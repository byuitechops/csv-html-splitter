window.deepen = (function(){
  function submatch(str1,str2){
    var i = 0;
    while(i < Math.min(str1.length,str2.length) && str1[i] == str2[i]){i++}
    return str1.slice(0,i)
  }
  
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  
  function deepen(obj){
    const BASECHAR = '_'
    var deep = {}
    Object.defineProperties(deep,{
      _:{value:deep},
      flatten:{value:function(node,path){
        node = node==undefined ? this._ : node
        path = path || []
        if(typeof node != 'object') return {[path.join('').replace(new RegExp(escapeRegExp(BASECHAR)+'$'),'')]:node}
        return Object.keys(node).reduce((obj,key) => Object.assign(obj,this.flatten(node[key],[...path,key])),{})
      }},
      get:{value:function(key){
        var node = this._
        while(true){
          if(typeof node != 'object'){
            if(key == ''){
              return node
            } else {
              return undefined
            }
          }
          if(key == ''){
            return node[BASECHAR] || deepen(node)
          }
          var entering = Object.keys(node).find(k => submatch(k,key))
          if(entering){
            var sub = submatch(entering,key)
            if(node[sub] != undefined){
              node = node[sub]
              key = key.slice(sub.length)
            } else {
              return undefined
            }
          } else {
            return undefined
          }
        }
      }},
      set:{value:function (key,value,parent,i){
        if(parent == undefined){
          parent = this
          i = BASECHAR
        }
        var node = parent[i]
        if(typeof node != 'object'){ node = parent[i] = {[BASECHAR]:node} }
        var entering = Object.keys(node).find(k => submatch(k,key))
        if(entering){
          var sub = submatch(entering,key)
          if(node[sub]){
            var next = key.slice(sub.length)
            if(next){
              // already exists, travel further
              this.set(next,value,node,sub)
            } else {
              node[key] = value
              return
            }
          } else {
            // some splicing needs to happen
            // {bent:'value',earl:'a'} => {ben:{t:'value',jamin:{}},earl:'a'}
            node[sub] = {[entering.slice(sub.length)]:node[entering]}
            delete node[entering]
            this.set(key.slice(sub.length)||BASECHAR,value,node,sub)
          }
        } else {
          // create here
          node[key] = value
        }
      }},
      arrayify:{value:function(parent,i){
        if(parent == undefined){
          parent = this
          i = BASECHAR
        }
        var node = parent[i]
        if(typeof node != 'object') return;
        var keys = Object.keys(node)
        if(keys.some(key => !isNaN(key))){
          node = parent[i] = keys.reduce((arr,key) => {
            arr[key] = node[key]
            return arr
          },[])
        }
        keys.forEach(key => this.arrayify(node,key))
      }}
    })
    Object.keys(obj).forEach(key=> deep.set(key,obj[key]))
    deep.arrayify()
    return deep
  }
  
  return deepen
})()
