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
    if (!result) return null;

    checkMatchImg(result.rect);

    const {x, y, width, height} = result.rect;
    const centerPoint = { x: x + width/2, y: y + height/2 };

    return centerPoint;
};

const checkMatchImg = async (rect) => {
    const { x, y, width, height } = rect;
    const matchImg = robotjs.screen.capture(x, y, width, height);
    const matchImgPath = `${process.cwd()}/tmp/matchImg.png`;
    const pngImg = await convertToPngImg(matchImg);
    pngImg.write(matchImgPath);
}

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