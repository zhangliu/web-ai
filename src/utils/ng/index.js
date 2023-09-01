const Nightmare = require('../../../third_packages/nightmare');
const ng = Nightmare({
    show: true,
    webPreferences: { partition: 'persist:web-ai' },
    typeInterval: 10,
    // openDevTools: { mode: 'detach' },
});

ng.init = async () => {
    await ng
        .goto('https://poe.com/chat/2izduy32d808lc12tqh')
        .inject('js', `${__dirname}/inject.js`);
}

ng.prompt = async (prompt) => {
    const formatedPrompt = prompt.trim().replaceAll('\n', '');
    const result = await ng
        .type('footer textarea', prompt)
        .click('footer > div > div > button:last-child')
        .evaluate(async (prompt) => {
            while(true) {
                await window.ng.utils.sleep(500);
                const footer = document.querySelector('footer');
                const children = footer.previousSibling.previousSibling.lastChild.children || [];
                const message = (children[0] || {}).innerText;
                if (!message) continue;
                if (message !== prompt) continue;
                if (children.length >= 4) return children[1].innerText;
            }
        }, formatedPrompt);
    console.log('--------------start--------------');
    console.log(`${formatedPrompt} \n==>\n ${result}`);
    console.log('***************end****************');
    return result;
}

module.exports = ng;