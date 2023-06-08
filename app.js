// Load GeoJSON data
function loadGeoJSON(callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", "circuits.geojson", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

// Fly to determined point
function flyToLocation(long, lat, name) {
  map.flyTo({
    center: [long, lat],
    zoom: 9,
    speed: 0.8,
    curve: 1,
  });

  // Create new popup
  if (popup != null) {
    popup.remove();
  }
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    closeOnMove: false,
  })
    .setLngLat([long, lat])
    .setHTML(`<strong>${name} Grand Prix</strong>`)
    .addTo(map);
}

// Add map
mapboxgl.accessToken =
  "pk.eyJ1IjoiZXRoYW5oZWluZSIsImEiOiJjbGlmYjhwNTgwY2M1M2ptc2xucHhuMXY2In0.i01L2hrCZX-j45M3QBNing";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12",
  zoom: 1,
  center: [-74, 40.7],
  maxZoom: 14,
});

map.on("load", () => {
  // Add circuit outlines
  map.addSource("circuits", {
    type: "geojson",
    data: "https://ethanheine.github.io/F1-2023-Locations/circuits.geojson",
  });

  map.addSource("locations", {
    type: "geojson",
    data: "https://ethanheine.github.io/F1-2023-Locations/locations.geojson",
  });

  map.addLayer({
    id: "circuit-outlines",
    type: "line",
    source: "circuits",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#66023C",
      "line-width": 5,
    },
  });

  map.addLayer({
    id: "circuit-locations",
    type: "circle",
    source: "locations",
    paint: {
      "circle-color": "#66023C",
      "circle-radius": 6,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.75,
      ],
    },
  });
})
