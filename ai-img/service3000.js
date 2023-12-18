const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    // 获取当前文件列表
    // const files = fs.readdirSync(__dirname);

    execSync('rm -rf /home/kasm-user/projects/ubuntu-env-test/test.png');
    execSync('import -window root /home/kasm-user/projects/ubuntu-env-test/test.png');
    const imgFile = `${__dirname}/test.png`;
    const data = fs.readFileSync(imgFile);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png');
    res.end(data);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});