// refer: https://pptr.dev/api/puppeteer.page
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {sleep} = require('./time');

puppeteer.use(StealthPlugin());
const isProd = process.env.NODE_ENV === 'production';
let browser = null;

const getBrowser = async () => {
    if (browser) return browser;

    // refer: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
    browser = await puppeteer.launch({
        headless: isProd,
        devtools: !isProd,
        args: ['--no-sandbox']
    });

    // 初始化页面
    const __newPage = browser.newPage;
    browser.newPage = async function(...args) {
        const page = await __newPage.call(browser, ...args);
        await page.evaluateOnNewDocument(() => {
            (() => {
                const sleep = duration => new Promise(r => setTimeout(r, duration));
                window.ai = {};
                window.ai.utils = { sleep };
            })()
        });
        page.waitUrlChange = waitUrlChange.bind(page);
        return page;
    }

    return browser;
}

const waitUrlChange = async function(match, timeout = 300000) {
    let index = 0;
    while(timeout > index * 1000) {
        index++;
        await sleep(1000);
        const url = await this.url();
        if (match.test(url)) return url;
    }
    throw new Error(`wait url change to: ${match} timeout!`);
}

module.exports = {
    getBrowser
}