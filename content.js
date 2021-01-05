// Listening to messages in Context Script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log (document.body.innerHTML);
    console.log('OnMessage hit');
    sendResponse(document.querySelectorAll(["p", "h1", "h2", "h3", "h4", "h5"]));
})
