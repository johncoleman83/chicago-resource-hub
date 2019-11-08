var map;

function displayOnMapFor(locations) {  
  /*
    var contentString2 = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        '<div id="bodyContent">'+
        '<p><b>kantju</b>, also referred to as <b>Ayers Rock</b>, is a large </p>' +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
        '</div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString2
    });
  */
  for ( let i in locations ) {
    let l = locations[i];
    new google.maps.Marker({
      position: { lat: Number(l.latitude), lng: Number(l.longitude) },
      map: map,
      title: l.name,
      visible: true
    });
  }

  /*
    marker2.addListener('click', function() {
      infowindow.open(map2, marker2);
    });
  */
}


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: DEFAULT_ZOOM,
    center: CHICAGO
  });
  new google.maps.Marker({
    position: CHICAGO,
    map: map,
    title: 'Hello World!'
  });
}

$(document).ready(function() {
  $( "#cross" ).click(function() {
    showAnother();
    });
});
