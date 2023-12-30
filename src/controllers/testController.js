// ignore_security_alert_file RCE
const Jimp = require('jimp');
const robotjs = require('robotjs');
const { exec } = require('../utils/shell');
  
async function cmd(ctx) {
    try {
        const cmd = decodeURIComponent(ctx.query.cmd);
        return await exec(`cd ${process.cwd()} && ${cmd}`);
    } catch(error) {
        return error.message;
    }
}

async function getDeskImg(ctx) {
    const size = robotjs.getScreenSize();
    const bgImg = robotjs.screen.capture(0, 0, size.width, size.height);

    const bgImgPath = `${process.cwd()}/tmp/bgImg.png`;
    const pngImg = await convertToPngImg(bgImg);
    pngImg.write(bgImgPath);
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

module.exports = {
    cmd,
    getDeskImg,
}