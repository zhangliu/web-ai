const logger = require('../utils/logger');

async function getQR(ctx) {
    try {
        return { code: 200, data: answer };
    } catch(err) {
        logger.error(err);
        return { code: 501, data: err.message };
    }
}

module.exports = {
    getQR,
}