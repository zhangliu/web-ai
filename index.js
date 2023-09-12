// import OpenAI from 'openai';
const fs = require('fs');
const config = require('./local.config.js');
const domClient = require('./src/client/domClient/index.js');
const { sleep } = require('./src/utils/index.js');
const ng = require('./src/utils/ng/index.js');

// const openai = new OpenAI({ apiKey: config.apiKey });
const defaultPrompt = `
现在假设你是一个网页机器人，注意：
*. 你熟悉前端相关技术，例如 html、js、css 等等。
*. 我会告诉你一个网页的 html 信息，然后你需要记住这个 html。
*. 之后我会让你帮我操作这个页面，例如点击这个页面里的按钮、填写表单、进行跳转等等。
*. 你需要告诉我，完成这个操作对应的 js 代码，并使用格式：script: + js 代码 来回答，具体可以参见示例1。 

示例1：
1. 当我让你点击 body时，你就回答：scripts: document.body.click()。
2. 当我让你清空 body 时，你就回答：scripts: document.body.innerHTML = '';
`
  
async function main() {
    const html = fs.readFileSync(`${__dirname}/src/assets/htmls/demo1.html`).toString();
    await ng.init();
    // await ng.prompt(defaultPrompt);
    await ng.prompt(`html 内容如下：${html}`);
    await ng.prompt(`请帮我点击一下发布按钮`);
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