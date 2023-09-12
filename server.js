const Koa = require('koa');
const routes = require('./src/routes');

const port = 3033;
const app = new Koa();

app.use(routes);

// 启动服务器
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});