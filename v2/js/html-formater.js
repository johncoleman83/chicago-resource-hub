let randomString = function (length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
      '<div class="col s12 m4 l4 xl4">',
      '<p><i class="material-icons location-icon">phone</i>',
      '<span class="location-info">' + l.phone + '</span></p>',
      '</div>',
      '<div class="col s12 m8 l8 xl8">',
      '<p><i class="material-icons location-icon">http</i>',
      '<span class="location-info">',
      '<a href="' + l.website + '" target="blank">' + l.website + '</a>',
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
  ].join("")
}

/*
  // $('.collapsible').collapsible();
  return [
      '<h5>' + l.name + '</h5>',
      '<ul class="collapsible">',
      '<li class="active">',
      '<div class="collapsible-header"><i class="material-icons">place</i>Location</div>',
      '<div class="collapsible-body">',
      '<p><span class="location-info">' + l.address + '</span></p>',
      '<div class="row">',
      '<div class="col s12 m6 l6 xl6">',
      '<p><i class="material-icons location-icon">phone</i><span class="location-info">' + l.phone + '</span></p>',
      '</div>',
      '<div class="col s12 m6 l6 xl6">',
      '<p><i class="material-icons location-icon">http</i>',
      '<span><a href="' + l.website + '" target="blank">' + l.website + '</a></span></p>',
      '</div>',
      '</div>',
      '</div>',
      '</li>',
      '<li>',
      '<div class="collapsible-header"><i class="material-icons">info_outline</i>Services</div>',
      '<div class="collapsible-body"><span>' + l.services + '</span></div>',
      '</li>',
      '<li>',
      '<div class="collapsible-header"><i class="material-icons">help</i>Description</div>',
      '<div class="collapsible-body"><span>',
      l.description == '' ? 'None Provided' : l.description,
      '</span></div>',
      '</li>',
      '</ul>'
  ].join("")
*/
