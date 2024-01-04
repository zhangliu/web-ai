const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const robotjs = require('robotjs');

const { exec } = require('../utils/shell');

// const logger = require('../utils/logger');

const tmpPath = `${process.cwd()}/tmp`; 
  
async function getFiles(ctx) {
    // 指定需要遍历的文件夹路径
    const files = fs.readdirSync(tmpPath);

    const result = [
        `/tmp-file/cmd?cmd=node src/utils/zlPP/index.js`,
        `/tmp-file/getDeskImg`,
    ];
    files.forEach(function(file) {
        const filePath = path.join(tmpPath, file);
        const stat = fs.statSync(filePath);
        if (!stat) return;
        if (!stat.isFile()) return;
        
        result.push(`/tmp-file/${file}`);
    });
    return result;
}

const downLoad = (ctx) => {
    const filename = path.basename(ctx.url);
    const filePath = path.join(tmpPath, filename);

    ctx.response.set(`Content-Disposition', 'attachment; filename=${filename}`);
    ctx.response.body = fs.createReadStream(filePath);
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

async function cmd(ctx) {
    try {
        const cmd = decodeURIComponent(ctx.query.cmd);
        return await exec(`cd ${process.cwd()} && ${cmd}`);
    } catch(error) {
        return error.message;
    }
}

module.exports = {
    getFiles,
    downLoad,
    cmd,
    getDeskImg,
}