class DomInteractor {
    dom;
    constructor(_dom) {
        this.dom = _dom;
    }
    
    selectRandomWord(wordLength) { //Refactor the random selection via jQuery.
        var randomPartOfText = this.dom[getRandomInt((this.dom.length)/2)].innerText
            .replace(/[^a-zA-Z\s]/g, "")
            .split(" ")
            .filter(x => x.length > wordLength); 
        //Within the random part of DOM select a random word.
        var randomSelection = randomPartOfText[getRandomInt(randomPartOfText.length-1)];
        return randomSelection;
    }
    translateAndReplaceWord(word_to_translate) {
        const regex = new RegExp("(\\b"+word_to_translate+"\\b|\\b" +capitalize(word_to_translate)+"\\b"+lower(word_to_translate)+"\\b)(?!')(?!([^<]+)?>)", 'g')
        var self = this;
        chrome.runtime.sendMessage(({wordToTranslate: word_to_translate}), function(translated_word) {
            self.replaceWord(regex, translated_word, word_to_translate);
        });
    }

    replaceWord(regex, translated_word, word_to_translate) {
        // console.log(word_to_translate);
        // console.log(translated_word);
        var replaced = $("body").html().replace(regex,'<mark class="page-vocab-tooltip">' + translated_word + '<span class="page-vocab-tooltiptext">'+ word_to_translate +'</span> </mark>');
        $("body").html(replaced);
    }
}
 
/*
 This variable, translationsPerformed, is important as it will prevent users from 
 swapping tabs and causing duplicate translations to the 'active' tab.
*/
let translationsPerformed = 0; 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(translationsPerformed < 1) {
        if (request.action == "translatePage") { 
            translationsPerformed++;
            const domInteractor = new DomInteractor($("body"));
            domInteractor.translateAndReplaceWord(domInteractor.selectRandomWord(3));
        }
    } 
 });


/*
    Script Utility
*/
function checkString(text, string) {
    if (text.includes(string)){
        return true;
    }
    else if (text.includes(capitalize(string))) {
        return true;
    }
    else if (text.includes(lower(string))) {
        return true;
    }
    else {
        return false;
    }
}
function capitalize(string) {
    if (string[0] != null)
        return string.charAt(0).toUpperCase() + string.slice(1);
}
function lower(string) {
    if (string[0] != null)
        return string.charAt(0).toLowerCase() + string.slice(1);
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}