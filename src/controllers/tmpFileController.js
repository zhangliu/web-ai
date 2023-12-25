const fs = require('fs');
const path = require('path');

const logger = require('../utils/logger');
  
async function getFiles(ctx) {
    // 指定需要遍历的文件夹路径
    const tmpPath = `${process.cwd()}/tmp`; 
    const files = fs.readdirSync(tmpPath);

    const result = [];
    files.forEach(function(file) {
        const filePath = path.join(tmpPath, file);
        const stat = fs.statSync(filePath);
        if (!stat) return;
        if (!stat.isFile()) return;
        result.push(filePath);
    });

    return result;
}

module.exports = {
    getFiles,
}