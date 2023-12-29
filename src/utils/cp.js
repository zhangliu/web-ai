const robotjs = require('robotjs');
const cp = require('copy-paste');

const copy = content => new Promise((resolve) => cp.copy(content, resolve));

const paste = async () => {
    try {
        robotjs.keyToggle('control', 'down');
        await sleep(100)
        robotjs.keyTap('v');
    } finally {
        robotjs.keyToggle('control', 'up');
    }
}

module.exports = {
    copy,
    paste
}