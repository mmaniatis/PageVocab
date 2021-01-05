chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        getDomInfo();
    }
});
function translate() {
    var url = "https://translation.googleapis.com/language/translate/v2";
    //Strings requiring translation
    url += "?q=" + "test"; 
    //Target language
    url += "&target=" + "ES";
    //API-key
    url += "&key=AIzaSyDIdNmueqLboMGLMkohyE902uED1uHUvMc";
    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data.data.translations[0].translatedText));
        // .then(replaceVocabWord());
}
//TODO: Need to access current tabs DOM and log in console.
// UPDATE 1/4/2021 - Successfully talking between content / background scripts. Now I can send dom, add methods, and print that.
function getDomInfo() {

        chrome.tabs.query({ active:true, currentWindow:true} , function(tab){
            console.log('Sending..');
            chrome.tabs.sendMessage(tab[0].id, { "message": 'test' }, processDom); 
    
        });
        
    
}

function processDom(domContent) {
    domContent.forEach(element => console.log(element));
}
