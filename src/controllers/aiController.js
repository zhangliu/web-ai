const { getChatBot } = require('../handlers/aiHandler');
const logger = require('../utils/logger');

const chatMap = {
    '*': '2ms7cmxdagq3r4dpy3h'
}
  
async function getAnswer(ctx) {
    const { question, userId} = ctx.query;
    if (!question) throw new Error('Need Question!');

    const aiBot = (await getChatBot(chatMap[userId] || chatMap[0]));
    try {
        const answer = await aiBot.prompt(question);
        return { code: 200, data: answer };
    } catch(err) {
        logger.error(err);
        return { code: 501, data: err.message };
    }
}

module.exports = {
    getAnswer,
}