/*****************
// convert json data to javascript object
data = $.getJSON("https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/data/locations.json", function(json) {
  console.log(json); // this will show the info it in firebug console
});

// convert data right back to string
stringData = JSON.stringify(data)

// convert string to base65 encoding
btoa(stringData)
********************/

var data;
const LOCAL_DATA = "http://localhost:8000/data/locations.txt";
const PROD_DATA = "https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/data/locations.txt";
const DATA_URL = LOCAL_DATA;

// fetch locations.txt via ajax & convert encoded string to json object
$.ajax(
  {
    url: DATA_URL,
    async: true,
    success: function(stringResponse){
      data = JSON.parse(atob(stringResponse)).responseJSON;
    }
  }
);
