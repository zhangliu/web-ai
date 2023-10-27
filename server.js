const Koa = require('koa');
const cors = require('koa2-cors');
const { bodyParser } = require("@koa/bodyparser");

const routes = require('./src/routes');

const port = 3030;
const app = new Koa();

app.use(bodyParser());
app.use(routes);
// see: https://github.com/zadzbw/koa2-cors
app.use(cors({
    origin: (ctx) => ctx.request.header.origin,
}));

// 启动服务器
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});