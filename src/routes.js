
const Router = require('koa-router');
const aiController = require('./controllers/aiController');
const wechatController = require('./controllers/wechatController');

const router = new Router();

const wrapper = (handler) => {
    return async (ctx, next) => {
        try {
            console.log(`will handler req: ${ctx.url}`)
            const result = await handler(ctx);
            ctx.body = result;
            next()
        } catch (error) {
            ctx.status = 500;
            ctx.body = `[Error] ${error.message}`;
        }
    }
}

router.get('/wechat/prompt', wrapper(aiController.getAnswer));
router.get('/wechat/login-qr', wrapper(wechatController.getQR));

module.exports = router.routes()