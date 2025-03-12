if (!window.hasRun) {
    window.hasRun = true; // Prevent multiple script injections

    let messageQueue = [];
    let isSending = false;

    function sendMessage(number, message, delay = 0) {
        messageQueue.push({ number, message, delay });
        processQueue();
    }

    function processQueue() {
        if (isSending || messageQueue.length === 0) return;

        isSending = true;
        let { number, message, delay } = messageQueue.shift();

        setTimeout(() => {
            let newChatDiv = document.querySelector('div.fab-label');
            if (newChatDiv && newChatDiv.innerText.includes("Start chat")) {
                console.log("✅ Clicking 'Start Chat' button...");
                newChatDiv.click();

                setTimeout(() => {
                    let inputField = document.querySelector('input[type="text"], input[aria-label="To"]');
                    if (inputField) {
                        console.log(`✅ Entering phone number: ${number}`);
                        inputField.value = number;
                        inputField.dispatchEvent(new Event("input", { bubbles: true }));

                        setTimeout(() => {
                            inputField.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

                            setTimeout(() => {
                                let textArea = document.querySelector('textarea, div[role="textbox"]');
                                if (textArea) {
                                    console.log(`✅ Typing message: ${message}`);
                                    textArea.value = message;
                                    textArea.dispatchEvent(new Event("input", { bubbles: true }));

                                    setTimeout(() => {
                                        let sendButton = document.querySelector('mw-message-send-button button[data-e2e-send-text-button]');
                                        if (sendButton) {
                                            console.log("✅ Clicking Send...");
                                            sendButton.click();
                                        } else {
                                            console.error("❌ Send button not found!");
                                        }
                                        isSending = false;
                                        processQueue(); // Continue sending next messages
                                    }, 1000);
                                } else {
                                    console.error("❌ Message input field not found!");
                                    isSending = false;
                                }
                            }, 2000);
                        }, 1000);
                    } else {
                        console.error("❌ Phone number input field not found!");
                        isSending = false;
                    }
                }, 2000);
            } else {
                console.error("❌ 'Start Chat' button not found!");
                isSending = false;
            }
        }, delay * 1000);
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "sendBulkMessages") {
            console.log("📩 Received bulk messages request:", request.messages);
            request.messages.forEach(msg => sendMessage(msg.number, msg.message, msg.delay));
            sendResponse({ status: "OK" });
        }
    });

    console.log("✅ Content script loaded successfully!");
}
