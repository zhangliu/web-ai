const Nightmare = require('../../../third_packages/nightmare');
const ng = Nightmare({
    show: true,
    webPreferences: { partition: 'persist:web-ai' },
    // typeInterval: 100,
    waitTimeout: 1000 * 60 * 3, // 3 分钟
    // openDevTools: { mode: 'detach' },
});

ng.init = async () => {
    await ng
        .goto('https://poe.com/chat/2izduy32d808lc12tqh')
        .inject('js', `${__dirname}/inject.js`);
}

ng.prompt = async (prompt) => {
    console.log(`set prompt: ${prompt} ********************`)
    const result = await ng
        .type('footer textarea', prompt)
        .click('footer > div > div > button:last-child')
        .evaluate(async () => {
            while(true) {
                await window.ng.utils.sleep(500);
                const footer = document.querySelector('footer');
                const children = footer.previousSibling.previousSibling.lastChild.children || [];
                const answerNode = children[1];
                if (!answerNode) continue;
                if (answerNode.getAttribute('data-complete') !== 'true') continue;
                return answerNode.innerText;
            }
        });
    console.log(`get answer: ${result} ********************`)
    return result;
}

module.exports = ng;