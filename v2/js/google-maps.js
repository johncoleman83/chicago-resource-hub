var map;
var markersArray = [];

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
    markersArray[i] = null;
  }
  markersArray.length = 0;
}

function displayOnMapFor(locations) {
   clearOverlays();
   $.each(locations, function(i, l) {
      let marker = createGoogleMarkerFor(l);
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
      markersArray.push(marker);
    });
}

let createGoogleInfoWindowFor = function (l) {
  return new google.maps.InfoWindow({
    content: formatOneLocation(l)
  });
}

let createGoogleMarkerFor = function (l) {
  return new google.maps.Marker({
    position: { lat: Number(l.latitude), lng: Number(l.longitude) },
    map: map,
    title: l.name,
    visible: true,
    icon: l.icon
  });
}

let setupSearchReset = function () {
  let $searchReset = $( "#search-reset" );
  $searchReset.click(function() {
      clearOverlays();
  });
}

let loadMap = function () {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: DEFAULT_ZOOM,
    center: CHICAGO
  });
}


function initMap() {
  loadMap();
  setupSearchReset();
}
