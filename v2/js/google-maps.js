var map;
var displayedMarkersList = [];
var customBounds = null;

let clearOverlays = function () {
    for (var i = 0; i < displayedMarkersList.length; i++ ) {
        displayedMarkersList[i].setMap(null);
        displayedMarkersList[i] = null;
    }
    displayedMarkersList.length = 0;
}

let displayOnMapFor = function (locations) {
    clearOverlays();

    $.each(locations, function(i, l) {
        let placeCoordinates =  { lat: Number(l.latitude), lng: Number(l.longitude) };
        let marker = createGoogleMarkerFor(l, placeCoordinates);
        let infowindow = createGoogleInfoWindowFor(l);
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
        google.maps.event.addListener(map, "click", function() {
            infowindow.close();
        });
        google.maps.event.addListener(infowindow, 'domready', function() {
            $(".tabs").tabs();
        });
        displayedMarkersList.push(marker);
    });
}

let createGoogleInfoWindowFor = function (l) {
    return new google.maps.InfoWindow({
      content: formatOneLocation(l)
    });
}

let createGoogleMarkerFor = function (l, placeCoordinates) {
    return new google.maps.Marker({
      position: placeCoordinates,
      map: map,
      title: l.name,
      visible: true,
      icon: l.icon
    });
}

let initSearchBox = function () {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
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
        map.fitBounds(bounds);
        map.setZoom(14);
        customBounds = bounds;

        createNewIndexForCustomBounds();
    });
}

let customBoundsDoesContain = function (location) {
    let markerLatLng = new google.maps.LatLng({lat: location.latitude, lng: location.longitude}); 

    return customBounds.contains(markerLatLng);
}

let createNewIndexForCustomBounds = function () {
    $.each(data, function(i, location) {
        if ( customBoundsDoesContain(location) ) {
            customData.push(location);
        }
    })
    queriableIndex = createSearchIndex(customData);
}

let resetMap = function () {
    clearOverlays();
    map.setZoom(11);
    customData.length = 0;
    customBounds = null;
    queriableIndex = index;
    repeatedSearchIsAllowed = true;
    $( '#pac-input' ).val("");
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: DEFAULT_ZOOM,
        center: CHICAGO,
        mapTypeId: 'roadmap'
    });
    let $searchReset = $( "#search-reset" );
    $searchReset.click(function() {
        resetMap();
    });
    initSearchBox();
}
