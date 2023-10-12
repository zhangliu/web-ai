const Nightmare = require('../../../third_packages/nightmare/lib/nightmare');
const isDev = process.env.NODE_ENV === 'developmeng';
const ng = Nightmare({
    show: isDev,
    webPreferences: { partition: 'persist:web-ai' },
    typeInterval: 10,
    waitTimeout: 1000 * 60 * 3, // 3 分钟
    openDevTools: isDev ? { mode: 'detach' } : undefined,
});

ng.init = async () => {
    await ng
        .goto('https://poe.com/chat/2izduy32d808lc12tqh')
        .inject('js', `${__dirname}/inject.js`);
}

ng.prompt = async (prompt) => {
    console.log(`set prompt: ${prompt}`)
    const result = await ng
        .type('footer textarea', prompt)
        .click('footer > div > div > button:last-child')
        .evaluate(async () => {
            let startTime = Date.now();
            while(true) {
                await window.ng.utils.sleep(500);
                const footer = document.querySelector('footer');
                const children = footer.previousSibling.previousSibling.lastChild.children || [];
                const answerNode = children[1];
                if (!answerNode) continue;
                if (answerNode.getAttribute('data-complete') !== 'true') continue;
                // gpt 回答太快，可能错误的用了历史的数据
                if (Date.now() - startTime <= 2000) continue;
                return answerNode.children[1].innerText;
            }
        });
    console.log(`get answer: ${result}`)
    return result;
}

module.exports = ng;