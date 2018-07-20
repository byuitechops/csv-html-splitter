function submatch(str1,str2){
  var i = 0;
  while(i < Math.min(str1.length,str2.length) && str1[i] == str2[i]){i++}
  return str1.slice(0,i)
}

function create(obj){
  var prox = new Proxy(new Deep(),{
    get(target,prop){
      if(target._[prop]){
        console.log('direct',prop)
        return target._[prop]
      } else if (target.hasOwnProperty(prop)){
        console.log('other',prop)
        return target[prop]
      } else {
        console.log('last',prop)
        return target.get(prop)
      }
    },
    set(target,prop,value){
      target.set([prop,value],target,'_')
      return true
    }
  })
  Object.assign(prox,obj)
  return prox
}

class Deep{
  constructor(){
    this._ = {}
    // Object.entries(obj).forEach(entry=> this.set(entry,this,'_'))
  }
  flatten(node=this._,path=[]){
    if(typeof node != 'object') return [[path.join(''),node]]
    var keys = Object.keys(node)
    return [].concat(...keys.map(key => flatten(node[key],[...path,key])))
  }
  get(key){
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
        return node['_'] || new Deep(node)
      }
      var entering = Object.keys(node).find(k => submatch(k,key))
      if(entering){
        var sub = submatch(entering,key)
        if(node[sub]){
          node = node[sub]
          key = key.slice(sub.length)
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    }
  }
  set([key,value],parent,i){
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

function retrieve(root,key){
  var node = root
  while(true){
    if(typeof node != 'object'){
      if(key == ''){
        return node
      } else {
        return undefined
      }
    }
    if(key == ''){
      return node['_'] || node
    }
    var entering = Object.keys(node).find(k => submatch(k,key))
    if(entering){
      var sub = submatch(entering,key)
      if(node[sub]){
        node = node[sub]
        key = key.slice(sub.length)
      } else {
        return undefined
      }
    } else {
      return undefined
    }
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

// module.exports.deepen = function(obj){
//   var root = {_:{}}
//   Object.entries(obj).forEach(entry => add(entry,root,'_'))
//   arrayify(root,'_')
//   return root._
// }

// module.exports.flatten = function(obj){
//   return flatten(obj).reduce((obj,[key,value]) => {obj[key] = value;return obj},{})
// }

var elm = create({"id":"0161dc19-60af-5131-84d6-64a07fa2d528","skill":"listening","level":"1","topic":"education","difficultylevel":"2","function":"ask and answer","passagetext":"<link href='https://byuitechops.github.io/ec3-quiz-design/icons.css' rel='stylesheet'type='text/css'><link href='https://byuitechops.github.io/ec3-quiz-design/new_style.css' rel='stylesheet'type='text/css'><link href='https://byuitechops.github.io/ec3-quiz-design/components/all.css' rel='stylesheet'type='text/css'><link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic'rel='stylesheet' type='text/css'><link rel='stylesheet' href='./jquery.fancybox.css?v=2.1.5' type='text/css' media='screen'><h1><strong>Instructions</strong></h1>\n<p>This passage will help you master Asking and Answering Questions. As you practice&nbsp;Asking and Answering Questions, you will be able to:</p>\n<ol style=\"list-style-type: lower-alpha;\">\n<li>understand the gist of texts</li>\n<li>understand simple invitations and simple messages</li>\n<li>listen for highly predictable details</li>\n<li>understand simple <em>yes</em>/<em>no</em> questions</li>\n<li>understand <em>what</em> questions</li>\n</ol>\n<h2>Warm-up</h2>\n<p><img src=\"/content/EC3_images/L1FP/FP_L1_AS_T2_P1.jpg\" /></p>\n<p>What are you planning for the future? Do you plan to go to college?</p>\n<p>Review these vocabulary words before listening. They will help you understand the passage.</p>\n<p><strong>acceptance letter (n):</strong> a letter from a university saying you are admitted to study at their school</p>\n<p><strong>example:</strong> <em>She received the acceptance letter from BYU today, and she is starting there in the fall. </em></p>\n<p><strong>scholarship (n):</strong> an amount of money given to a student</p>\n<p><strong>example:</strong> <em>He doesn&rsquo;t need to pay for school next semester because he received a scholarship.</em></p>\n<p><strong>lease (n):</strong> a contract for an apartment or <strong>house</strong> you are renting</p>\n<p><strong>example:</strong> <em>The lease for my new apartment goes from January 3rd to April 29th.</em></p>\n<h2>Passage</h2>\n<p>Two friends are talking on the phone about college plans.</p>\n<p><audio src=\"/content/EC3_sounds/audio/L1FP/FP_L1_AS_T2_P1.mp3\" controls=\"controls\"></audio></p>\n<p>Carlos: Hey Cynthia! <strong>How are you? </strong></p>\n<p>Cynthia: Hey Carlos! I&rsquo;m doing pretty well. What&rsquo;s up?</p>\n<p>Carlos: Nothing much. I&rsquo;m calling to get some news from you. You tried to get into BYU for the second time, right? Did you get accepted this time?</p>\n<p>Cynthia: Yes, I am so happy! I received the acceptance letter <strong>yesterday,</strong> and I still can&rsquo;t believe it! I even received a scholarship!</p>\n<p>Carlos: Oh, I am so happy for you too! Are you <strong>starting</strong> there this Fall Semester then?</p>\n<p>Cynthia: Yes, I&rsquo;m leaving in three weeks. I <strong>need to</strong> find an apartment, and I also need to find a <strong>job</strong>.</p>\n<p>Carlos: We have to see each other before you leave. <strong>What</strong> is your schedule like next week?</p>\n<p>Cynthia: I am free every evening except for Monday.</p>\n<p>Carlos: Great! <strong>Let&rsquo;s</strong> plan for Tuesday evening then. I can pick you up at 6:00pm. Does that work for you?</p>\n<p>Cynthia: <strong>Perfect</strong>. See you then.</p>","passagecorevocabularyused":"","passagetexttype":"c1","passageaudiofilename":"","passageimagename":"","questionname":"passage 1 question1","questionfunction":"ask and answer","questioncando":"f1","questiontext":"<p>This conversation mainly talks about ________________.</p>","questionlevelfeedback":"","questiontype":"multiple choice","questionaudiofilename":"","questionimagename":"","questionrubric":"","answertext1":"students’ jobs","answer1feedback":"","answer1audiofilename":"","answer1imagename":"","answertext2":"Brigham Young University","answer2feedback":"","answer2audiofilename":"","answer2imagename":"","answertext3":"**going away for college","answer3feedback":"","answer3audiofilename":"","answer3imagename":"","answertext4":"getting together ","answer4feedback":"","answer4audiofilename":"","answer4imagename":"","answertext5":"","answer5feedback":"","answer5audiofilename":"","answer5imagename":"","answertext6":"","answer6feedback":"","answer6audiofilename":"","answer6imagename":""})
console.log(elm)