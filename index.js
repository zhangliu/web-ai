// import OpenAI from 'openai';
const config = require('./local.config.js');
const domClient = require('./src/client/domClient/index.js');
const { sleep } = require('./src/utils/index.js');
const ng = require('./src/utils/ng.js');

// const openai = new OpenAI({ apiKey: config.apiKey });
  
async function main(html) {
    const prompt = initPrompt();
    initAi(ng);
    // realizeHtml(html);

    // const question = waitQuestion();
    // const answer = await waitAiAnswer();
    // domClient.handler(answer);
}

const initPrompt = () => {};

async function initAi(ng) {
    ng.login();
}

async function waitAiAnswer(question) {
    // let answer
    // while(true) {
    //     try {
    //         improvePrompt(prompt, question, answer);
    //         answer = getAiAnswer(question);
    //         if (checkAnswer(answer)) return answer;

    //         await sleep(3000);
    //     } catch(err) {
    //         console.error(err);
    //     }
    // }
}

async function getAiAnswer(question) {

    // const completion = await openai.chat.completions.create({
    //     messages: [{ role: 'user', content: 'Say this is a test' }],
    //     model: 'gpt-3.5-turbo',
    // });

    // console.log(completion.choices);
}

main();