const fs = require('fs');

const filePath = `${__dirname}/talks.json`;
const desc = `
    现在假设你是一个网页机器人，你熟悉前端相关技术，例如 html、js、css 等等，注意：
    1. 我会告诉你一个网页的 html 信息。
    2. 我会让你帮我在这个网页上做些任务，例如点击按钮、填写表单等。
    3. 你不需要真的去完成任务，你只需要回答完成这些任务需要的步骤，和每一步需要执行的 js 代码。
    4. 你的回答需要是 js 格式的数组格式，数组的每个元素代表着完成任务的一个步骤。

    以下是一些示例，你需要根据这些示例总结出规律，并帮住我完成新的任务：
`
const defaultTalks = [
    {
        question: '帮我点击一下 body',
        answer: [{ type: 'click', code: 'document.body.click()' }]
    },
    {
        question: '帮我点击一下发布按钮',
        answer: [{ type: 'click', code: 'document.querySelector("deployBtn").click()' }]
    },
    // {
    //     question: '帮我点击一下发布按钮',
    //     answer: [
    //         { type: '', code: '' },
    //         { type: '', code: '' },
    //     ],
    // }
];

const getDefaultPrompt = () => '';

const getPrompt = () => {
    const content = fs.readFileSync(filePath);
    const talks = JSON.parse(content);
    const allTalls = defaultTalks
        .concat(talks)
        .map((item, key) => `${key + 1}. 当我问你「${item.question}」，你需要回答：${JSON.stringify(item.answer)}`);
    return `
        ${desc}
        ${allTalls.join('\n')}
    `
}

const setPrompt = (prompt) => fs.writeFileSync(filePath, JSON.stringify(prompt));

module.exports = {
    getDefaultPrompt,
    getPrompt,
    setPrompt
}