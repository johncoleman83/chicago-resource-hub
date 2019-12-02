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
    $("#search-reset").click(function() {
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
      content: formatOneLocation(l)
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

    $.each(locations, function(i, l) {
      let placeCoordinates = {
        lat: Number(l.latitude),
        lng: Number(l.longitude)
      };
      let marker = this.createGoogleMarkerFor(l, placeCoordinates);
      let infowindow = this.createGoogleInfoWindowFor(l);
      marker.addListener('click', function() {
        infowindow.open(this.map, marker);
      });
      google.maps.event.addListener(this.map, "click", function() {
        infowindow.close();
      });
      google.maps.event.addListener(infowindow, 'domready', function() {
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
    this.map.addListener('bounds_changed', function() {
      searchBox.setBounds(this.map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      let places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      let bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
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

  customBoundsDoesContain(location) {
    let markerLatLng = new google.maps.LatLng({
      lat: location.latitude,
      lng: location.longitude
    });

    return this.customBounds.contains(markerLatLng);
  }

  createNewIndexForCustomBounds() {
    $.each(this.data, function(i, location) {
      if (this.customBoundsDoesContain(location)) {
        this.customData.push(location);
      }
    })
    this.queriableIndex = createSearchIndex(this.customData);
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
    tempIndex.add(this.data);
    return tempIndex;
  }

  shouldDoNewSearch(query) {
    if (!this.paginationQuery) {
      return true;
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


  setupSearch() {
    let searchCallback = async (locations) => {
      let formatedLocations = this.htmlFormatFor(locations);
      $("#locations-listing-view").html(formatedLocations);
      $(".tabs").tabs();
    }

    let doSearchWithPagination = function() {
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
      searchCallback(locations);
      this.displayOnMapFor(locations);
      this.updateResultsWindow(totalResults);
    }

    let doSearch = function() {
      let query = this.buildSearchQuery();
      if (this.shouldDoNewSearch(query)) {
        this.resetPagination();
        this.paginationQuery = query;
        doSearchWithPagination();
      }
    }

    let searchAsYouType = function(field) {
      let typingTimer;
      let doneTypingInterval = SEARCH_AS_YOU_TYPE_TIMEOUT;

      //on keypress for enter do search
      field.keypress(function(e) {
        if (e.which == 13) {
          clearTimeout(typingTimer);
          doSearch();
        }
      });

      //on keyup, start the countdown
      field.keyup(function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doSearch, doneTypingInterval);
      });

      //on keydown, clear the countdown 
      field.keydown(function() {
        clearTimeout(typingTimer);
      });
    }

    let searchOnClick = function(field) {
      field.click(function() {
        doSearch();
      });
    }

    let paginateOnClick = function() {
      $("#pagination-back").click(function() {
        if (this.paginationIndex > 0 && this.paginationQuery) {
          this.paginationIndex -= 1;
          this.paginationMore = true;
          doSearchWithPagination();
          if (this.paginationIndex == 0) {
            $("#pagination-back").addClass("disabled");
          }
          if ($("#pagination-forward").hasClass("disabled")) {
            $("#pagination-forward").removeClass("disabled");
          }
        }
      });
      $("#pagination-forward").click(function() {
        if (this.paginationMore && this.paginationQuery) {
          this.paginationIndex += 1;
          doSearchWithPagination();
          if ($("#pagination-back").hasClass("disabled")) {
            $("#pagination-back").removeClass("disabled");
          }
        }
      });
    }

    searchAsYouType($("#organization-name-search"));
    searchAsYouType($("#autocomplete-input"));

    searchOnClick($("#search-button"));
    searchOnClick($("#services-autocomplete-parent").children());
    searchOnClick($("#population-list").find("li"));
    searchOnClick($("#activities-list").find("li"));
    paginateOnClick();
  };

  updateResultsWindow(totalResults) {
    let formatted = htmlFormatForResultsWindow(totalResults, this.paginationMore);
    $('#results-window').html(formatted);
  }

  htmlFormatFor(locations) {
    let formatedLocations = locations.map(function(l) {
      return [
        '<div class="col s12 m6 l6 xl6">',
        formatOneLocation(l),
        '</div>'
      ].join("")
    });
    return formatedLocations.join("")
  }
}
