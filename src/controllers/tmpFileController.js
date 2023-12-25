const fs = require('fs');
const path = require('path');

const logger = require('../utils/logger');

const tmpPath = `${process.cwd()}/tmp`; 
  
async function getFiles(ctx) {
    // 指定需要遍历的文件夹路径
    const files = fs.readdirSync(tmpPath);

    const result = [];
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

module.exports = {
    getFiles,
    downLoad
}