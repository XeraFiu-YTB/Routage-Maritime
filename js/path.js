//Global Update of the Path
async function updatePath(startingPoint, endingPoint) {
    if(!startingPoint.maker || !endingPoint.maker) return
    //Get the nearest marnet point for starting/ending points
    let startingMarnet = await pointToMarnet(startingPoint.lat, startingPoint.lng)
    let endingMarnet = await pointToMarnet(endingPoint.lat, endingPoint.lng)
    
    //Get the path between the marnet points
    let pathFinder = new window.PathFinder(maritimeNetwork)
    let path = pathFinder.findPath(startingMarnet, endingMarnet)
    if(!path) return
    path = window.turf.lineString(path.path)

    //Remove old path from the map
    map.eachLayer((layer) => {
        if(layer?.myTag == "MaritimePath") map.removeLayer(layer)
    })
    //Draw new path on the map
    L.geoJSON(path, { color: "blue", alt: "path",
        onEachFeature: function (feature, layer) {
            layer.myTag = "MaritimePath"
        }
    }).addTo(map)
}

async function pointToMarnet(lat, lng) {
    let point = window.turf.point([lng, lat])
    let shortestDistance = Number.MAX_SAFE_INTEGER
    let nearestLineIndex = 0
    
    //Get the nearest marnet line from the point
    maritimeNetwork.features.forEach((line, index) => {
        let distance = window.turf.pointToLineDistance(point, line)
        if(distance >= shortestDistance) return
        
        shortestDistance = distance
        nearestLineIndex = index
    })

    //Get the nearest point from the line
    let nearestPoint = window.turf.nearestPointOnLine(maritimeNetwork.features[nearestLineIndex], point)
    let nearestPointApprox = window.turf.point(maritimeNetwork.features[nearestLineIndex].geometry.coordinates[nearestPoint.properties.index])
    
    let nearestPointDist = null
    let nearestPointCoords = null

    maritimeNetwork.features[nearestLineIndex].geometry.coordinates.forEach((coords) => {
        let distToPoint = window.turf.rhumbDistance(point, coords)

        if(!nearestPointDist || distToPoint < nearestPointDist) {
            nearestPointDist = distToPoint
            nearestPointCoords = coords
        }
        
    })
    nearestPointCoords = window.turf.point(nearestPointCoords)
    return nearestPointCoords
}

