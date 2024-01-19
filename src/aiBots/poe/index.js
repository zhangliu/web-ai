const logger = require('../../utils/logger');
const { getBrowser } = require('../../utils/puppeteerHelper');
const { tryLogin } = require('./login');

const chatMap = {
    '*': {
        chatId: '2izduy32d808lc12tqh',
        instance: null,
        preparePrompt: (messages, aiName) => `
            有个群的聊天记录如下(注意是JSON 格式)： 
            ${messages}

            现在假设你是${aiName}，你觉得最后一个 @ 你的消息是啥，针对这个消息帮忙回复解答一下，注意：
            1. 回复要简洁，口语化，最好不要超过 50 个字。
        `
    }
};

const getChat = async (chatName) => {
    const chatContext = chatMap[chatName] || chatMap['*'];
    if (!chatContext) throw new Error('未找到合适的聊天对话，请先创建一个对话！');
    if (chatContext.instance) return chatContext.instance;

    const chatUrl = `https://poe.com/chat/${chatContext.chatId}`
    const browser = await getBrowser()
    const page = await browser.newPage();

    page.prompt = prompt.bind(page);
    page.preparePrompt = chatContext.preparePrompt || (value => value);

    logger.info(`will goto ${chatUrl}`);
    await tryLogin(page, chatUrl);

    await page.waitForSelector('footer textarea');
    logger.info(`has find footer textarea element!`);

    await page.prompt(`请注意，接下来我发给你的每个问题都会带有类似：[一串数字] 的前缀，你可以直接忽略它，不要受到它的干扰。`);

    chatContext.instance = page;
    return page;
}

const prompt = async function (prompt) {
    const indexPrefix = `[${Date.now()}]`;
    const promptWithIndex = `${indexPrefix} ${prompt}`.replace(/\n/g, '');
    logger.info(`set prompt: ${promptWithIndex}`)
    await this.type('footer textarea', promptWithIndex);
    await this.click('footer > div > div > button:last-child')
    const result = await this.evaluate(async (indexPrefix) => {
        let startTime = Date.now();
        while(true) {
            await window.ai.utils.sleep(500);
            const footer = document.querySelector('footer');
            const children = footer.previousSibling.previousSibling.lastChild.children || [];

            const questionNode = children[0];
            if (!questionNode) continue;
            if (!questionNode.innerText.includes(indexPrefix)) continue;

            const answerNode = children[1];
            if (!answerNode) continue;
            if (answerNode.getAttribute('data-complete') !== 'true') continue;
            // gpt 回答太快，可能错误的用了历史的数据
            if (Date.now() - startTime <= 2000) continue;
            return answerNode.children[1].innerText;
        }
    }, indexPrefix);
    logger.info(`get answer: ${result}`)
    return result;
}

module.exports = {
    getChat
};