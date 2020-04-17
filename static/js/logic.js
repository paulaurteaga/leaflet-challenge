url= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
d3.json(url, function(data) {
     //calling this function and passing an array of feaures of every geojson object
     createFeatures(data.features);
     
  
  });

function createFeatures(data){
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
          "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
  var earthquakes = L.geoJSON(data, {

    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      //At first i was going to get the colors like this, 
      //but ended up using a much more readable function
      // var r = 255;
      // var g = Math.floor(255-80*feature.properties.mag);
      // var b = Math.floor(255-80*feature.properties.mag);
      // color= "rgb("+r+" ,"+g+","+ b+")"
      // colors.push(color)
      var geojsonMarkerOptions = {
        radius: 6*feature.properties.mag,
        fillColor: getColor(feature.properties.mag),
        color: "blue",
        weight: 1,
        opacity: 0.6,
        fillOpacity: 0.8
      };
      
      return L.circleMarker(latlng, geojsonMarkerOptions);
      
    }
  })
  
  createMap(earthquakes)
}

function createMap(earthquakes){
  // Adding tile layer
  var streetmap=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
})

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0,1,2,3,4,5,6];
    for (var i = 0; i < limits.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(limits[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
          limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
     }
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  

}

//Function where i would pass the Magnitude value as parameter and 
//return a code of color
function getColor(d) {
  return d > 6 ? '#800026' :
         d >  5 ? '#BD0026' :
         d > 4  ? '#E31A1C' :
         d > 3  ? '#FC4E2A' :
         d > 2   ? '#FD8D3C' :
         d >1   ? '#FEB24C' :
         d > 0   ? '#FED976' :
         "FED976"
          
}


     
    