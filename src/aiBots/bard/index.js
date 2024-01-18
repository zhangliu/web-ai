const fs = require('fs');

const logger = require('../../utils/logger');
const { getBrowser } = require('../../utils/puppeteerHelper');
const { runTimes } = require('../../utils/runHelper');
const { tryLogin } = require('./login');

let browser;
const startTag = '[start]';
const endTag = '[end]';

const chatMap = {
    '*': {
        chatId: '66d4adf3b9615c7b',
        instance: null,
        preparePrompt: (messages, aiName) => `
            我会给你一个群的聊天记录，假设你也在群里，你的名字叫「${aiName}」，你需要注意：
            1. 你需要根据最近的聊天记录，就最后一个 @ 到你的消息，给出口语化的合适的回复。
            2. 回复要简洁，最好不要超过 50 个字。
            3. 你的回复需必须要以：${startTag} 开头，然后以 ${endTag} 结尾。

            最后，群的聊天记录如下(注意是JSON 格式)：
            ${messages}
        `
    },
    '柳芮友爱聊天群': {
        chatId: 'ba1afa2e749fe2d2',
        instance: null,
        preparePrompt: (messages, aiName) => `
            我会给你一个群的聊天记录，假设你也在群里，你的名字叫「${aiName}」，你需要注意：
            1. 你需要根据最近的聊天记录，就最后一个 @ 到你的消息，给出口语化的合适的回复。
            2. 回复要简洁，最好不要超过 50 个字。
            3. 你的回复需必须要以：${startTag} 开头，然后以 ${endTag} 结尾。

            最后，群的聊天记录如下(注意是JSON 格式)：
            ${messages}
        `
    }
};

const getChat = async (chatName) => {
    const chatContext = chatMap[chatName] || chatMap['*'];
    if (!chatContext) throw new Error('未找到合适的聊天对话，请先创建一个对话！');
    if (chatContext.instance) return chatContext.instance;

    const chatUrl = `https://bard.google.com/chat/${chatContext.chatId}`
    browser = await getBrowser()
    const page = await browser.newPage();

    page.prompt = prompt.bind(page);
    page.preparePrompt = chatContext.preparePrompt || (value => value);

    logger.info(`will goto ${chatUrl}`);
    await tryLogin(page, chatUrl);

    await page.waitForSelector('.text-input-field_textarea');
    logger.info(`has find textarea element!`);

    await page.prompt(`请注意，接下来我发给你的每个问题都会带有类似：[一串数字] 的前缀，你可以直接忽略它，不要受到它的干扰。`);

    chatContext.instance = page;
    return page;
}

const prompt = async function (prompt) {
    const indexPrefix = `[${Date.now()}]`;
    const indexifyPrompt = `${indexPrefix} ${prompt}`.replace(/\n/g, '');
    logger.info(`set prompt: ${indexifyPrompt}`);
    await this.type('.text-input-field_textarea .textarea:nth-child(1)', indexifyPrompt);
    await runTimes(this.click.bind(this, '.send-button-container button[aria-disabled=false]'), 10);
    const result = await this.evaluate(async (indexPrefix) => {
        while(true) {
            await window.ai.utils.sleep(500);
            const promptNode = document.querySelector('.conversation-container:last-child user-query');
            if (!promptNode) continue;

            const promptContentNode = promptNode.querySelector('.query-text');
            if (!promptContentNode) continue;
            if (!promptContentNode.innerText.includes(indexPrefix)) continue;

            const answerNode = promptNode.parentNode.querySelector('model-response');
            if (!answerNode) continue;

            const answerContentNode = answerNode.querySelector('.response-container-content');
            if (!answerContentNode) continue;

            const isEnd = !!answerNode.querySelector('message-actions');
            if (!isEnd) continue;

            return answerContentNode.innerText || '';
        }
    }, indexPrefix);
    logger.info(`get answer: ${result}`);
    const startPos = result.indexOf(startTag);
    const endPos = result.indexOf(endTag);
    return result.substring(startPos + startTag.length, endPos).trim();
}

module.exports = {
    getChat,
};