# Chicago Resource Hub Child Theme and Map Template

## Front-end

https://www.chicagoresourcehub.com/

## Dependencies

* **WordPress**

This child theme can be plugged into **WordPress**: https://wordpress.org/ However,
all that is needed are some of the JS, CSS & HTML files.  The PHP is just some
of the design stuff.

* **Material Design**
  * The ui uses materialize theme based on material design: https://materializecss.com/
  * Also google's material.io design for web: https://github.com/material-components/material-components-web/

* **FlexSearch**

The Data Store of locations is queried using FlexSearch: https://github.com/nextapps-de/flexsearch

## About

### V1

(Now Deprecated) This tool interacted with **Google Fusion** Tables Database using the Google Rest API: https://developers.google.com/fusiontables/

### V2

Current Version of Map Search Tool and Google Maps API.
This uses an  in-memory data store, FlexSearch Search API, & Google Maps API 

## Usage

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

Public Domain, no copyright protection
