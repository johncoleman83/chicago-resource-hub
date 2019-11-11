var map;

function displayOnMapFor(locations) {
  clearOverlays();
  $.each(locations, function(i, l) {
       let marker = createGoogleMarkerFor(l);
       let infowindow = createGoogleInfoWindowFor(l);
       marker.addListener('click', function() {
           infowindow.open(map, marker);
       });
       google.maps.event.addListener(infowindow, 'domready', function() {
           $(".tabs").tabs();
           //$('.collapsible').collapsible(); 
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
      visible: true
    });
}


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: DEFAULT_ZOOM,
    center: CHICAGO
  });
}
