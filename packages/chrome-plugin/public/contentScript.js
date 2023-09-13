const ACTION = 'web-ai-runJs';
const typeMap = {
    click: 'click',
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.action) return;
    if (message.action !== ACTION) return;

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