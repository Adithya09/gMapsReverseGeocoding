//Defining map as a global variable
let map;

//Defining a global marker object
let marker;

function reverseGeocode(geocoder, map, infowindow){
  const input = document.getElementById("latlng").value;
 const latlngStr = input.split(",", 2);
 const latlng = {
   lat: parseFloat(latlngStr[0]),
   lng: parseFloat(latlngStr[1]),
 };
 geocoder
   .geocode({ location: latlng })
   .then((response) => {
     if (response.results[0]) {
       map.setZoom(11);
       const marker = new google.maps.Marker({
         position: latlng,
         map: map,
       });
       infowindow.setContent(response.results[0].formatted_address);
       infowindow.open(map, marker);
     } else {
       window.alert("No results found");
     }
   })
   .catch((e) => window.alert("Geocoder failed due to: " + e));
}

function initMap(){
  //Creating a new map with the center in London
   map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {lat: 51.507, lng: 0.127 }
  });
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();
  document.getElementById("submit").addEventListener("click", () => {
    reverseGeocode(geocoder, map, infowindow);
  });
}
