
const Router = require('koa-router');

const router = new Router();

router.get('/question', (ctx, next) => {
    const question = (ctx.query || {}).question;
    console.log('get question:', question);
    if (!question) throw new Error('no question!');
    ctx.body = question;
    next();
});

module.exports = router.routes()