let data;
let pagination = [];

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
    let $servicesInput = $( "#autocomplete-input" );
    let $populationInput = $( "#population-select" );
    let $populationList = $( "#population-list" );
    let $activitiesInput = $( "#activities-select" );
    let $activitiesList = $( "#activities-list" );
    let $searchButton = $( "#search-button" );

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

    let doflexSearch = function() {
        let nameSearchTerm = $nameInput.val().trim();
        let serviceSearchTerm = $servicesInput.val().trim();
        let populationSearchText = $populationInput.val().trim();
        let activitiesSearchText = $activitiesInput.val().trim();
    
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

        if ( searchTerms != "" ) {
            let result = index.search(
                {
                    query: searchTerms,
                    bool: "or",
                    field: fields,
                    limit: DEFAULT_SEARCH_LIMIT,
                    page: true
                }
            );
            let locations = result.result;
            searchCallback(locations);
            displayOnMapFor(locations);
        } else {
            clearOverlays();
        }
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
    searchAsYouType($servicesInput);

    searchOnClick($searchButton);
    searchOnClick($( "#services-autocomplete-parent" ).children());
    searchOnClick($populationList.find("li"));
    searchOnClick($activitiesList.find("li"));
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
