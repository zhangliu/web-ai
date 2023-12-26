// ignore_security_alert_file RCE
const robotjs = require('robotjs');
const logger = require('../logger');
const zlSikuli = require('../zlSikuli');

const openBrowser = async () => {
    try {
        logger.info('开始启动浏览器');
        const { centerPoint } = await zlSikuli.waitImg(`${__dirname}/imgs/chrome.png`);
        robotjs.moveMouse(centerPoint.x, centerPoint.y );
        robotjs.mouseClick('left', true);
        await findAddressBar();
    } catch(err) {
        logger.error('启动浏览器失败：', err.message);
        throw err;
    }
}

const findAddressBar = async () => zlSikuli.waitImg(`${__dirname}/imgs/addressBar.png`);

const openUrl = async (url) => {
    await robotjs.typeString(url);
    await robotjs.keyTap('enter');
}

(async () => {
    openBrowser('https://bard.google.com/');
    openUrl();
})()

module.exports = { openBrowser, openUrl };