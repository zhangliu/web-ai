const ONE_SECOND = 1000;

const sleep = (duration) => new Promise(r => setTimeout(r, duration));

module.exports = {
    ONE_SECOND,
    sleep
}