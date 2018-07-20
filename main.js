function readFile(file){
  return new Promise((resolve,reject) => {
    var reader = new FileReader()
    reader.onload = e => {
      resolve({
        content:d3.csvParse(e.target.result),
        name:file.name,
        type:file.type,
        size:file.size,
      })
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function download(files,fileName){
  var zip = new JSZip()
  files.forEach(file => {
    zip.file(file.name,d3.csvFormat(file.content))
  })
  zip.generateAsync({type:"blob"}).then((content) => {
    saveAs(content, fileName);
  });
}

function onFiles(files){
  window.file = files[0].content.map(deepen)
  console.log(window.file)
  // console.log(Object.keys(files[0].content[0]))
  // download(files,'files.zip')
}

/* READY SET GO! */
document.getElementById('fileInput').addEventListener('change',e => {
  Promise.all(Array.from(e.target.files).map(readFile)).then(files => files.length && onFiles(files))
})