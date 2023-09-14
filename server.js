const Koa = require('koa');
const routes = require('./src/routes');
const cors = require('koa2-cors');

const port = 3036;
const app = new Koa();

app.use(routes);
// see: https://github.com/zadzbw/koa2-cors
app.use(cors({
    origin: (ctx) => ctx.request.header.origin,
}));

// 启动服务器
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});