const Nightmare = require('../../third_packages/nightmare');
const ng = Nightmare({ show: true, webPreferences: { partition: 'persist:web-ai' } });

ng.login = async () => {
    await ng.goto('https://poe.com');
}

module.exports = ng;