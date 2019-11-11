# Chicago Resource Hub Child Theme and Map Template

## Front-end

https://www.chicagoresourcehub.com/

## Development

* **WordPress**

This child theme can be plugged into **WordPress**: https://wordpress.org/ However,
all that is needed are some of the JS, CSS & HTML files.  The PHP is just some
of the design stuff.

* **Materialize**

The ui uses materialize theme based on material design: https://materializecss.com/

* V1

**Google Fusion**

This tool interacts with Google Fusion Tables Database using the Google Rest API: https://developers.google.com/fusiontables/

* V2

* Start server and rip
```
$ cd v2 && ../server-cors.py
```

* encode locations js file
```
// convert json data to javascript object
let r = $.getJSON("http://localhost:8000/data/locations.json", function(json) {
  return json;
});

// convert data right back to string
// r.responseText;
let stringData = JSON.stringify(r.responseJSON);

// convert string to base65 encoding
let encodedData = btoa(stringData)

// convert back
let decodedData = JSON.parse(atob(encodedData))
```

## Author

David John Coleman II, [davidjohncoleman.com](https://www.davidjohncoleman.com/)

## License

Public Domain, no copyright protection
