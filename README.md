# Chicago Resource Hub Child Theme and Map Template

## Front-end

https://www.chicagoresourcehub.com/

## Dependencies

* **JQuery**

This is a vanilla JS application, using JQuery: https://api.jquery.com/

* **requireJS**

Packages are managed with `require.js`: https://requirejs.org/

* **WordPress**

This child theme can be plugged into **WordPress**: https://wordpress.org/ However,
all that is needed are some of the JS, CSS & HTML files.  The PHP is just some
of the design stuff.

* **Material Design**
  * The ui uses materialize theme based on material design: https://materializecss.com/
  * Also google's material.io design for web: https://github.com/material-components/material-components-web/

* **FlexSearch**

The Data Store of locations is queried using FlexSearch: https://github.com/nextapps-de/flexsearch

* **Google Maps API (with Places configured)**

* You need to have a Google Cloud Platform Account along with a Project that has a Google Maps API Key

If you don't already have an account, then you will need to start a Google Cloud Platform Account:
  * https://cloud.google.com/maps-platform/places/

**$200 free monthly usage**
> For most of our users, the $200 monthly credit is enough to support their needs.
> You can also set daily quotas to protect against unexpected increases.

Instructions on actually aquiring your API key are here:
  * https://developers.google.com/places/web-service/get-api-key

## About

### V1

(Now Deprecated) This tool interacted with **Google Fusion** Tables Database using the Google Rest API: https://developers.google.com/fusiontables/

### V2

Current Version of Map Search Tool and Google Maps API.
This uses an  in-memory data store, FlexSearch Search API, & Google Maps API 

## Usage

* The DataStore location URL should use Local data if you are running locally to develop.
This is important to avoid cross-origin browser errors.

from `js/lib/constants.js`:
```
const DATA_URL = LOCAL_DATA;
```

* If you need the map to function ensure you've inserted a correct Google Maps API Key.
You also need to set the authorizations for your Google API Key in the Google Cloud Command
Console.  There you will find a setting to restrict the use of the API key.  In order to
test locally, you'll need to set restrictions to **None**.
  * Visit: `https://console.cloud.google.com/apis/credentials?authuser=1&project=<YOUR_PROJECT_NAME>`
  * Click on **"Credentials"** in the Google Cloud Platform Project Settings
  * Click on **"Application restrictions"**
  * Set your restrictions according to your needs

* The application should have your API KEY configured.

This app uses `require.js`, so in `js/app.js` change the API Key
```
paths: {
  shared: 'shared',
  jquery: 'jquery-3.4.1',
  google: '//maps.googleapis.com/maps/api/js?key=<HIDDEN>&region=US&libraries=places'
},
```

* Start server and begin!
```
$ cd v2 && ../server-cors.py
```

* encode locations js file

This is a little bit of security by obscurity.  It does nothing to protect the data
but simply creates a little bit more challenge for bots trying to scrape
contact information.  We don't want bots getting all the list of phone numbers
to start spamming these locations.

```
// start server
$ cd v2 && ../server-cors.py

// convert json data to javascript object
let r = $.getJSON("http://localhost:8000/data/locations.json", function(json) {
  return json;
});

// convert data right back to string
// r.responseText;
let stringData = JSON.stringify(r.responseJSON);

// convert string to base65 encoding
let encodedData = btoa(unescape(encodeURIComponent(stringData)))

// convert back
let decodedData = JSON.parse(decodeURIComponent(escape(atob(encodedData))))
```

## Author

David John Coleman II, [davidjohncoleman.com](https://www.davidjohncoleman.com/)

## License

MIT License
