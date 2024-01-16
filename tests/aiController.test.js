const Axios = require('axios');

const axios = Axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 60000,
    headers: {'Content-type': 'application/json'}
});

// test /bot/bard/prompt
(async () => {
    const params = {
        prompt: '你好',
    };
    axios.post(`/bot/bard/prompt?chatName=*`, params).then(res => {
        console.log(res.data.data);
    })
})()