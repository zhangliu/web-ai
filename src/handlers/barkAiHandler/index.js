const fs = require('fs');
const robotjs = require('robotjs');
const logger = require('../../utils/logger');
const zlSikuli = require('../../utils/zlSikuli');

const openBrowser = async () => {
    try {
        logger.info('开始启动浏览器');
        const { centerPoint } = await zlSikuli.waitImg(`${__dirname}/browser.png`);
        robotjs.moveMouse(centerPoint.x, centerPoint.y );
        robotjs.mouseClick('left', true);
    } catch(err) {
        logger.error('启动浏览器失败：', err.message);
        throw err;
    }
}

const goBark = async () => {
    await openBrowser();
    await zlSikuli.waitImg();
}

module.exports = {
}