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

const findAddressBar = async (limit = 10) => zlSikuli.waitImg(`${__dirname}/imgs/addressBar.png`, limit);

const openUrl = async (url) => {
    const img = await findAddressBar(2000);
    robotjs.moveMouse(img.centerPoint.x, img.centerPoint.y);
    robotjs.mouseClick('left');
    // await cp.copy(url);
    // await cp.paste();
    robotjs.typeString(url);
    await robotjs.keyTap('enter');
}

(async () => {
    await openBrowser();
    openUrl('https://bard.google.com/');
})()

module.exports = { openBrowser, openUrl };