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
    let $servicesInput = $( "#autocomplete-input" );
    let $populationInput = $( "#population-select" );
    let $activitiesInput = $( "#activities-select" );
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

    let searchCallback = async (results) => {
        let formatedLocations = htmlFormatFor(results);
        $( "#locations-listing-view" ).html(formatedLocations);
        $(".tabs").tabs();
    }

    let doflexSearch = function() {
        let nameSearchTerm = $nameInput.val().trim();
        let serviceSearchTerm = $servicesInput.val().trim();
        let populationSearchText = $populationInput.find("li.selected").text().trim();
        let activitiesSearchText = $activitiesInput.find("li.selected").text().trim();
    
        let query = []
        let servicesQuery = "";
        if ( nameSearchTerm != "" ) {
            query.push({
                field: "name",
                query: nameSearchTerm,
                bool: "and"
            })
        };
        if ( serviceSearchTerm != "" ) {
            servicesQuery += serviceSearchTerm
        };
        if ( populationSearchText != "** no specified population **") {
            let populationSearchTerm = $populationInput.find("select").find("option").filter(
                function (i, opt) {
                    return opt.text.trim() == populationSearchText;
                }
            )[0].value;
            servicesQuery += " " +  populationSearchTerm
        };
        if ( activitiesSearchText != "** no specified activity **") {
            let activitiesSearchTerm = $activitiesInput.find("select").find("option").filter(
                function (i, opt) {
                    return opt.text.trim() == activitiesSearchText;
                }
            )[0].value;
            servicesQuery += " " + activitiesSearchTerm
        };
        if ( servicesQuery != "" ) {
            query.push({
                field: "services",
                query: servicesQuery,
                bool: "and"
            })
        }

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
    searchAsYouType($servicesInput);

    searchOnClick($searchButton);
    searchOnClick($( "#services-autocomplete-parent" ).children());
    searchOnClick($populationInput.find("li"));
    searchOnClick($activitiesInput.find("li"));
};

let formatOneLocation = function (l) {
    return [
        '<div class="col s12 m6 l6 xl6">',
        '<h5>' + l.name + '</h5>',
        '<div class="card">',
        '<div class="row card-content">',
        '<div class="col s12 m6 l6 xl 6">',
        '<p class="location-address">' + l.address + '</p>',
        '<p class="location-phone">' + l.phone + '</p>',
        '</div>',
        '<div class="col s12 m6 l6 xl 6">',
        '<p class="location-website">',
        '<a href="' + l.website + '" target="blank">' + l.website + '</a>',
        '</p>',
        '</div>',
        '</div>',
        '<div class="card-tabs">',
        '<ul class="tabs tabs-fixed-width">',
        '<li class="tab"><a href="#services-' + l.id + '" class="active">Services</a></li>',
        '<li class="tab"><a href="#description-' + l.id + '">Description</a></li>',
        '</ul>',
        '</div>',
        '<div class="card-content grey lighten-4">',
        '<div id="services-' + l.id + '">' + l.services + '</div>',
        '<div id="description-' + l.id + '">',
        l.description == "" ? "None Provided" : l.description,
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join("")
}

let htmlFormatFor = function (results) {
    formatedLocations = results.map(function(r) {
        return formatOneLocation(r)
    });
    return formatedLocations.join("")
}

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
