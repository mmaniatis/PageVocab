function targetLanguageChanged(value) {
    chrome.storage.sync.set({targetLanguage: value}, function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
          });
      });
}

async function getLocaleList() {
    const data = {"target": "en"}
    var url = "https://translation.googleapis.com/language/translate/v2/languages";
     url += "?key=AIzaSyBPBL9scxJGe0GOjx2Ougtb2MWbdzw_bP4";
    const response = await fetch(url, {
        method: "GET"
    }).then(res => res.json()).then(json => {console.log(json)});
    return response;
}


document.addEventListener("DOMContentLoaded", function(event) {
    chrome.storage.sync.get(['targetLanguage'], function(result) {
        var languageDropdown = document.getElementById("selectedTargetLanguage");
        languageDropdown.value = result.targetLanguage;
      });
});

document.addEventListener("change", function(event) {
    var languageDropdown = document.getElementById("selectedTargetLanguage");
    languageDropdown.onchange = targetLanguageChanged(languageDropdown.value);
});