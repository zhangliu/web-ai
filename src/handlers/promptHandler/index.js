const fs = require('fs');

const filePath = `${__dirname}/prompt.json`;
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

const getPrompt = () => {
    try {
        const content = fs.readFileSync(filePath);
        const { des, rules } = JSON.parse(content);
        return `
            ${des}
            ${rules.json('\n')}
        `
    } catch(err) {
        console.error(err);
        return defaultPrompt;
    }
}

const setPrompt = (prompt) => fs.writeFileSync(filePath, JSON.stringify(prompt));

module.exports = {
    getPrompt,
    setPrompt
}