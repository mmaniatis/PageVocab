// Listening to messages in Context Script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(document.querySelectorAll("div"));
    // console.log('Sending hit');
    sendResponse(document.querySelectorAll("div"));
})
