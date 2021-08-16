//Defining map as a global variable
let map;

//Defining a global marker object
let marker;

//Defining a global drawing manager Object
let drawingManager;

//Defining a global coordinates variable
let coordinates

//Polygon ids
let id;

//Polygon array
let polArray = [];

//Function to make an id for each polygonOptions//Function to generate a random code for each polygon
function makeID(){
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 5; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
    charactersLength));
  }
  return result;
}

function initMap(){
  //Creating a new map with the center in London
   map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {lat: 51.507, lng: 0.127 }
  });

  //Creating a drawing manager tool
  drawingManager = new google.maps.drawing.DrawingManager({
  drawingMode: google.maps.drawing.OverlayType.MARKER,
  drawingControl: true,
  drawingControlOptions: {
    position: google.maps.ControlPosition.TOP_CENTER,
    drawingModes: [
      google.maps.drawing.OverlayType.POLYGON
    ],
  },
  polygonOptions: {
    draggable: true,
    editable: true,
    clickable: true,
  }
});
  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, "overlaycomplete", function(e){
    id = e.overlay.getPath().getArray();
    var path =  e.overlay.getPath().getArray();
    id = makeID();
    console.log(id);
    polArray.push(e.overlay);
    console.log(polArray[0]);

    //Point in polygon
    // const input = document.getElementById("latlng").value;
    // const latlngStr = input.split(",", 2);
    // var lat = parseFloat(latlngStr[0]);
    // var lng = parseFloat(latlngStr[1])
    // var curPosition = new google.maps.LatLng(lat, lng);

    //document.getElementById("submit").addEventListener("click", () => {
      // if(google.maps.geometry.poly.containsLocation(curPosition, e.overlay)){
      //   alert("These coordinates lie in the polygon: " + id);
      // }
  });

    const input = document.getElementById("latlng").value;
    const latlngStr = input.split(",", 2);
    var lat = parseFloat(latlngStr[0]);
    var lng = parseFloat(latlngStr[1])
    var coords = new google.maps.LatLng(lat, lng);

    document.getElementById("submit").addEventListener("click", () => {
      // if(google.maps.geometry.poly.containsLocation(curPosition, e.overlay)){
      //   alert("These coordinates lie in the polygon: " + id);

    for(i = 0; i < polArray.length; i++){
        if(google.maps.geometry.poly.containsLocation(coords, polArray[i])){
          alert("This point lies in the polygon: " + id);
        }else{
          alert("This point does not lie in a polygon");
        }
      }
    });
  }
