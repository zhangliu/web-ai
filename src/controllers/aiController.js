const { getChatBot } = require('../handlers/aiHandler');
const logger = require('../utils/logger');
  
async function getAnswer(ctx) {
    const { question, chatId} = ctx.query;
    if (!question) throw new Error('Need Question!');

    const aiBot = (await getChatBot(chatId));
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