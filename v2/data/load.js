// convert json data to javascript object
data = $.getJSON("https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/data/locations.txt", function(json) {
  console.log(json); // this will show the info it in firebug console
});

// convert data right back to string
stringData = JSON.stringify(data)

// convert string to base65 encoding
btoa(stringData)

// fetch locations.txt via ajax & convert encoded string to json object
$.ajax(
  {
    url: "https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/data/locations.txt",
    success: function(stringData){
      data = JSON.parse(atob(stringData));
    }
  }
);
