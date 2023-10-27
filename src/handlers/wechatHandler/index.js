const fs = require('fs');
const logger = require('../utils/logger');

const uuidFile = `${__dirname}/uuid.json`;

async function getQR() {
    try {
        if (!fs.existsSync(uuidFile)) throw new Error('no uuid');

        const uuid = fs.readFileSync(uuidFile).toString();
        const url = `https://login.weixin.qq.com/l/${uuid}`;
        const jqueryCode = fs.readFileSync(`${__dirname}/jquery.min.js`).toString();
        const qrCode = fs.readFileSync(`${__dirname}/qrcode.min.js`).toString();
        let qrHtml = fs.readFileSync(`${__dirname}/qr.html`).toString();
        qrHtml = qrHtml.replace('{{jqueryCode}}', jqueryCode);
        qrHtml = qrHtml.replace('{{qrCode}}', qrCode);
        qrHtml = qrHtml.replace('{{url}}', url);
        return qrHtml;
    } catch(err) {
        logger.error(err);
        return { code: 501, data: err.message };
    }
}

async function postUUID(uuid) {
    fs.writeFileSync(uuidFile, uuid);
}

async function deleteUUID() {
    fs.unlinkSync(uuidFile);
}

module.exports = {
    getQR,
    postUUID,
    deleteUUID,
}