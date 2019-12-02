let randomString = function (length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let htmlFormatForResultsWindow = function (totalResults, paginationMore) {
  let moreMessage;
  if ( paginationMore ) {
      moreMessage = 'Click to see more results.'
  } else {
      moreMessage = 'There are no more results.'
  }
  return [
      '<p>Displayed Results: ' + totalResults + '<br>',
      moreMessage,
      '</p>'
  ].join("");
}

let formatOneLocation = function (l) {
  // if using this solution, need to add: `$(".tabs").tabs();` after template rendered
  let hash = l.id + '-' + randomString(8)

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
      '<li class="tab"><a href="#services-' + hash +  '" class="active">',
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
