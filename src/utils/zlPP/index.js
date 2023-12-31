// ignore_security_alert_file RCE
const robotjs = require('robotjs');
const logger = require('../logger');
const cp = require('../cp');
const zlSikuli = require('../zlSikuli');

const openBrowser = async () => {
    try {
        logger.info('开始启动浏览器');
        const { centerPoint } = await zlSikuli.waitImg(`${__dirname}/imgs/chrome.png`);
        robotjs.moveMouse(centerPoint.x, centerPoint.y);
        robotjs.mouseClick('left', true);
    } catch(err) {
        logger.error('启动浏览器失败：', err.message);
        throw err;
    }
}

const findAddressBar = async () => zlSikuli.waitImg(`${__dirname}/imgs/addressBar.png`);

const openUrl = async (url) => {
    const img = await findAddressBar();
    robotjs.moveMouse(img.centerPoint.x, img.centerPoint.y);
    robotjs.mouseClick('left');
    await cp.copy(url);
    await cp.paste();
    await robotjs.keyTap('enter');

    // bgImgPath=/home/kasm-user/projects/web-ai/tmp/bgImg.png targetImgPath=/home/kasm-user/projects/web-ai/src/utils/zlPP/imgs/chrome-mac.png python3 /home/kasm-user/projects/web-ai/src/utils/zlSikuli/python/findImg.py
}

(async () => {
    await openBrowser();
    openUrl('https://bard.google.com/');
})()

module.exports = { openBrowser, openUrl };