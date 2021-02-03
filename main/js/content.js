class DomInteractor {
    translations_performed = 0;
    original_word = "";
    post_translation_word = "";
    node_array = []
    text_array = [];
    dom;
    constructor() {
        
    }

    init() {
        this.build_p_array(this.dom, this.text_array);
    }
    
    /* This function will select a word from top half of array (most lengthiest half),
        ensuring a good candidate is chosen. 
    */
    selectRandomWord(p_array, wordLength) {
        if(p_array.length > 0) {
            p_array.sort(function(a,b) { return (a.length < b.length ? 1 : -1)});
            let text_to_choose_random_word_from = p_array[getRandomInt(Math.floor(p_array.length/2))]
            .replace(/[^a-zA-Z\s]/g, "")
            .split(" ")
            .filter(x => x.length > wordLength);
            // console.log(text_to_choose_random_word_from);
            return text_to_choose_random_word_from[getRandomInt(text_to_choose_random_word_from.length-1)];    
        }
        
    }

    build_p_array(node, text_array)
    {
        this.build_array_helper(node, text_array);
        node = node.firstChild;
        while (node)
        {
            build_p_array(node, text_array);
            node = node.nextSibling;
        }
    }

    build_array_helper(node, text_array) {
        node.each(i => {
            if(node[i].firstChild != null && (node[i].tagName == 'P') && node[i].firstChild.nodeType == 3 ){
                this.node_array.push(node[i]);
                text_array.push(node[i].innerText);
            }
        })

    }

    translateAndReplaceWord(word_to_translate) {
        var self = this;
        chrome.runtime.sendMessage(({wordToTranslate: word_to_translate}), function(translated_word) {
            self.replaceWord($('*'), translated_word, word_to_translate);
        });
    }

    replaceWord(node, translated_word, word_to_translate) {
        this.original_word = word_to_translate;
        this.post_translation_word = translated_word;
        console.log(word_to_translate);
        console.log(translated_word);
        const regex = new RegExp("(\\b"+word_to_translate+"\\b|\\b" +capitalize(word_to_translate)+"\\b"+lower(word_to_translate)+"\\b)(?!([^<]+)?>)", 'g');
        $.each(this.node_array, function() {
            $(this).html($(this).html().replace(regex, (regex,'<mark class="page-vocab-tooltip">' + translated_word + '<span class="page-vocab-tooltiptext">'+ word_to_translate +'</span> </mark>')));
        })
    }

    undoTranslation() {
        // console.log(domInteractor.translations_performed);
        $.each(this.node_array, function() {
            $(this).html($(this).html().replace('<mark class="page-vocab-tooltip">' + this.post_translation_word + '<span class="page-vocab-tooltiptext">'+ this.original_word +'</span> </mark>', this.original_word));
        })
        this.translations_performed = 0;
        console.log("reversing "  + this.post_translation_word + " back to " + this.original_word);
        this.beginTranslate()
    }
    
    beginTranslate() {
        let randomWord = this.selectRandomWord(this.text_array, 3);
        if(randomWord != "" && randomWord != undefined){
            this.translateAndReplaceWord(randomWord.trim());
        }
    }
}
const domInteractor = new DomInteractor();
 
/*
 This variable, translationsPerformed, is important as it will prevent users from 
 swapping tabs and causing duplicate translations to the 'active' tab.
*/
let translationsPerformed = 0; 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message Received..');
    if (request.action == "translatePage") {
        domInteractor.dom = $('*'); 
        domInteractor.init();
        domInteractor.translations_performed++;
        if(domInteractor.translations_performed > 1) {
            console.log("Undoing translation..");
            domInteractor.undoTranslation();
        }
        else {
            console.log("Beginning translation..");
            domInteractor.beginTranslate();
        }

    }
 });


/*
    ####################################################### Script Utility
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

function checkVisible( elm, evalType ) {
    evalType = evalType || "visible";

    var vpH = $(window).height(), // Viewport Height
        st = $(window).scrollTop(), // Scroll Top
        y = $(elm).offset().top,
        elementHeight = $(elm).height();

    if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
    if (evalType === "above") return ((y < (vpH + st)));
}