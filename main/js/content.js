class DomInteractor {
    dom;
    constructor(_dom) {
        this.dom = _dom;
    }
    
    selectRandomWord(wordLength) {
        /*
            1. select random part of DOM, 
            2. filter out non english letters
            3. convert to array
            4. filter trivial words / spaces out of array
        */
        var randomPartOfText = this.dom[getRandomInt(this.dom.length-1)].innerText
            .replace(/[^a-zA-Z\s]/g, "")
            .split(" ")
            .filter(x => x.length > wordLength); 
        //Within the random part of DOM select a random word.
        var randomSelection = randomPartOfText[getRandomInt(randomPartOfText.length-1)];
        return randomSelection;
    }

    //TODO: See if this and findWordAndReplace can be done in one step for performance enhancement.
    findWordAndReplace(word_to_translate) { 
        for (var i = this.dom.length; i--;) { 
            if (checkString(this.dom[i].innerHTML, word_to_translate)) {
                this.translateAndReplaceWord(this.dom, i, word_to_translate)
            }
        } 
    }

    translateAndReplaceWord(dom, index, word_to_translate) {
        const regex = new RegExp("(\\b"+word_to_translate+"\\b|\\b" +capitalize(word_to_translate)+"\\b"+lower(word_to_translate)+"\\b)(?!')(?!([^<]+)?>)", 'g')
        var self = this;
        chrome.runtime.sendMessage(({wordToTranslate: word_to_translate}), function(translated_word) {
            self.replaceWord(dom, index, regex, translated_word, word_to_translate);
        });
    }

    replaceWord(dom, index, regex, translated_word, word_to_translate) {
        dom[index].innerHTML = dom[index].innerHTML.replaceAll(regex,
            function(matched) { // Add check to see if it's lower, then match lower.. other wise upper.
                //TODO: Add onClick to pronounce the word.
                return '<mark class="page-vocab-tooltip">' + translated_word + '<span class="page-vocab-tooltiptext">'+ word_to_translate +'</span> </mark>';
            }    
        )
    }
}


/*
    Check if request is transalte page
    Get DOM
    Pick random word
    Translate
    Replace word.
*/

/*
 This variable, translationsPerformed, is important as it will prevent users from 
 swapping tabs and causing duplicate translations to the 'active' tab.
*/
let translationsPerformed = 0; 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(translationsPerformed < 1) {
        if (request.action == "translatePage") { 
            translationsPerformed++;
            var dom = Array.from(document.querySelectorAll('p')).filter(x => ((x.innerText.length > 4) && x.innerText.match(/[^a-zA-Z\s]/g))); //Doing this so that we don't get an empty inner text part of dom that throws error.
            const domInteractor = new DomInteractor(dom);
            domInteractor.findWordAndReplace(domInteractor.selectRandomWord(2));
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