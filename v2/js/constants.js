/*****************
// convert json data to javascript object
data = $.getJSON("https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/data/locations.json", function(json) {
  console.log(json);
});

// convert data right back to string
stringData = JSON.stringify(data)

// convert string to base65 encoding
btoa(stringData)
********************/

const SEARCH_AS_YOU_TYPE_TIMEOUT = 2000;

const LOCAL_DATA = "http://localhost:8000/data/locations.txt";
const PROD_DATA = "https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/data/locations.txt";
const DATA_URL = LOCAL_DATA;
