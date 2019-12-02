class MapsLibV2 {
  constructor() {
    // Search Setup
    this.data = null;
    this.index = null;
    this.paginationIndex = 0;
    this.paginationQuery = null;
    this.queriableIndex = null;
    this.paginationMore = true;
    this.repeatedSearchIsAllowed = false
    this.customData = [];

    // Maps Setup
    this.map;
    this.displayedMarkersList = [];
    this.customBounds = null;
  }

  // static method
  static getData() {
    // fetch locations.txt via ajax & convert encoded string to json object
    return $.ajax({
      url: DATA_URL,
      async: true
    });
  };

  // Maps Functions
  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: DEFAULT_ZOOM,
      center: CHICAGO,
      mapTypeId: 'roadmap'
    });
    $("#search-reset").click(() => {
      this.resetMap();
    });
    this.initMapSearchBox();
  }

  clearOverlays() {
    for (var i = 0; i < this.displayedMarkersList.length; i++) {
      this.displayedMarkersList[i].setMap(null);
      this.displayedMarkersList[i] = null;
    }
    this.displayedMarkersList.length = 0;
  }

  createGoogleInfoWindowFor(l) {
    return new google.maps.InfoWindow({
      content: this.formatOneLocation(l)
    });
  }

  createGoogleMarkerFor(l, placeCoordinates) {
    return new google.maps.Marker({
      position: placeCoordinates,
      map: this.map,
      title: l.name,
      visible: true,
      icon: l.icon
    });
  }

  displayOnMapFor(locations) {
    this.clearOverlays();

    $.each(locations, (i, l) => {
      let placeCoordinates = {
        lat: Number(l.latitude),
        lng: Number(l.longitude)
      };
      let marker = this.createGoogleMarkerFor(l, placeCoordinates);
      let infowindow = this.createGoogleInfoWindowFor(l);
      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });
      google.maps.event.addListener(this.map, "click", () => {
        infowindow.close();
      });
      google.maps.event.addListener(infowindow, 'domready', () => {
        $(".tabs").tabs();
      });
      this.displayedMarkersList.push(marker);
    });
  }

  initMapSearchBox() {
    // Create the search box and link it to the UI element.
    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      let places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      let bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        console.log(place.geometry.viewport);
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
      this.map.setZoom(14);
      this.customBounds = bounds;

      this.createNewIndexForCustomBounds();
    });
  }

  customBoundsDoesContain(l) {
    let markerLatLng = new google.maps.LatLng({
      lat: Number(l.latitude),
      lng: Number(l.longitude)
    });

    return this.customBounds.contains(markerLatLng);
  }

  createNewIndexForCustomBounds() {
    $.each(this.data, (i, location) => {
      if (this.customBoundsDoesContain(location)) {
        this.customData.push(location);
      }
    })
    this.queriableIndex = this.createSearchIndex(this.customData);
  }

  resetMap() {
    this.clearOverlays();
    this.map.setZoom(11);
    this.customData.length = 0;
    this.customBounds = null;
    this.queriableIndex = this.index;
    this.repeatedSearchIsAllowed = true;
    $('#pac-input').val("");
  }


  // Search Functions

  initSearch(d) {
    this.data = JSON.parse(atob(d));
    this.index = this.createSearchIndex(this.data);
    this.queriableIndex = this.index;
    this.setupSearch();
  }

  createSearchIndex(data) {
    let tempIndex = new FlexSearch({
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
    tempIndex.add(data);
    return tempIndex;
  }

  shouldDoNewSearch(query) {
    if (!this.paginationQuery) {
      return true;
    }
    if (!query) {
      return false;
    }
    let queryIsEqual = this.paginationQuery.query === query.query;
    let fieldIsEqual = this.paginationQuery.field.sort().join('') === query.field.sort().join('');;
    return !queryIsEqual || this.repeatedSearchIsAllowed || !fieldIsEqual;
  }

  buildSearchQuery() {
    let nameSearchTerm = $("#organization-name-search").val().trim();
    let serviceSearchTerm = $("#autocomplete-input").val().trim();
    let populationSearchText = $("#population-select").val().trim();
    let activitiesSearchText = $("#activities-select").val().trim();

    let searchTerms = "";
    let fields = []
    if (nameSearchTerm != "") {
      searchTerms += nameSearchTerm;
      fields.push("name")
      fields.push("description")
    };

    if (populationSearchText != "") {
      serviceSearchTerm += " " + populationSearchText;
    }
    if (activitiesSearchText != "") {
      serviceSearchTerm += " " + activitiesSearchText;
    }
    if (serviceSearchTerm != "") {
      searchTerms += " " + serviceSearchTerm;
      fields.push("services")
    }

    if (searchTerms.trim() != "") {
      return {
        query: searchTerms.trim(),
        bool: "or",
        field: fields,
        limit: DEFAULT_SEARCH_LIMIT,
        page: true
      };
    } else {
      this.clearOverlays();
      return null;
    }
  }

  resetPagination() {
    this.paginationIndex = 0;
    this.paginationQuery = null;
    this.paginationMore = true;
    $("#pagination-back").addClass("disabled");
  }

  paginationOffset() {
    if (this.paginationIndex == 0) {
      return true;
    }
    let offset = this.paginationIndex * DEFAULT_SEARCH_LIMIT;
    return offset.toString();
  }

  // Search Functions
  async searchCallback(locations) {
    let formatedLocations = this.htmlFormatFor(locations);
    $("#locations-listing-view").html(formatedLocations);
    $(".tabs").tabs();
  }

  doSearchWithPagination() {
    let query = this.paginationQuery;
    this.repeatedSearchIsAllowed = false;
    if (!query) {
      return;
    }

    query.page = this.paginationOffset();
    query.limit = DEFAULT_SEARCH_LIMIT;

    let result = this.queriableIndex.search(query.query, query);
    let locations = result.result;
    let totalResults = locations.length;
    if (totalResults <= 0) {
      return;
    }
    if (!result.next) {
      this.paginationMore = false;
      $("#pagination-forward").addClass("disabled");
    } else {
      $("#pagination-forward").removeClass("disabled");
    }
    this.searchCallback(locations);
    this.displayOnMapFor(locations);
    this.updateResultsWindow(totalResults);
  }

  doSearch() {
    let query = this.buildSearchQuery();
    if (this.shouldDoNewSearch(query)) {
      this.resetPagination();
      this.paginationQuery = query;
      this.doSearchWithPagination();
    }
  }

  // Setup search event handlers
  searchAsYouType(field) {
    let typingTimer;
    let doneTypingInterval = SEARCH_AS_YOU_TYPE_TIMEOUT;

    //on keypress for enter do search
    field.keypress((e) => {
      if (e.which == 13) {
        clearTimeout(typingTimer);
        this.doSearch();
      }
    });

    //on keyup, start the countdown
    field.keyup(() => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(this.doSearch, doneTypingInterval);
    });

    //on keydown, clear the countdown 
    field.keydown(() => {
      clearTimeout(typingTimer);
    });
  }

  searchOnClick(field) {
    field.click(() => {
      this.doSearch();
    });
  }

  paginateOnClick() {
    $("#pagination-back").click(() => {
      if (this.paginationIndex > 0 && this.paginationQuery) {
        this.paginationIndex -= 1;
        this.paginationMore = true;
        this.doSearchWithPagination();
        if (this.paginationIndex == 0) {
          $("#pagination-back").addClass("disabled");
        }
        if ($("#pagination-forward").hasClass("disabled")) {
          $("#pagination-forward").removeClass("disabled");
        }
      }
    });
    $("#pagination-forward").click(() => {
      if (this.paginationMore && this.paginationQuery) {
        this.paginationIndex += 1;
        this.doSearchWithPagination();
        if ($("#pagination-back").hasClass("disabled")) {
          $("#pagination-back").removeClass("disabled");
        }
      }
    });
  }

  setupSearch() {
    this.searchAsYouType($("#organization-name-search"));
    this.searchAsYouType($("#autocomplete-input"));

    this.searchOnClick($("#search-button"));
    this.searchOnClick($("#services-autocomplete-parent").children());
    this.searchOnClick($("#population-list").find("li"));
    this.searchOnClick($("#activities-list").find("li"));
    this.paginateOnClick();
  };

  // HTML Formatters

  randomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  htmlFormatForResultsWindow(totalResults, paginationMore) {
    let moreMessage;
    if ( paginationMore ) {
        moreMessage = 'Click to see more results.'
    } else {
        moreMessage = 'There are no more results.'
    }
    return [
        '<p>Displayed Results: ' + totalResults + '<br>',
        moreMessage,
        '</p>'
    ].join("");
  }
  
  formatOneLocation(l) {
    // if using this solution, need to add: `$(".tabs").tabs();` after template rendered
    let hash = l.id + '-' + this.randomString(8)
  
    return [
        '<h5>' + l.name + '</h5>',
        '<div class="card">',
        '<div class="row card-content">',
        '<div class="col s12 m12 l12 xl12">',
        '<p><i class="material-icons location-icon">place</i>',
        '<span class="location-info">' + l.address + '</span></p>',
        '</div>',
        '<div class="col s12 m12 l12 xl12">',
        '<p><i class="material-icons location-icon">phone</i>',
        '<span class="location-info">' + l.phone + '</span></p>',
        '</div>',
        '<div class="col s12 m12 l12 xl12">',
        '<p><i class="material-icons location-icon">language</i>',
        '<span class="location-info">',
        '<a href="' + l.website + '" target="blank">' + l.website + '</a>',
        '</span></p>',
        '</div>',
        '<div class="col s12 m12 l12 xl12">',
        '<p><i class="material-icons location-icon">my_location</i>',
        '<span class="location-info">',
        '<a href=' + "'http://maps.google.com/?q=" + l.address + "' target='_blank'>Google Maps Directions</a><br>",
        '</span></p>',
        '</div>',
        '</div>',
        '<div class="card-tabs">',
        '<ul class="tabs tabs-fixed-width">',
        '<li class="tab"><a href="#services-' + hash +  '" class="active">',
        '<i class="material-icons location-icon">info_outline</i>Services</a></li>',
        '<li class="tab"><a href="#description-' + hash + '">',
        '<i class="material-icons location-icon">help</i>Description</a></li>',
        '</ul>',
        '</div>',
        '<div class="card-content grey lighten-4">',
        '<div id="services-' + hash + '">' + l.services + '</div>',
        '<div id="description-' + hash + '">',
        l.description == "" ? "None Provided" : l.description,
        '</div>',
        '</div>',
        '</div>',
    ].join("");
  }
  

  updateResultsWindow(totalResults) {
    let formatted = this.htmlFormatForResultsWindow(totalResults, this.paginationMore);
    $('#results-window').html(formatted);
  }

  htmlFormatFor(locations) {
    let formatedLocations = locations.map((l) => {
      return [
        '<div class="col s12 m6 l6 xl6">',
        this.formatOneLocation(l),
        '</div>'
      ].join("")
    });
    return formatedLocations.join("")
  }
}
