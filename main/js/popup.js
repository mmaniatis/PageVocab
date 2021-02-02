function targetLanguageChanged(value) {
    chrome.storage.sync.set({targetLanguage: value}, function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
          });
      });
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