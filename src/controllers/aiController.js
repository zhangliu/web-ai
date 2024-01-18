const { getChat } = require('../aiBots/bard/index');
const logger = require('../utils/logger');
const { runTimeout } = require('../utils/runHelper');
  
async function getAnswer(ctx) {
    const { chatName, aiName, isGroup} = ctx.query;
    const { prompt } = ctx.request.body || {};
    if (!prompt) throw new Error('Need Prompt!');
    if (!chatName) throw new Error('Need chatName!');

    logger.info(`will handle for chat: ${chatName}, prompt: ${prompt}`);
    try {
        const aiBot = (await getChat(chatName));
        const preparedPrompt = aiBot.preparePrompt(prompt, aiName);
        const answer = await runTimeout(() => aiBot.prompt(preparedPrompt), 60000);
        return { code: 200, data: answer };
    } catch(err) {
        logger.error(err);
        return { code: 501, data: err.message };
    }
}

module.exports = {
    getAnswer,
}