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

function breakHtml(quiz){
  quiz = deepen(quiz)
  var sections = quiz.get('passagetext').split(/(<h\d>)/)
  for(var i = 1; i < sections.length; ++i){ 
    sections.splice(i,2,sections[i]+sections[i+1]) 
  }
  sections.forEach(html => {
    var temp = document.createElement('div')
    temp.innerHTML = html
    var header = temp.querySelector('h1,h2,h3,h4,h5,h6')
    header = (header ? header.innerText : 'head').replace(/\W/g,'').toLowerCase()
    quiz.set('passagesections'+header,html)
  })
  window.quiz = quiz
  return quiz.flatten()
}

function onFiles(files){
  files.forEach(file => {
    file.content = file.content.map(breakHtml)
  })
  download(files,'files.zip')
}

/* READY SET GO! */
document.getElementById('fileInput').addEventListener('change',e => {
  Promise.all(Array.from(e.target.files).map(readFile)).then(files => files.length && onFiles(files))
})
