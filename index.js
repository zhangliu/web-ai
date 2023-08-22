import OpenAI from 'openai';
import config from './local.config.js';

const openai = new OpenAI({
    apiKey: config.apiKey, // defaults to process.env["OPENAI_API_KEY"]
});
  
async function main() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
    });

    console.log(completion.choices);
}

main();