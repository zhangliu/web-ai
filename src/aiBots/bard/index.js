const fs = require('fs');

const logger = require('../../utils/logger');
const { getBrowser } = require('../../utils/puppeteerHelper');
const { runTimes } = require('../../utils/runHelper');

let browser;

const chatMap = {
    '*': {
        chatId: '4df694d8fb1eb183',
        instance: null,
    },
    '柳芮友爱聊天群': {
        chatId: 'daec4de88abc3268',
        instance: null,
        preparePrompt: (messages) => `
            我会给你一个群的聊天记录，假设你也在群里，你需要注意：
            1. 内容如果出现 @ + 人名，表示这句话是发给这个人的，或者是和这个人相关的
            2. 你在群里的名字叫：「{msg.to_user_nickname}」
            3. 你需要根据最近的聊天记录，就最后一个 @ 到你的消息，给出恰当的回复
            4. 回复的目的是帮助解答问题，或者给予合适的意见，或者活跃群气氛
            5. 回复需要比较简洁和口语化，内容最好不要超过 50 个字！

            最后，群的聊天记录如下(注意是JSON 格式)：
            ${messages}
        `
    }
};

const cookiesFile = `${__dirname}/cookies.json`;

const getChat = async (chatName) => {
    const chatInfo = chatMap[chatName] || chatMap['*'];
    if (!chatInfo) throw new Error('未找到合适的聊天对话，请先创建一个对话！');
    if (chatInfo.instance) return chatInfo.instance;

    const chatUrl = `https://bard.google.com/chat/${chatInfo.chatId}`
    browser = await getBrowser()
    const page = await browser.newPage();

    // return await genCookiesFile(page, chatUrl);

    page.tryLogin = tryLogin.bind(page);
    page.prompt = prompt.bind(page);
    page.preparePrompt = chatInfo.preparePrompt || (value => value);

    logger.info(`will goto ${chatUrl}`);
    await page.tryLogin(chatUrl);

    await page.waitForSelector('.text-input-field_textarea');
    logger.info(`has find textarea element!`);

    await page.prompt(`请注意，接下来我发给你的每个问题都会带有类似：[一串数字] 的前缀，你可以直接忽略它，不要受到它的干扰。`);

    chatMap[chatName].instance = page;
    return page;
}

const tryLogin = async function(target) {
    if (!fs.existsSync(cookiesFile)) throw new Error('未登录，请联系作者进行登录！');
    let cookies = JSON.parse(fs.readFileSync(cookiesFile).toString());

    await this.setCookie(...cookies);
    await this.goto(target);
}

const genCookiesFile = async function(page, targetUrl) {
    const loginUrl = `https://accounts.google.com/v3/signin/identifier?continue=${encodeURIComponent(targetUrl)}&followup=${encodeURIComponent(targetUrl)}&flowName=GlifWebSignIn`;
    await page.goto(loginUrl);

    await page.waitUrlChange(new RegExp('^https://bard.google.com/'));
    await page.waitForNavigation();
    cookies = await page.cookies();
    fs.writeFileSync(cookiesFile, JSON.stringify(cookies, null, 2));
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

            return answerContentNode.innerText;
        }
    }, indexPrefix);
    logger.info(`get answer: ${result}`)
    return result;
}

module.exports = {
    getChat
};