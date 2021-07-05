const fs = require('fs');

function readNDJSON(path) {
  return fs.readFileSync(path, 'utf8').split('\n')
    .filter(d => d !== '')
    .map(JSON.parse);
}

function writeNDJSON(data) {
  data = Array.isArray(data) ? data : [data];
  let outNdjson = '';
  data.forEach(item => {
    outNdjson += JSON.stringify(item) + '\n';
  });
  return outNdjson;
}

const srcIdsGeo = readNDJSON('./sc-edits-ids.geojsonseq')

const outArray = []
// console.log('[')
console.log('id,lat,lon,weight,osmid')
srcIdsGeo.forEach(f => {
  const uid = `${f.properties["@type"].charAt(0)}${f.properties["@id"]}`
  if (f.geometry.type === "Point") {
    // ignore
    // console.log(`[${f.geometry.coordinates},1]`)
    console.log(`${f.id},${f.geometry.coordinates},1,${uid}`)
    outArray.push([f.geometry.coordinates, 1].flat())
  }

  if (f.geometry.type === "LineString") {
    // ignore
    // console.log(`[${f.geometry.coordinates[0]},1]`)
    console.log(`${f.id},${f.geometry.coordinates[0]},1,${uid}`)
    outArray.push([f.geometry.coordinates[0], 1].flat())
  }
  if (f.geometry.type === "MultiPolygon") {
    // ignore
    // console.log(`[${[f.geometry.coordinates[0][0][0]]},1]`)
    console.log(`${f.id},${f.geometry.coordinates[0][0][0]},1,${uid}`)
    outArray.push([f.geometry.coordinates[0][0][0], 1].flat())
  }

})
// console.log(']')

// let data = JSON.stringify(student);
// fs.writeFileSync('student-2.json', data);

// const ndjson = writeNDJSON(outArray)
