
async function load(){
  return await fetch('tf/model', { method:'GET',headers: {'Content-type':'application/json'} }).then(data => {
    return data.json()
  }).then(data => data)
}


let model = await load()
console.log(await tf.loadLayersModel(model))
// const modelLoaded = await tf.loadLayersModel(model);
console.log(model)