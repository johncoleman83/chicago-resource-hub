
var init = function() {
    $( document ).ready(function() {
        getData().then(function (data) {
            fuseSearch(JSON.parse(atob(data)).responseJSON)
        });
    });
}

var fuseSearch = function(data) {
    var typingTimer;
    var doneTypingInterval = SEARCH_AS_YOU_TYPE_TIMEOUT;
    var $organizationNameInput = $( "#text_search" );

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
                "organization"
            ]
        };
        let fuse = new Fuse(data, options);
        let searchTerms = $organizationNameInput.val();
        let result = fuse.search(searchTerms);
        let formatedResult = result.map(function(r) {
            return [
                "<p>",
                "organization= ",
                r.item.organization,
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

    //on keyup, start the countdown
    $organizationNameInput.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doFuseSearch, doneTypingInterval);
    });

    //on keydown, clear the countdown 
    $organizationNameInput.on('keydown', function () {
        clearTimeout(typingTimer);
    });
};

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
