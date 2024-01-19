
const fs = require('fs');
const {getBrowser} = require('../../utils/puppeteerHelper');

const cookiesFile = `${__dirname}/cookies.json`;
const targetUrl = 'https://poe.com/chat/2izduy32d808lc12tqh';

const run = async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await tryLogin(page, targetUrl);
        console.info('Great! login successful!')
    } finally {
        browser.close();
    }
}

const tryLogin = async (page, target) => {
    try {
        if (fs.existsSync(cookiesFile)) {
            const cookies = JSON.parse(fs.readFileSync(cookiesFile).toString());
            await page.setCookie(...cookies);
        } else {
            await genCookieFile(page);
        }
        
        if (await isLogin(page)) return await page.goto(target);
        throw new Error('Login Failed!');
    } catch(error) {
        console.error('Login Failed:', error.message);
        throw error;
    }
}

const isLogin = async (page) => {
    await page.goto('https://poe.com/');
    return await page.waitUrlStabilize('https://poe.com/');
}

const genCookieFile = async function(page) {
    console.warn('please login by manual and gen cookie file...');
    await page.goto('https://poe.com/login');
    await page.waitUrlChange(new RegExp(`^https://poe.com/$`), 60000 * 3);
    // await page.waitForNavigation();

    cookies = await page.cookies();
    fs.writeFileSync(cookiesFile, JSON.stringify(cookies, null, 2));
}

if (require.main === module) run();

module.exports = {
    tryLogin,
}