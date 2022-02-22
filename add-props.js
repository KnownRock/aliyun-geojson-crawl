const turf = require('@turf/turf')
const fs = require('fs')

// add adcode as id, and add bbox for each feature
const areaQuene = ['100000']

if(!fs.existsSync('./dataForHandled')){
  fs.mkdirSync('./dataForHandled')
}

while (areaQuene.length > 0) {
  const areaCode = areaQuene.shift()
  if(fs.existsSync(`./data/${areaCode}.json`)){
    const json = JSON.parse(fs.readFileSync(`./data/${areaCode}.json`)) 
    json.features.forEach(feature => {
      if (feature.properties.adcode.toString().match(/00$/)) {
        areaQuene.push(feature.properties.adcode)
      }
    })

    json.features.forEach(feature => {
      feature.id = feature.properties.adcode
      feature.properties.bbox = turf.bbox(feature)
    })

    fs.writeFileSync(`./dataForHandled/${areaCode}.json`, JSON.stringify(json))
  }
}