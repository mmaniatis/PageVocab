// Listening to messages in Context Script

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //
    //Check if request is transalte page
    //Get DOM
    //Pick random word
    //Translate
    //Replace word.

    //TODO: THESE SHOULD BE METHODS
    if (request.action == "translatePage") { 
        //select p 
        var dom = document.querySelectorAll('p'); 

        //select random part of DOM, 
        // 1. filter out non english letters
        // 2. convert to array
        // 3. filter trivial words / spaces out of array 
        var randomPartOfDom = dom[getRandomInt(dom.length-1)].innerText
            .replace(/[^a-zA-Z\s]/g, "")
            .split(" ")
            .filter(x => x.length > 2); 
            
        //Within the random part of DOM select a random word.
        var randomSelection = randomPartOfDom[getRandomInt(randomPartOfDom.length-1)]
        console.log(randomSelection);
        //Send message to background and translate the word, then pass it into the method.

        findWordInDomAndReplace(dom, randomSelection);

    }
 })

function findWordInDomAndReplace(dom, word_to_translate){
    for (var i = dom.length; i--;) { 
        if (checkString(dom[i].innerHTML, word_to_translate) && dom[i].outerHTML) {
            console.log("Replacing..");
            translateAndReplaceWord(dom, i, word_to_translate)
        }
    } 
}

function translateAndReplaceWord(dom, index, word_to_translate) {
    const regex = new RegExp(
        "\\b" + word_to_translate + "\\b|" + 
        "\\b" + word_to_translate + 's' + "\\b|" + 
        "\\b" + capitalize(word_to_translate) + "\\b|" + 
        "\\b" + capitalize(word_to_translate) + 's' + "\\b" 
    , 'g');


    chrome.runtime.sendMessage(({wordToTranslate: word_to_translate}), function(response) {
        console.log(response);
        dom[index].innerHTML = dom[index].innerHTML.replaceAll(regex,
            function(matched) {
                return '<mark>' + response + '</mark>';
            }    
        )
    });
}

function checkString(innerHTML, word_to_translate) {
    if (innerHTML.includes(word_to_translate)){
        return true;
    } else if (innerHTML.includes(word_to_translate + 's')) {
        return true;
    } else if (innerHTML.includes(capitalize(word_to_translate))) {
        return true;
    } else if (innerHTML.includes(capitalize(word_to_translate) + 's')) {
        return true;
    } else {
        return false;
    }

}
function capitalize(string) {
    if (string[0] != null)
        return string.charAt(0).toUpperCase() + string.slice(1);
    
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}