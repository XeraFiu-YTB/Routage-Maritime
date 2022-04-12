//Point Network that define all the possible paths
let maritimeNetwork = JSON.parse(marnet)
//The current Map
let map = L.map("map").setView([0, 0], 3)

//Prevent user from dragging the map and dezooming
//map.setMaxBounds(map.getBounds()).setMinZoom(2)

//Using openstreetmap.org to handle information
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; Developed By Bastard Nathan'
}).addTo(map);

let startingPoint = { "lat": 0, "lng": 0, "maker": null }
let endingPoint = { "lat": 0, "lng": 0, "maker": null }

//Listen Left & Right Click from the map
;["click", "contextmenu"].forEach(function (eventName) {
    map.on(eventName, (event) => {
        switch(event.originalEvent.which) {
            //Left Click
            case 1:
                if(startingPoint.maker) map.removeLayer(startingPoint.maker)
                startingPoint = { "lat": event.latlng.lat, "lng": event.latlng.lng }
                startingPoint.maker = L.marker([startingPoint.lat, startingPoint.lng], { alt: "Start" }).addTo(map)
                startingPoint.maker.bindPopup("<b>Start</b>").openPopup()
                updatePath(startingPoint, endingPoint)
                //draw()
            break;
            //Right Click
            case 3:
                if(endingPoint.maker) map.removeLayer(endingPoint.maker)
                endingPoint = { "lat": event.latlng.lat, "lng": event.latlng.lng }
                endingPoint.maker = L.marker([endingPoint.lat, endingPoint.lng], { alt: "End" }).addTo(map)
                endingPoint.maker.bindPopup("<b>End</b>").openPopup()
                updatePath(startingPoint, endingPoint)
                //draw()
            break;
        }
    })
})

//Display every path on the map
let active = false
document.getElementById("show").onclick = () => {
    active = !active
    if(active) {
        //Draw path on the map
        L.geoJSON(maritimeNetwork, { color: "red", alt: "path",
            onEachFeature: function (feature, layer) {
                layer.myTag = "MaritimeNetwork"
            }
        }).addTo(map)
    } else {
        map.eachLayer((layer) => {
            if(layer?.myTag == "MaritimeNetwork") map.removeLayer(layer)
        })
    }
}


