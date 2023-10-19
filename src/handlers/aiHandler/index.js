const fs = require('fs');
const logger = require('../../utils/logger');
const { sleep } = require('../../utils/time');
const puppeteer = require('puppeteer');
const isDev = process.env.NODE_ENV === 'development';

let browser;
const botMap = {};
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';

const getChatBot = async ({ chatId, defaultPrompt }) => {
    if (botMap[chatId]) return botMap[chatId];

    browser = browser || await puppeteer.launch({headless: !isDev, devtools: isDev});
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);

    page.prompt = prompt.bind(page);
    page.tryLogin = tryLogin.bind(page);

    logger.info(`will open page: https://poe.com/chat/${chatId}`);
    await page.tryLogin(`https://poe.com/chat/${chatId}`);

    // 初始化一些工具函数
    page.evaluate(() => {
        (() => {
            const sleep = duration => new Promise(r => setTimeout(r, duration));
            window.ai = {};
            window.ai.utils = { sleep };
        })()
    });

    await page.waitForSelector('footer textarea');
    logger.info(`has find footer textarea element!`);

    await page.prompt(`
        ${defaultPrompt || ''};
        请注意，接下来我发给你的每个问题都会带有类似：[一串数字] 的前缀，你可以直接忽略它，不要受到它的干扰。
    `);

    botMap[chatId] = page;
    return botMap[chatId];
}

const tryLogin = async function(target) {
    const cookiesFile = `${__dirname}/cookies.json`;
    const loginUrl = 'https://poe.com/login';

    if (!fs.existsSync(cookiesFile)) fs.writeFileSync(cookiesFile, JSON.stringify([]));
    let cookies = JSON.parse(fs.readFileSync(cookiesFile).toString());

    await this.setCookie(...cookies);
    await this.goto(target);

    let url = await this.url();
    if (!url.startsWith(loginUrl)) return;

    while(true) {
        await sleep(3000);
        const url = await this.url();
        logger.info(`get page url: ${url}`);
        if (!url.startsWith(loginUrl)) break;
    }

    cookies = await this.cookies();
    // TODO 需要剔除掉 cf_clearance 这个 cookie，不然恢复 cookie 后会登录失败。
    cookies = cookies.filter(item => item.name !== 'cf_clearance');
    fs.writeFileSync(cookiesFile, JSON.stringify(cookies));
}

const prompt = async function (prompt) {
    const indexPrefix = `[${Date.now()}]`;
    const promptWithIndex = `${indexPrefix} ${prompt}`;
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
    getChatBot
};