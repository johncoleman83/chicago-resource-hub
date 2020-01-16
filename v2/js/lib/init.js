initApp = function($, google, FlexSearch, materialDesign, materialize) {
  // enable autocomplete
  $('.autocomplete').autocomplete({
    data: AUTOCOMPLETE_DATA,
    minLength: 0
  });
  
  // instantiate app
  var mapInterface = new MapsLibV2({
    google: google,
    searchService: FlexSearch,
    design: materialDesign
  });

  // load the interactive map from google maps API
  mapInterface.initMap();

  // load data to browser and setup the search engine
  MapsLibV2.getData().then(function(d) {
    mapInterface.initSearch(d);
  });
}
