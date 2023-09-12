
const Router = require('koa-router');

const router = new Router();

router.get('/question', (ctx, next) => {
    const prompt = (ctx.query || {}).prompt;
    console.log('get question:', prompt);
    if (!prompt) throw new Error('no prompt!');
    ctx.body = prompt;
    next();
});

module.exports = router.routes()