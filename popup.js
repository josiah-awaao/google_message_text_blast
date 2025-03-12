document.getElementById("sendBtn").addEventListener("click", function() {
    let number = document.getElementById("number").value;
    let message = document.getElementById("message").value;

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "sendMessage", number, message });
    });
});