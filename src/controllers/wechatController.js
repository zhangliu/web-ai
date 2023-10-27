const fs = require('fs');
const logger = require('../utils/logger');
const wechatHandler = require('../handlers/wechatHandler');

const uuidFile = `${__dirname}/uuid.json`;

async function getQR(ctx) {
    try {
        const html = wechatHandler.getQR();
        ctx.type = 'text/html';
        return html;
    } catch(err) {
        logger.error(err);
        return { code: 501, data: err.message };
    }
}

async function postUUID(ctx) {
    try {
        const { uuid } = ctx.request.body || {};
        logger.info(`get uuid:`, uuid);
        wechatHandler.postUUID(uuid);
        return { code: 200, data: 'ok' };
    } catch(err) {
        logger.error(err);
        return { code: 501, data: err.message };
    }
}

async function deleteUUID() {
    wechatHandler.deleteUUID();
}

module.exports = {
    getQR,
    postUUID,
    deleteUUID,
}