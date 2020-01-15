class MapsLibV2 {
  constructor(options) {
    // Search Setup
    this.search = {
      service: options.searchService,
      data: null,
      index: null,
      queriableIndex: null,
      customData: [],
      populationFilter: null,
      activityFilter: null
    }

    // Pagination Setup
    this.pagination = {
      index: 0,
      query: null,
      more: false,
      canRepeat: false
    }

    // Maps Setup
    this.google = options.google || null;
    this.map = null;
    this.displayedMarkersList = [];
    this.customBounds = null;

    // UX setup
    this.design = options.design || null;
  }

  // called to get datastore for client side
  static getData() {
    // fetch locations.txt via ajax & convert encoded string to json object
    return $.ajax({
      url: DATA_URL,
      async: true
    });
  };

  /**
   * 
   * Google Maps API
   * 
   */

  initMap() {
    this.map = new this.google.Map(document.getElementById('map'), {
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
    return new this.google.InfoWindow({
      content: this.formatOneLocation(l)
    });
  }

  createGoogleMarkerFor(l, placeCoordinates) {
    return new this.google.Marker({
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
      this.google.event.addListener(this.map, "click", () => {
        infowindow.close();
      });
      this.google.event.addListener(infowindow, 'domready', () => {
        $(".tabs").tabs();
      });
      this.displayedMarkersList.push(marker);
    });
  }

  initMapSearchBox() {
    // Create the search box and link it to the UI element.
    let input = document.getElementById('pac-input');
    let searchBox = new this.google.places.SearchBox(input);
    // map.controls[this.google.ControlPosition.TOP_LEFT].push(input);

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
      let bounds = new this.google.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
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
    let markerLatLng = new this.google.LatLng({
      lat: Number(l.latitude),
      lng: Number(l.longitude)
    });

    return this.customBounds.contains(markerLatLng);
  }

  createNewIndexForCustomBounds() {
    $.each(this.search.data, (i, location) => {
      if (this.customBoundsDoesContain(location)) {
        this.search.customData.push(location);
      }
    })
    this.search.queriableIndex = this.createSearchIndex(this.search.customData);
  }

  resetMap() {
    this.clearOverlays();
    this.map.setZoom(11);
    this.search.customData.length = 0;
    this.customBounds = null;
    this.search.queriableIndex = this.search.index;
    this.pagination.canRepeat = true;
    $('#pac-input').val("");
    this.pagination.index = 0;
    this.pagination.query = null;
    this.pagination.more = false;
    $("#pagination-forward").addClass("disabled");
    $("#pagination-back").addClass("disabled");
    this.updateResultsWindow(0);
  }

  /**
   * 
   * Search API
   * 
   */

  initSearch(d) {
    this.search.data = JSON.parse(decodeURIComponent(escape(atob(d))));
    this.search.index = this.createSearchIndex();
    this.search.queriableIndex = this.search.index;
    this.setupSearch();
  }

  fixMaterializeMobileBug(elementID) {
    $(window).on('load, resize', function mobileViewUpdate() {
      var viewportWidth = $(window).width();
      if (viewportWidth < 600) {
        $(elementID).addClass("browser-default");
      } else {
        $(elementID).removeClass("browser-default");
      }
    });
    $(window).trigger('resize');
  }

  createSearchIndex() {
    let tempIndex = new this.search.service({
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
    tempIndex.add(this.search.data);
    return tempIndex;
  }

  queryDidChange(query) {
    return this.pagination.query.query !== query.query || this.pagination.query.field.sort().join('') !== query.field.sort().join('');
  }

  shouldDoNewSearch(query) {
    if (!this.pagination.query) {
      return true;
    }
    if (!query) {
      return false;
    }

    return this.queryDidChange(query) || this.pagination.canRepeat;
  }

  buildSearchQuery() {
    let nameSearchTerm = $("#organization-name-search").val().trim();
    let serviceSearchTerm = $("#autocomplete-input").val().trim();

    let searchTerms = "";
    let fields = []
    if (nameSearchTerm != "") {
      searchTerms += nameSearchTerm;
      fields.push("name")
      fields.push("description")
    } else {
      if (this.search.populationFilter != null) {
        serviceSearchTerm += " " + this.search.populationFilter;
      }
      if (this.search.activityFilter != null) {
        serviceSearchTerm += " " + this.search.activityFilter;
      }
      if (serviceSearchTerm != "") {
        searchTerms += " " + serviceSearchTerm.trim();
        fields.push("services")
      }
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
    this.pagination.index = 0;
    this.pagination.query = null;
    this.pagination.more = true;
    $("#pagination-back").addClass("disabled");
  }

  paginationOffset() {
    if (this.pagination.index == 0) {
      return true;
    }
    let offset = this.pagination.index * DEFAULT_SEARCH_LIMIT;
    return offset.toString();
  }

  /**
   * 
   * Query FlexSearch Functions
   * 
   */

  displayOnPageFor(locations) {
    if (locations.length <= 0) {
      return;
    }
    let formatedLocations = this.htmlFormatFor(locations);
    let locationsId = "#locations-listing-view";
    $(locationsId).html(formatedLocations);

    // setTimeout(function(){ $(".tabs").tabs() }, 1500);
    // using setTimeout or below setInterval has problems and should be changed
    // this is to ensure that html has fully loaded before adding listening events
    // should really add something like this
    let verifyLocationsHaveLoaded = setInterval(function() {
      if ($(locationsId).children().length == locations.length) {
        $(".tabs").tabs()
        clearInterval(verifyLocationsHaveLoaded);
      }
    }, 300); // check every 300ms
  }

  doSearchWithPagination() {
    let query = this.pagination.query;
    this.pagination.canRepeat = false;

    if (!query) {
      return;
    }

    query.page = this.paginationOffset();
    query.limit = DEFAULT_SEARCH_LIMIT;

    let result = this.search.queriableIndex.search(query.query, query);
    let locations = result.result;
    let totalResults = locations.length;
    if (!result.next) {
      this.pagination.more = false;
      $("#pagination-forward").addClass("disabled");
    } else {
      $("#pagination-forward").removeClass("disabled");
    }
    this.displayOnPageFor(locations);
    this.displayOnMapFor(locations);
    this.updateResultsWindow(totalResults);
  }

  doSearch(query) {
    if (this.shouldDoNewSearch(query)) {
      this.resetPagination();
      this.pagination.query = query;
      this.doSearchWithPagination();
    }
  }

  /**
   * 
   * Search Event Handlers
   * 
   */

  searchAsYouType(field) {
    let typingTimer;
    let doneTypingInterval = SEARCH_AS_YOU_TYPE_TIMEOUT;

    //on keypress for enter do search
    field.keypress((e) => {
      if (e.which == 13) {
        clearTimeout(typingTimer);
        this.doSearch(this.buildSearchQuery());
      }
    });

    //on keyup, start the countdown
    field.keyup(() => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        this.doSearch(this.buildSearchQuery());
      }, doneTypingInterval);
    });

    //on keydown, clear the countdown 
    field.keydown(() => {
      clearTimeout(typingTimer);
    });
  }

  searchOnClick(field) {
    field.click(() => {
      this.doSearch(this.buildSearchQuery());
    });
  }

  filterOnClick(filterId) {
    let selectPopulation = new this.design.select.MDCSelect(document.querySelector("#population-filter"));
    let selectRecreation = new this.design.select.MDCSelect(document.querySelector("#activity-filter"));
    selectPopulation.listen('MDCSelect:change', () => {
      if (selectPopulation.value != "") {
        this.search.populationFilter = selectPopulation.value;
      } else {
        this.search.populationFilter = null;
      }
      this.doSearch(this.buildSearchQuery());
    });
    selectRecreation.listen('MDCSelect:change', () => {
      if (selectRecreation.value != "") {
        this.search.populationFilter = selectRecreation.value;
      } else {
        this.search.populationFilter = null;
      }
      this.doSearch(this.buildSearchQuery());
    });
  }

  paginateOnClick() {
    $("#pagination-back").click(() => {
      if (this.pagination.index > 0 && this.pagination.query) {
        this.pagination.index -= 1;
        this.pagination.more = true;
        this.doSearchWithPagination();
        if (this.pagination.index == 0) {
          $("#pagination-back").addClass("disabled");
        }
        if ($("#pagination-forward").hasClass("disabled")) {
          $("#pagination-forward").removeClass("disabled");
        }
      }
    });
    $("#pagination-forward").click(() => {
      if (this.pagination.more && this.pagination.query) {
        this.pagination.index += 1;
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

    this.filterOnClick();

    this.paginateOnClick();
    this.updateResultsWindow(0);
  };

  /**
   * 
   * HTML Formatters
   * 
   */

  randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  htmlFormatForResultsWindow(totalResults, more) {
    let moreMessage;
    if (more) {
      moreMessage = 'Click to see more results.'
    } else if (totalResults >= 1) {
      moreMessage = 'End of results.'
    } else {
      moreMessage = 'No results, modify search terms to see more.'
    }
    return [
      '<p>Displayed Results: <strong>' + totalResults + '</strong><br>',
      '<i>' + moreMessage + '</i>',
      '</p>'
    ].join("");
  }

  formatOneLocation(l) {
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
      '<li class="tab"><a href="#services-' + hash + '" class="active">',
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
    let formatted = this.htmlFormatForResultsWindow(totalResults, this.pagination.more);
    $('#results-window').html(formatted);
  }

  htmlFormatFor(locations) {
    let formatedLocations = locations.map((l) => {
      return [
        '<div class="one-location-listing col s12 m6 l6 xl6">',
        this.formatOneLocation(l),
        '</div>'
      ].join("");
    });
    return formatedLocations.join("")
  }
}
