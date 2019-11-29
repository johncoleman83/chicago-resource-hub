var data;
var index;
var paginationIndex = 0;
var paginationQuery = null;
var paginationMore = true;

let init = function() {
    $( document ).ready(function() {
        getData().then(function (d) {
            initSearch(d);
        });
    });
}

let initSearch = function (d) {
    data = JSON.parse(atob(d));
    index = createSearchIndex(data);
    index.add(data);
    setupSearch();
}

let createSearchIndex = function (data) {
    return new FlexSearch({
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
}

let shouldDoNewSearch = function(query) {
    if ( !paginationQuery ) {
        return true;
    }
    let queryIsEqual = paginationQuery.query === query.query;
    let fieldIsEqual = paginationQuery.field.sort().join('') === query.field.sort().join('');;
    return !queryIsEqual || !fieldIsEqual;
}

let buildSearchQuery = function() {
    let nameInput = $( "#organization-name-search" );
    let servicesInput = $( "#autocomplete-input" );
    let populationInput = $( "#population-select" );
    let activitiesInput = $( "#activities-select" );
        
    let nameSearchTerm = nameInput.val().trim();
    let serviceSearchTerm = servicesInput.val().trim();
    let populationSearchText = populationInput.val().trim();
    let activitiesSearchText = activitiesInput.val().trim();
    
    let searchTerms = "";
    let fields = []
    if ( nameSearchTerm != "" ) {
        searchTerms += nameSearchTerm;
        fields.push("name")
        fields.push("description")
    };

    if ( populationSearchText != "" ) {
        serviceSearchTerm += " " + populationSearchText;
    }
    if ( activitiesSearchText != "" ) {
        serviceSearchTerm += " " + activitiesSearchText;
    }
    if ( serviceSearchTerm != "" ) {
        searchTerms += " " + serviceSearchTerm;
        fields.push("services")
    }

    if ( searchTerms.trim() != "" ) {
        return {
            query: searchTerms.trim(),
            bool: "or",
            field: fields,
            limit: DEFAULT_SEARCH_LIMIT,
            page: true
        };
    } else {
        clearOverlays();
        return null;
    }
}

let resetPagination = function() {
    paginationIndex = 0;
    paginationQuery = null;
    paginationMore = true;
    $( "#pagination-back" ).addClass("disabled");
}

let paginationOffset = function () {
    if ( paginationIndex == 0 ) {
        return true;
    }
    let offset = paginationIndex * DEFAULT_SEARCH_LIMIT;
    return offset.toString();
}


let setupSearch = function() {
    let searchCallback = async (locations) => {
        let formatedLocations = htmlFormatFor(locations);
        $( "#locations-listing-view" ).html(formatedLocations);
        $(".tabs").tabs();
    }
    
    let doSearchWithPagination = function (query) {
        if ( !query )   {
            return;
        }

        query.page = paginationOffset();
        query.limit = DEFAULT_SEARCH_LIMIT;

        let result = index.search(query.query, query);
        let locations = result.result;
        let totalResults = locations.length;
        if ( totalResults <= 0 ) {
            return;
        }
        if ( !result.next ) {
            paginationMore = false;
            $( "#pagination-forward" ).addClass("disabled");
        } else {
             $( "#pagination-forward" ).removeClass("disabled");
        }
        searchCallback(locations);
        displayOnMapFor(locations);
        updateResultsWindow(totalResults, paginationMore);
    }
    
    let doSearch = function() {
        let query = buildSearchQuery();
        if ( shouldDoNewSearch(query) ) {
            resetPagination();
            paginationQuery = query;
            doSearchWithPagination(query);
        }
    }

    let searchAsYouType = function(field) {
        let typingTimer;
        let doneTypingInterval = SEARCH_AS_YOU_TYPE_TIMEOUT;

        //on keypress for enter do search
        field.keypress(function (e) {
            if ( e.which == 13 ) {
                clearTimeout(typingTimer);
                doSearch();
            }
        });

        //on keyup, start the countdown
        field.keyup(function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doSearch, doneTypingInterval);
        });

        //on keydown, clear the countdown 
        field.keydown(function () {
            clearTimeout(typingTimer);
        });
    }

    let searchOnClick = function(field) {
        field.click(function() {
            doSearch();
        });
    }
    
    let paginateOnClick = function() {
        $( "#pagination-back" ).click(function() {
            if ( paginationIndex > 0 && paginationQuery) {
                paginationIndex -= 1;
                paginationMore = true;
                doSearchWithPagination(paginationQuery);
                if ( paginationIndex == 0) {
                    $( "#pagination-back" ).addClass("disabled");
                }
                if ( $( "#pagination-forward" ).hasClass("disabled") ) {
                    $( "#pagination-forward" ).removeClass("disabled");
                }
            }
        });
        $( "#pagination-forward" ).click(function() {
            if ( paginationMore && paginationQuery) {
                paginationIndex += 1;
                doSearchWithPagination(paginationQuery);
                if ( $( "#pagination-back" ).hasClass("disabled") ) {
                    $( "#pagination-back" ).removeClass("disabled");
                }
            }
        });
    }

    searchAsYouType($( "#organization-name-search" ));
    searchAsYouType($( "#autocomplete-input" ));

    searchOnClick($( "#search-button" ));
    searchOnClick($( "#services-autocomplete-parent" ).children());
    searchOnClick($( "#population-list" ).find("li"));
    searchOnClick($( "#activities-list" ).find("li"));
    paginateOnClick();
};

let updateResultsWindow = function (totalResults, paginationMore) {
    let formatted = htmlFormatForResultsWindow(totalResults, paginationMore);
    $( '#results-window' ).html(formatted);
}

let htmlFormatFor = function (locations) {
    formatedLocations = locations.map(function(l) {
        return [
            '<div class="col s12 m6 l6 xl6">',
            formatOneLocation(l),
            '</div>'
        ].join("")
    });
    return formatedLocations.join("")
}

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
