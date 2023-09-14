const ng = require('../utils/ng/index.js');
const promptHandler = require('../handlers/promptHandler');
  
async function getAnswer(ctx) {
    const question = ctx.query.question;
    if (!question) throw new Error('Need Question!');

    const prompt = promptHandler.getPrompt();
    await ng.init();
    await ng.prompt(prompt);
    const answer = await ng.prompt(question);
    if (isValidAnswer(answer)) return { code: 200, data: answer };
    return { code: 501, data: answer };
}

const isValidAnswer = (answer) => {
    try {
        const result = JSON.stringify(answer);
        if (!Array.isArray(result)) throw new Error(`Answer is not Array type!`);
        return true;
    } catch(err) {
        console.error(err.message);
        return false;
    }
}

module.exports = {
    getAnswer,
}