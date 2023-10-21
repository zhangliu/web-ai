const { getChatBot } = require('../handlers/aiHandler');
const logger = require('../utils/logger');

const chatMap = {
    '*': {
        chatId: '2lhbagehfpn58peswnw',
        defaultPrompt: '',
    },
    'AI算卦': {
        chatId: '2nxvpm9gqd6i9zuajwt',
        defaultPrompt: ''
    },
};
  
async function getAnswer(ctx) {
    const { question, userId, isGroup} = ctx.query;
    if (!question) throw new Error('Need Question!');
    if (!userId) throw new Error('Need userId!');

    logger.info(`will handle for user: ${userId}, question: ${question}`);
    const chatInfo = chatMap[userId] || chatMap['*'];
    if (!chatInfo) return { code: 200, data: '无法使用，请联系作者开通' }

    const aiBot = (await getChatBot(chatMap[userId] || chatMap['*']));
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