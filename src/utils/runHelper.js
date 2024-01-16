const { sleep } = require("./time");
const logger = require('./logger');

const runTimes = async (func, limit = 3, timeout = 30000) => {
    let times = limit;
    while (times--) {
      logger.info(`run ${func.name} ${limit - times} times`);
      try {
        return await runTimeout(func, timeout);
      } catch (err) {
        console.error(err);
        if (times <= 0) throw err;
      } finally {
        await sleep(1000);
      }
    }
}

const runTimeout = async (func, timeout) => {
    return Promise.race([
        Promise.resolve(func()),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`执行 ${func.name} 超时！`)), timeout)),
    ]);
}
  
module.exports = {
    runTimes,
    runTimeout
}