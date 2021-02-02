console = chrome.extension.getBackgroundPage().console;

function targetLanguageChanged(value) {
    getLocaleList();
    chrome.storage.sync.set({targetLanguage: value}, function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
          });
      });
}

async function getLocaleList() {
    console.log('Inside getLocaleList()!');
    const data = {"target": "en"}
    var url = "https://translation.googleapis.com/language/translate/v2/languages";
     url += "?key=AIzaSyDavCeDDkRQeAC85udu9p6Kl8Nj0cHuxYU"; //Regenerating key once deployed.
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