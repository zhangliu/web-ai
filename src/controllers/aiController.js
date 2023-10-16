const { getChatBot } = require('../handlers/aiHandler');
const logger = require('../utils/logger');

const chatMap = {
    '*': '2ms7cmxdagq3r4dpy3h',
    'Ai助手测试群': '2ms7cmxdagq3r4dpy3h',
};
  
async function getAnswer(ctx) {
    const { question, userId, isGroup} = ctx.query;
    if (!question) throw new Error('Need Question!');
    if (!userId) throw new Error('Need userId!');

    logger.info(`will handle for user: ${userId}, question: ${question}`);
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