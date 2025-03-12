function sendMessage(number, message) {
    let newChatBtn = document.querySelector('button[aria-label="Start chat"]');
    if (newChatBtn) {
        newChatBtn.click();
        setTimeout(() => {
            let inputField = document.querySelector('input[type="text"]');
            if (inputField) {
                inputField.value = number;
                inputField.dispatchEvent(new Event("input", { bubbles: true }));
                setTimeout(() => {
                    inputField.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
                    setTimeout(() => {
                        let textArea = document.querySelector('textarea');
                        if (textArea) {
                            textArea.value = message;
                            textArea.dispatchEvent(new Event("input", { bubbles: true }));
                            setTimeout(() => {
                                let sendButton = document.querySelector('button[aria-label="Send SMS"]');
                                if (sendButton) {
                                    sendButton.click();
                                }
                            }, 1000);
                        }
                    }, 2000);
                }, 1000);
            }
        }, 2000);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendMessage") {
        sendMessage(request.number, request.message);
    }
});