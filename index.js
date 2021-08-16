//Defining map as a global variable
let map;

//Defining a global marker object
let marker;

//Defining a global drawing manager Object
let drawingManager;

//Defining a global coordinates variable
let coordinates

//Deefining a global array of polygons
let polygonArray = [];

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
    var id = e.overlay.getPath().getArray();
    var path =  e.overlay.getPath().getArray();
    id = makeID();
    console.log(id);
    var polygon = e.overlay

    google.maps.Polygon.prototype.Contains = function(point) {
      var crossings = 0,
      path = this.getPath();

      // for each edge
      for (var i=0; i < path.getLength(); i++) {
        var a = path.getAt(i),
        j = i + 1;
        if (j >= path.getLength()) {
          j = 0;
        }
        var b = path.getAt(j);
        if (rayCrossesSegment(point, a, b)) {
          crossings++;
        }
      }

      // odd number of crossings?
      return (crossings % 2 == 1);

      function rayCrossesSegment(point, a, b) {
        var px = point.lng(),
        py = point.lat(),
        ax = a.lng(),
        ay = a.lat(),
        bx = b.lng(),
        by = b.lat();
        if (ay > by) {
          ax = b.lng();
          ay = b.lat();
          bx = a.lng();
          by = a.lat();
        }
        // alter longitude to cater for 180 degree crossings
        if (px < 0) { px += 360 };
        if (ax < 0) { ax += 360 };
        if (bx < 0) { bx += 360 };
        if (py == ay || py == by) py += 0.00000001;
        if ((py > by || py < ay) || (px > Math.max(ax, bx))) return false;
        if (px < Math.min(ax, bx)) return true;
        var red = (ax != bx) ? ((by - ay) / (bx - ax)) : Infinity;
        var blue = (ax != px) ? ((py - ay) / (px - ax)) : Infinity;
        return (blue >= red);
      }
    };

    // const input = document.getElementById("latlng").value;
    // const latlngStr = input.split(",", 2);
    // var lat = parseFloat(latlngStr[0]);
    // var lng = parseFloat(latlngStr[1])
    // var point = new google.maps.LatLng(lat, lng);
    var point = new google.maps.LatLng(52.05249047600099, -0.6097412109375);
    var polygon = new google.maps.Polygon({path:[path]});
    if (polygon.Contains(point)) {
      // point is inside polygon
    }
  });
}
