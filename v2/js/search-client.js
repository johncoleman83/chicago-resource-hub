var data;
var paginationIndex = 0;
var paginationQuery;
var paginationMore = true;

let init = function() {
    $( document ).ready(function() {
        getData().then(function (d) {
            data = JSON.parse(atob(d));
            flexSearchClient(data);
        });
    });
}

let resetPagination = function() {
    paginationIndex = 0;
    paginationQuery = null;
    paginationMore = true;
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
};

let paginationOffset = function () {
    if ( paginationIndex == 0 ) {
        return true;
    }
    let offset = paginationIndex * DEFAULT_SEARCH_LIMIT;
    return offset.toString();
}


let flexSearchClient = function(data) {
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

    let searchCallback = async (locations) => {
        let formatedLocations = htmlFormatFor(locations);
        $( "#locations-listing-view" ).html(formatedLocations);
        $(".tabs").tabs();
    }
    
    let doflexSearchWithPagination = function (query) {
        if ( !query )   {
            return;
        }

        query.page = paginationOffset();
        query.limit = DEFAULT_SEARCH_LIMIT;

        let result = index.search(query.query, query);
        let locations = result.result;
        if ( locations.length <= 0 )  {
            return;
        }
        if ( !result.next ) {
            paginationMore = false;
        }
        searchCallback(locations);
        displayOnMapFor(locations);
    }
    
    let doflexSearch = function() {
        resetPagination();
        let query = buildSearchQuery();
        paginationQuery = query;
        doflexSearchWithPagination(query);
    }

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
    
    let paginateOnClick = function() {
        let paginationBack = $( "#pagination-back" );
        let paginationForward = $( "#pagination-forward" );
        
        paginationBack.click(function() {
            if ( paginationIndex > 0 && paginationQuery) {
                paginationIndex -= 1;
                paginationMore = true;
                doflexSearchWithPagination(paginationQuery);
            }
        });
        paginationForward.click(function() {
            if ( paginationMore && paginationQuery) {
                paginationIndex += 1;
                doflexSearchWithPagination(paginationQuery);
            }
        });
    }
    let $nameInput = $( "#organization-name-search" );
    let $servicesInput = $( "#autocomplete-input" );
    let $populationList = $( "#population-list" );
    let $activitiesList = $( "#activities-list" );
    let $searchButton = $( "#search-button" );

    searchAsYouType($nameInput);
    searchAsYouType($servicesInput);

    searchOnClick($searchButton);
    searchOnClick($( "#services-autocomplete-parent" ).children());
    searchOnClick($populationList.find("li"));
    searchOnClick($activitiesList.find("li"));
    paginateOnClick();
};

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
