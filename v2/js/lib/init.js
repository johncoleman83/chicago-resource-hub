initApp = function($, google, FlexSearch, materialDesign, materialize) {
  // setup the input forms
  $('#population-select').formSelect();
  // enable autocomplete
  $('.autocomplete').autocomplete({
    data: AUTOCOMPLETE_DATA,
    minLength: 0
  });

  var mapInterface = new MapsLibV2({
    google: google,
    searchService: FlexSearch,
    design: materialDesign
  });

  mapInterface.initMap();

  MapsLibV2.getData().then(function(d) {
    mapInterface.initSearch(d);
  });
}
