
var init = function() {
    $( document ).ready(function() {
        getData().then(function (data) {
            fuseSearch(JSON.parse(atob(data)))
        });
    });
}

var fuseSearch = function(data) {
    var typingTimer;
    var doneTypingInterval = SEARCH_AS_YOU_TYPE_TIMEOUT;
    var $nameInput = $( "#text_search" );

    // $( "#search" ).click(function() {
    let doFuseSearch = function() {
        let options = {
            shouldSort: true,
            tokenize: true,
            findAllMatches: true,
            includeScore: true,
            threshold: 0.2,
            location: 0,
            distance: 100,
            maxPatternLength: 20,
            minMatchCharLength: 1,
            keys: [
                "name"
            ]
        };
        let fuse = new Fuse(data, options);
        let searchTerms = $nameInput.val();
        let result = fuse.search(searchTerms);
        let formatedResult = result.map(function(r) {
            return [
                "<p>",
                "name= ",
                r.item.name,
                ", phone= ",
                r.item.phone,
                ", score= ",
                Math.round((1 - r.score) * 100),
                "</p>",
                "<br>"
            ].join("")
        });
        $( "#test-json-results" ).html(formatedResult);
    };

    //on keypress for enter do search
    $nameInput.keypress(function (e) {
        if( e.which == 13 ) {
            clearTimeout(typingTimer);
            doFuseSearch();
        }
    });

    //on keyup, start the countdown
    $nameInput.keyup(function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doFuseSearch, doneTypingInterval);
    });

    //on keydown, clear the countdown 
    $nameInput.keydown(function () {
        clearTimeout(typingTimer);
    });
};

/*****************
// convert json data to javascript object
let r = $.getJSON("http://localhost:8000/data/locations.json", function(json) {
  return json;
});

// convert data right back to string
// r.responseText;
let stringData = JSON.stringify(r.responseJSON);

// convert string to base65 encoding
let encodedData = btoa(stringData)

// convert back
let decodedData = JSON.parse(atob(encodedData))

********************/
var getData = function() {
    // fetch locations.txt via ajax & convert encoded string to json object
    return $.ajax(
        {
            url: DATA_URL,
            async: true
        }
    );
};

init();
