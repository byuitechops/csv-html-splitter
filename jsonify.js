function submatch(str1,str2){
  var i = 0;
  while(i < Math.min(str1.length,str2.length) && str1[i] == str2[i]){i++}
  return str1.slice(0,i)
}

function add([key,value],parent,i){
  var node = parent[i]
  if(typeof node != 'object'){
    node = parent[i] = {_:node}
  }
  var entering = Object.keys(node).find(k => submatch(k,key))
  if(entering){
    var sub = submatch(entering,key)
    if(node[sub]){
      // already exists, travel further
      add([key.slice(sub.length),value],node,sub)
    } else {
      // some splicing needs to happen
      // {bent:'value',earl:'a'} => {ben:{t:'value',jamin:{}},earl:'a'}
      node[sub] = {[entering.slice(sub.length)]:node[entering]}
      delete node[entering]
      add([key.slice(sub.length),value],node,sub)
    }
  } else {
    // create here
    node[key] = value
  }
}

function arrayify(parent,i){
  var node = parent[i]
  if(typeof node != 'object') return;
  var keys = Object.keys(node)
  if(keys.every(key => !isNaN(key))){
    parent[i] = keys.reduce((arr,key) => {
      arr[key] = node[key]
      return arr
    },[])
  }
  keys.forEach(key => arrayify(node,key))
}

function flatten(node,path=[]){
  if(typeof node != 'object') return [[path.join(''),node]]
  var keys = Object.keys(node)
  return [].concat(...keys.map(key => flatten(node[key],[...path,key])))
}

module.exports.deepen = function(obj){
  var root = {_:{}}
  Object.entries(obj).forEach(entry => add(entry,root,'_'))
  arrayify(root,'_')
  return root._
}

module.exports.flatten = function(obj){
  return flatten(obj).reduce((obj,[key,value]) => {obj[key] = value;return obj},{})
}