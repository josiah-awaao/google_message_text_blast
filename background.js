chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ Text Blaster Extension Installed!");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("messages.google.com/web/conversations")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        }).then(() => {
            console.log("✅ Content script injected successfully!");
        }).catch(err => console.error("❌ Error injecting content script:", err));
    }
});
