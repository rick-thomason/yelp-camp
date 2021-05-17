mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 8, // starting zoom
})

var marker2 = new mapboxgl.Marker({ color: 'aqua', rotation: 45 })
  .setLngLat([-74.5, 40])
  .addTo(map)
