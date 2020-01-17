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
      queryObject: null,
      more: false,
      canRepeat: false
    }

    // Maps Setup
    this.maps = {
      google: options.google || null,
      map: null,
      displayedMarkersList: [],
      customBounds: null
    }
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
    this.maps.map = new this.maps.google.Map(document.getElementById('map'), {
      zoom: DEFAULT_ZOOM,
      center: CHICAGO,
      mapTypeId: 'roadmap'
    });
    $("#search-reset").click(() => {
      this.resetAllTheThings();
    });
    this.initMapSearchBox();
  }

  clearOverlays() {
    for (var i = 0; i < this.maps.displayedMarkersList.length; i++) {
      this.maps.displayedMarkersList[i].setMap(null);
      this.maps.displayedMarkersList[i] = null;
    }
    this.maps.displayedMarkersList.length = 0;
  }

  createGoogleInfoWindowFor(l) {
    return new this.maps.google.InfoWindow({
      content: this.formatOneLocation(l)
    });
  }

  createGoogleMarkerFor(l, placeCoordinates) {
    return new this.maps.google.Marker({
      position: placeCoordinates,
      map: this.maps.map,
      title: l.name,
      visible: true,
      icon: MAP_MARKERS[l.icon]
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
        infowindow.open(this.maps.map, marker);
      });
      this.maps.google.event.addListener(this.maps.map, "click", () => {
        infowindow.close();
      });
      this.maps.google.event.addListener(infowindow, 'domready', () => {
        $(".tabs").tabs();
      });
      this.maps.displayedMarkersList.push(marker);
    });
  }

  initMapSearchBox() {
    // Create the search box and link it to the UI element.
    let input = document.getElementById('pac-input');
    let searchBox = new this.maps.google.places.SearchBox(input);
    // map.controls[this.maps.google.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    this.maps.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.maps.map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      let places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      let bounds = new this.maps.google.LatLngBounds();

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
      this.maps.map.fitBounds(bounds);
      this.maps.map.setZoom(14);
      this.maps.customBounds = bounds;

      this.createNewIndexForCustomBounds();
    });
  }

  customBoundsDoesContain(l) {
    let markerLatLng = new this.maps.google.LatLng({
      lat: Number(l.latitude),
      lng: Number(l.longitude)
    });

    return this.maps.customBounds.contains(markerLatLng);
  }

  createNewIndexForCustomBounds() {
    $.each(this.search.data, (i, location) => {
      if (this.customBoundsDoesContain(location)) {
        this.search.customData.push(location);
      }
    })
    this.search.queriableIndex = this.createSearchIndex(this.search.customData);
  }

  resetAllTheThings() {
    // clear map
    this.clearOverlays();
    this.maps.map.setZoom(11);
    this.maps.customBounds = null;

    // clear search results
    this.search.customData.length = 0;
    this.updateResultsWindow(0);
    this.search.queriableIndex = this.search.index;
    $("#locations-listing-view").html("");

    // clear input boxes
    $('#autocomplete-input').val("")
    $('.mdc-select__selected-text').html("")
    $("#organization-name-search").val("")

    // clear location bounds input
    $('#pac-input').val("");

    // clear stored filters
    this.search.populationFilter = null;
    this.search.activityFilter = null;

    // reset pagination
    this.pagination.canRepeat = true;
    this.pagination.index = 0;
    this.pagination.queryObject = null;
    this.pagination.more = false;
    $("#pagination-forward").addClass("disabled");
    $("#pagination-back").addClass("disabled");
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

  createSearchIndex(data = null) {
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
    tempIndex.add(data || this.search.data);
    return tempIndex;
  }

  queryDidChange(query) {
    return this.pagination.queryObject.query !== query.query || this.pagination.queryObject.field.sort().join('') !== query.field.sort().join('');
  }

  shouldDoNewSearch(query) {
    if (!this.pagination.queryObject) {
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

  resetPaginationForSearch() {
    this.pagination.index = 0;
    this.pagination.queryObject = null;
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
    let formatedLocations = this.htmlFormatForAllLocations(locations);
    let locationsId = "#locations-listing-view";
    $(locationsId).html(formatedLocations);

    // setTimeout(function(){ $(".tabs").tabs() }, 1500);
    // using setTimeout or below setInterval has problems and should be changed
    // this is to ensure that html has fully loaded before adding listening events
    // should really add something like this
    let count = 0;
    let verifyLocationsHaveLoaded = setInterval(function() {
      if (count >= 30) {
        clearInterval(verifyLocationsHaveLoaded);
      }
      count += 1;
      if ($(locationsId).children().length == locations.length) {
        $(".tabs").tabs()
        clearInterval(verifyLocationsHaveLoaded);
      }
    }, 300); // check every 300ms
  }

  doSearchWithPagination() {
    let queryObject = this.pagination.queryObject;
    this.pagination.canRepeat = false;

    if (!queryObject) {
      return;
    }

    queryObject.page = this.paginationOffset();
    queryObject.limit = DEFAULT_SEARCH_LIMIT;

    let result = this.search.queriableIndex.search(queryObject.query, queryObject);
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

  doSearch(queryObject) {
    if (this.shouldDoNewSearch(queryObject)) {
      this.resetPaginationForSearch();
      this.pagination.queryObject = queryObject;
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
      if (this.pagination.index > 0 && this.pagination.queryObject) {
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
      if (this.pagination.more && this.pagination.queryObject) {
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

  htmlForIcon(iconType) {
    return '<i class="material-icons location-icon">' + iconType + '</i>';
  }

  htmlForIconAndInfo(icon, info) {
    if (info == null) {
      return "";
    }
    return [
      '<div class="col s12 m12 l12 xl12">',
      '<p>' + this.htmlForIcon(icon),
      '<span class="location-info">' + info + '</span></p>',
      '</div>'
    ].join("")
  }

  htmlForWebsite(l) {
    let urlLink;
    if (typeof(l.website) !== 'string' || l.website.length < 11) {
      name = l.name.split(' ').join('+') + '+Chicago+IL';
      urlLink = '<a href="' + GOOGLE_SEARCH_URL_PREFIX + name + '" target="_blank">Search Google For ' + l.name + '</a>';
    } else {
      urlLink = '<a href="' + l.website + '" target="_blank">' + l.website + '</a>';
    }
    return this.htmlForIconAndInfo('language', urlLink)
  }

  googleMapsLink(address) {
    if (address == "") {
      return null;
    }
    return '<a href=' + '"http://maps.google.com/?q=' + address + '" target="_blank">Google Maps Directions</a><br>';
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
      this.htmlForIconAndInfo('place', l.address),
      this.htmlForIconAndInfo('phone', l.phone),
      this.htmlForWebsite(l),
      this.htmlForIconAndInfo('my_location', this.googleMapsLink(l.address)),
      '</div>',
      '<div class="card-tabs">',
      '<ul class="tabs tabs-fixed-width">',
      '<li class="tab"><a href="#services-' + hash + '" class="active">',
      this.htmlForIcon('info_outline') + 'Services</a></li>',
      '<li class="tab"><a href="#description-' + hash + '">',
      this.htmlForIcon('help') + 'Description</a></li>',
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

  htmlFormatForAllLocations(locations) {
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
