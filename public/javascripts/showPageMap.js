mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: geometry.coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ closeOnClick: false }).setHTML(
      `<h3>${title}</h3>
      <p>${campLocation}</p>`
    )
  )
  .addTo(map);


  