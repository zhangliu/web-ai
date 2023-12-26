const fs = require('fs');
const robotjs = require('robotjs');
const logger = require('../../utils/logger');
const imageHelper = require('../../utils/imageHelper');

async function openBrowser() {
    try {
        logger('开始启动浏览器');
        const { centerPoint } = await imageHelper.waitImg(`${__dirname}/browser.png`);
        robotjs.moveMouse(centerPoint.x, centerPoint.y );
        robotjs.mouseClick('left', true);
    } catch(err) {
    }
}

openBrowser();

module.exports = {
}