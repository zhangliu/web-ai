// ignore_security_alert_file RCE
var Jimp = require('jimp');
const robotjs = require('robotjs');
const { exec } = require('../shell');

const findImg = async (targetImgPath) => {
    const size = robotjs.getScreenSize();
    const bgImg = robotjs.screen.capture(0, 0, size.width, size.height);

    const bgImgPath = `${process.cwd()}/tmp/bgImg.png`;
    const pngImg = await convertToPngImg(bgImg);
    pngImg.write(bgImgPath);

    let result = await exec(`bgImgPath=${bgImgPath} targetImgPath=${targetImgPath} python3 ${__dirname}/python/findImg.py`);
    result = JSON.parse(result);
    if (result) console.log('xxxxx3')
    else console.log('xxxxx4')
};

const convertToPngImg = async (bgImg) => new Promise((resolve, reject) => {
    const pngImg = new Jimp(bgImg.width, bgImg.height, function(_, img) {
        img.bitmap.data = bgImg.image;
        img.getBuffer(Jimp.MIME_PNG, (err) => {
            if (err) return reject(err);
            resolve(pngImg);
        });
    });
});

// findImg(`${process.cwd()}/tmp/browser.png`)

module.exports = { findImg };