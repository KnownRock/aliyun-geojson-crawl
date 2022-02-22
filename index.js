const axios = require('axios')
const fs = require('fs')

const sleep = ()=>{
  return new Promise(resolve => {
    setTimeout(() => {
          resolve()
    }, 1000)
  })
}

async function getJson(adcode) {
  if(fs.existsSync(`./data/${adcode}.json`)){
    return JSON.parse(fs.readFileSync(`./data/${adcode}.json`))
  }else{
    await sleep()
    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`
    const res = await axios.get(url)
    const json = res.data
    return json
  }
}

!(async ()=>{
  if(!fs.existsSync('./data')){
    fs.mkdirSync('./data')
  }

  const areaQuene = ['100000']

  while(areaQuene.length > 0){
    try {
      const areaCode = areaQuene.shift()
    
      const json = await getJson(areaCode)

      console.log(`${areaCode} finished`)

      fs.writeFileSync(`./data/${areaCode}.json`, JSON.stringify(json))
      
      json.features.forEach(feature => {
        if(feature.properties.adcode.toString().match(/00$/)){
          areaQuene.push(feature.properties.adcode)
        }
      })
    } catch (error) {
      console.log(error)
    } 
  }
})()