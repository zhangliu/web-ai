const sleep = (duration) => new Promise(r => setTimeout(r, duration));

module.exports = {
    sleep
}