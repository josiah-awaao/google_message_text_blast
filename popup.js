document.getElementById("sendBtn").addEventListener("click", function() {
    let numbers = document.getElementById("number").value.split(",").map(n => n.trim());
    let message = document.getElementById("message").value;
    let delay = parseInt(document.getElementById("delay").value) || 0;

    let messages = numbers.map(num => ({ number: num, message: message, delay }));

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length === 0 || !tabs[0].url.includes("messages.google.com/web/conversations")) {
            alert("Please open Google Messages Web first!");
            return;
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: "sendBulkMessages", messages }, function(response) {
            if (chrome.runtime.lastError) {
                alert("Error: Content script not running. Reload Google Messages and try again.");
            } else {
                console.log("✅ Messages sent successfully!");
            }
        });
    });
});

document.getElementById("sendCSVBtn").addEventListener("click", function() {
    let file = document.getElementById("csvFile").files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(event) {
        let lines = event.target.result.split("\n").map(line => line.split(","));
        let messages = lines.map(line => ({ number: line[0].trim(), message: line[1].trim(), delay: parseInt(line[2] || "0") }));

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length === 0 || !tabs[0].url.includes("messages.google.com/web/conversations")) {
                alert("Please open Google Messages Web first!");
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: "sendBulkMessages", messages });
        });
    };
    reader.readAsText(file);
});
