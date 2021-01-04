// Listening to messages in Context Script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    // Callback
    sendResponse({ message: 'Content script has received that message ⚡' })
})