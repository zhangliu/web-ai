const logger = require('../../utils/logger');
// const Nightmare = require('../../../third_packages/nightmare/lib/nightmare');
const Nightmare = require('nightmare');
const isDev = process.env.NODE_ENV === 'development';

const ngMap = {}

const getChatBot = async (chatId = '2izduy32d808lc12tqh') => {
    if (ngMap[chatId]) return ngMap[chatId];

    const ng = Nightmare({
        show: isDev,
        // webPreferences: { partition: `persist:web-ai-${chatId}` },
        webPreferences: { partition: `persist:web-ai` },
        typeInterval: 10,
        waitTimeout: 10 * 1000,
        openDevTools: isDev ? { mode: 'detach' } : undefined,
    });
    ngMap[chatId] = { bot: ng };

    logger.info(`will open page: https://poe.com/chat/${chatId}`);
    await ng.goto(`https://poe.com/chat/${chatId}`).inject('js', `${__dirname}/inject.js`);

    await ng.wait('footer textarea');
    logger.info(`has find footer textarea element!`);

    ng.prompt = prompt.bind(ng);
    await ng.prompt('注意，我的每个问题都会带有类似：[一串数字] 的前缀，你可以直接忽略它，不要受到它的干扰。');

    return ngMap[chatId];
}

const prompt = async function (prompt) {
    const indexPrefix = `[${Date.now()}]`;
    const promptWithIndex = `${indexPrefix} ${prompt}`;
    logger.info(`set prompt: ${promptWithIndex}`)
    const result = await this
        .type('footer textarea', promptWithIndex)
        .click('footer > div > div > button:last-child')
        .evaluate(async (indexPrefix) => {
            let startTime = Date.now();
            while(true) {
                await window.ng.utils.sleep(500);
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
    getChatBot
};