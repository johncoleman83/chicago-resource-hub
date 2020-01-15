requirejs.config({
  //By default load any module IDs from js/lib
  baseUrl: 'wp-content/themes/fortunato-child/js/lib',
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  paths: {
    shared: 'shared',
    jquery: 'jquery-3.4.1',
    google: '//maps.googleapis.com/maps/api/js?key=<HIDDEN>&region=US&libraries=places'
  },
  shim: {
    google: {
      exports: 'google.maps',
    },
    shared: {
      deps: 'jquery'
    }
  }
});

// Start the main app logic.
requirejs([
  'init',
  'constants',
  'mapslib',
  'google',
  'jquery',
  'shared/flexsearch',
  'shared/material-components-web',
  'shared/materialize'
],
function (
  init,
  constants,
  mapsLib,
  google,
  $,
  FlexSearch,
  materialDesign,
  materialize
) {
  // all loaded and can be used here now.
  $(document).ready(function() {
    initApp($, google, FlexSearch, materialDesign, materialize);
  });
});
