// import OpenAI from 'openai';
const config = require('./local.config.js');
const domClient = require('./src/client/domClient/index.js');
const { sleep } = require('./src/utils/index.js');
const ng = require('./src/utils/ng/index.js');

// const openai = new OpenAI({ apiKey: config.apiKey });
const defaultPrompt = `
现在假设你是一个网页机器人，注意：
1. 你了解前端相关技术，例如 html、js 等。
2. 我会告诉你一个网页的 html 信息，然后我会问你一些问题。
`
  
async function main(html) {
    await ng.init();
    await ng.prompt(defaultPrompt);
    // realizeHtml(html);

    // const question = waitQuestion();
    // const answer = await waitAiAnswer();
    // domClient.handler(answer);
}

const initPrompt = () => {};

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