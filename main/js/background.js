class Translator {
    translatedUrl = "";
    constructor () {
    }

    async translate(word, target) {
        var url = "https://translation.googleapis.com/language/translate/v2";
        url += "?q=" + word; 
        url += "&target=" + target;
        url += "&key=";
        const response = await fetch(url);
        return response;
    }
    
    translatePage(tabId) {
        chrome.tabs.query({currentWindow: true,active: true}, function(tab){ 
            chrome.tabs.sendMessage(tabId, { action: "translatePage" }); 
        });
    }
}
const translator = new Translator();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {    
    //Still facing reddit issue... loading a million times.
    if((translator.translatedUrl != tab.url)) { // for 1 page sites where url only changes
        translator.translatedUrl = tab.url;
        translator.translatePage(tabId);
    }
});

chrome.webNavigation.onCompleted .addListener(function(details){ // for refreshes
    if(details.frameId == 0){
        translator.translatePage(details.tabId) 
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.storage.sync.get(['targetLanguage'], function(result) {
        var target = 'es';
        if (result.targetLanguage != null) {
            target = result.targetLanguage;
        }
        translator.translate(request.wordToTranslate, target).then(res => res.json()).then(json => 
            {
                const obj = json.data.translations[0].translatedText;
                sendResponse(obj);
            });
    }); 
    return true;
});
