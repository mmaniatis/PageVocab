class Translator {

    constructor () {
    }

    async translate(word, target) {
        // console.log('Word to translate: ' + word);
        // console.log('Target language: ' + target);
        var url = "https://translation.googleapis.com/language/translate/v2";
        url += "?q=" + word; 
        url += "&target=" + target;
        url += "&key=";
        const response = await fetch(url);
        // console.log(response);
        return response;
    }
    
    translatePage(tabId) {
        chrome.tabs.query({currentWindow: true,active: true}, function(tab){ 
            chrome.tabs.sendMessage(tabId, { action: "translatePage" }); 
        });
    }
}
const translator = new Translator();

chrome.tabs.onUpdated.addListener(function(tab, info) {    
    console.log(tab);
    if(info.status == 'complete') {
        translator.translatePage(tab);
    }
});

chrome.tabs.onCreated.addListener(function(tab) {
    
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