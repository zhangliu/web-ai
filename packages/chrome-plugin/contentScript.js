const ACTION = 'web-ai-runJs';
const typeMap = {
    getDom: 'getDom',
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.action) return;
    if (message.action !== ACTION) return;

    const type = message.type;
    try {
        handle(message.data);
        sendResponse({ status: true });
    } catch(err) {
        console.error(err);
        sendResponse({ status: false });
    }
});

const handle = () => {
    document.body.style.background = "blue";
}