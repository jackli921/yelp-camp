mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL or style object
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});


const marker1 = new mapboxgl.Marker({ color: "orange" })
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 10 }).setHTML(`
              <p>${campground.location}<p>`)
  ) // add popup
  .addTo(map);