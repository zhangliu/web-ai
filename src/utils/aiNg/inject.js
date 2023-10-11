(() => {
    const sleep = duration => new Promise(r => setTimeout(r, duration));
    window.ng = {};
    window.ng.utils = {
        sleep
    };
})()
