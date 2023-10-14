const moment = require('moment');

const info = (...args) => {
    console.log(`[INFO] ${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}:`, ...args);
}

const error = (...args) => {
    console.error(`[ERROR] ${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}:`, ...args);
}

module.exports = {
    info,
    error
}
