class DomInteractor {
    original_dom
    translated_word;
    
    constructor(_original_dom) {
        this.original_dom = _original_dom;
    }
    
    /* This function will select a word from top half of array (most lengthiest half),
        ensuring a good candidate is chosen. 
    */
    selectRandomWord(wordLength) {
        let p_array = [];
        $.each($('p'), function() {
            if (this != undefined) {
                p_array.push(this.innerText);
            }
        });
        p_array.sort(function(a,b) { return (a.length < b.length ? 1 : -1)});
        let text_to_choose_random_word_from = p_array[getRandomInt(Math.floor(p_array.length/2))].replace(/[^a-zA-Z\s]/g, "")
        .split(" ")
        .filter(x => x.length > wordLength);
        return text_to_choose_random_word_from[getRandomInt(text_to_choose_random_word_from.length-1)];
    }

    translateAndReplaceWord(word_to_translate) {
        var self = this;
        chrome.runtime.sendMessage(({wordToTranslate: word_to_translate}), function(translated_word) {
            self.replaceWord(translated_word, word_to_translate);
        });
    }

    replaceWord(translated_word, word_to_translate) {
        console.log(word_to_translate);
        console.log(translated_word);
        const regex = new RegExp("(\\b"+word_to_translate+"\\b|\\b" +capitalize(word_to_translate)+"\\b"+lower(word_to_translate)+"\\b)(?!([^<]+)?>)", 'g')
        $.each($('p'), function() {
            $(this).html($(this).html().replace(regex, (regex,'<mark class="page-vocab-tooltip">' + translated_word + '<span class="page-vocab-tooltiptext">'+ word_to_translate +'</span> </mark>')));
        })
    }

}
 
/*
 This variable, translationsPerformed, is important as it will prevent users from 
 swapping tabs and causing duplicate translations to the 'active' tab.
*/
let translationsPerformed = 0; 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action == "translatePage") { 
            translationsPerformed++;
            const domInteractor = new DomInteractor($('*'));
            domInteractor.translateAndReplaceWord(domInteractor.selectRandomWord(3));
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