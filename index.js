//Defining map as a global variable
let map;

//Defining a global drawing manager Object
let drawingManager;

//Defining a global polygon ids variable
let id;

//Defining a global polygon array
let polArray = [];

/*
Function to make an id for each polygonOptions//Function to generate a random
code for each polygon
*/
function makeID(){
  var result = '';
  var characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 5; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
    charactersLength));
  }
  return result;
}

/*
Function to check if the given point lies within any of the polygons in the
array
*/
function checkPIP(){
  var isWithin = false;
  var length = polArray.length;
  const input = document.getElementById("latlng").value;
  const latlngStr = input.split(",", 2);
  var lat = parseFloat(latlngStr[0]);
  var lng = parseFloat(latlngStr[1])
  var coords = new google.maps.LatLng(lat, lng);
  for(i = 0; i < length; i++){
    if(google.maps.geometry.poly.containsLocation(coords, polArray[i])){
      alert("The point lies inside polygon: " + i);
      isWithin = true;
    }
  }
  return isWithin;
}

//Function to refresh the map
function refresh(){
  document.getElementById('msg').innerHTML = "";
  document.getElementById("marker1").value = "";
  document.getElementById("marker2").value = "";
  initMap();
}

function initMap(){
  //Creating a new map with the center in London
  var myLatlng = new google.maps.LatLng(51.507, 0.127);
  var mapOptions = {
    zoom: 8,
    center: myLatlng,
    mapTypeId: 'roadmap'
};
   map = new google.maps.Map(document.getElementById("map"), mapOptions);

  //Creating a drawing manager tool
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.POLYGON
      ],
    },
    markerOptions: {
      draggable: true,
      clickable: true,
    },
    polygonOptions: {
      draggable: true,
      editable: true,
      clickable: true,
    }
  });
  drawingManager.setMap(map);

  /*
  Generating a unique ID for a polygon upon creation and adding it to the
  polygon array
  */
  google.maps.event.addListener(drawingManager, "overlaycomplete", function(e){
    if(e.type == google.maps.drawing.OverlayType.POLYGON){
      var path =  e.overlay.getPath().getArray();
      polArray.push(e.overlay);
    }
  });

  /*
  Code to check if a given point lies in a polygon, triggered when the button
  is pressed
  */
  document.getElementById("submit").addEventListener("click", (click) => {
    const markerCoords = document.getElementById("latlng").value;
    const latlngStr = markerCoords.split(",", 2);
    var lat = parseFloat(latlngStr[0]);
    var lng = parseFloat(latlngStr[1])
    var markerPosition = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({position: markerPosition, map: map});

    //Switch statement to handle the cases
    switch(checkPIP()){
      case true:
        click.stopImmediatePropagation();
        break;
      default:
        click.stopImmediatePropagation();
        alert("The point does not lie in a polygon");
        break;
      }
    });

  /*
  Calculating the distance between two points on the Map
  */
  document.getElementById("routeSubmit").addEventListener("click", () => {
    //Getting the coordinates of point A and placing a marker at these coords
    const marker1 = document.getElementById("marker1").value;
    const latlngStr1 = marker1.split(",", 2);
    var lat1 = parseFloat(latlngStr1[0]);
    var lng1 = parseFloat(latlngStr1[1])
    var marker1position = new google.maps.LatLng(lat1, lng1);
    var mk1 = new google.maps.Marker({position: marker1position, map: map});

    //Getting the coordinates of point B and placing a marker at these coords
    const marker2 = document.getElementById("marker2").value;
    const latlngStr2 = marker2.split(",", 2);
    var lat2 = parseFloat(latlngStr2[0]);
    var lng2 = parseFloat(latlngStr2[1]);
    var marker2position = new google.maps.LatLng(lat2, lng2);
    var mk2 = new google.maps.Marker({position: marker2position, map: map});

    /*
    Utilising the google maps directions API to calculate the distance from
    marker A to marker B
    */
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();

    //Existing map object displays directions
    directionsRenderer.setMap(map);

    // Create route from existing points used for markers
    const route = {
      origin: marker1position,
      destination: marker2position,
      travelMode: 'DRIVING'
    }

    //Anonymous function to capture directions
    directionsService.route(route,
      function(response, status) {
        if (status !== 'OK') {
          window.alert('Directions request failed due to ' + status);
          return;
        } else {
          // Add route to the map
          directionsRenderer.setDirections(response);

          // Get data about the mapped routes
          var directionsData = response.routes[0].legs[0];
          if (!directionsData) {
            window.alert('Directions request failed');
            return;
          }else {
            document.getElementById('msg').innerHTML =
            "Driving distance and duration from "
            + marker1position + " to " + marker2position + " is "
            + directionsData.distance.text + " (" + directionsData.duration.text
            + ").";
          }
        }
      });
    });

  //Refresh the map if the 'Refresh' button is clicked
  document.getElementById("refresh").addEventListener("click", () => {
    refresh();
  });

  //Calculating routes based on clicked points
  document.getElementById("calcRoute").addEventListener("click", (clicked) => {
    clicked.stopImmediatePropagation();
    alert("Click on two points on the map to find the driving distance and duration between these two points");
    google.maps.event.addListener(map, "click", function(event){
      var clickedPoint1 = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
      click1pos = clickedPoint1;
      var click1marker = new google.maps.Marker({position: clickedPoint1, map: map});
      document.getElementById("marker1").value = click1pos;

      google.maps.event.addListener(map, "click", function(event2){
        var clickedPoint2 = new google.maps.LatLng(event2.latLng.lat(), event2.latLng.lng());
        click2pos = clickedPoint2;
        var click2marker = new google.maps.Marker({position: clickedPoint2, map: map});
        document.getElementById("marker2").value = click2pos;

        //Calculating distance and duration
        let directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer();
        //Existing map object displays directions
        directionsRenderer.setMap(map);

        // Create route from existing points used for markers
        const route = {
           origin: clickedPoint1,
           destination: clickedPoint2,
           travelMode: 'DRIVING'
         }

        //Anonymous function to capture directions
        directionsService.route(route,
         function(response, status) {
           if (status !== 'OK') {
             window.alert('Directions request failed due to ' + status);
             return;
           } else {
             // Add route to the map
             directionsRenderer.setDirections(response);

             // Get data about the mapped routes
             var directionsData = response.routes[0].legs[0];
             if (!directionsData) {
               window.alert('Directions request failed');
               return;
           } else {
              document.getElementById('msg').innerHTML =
              "Driving distance and duration from "
              + click1pos + " to " + click2pos + " is "
              + directionsData.distance.text + " (" + directionsData.duration.text
              + ").";
            }
          }
        });
      });
    });
  });
}
