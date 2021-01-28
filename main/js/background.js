class Translator {

    constructor () {
    }

    async translate(word, target) {
        console.log('Word to translate: ' + word);
        console.log('Target language: ' + target);
        var url = "https://translation.googleapis.com/language/translate/v2";
        url += "?q=" + word; 
        url += "&target=" + target;
        url += "&key=AIzaSyBPBL9scxJGe0GOjx2Ougtb2MWbdzw_bP4";
        const response = await fetch(url);
        return response;
    }
    
    translatePage() {
        chrome.tabs.query({ currentWindow:true, active:true} , function(tab){
            console.log('Sending to content script for translation...');
            chrome.tabs.sendMessage(tab[0].id, { action: "translatePage" }); 
        });
    }
}
const translator = new Translator();

chrome.webNavigation.onCompleted.addListener(function(details) {    
    if (!(details.url.includes('google')) ) {
        if(details.frameId==0){
            translator.translatePage();
        }
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



// async function getLocaleList() {
//     const data = {"target": "en"}
//     var url = "https://translation.googleapis.com/language/translate/v2/languages";
//      url += "?key=AIzaSyBPBL9scxJGe0GOjx2Ougtb2MWbdzw_bP4";
//     const response = await fetch(url, {
//         method: "GET"
//     }).then(res => res.json()).then(json => {console.log(json)});
//     return response;
// }
