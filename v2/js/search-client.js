let data;
let init = function() {
    $( document ).ready(function() {
        getData().then(function (d) {
            data = JSON.parse(atob(d));
            flexSearchClient(data);
        });
    });
}

let flexSearchClient = function(data) {
    let $nameInput = $( "#organization-name-search" );
    let $searchButton = $( "#search-button" );
    let $servicesInput = $( "#services-select" );
    let index = new FlexSearch({
        tokenize: "forward",
        doc: {
            id: "id",
            field: [
                "name",
                "services",
                "description"
            ]
        }
    });
    index.add(data);

    let searchCallback = function(results) {
        let formatedResult = results.map(function(r) {
            return [
                "<p>",
                "name= ",
                r.name,
                ", phone= ",
                r.phone,
                "</p>",
                "<br>"
            ].join("")
        });
        $( "#test-json-results" ).html(formatedResult);
    }

    let doflexSearch = function() {
        let nameSearchTerm = $nameInput.val().trim();
        let serviceSearchText = $servicesInput.find("li.selected").text().trim();
    
        let query = []
        if ( nameSearchTerm != "" ) {
            query.push({
                field: "name",
                query: nameSearchTerm,
                bool: "and"
            })
        };
        if ( serviceSearchText != "** no specified service **") {
            let serviceSearchTerm = $servicesInput.find("select").find("option").filter(
                function (i, opt) {
                    return opt.text.trim() == serviceSearchText;
                }
            )[0].value;
            query.push({
                field: "services",
                query: serviceSearchTerm,
                bool: "and"
            })
        };

        results = index.search(query, DEFAULT_SEARCH_LIMIT);
        searchCallback(results);
    };

    let searchAsYouType = function(field) {
        let typingTimer;
        let doneTypingInterval = SEARCH_AS_YOU_TYPE_TIMEOUT;

        //on keypress for enter do search
        field.keypress(function (e) {
            if ( e.which == 13 ) {
                clearTimeout(typingTimer);
                doflexSearch();
            }
        });

        //on keyup, start the countdown
        field.keyup(function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doflexSearch, doneTypingInterval);
        });

        //on keydown, clear the countdown 
        field.keydown(function () {
            clearTimeout(typingTimer);
        });
    }

    let searchOnClick = function(field) {
        field.click(function() {
            doflexSearch();
        });
    }
    searchAsYouType($nameInput);
    searchOnClick($searchButton);
    searchOnClick($servicesInput.find("li"));
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
let getData = function() {
    // fetch locations.txt via ajax & convert encoded string to json object
    return $.ajax(
        {
            url: DATA_URL,
            async: true
        }
    );
};

init();
