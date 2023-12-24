const { exec } = require('../shell');
const robotjs = require('robotjs');

const findImg = (subImg, img = null) => {
    const size = robotjs.getScreenSize();
    console.log(size);
    // exec()
};

findImg(undefined)

module.exports = { findImg };