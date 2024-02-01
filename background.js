chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
        // Check if the current tab matches the target website
        console.log(tab.url);
        if (tab.url.startsWith("https://chat.openai.com/c")) {
            chrome.tabs.sendMessage(tabId, { url: tab.url });
        }
    }
});
