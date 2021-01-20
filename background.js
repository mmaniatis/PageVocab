chrome.webNavigation.onCompleted.addListener(function(details) { // TODO: webNavigation is not working 
    if (!(details.url.includes('google')) ) {
        if(details.frameId==0){
            translatePage();
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
     translate(request.wordToTranslate).then(res => res.json()).then(json => 
        {
            const obj = json.data.translations[0].translatedText;
            sendResponse(obj);
        });
    return true;
});


async function translate(word) {
    var url = "https://translation.googleapis.com/language/translate/v2";
    //Strings requiring translation
    url += "?q=" + word; 
    //Target language
    url += "&target=" + "ES";
    //API-key
    url += "&key=AIzaSyBPBL9scxJGe0GOjx2Ougtb2MWbdzw_bP4";
    const response = await fetch(url);
    // .then(response => response.json())
        // .then(data => {return data.data.translations[0].translatedText})
        // .catch(error => console.warn(error));
    return response;
}

function translatePage() {
        chrome.tabs.query({ active:true, currentWindow:true} , function(tab){
            console.log('Sending to content script for translation...');
            chrome.tabs.sendMessage(tab[0].id, { action: "translatePage" }); 
        });
}

