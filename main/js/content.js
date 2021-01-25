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
            var dom = document.querySelectorAll('p');
            const randomSelection = selectRandomWordInDom(dom);
            findWordInDomTranslateAndReplace(dom, randomSelection);
        }
    } 
 })

function selectRandomWordInDom(dom) {
    /*
        1. select random part of DOM, 
        2. filter out non english letters
        3. convert to array
        4. filter trivial words / spaces out of array
    */
    var randomPartOfDom = dom[getRandomInt(dom.length-1)].innerText
        .replace(/[^a-zA-Z\s]/g, "")
        .split(" ")
        .filter(x => x.length > 2); 
        
    //Within the random part of DOM select a random word.
    var randomSelection = randomPartOfDom[getRandomInt(randomPartOfDom.length-1)]
    console.log(randomSelection);
    return randomSelection;
}
function findWordInDomTranslateAndReplace(dom, word_to_translate) { 
    for (var i = dom.length; i--;) { 
        if (checkString(dom[i].innerHTML, word_to_translate) && !(checkString(dom[i].outerHTML, 'page-vocab-tooltip')) ) {
            translateAndReplaceWord(dom, i, word_to_translate)
        }
    } 
}

function translateAndReplaceWord(dom, index, word_to_translate) {
    // const regex1 = new RegExp("(?!.<.[^>]*?>)(\\b"+word_to_translate+"\\b|\\b"+capitalize(word_to_translate)+"\\b|\\b"+lower(word_to_translate)+"\\b)(?![^<]*?</.>)",  'g');
    const regex = new RegExp("(\\b"+word_to_translate+"\\b|\\b" +capitalize(word_to_translate)+"\\b"+lower(word_to_translate)+"\\b)(?!([^<]+)?>)", 'g')
    chrome.runtime.sendMessage(({wordToTranslate: word_to_translate}), function(translated_word) {
        replaceWord(dom, index, regex, translated_word, word_to_translate);
    });
}

function replaceWord(dom, index, regex, translated_word, word_to_translate) {
    dom[index].innerHTML = dom[index].innerHTML.replaceAll(regex,
        function(matched) { // Add check to see if it's lower, then match lower.. other wise upper.
            return '<mark class="page-vocab-tooltip">' + translated_word + '<span class="page-vocab-tooltiptext">'+ word_to_translate +'</span> </mark>';
        }    
    )
}


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