
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

router.post('/wechat/prompt', wrapper(aiController.getAnswer));

// 登录相关
router.get('/wechat/login-qr', wrapper(wechatController.getQR));
router.post('/wechat/uuid', wrapper(wechatController.postUUID));
router.delete('/wechat/uuid', wrapper(wechatController.deleteUUID));

module.exports = router.routes()