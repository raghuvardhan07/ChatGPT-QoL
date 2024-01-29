chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      // Check if the current tab matches the target website
      console.log(tab.url);
      if (tab.url.startsWith('https://chat.openai.com/c')) {
        chrome.scripting.executeScript({
            target: {tabId}, 
            files: ['content_scripts.js'] // Inject your content script
        });
      }
    }
  });

