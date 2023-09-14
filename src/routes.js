
const Router = require('koa-router');
const aiController = require('./controllers/aiController');

const router = new Router();

const wrapper = (handler) => {
    return async (ctx, next) => {
        try {
            await handler(ctx);
            next()
        } catch (error) {
            ctx.status = 500;
            ctx.body = `[Error] ${error.message}`;
        }
    }
}

router.get('/question', wrapper(aiController.getAnswer));

module.exports = router.routes()