(function(){var __amdDefs__={},Marx_prototype=function(){!function(_myTrait_){var _callBackHash,_idx,_worker,_initDone,_objRefs,_threadPool,_maxWorkerCnt,_roundRobin,_objPool,_promiseClass,_classDefs,_loadedLibs;_myTrait_.__promiseClass=function(t){return t&&(_promiseClass=t),"undefined"!=typeof Promise&&(_promiseClass||(_promiseClass=Promise)),_promiseClass},_myTrait_._appendToHead=function(t,a){if(!a){a=t;var e=a.split(".");t=e.pop()}var r=this.__promiseClass();return r?(_loadedLibs||(_loadedLibs={}),_loadedLibs[a]?_loadedLibs[a]:(_loadedLibs[a]=new r(function(e,r){var s;return"js"==t&&(s=document.createElement("script"),s.src=a),"css"==t&&(s=document.createElement("link"),s.setAttribute("rel","stylesheet"),s.setAttribute("type","text/css"),s.setAttribute("href",a)),s?(s.onload=function(){e(a)},s.onerror=function(){r(a)},void document.head.appendChild(s)):void r("Unknown element type "+a)}),_loadedLibs[a])):void 0},_myTrait_._baseWorker=function(t){return{init:function(){this._initDone||(this._initDone=!0,this._classes={},this._instances={},this._imports={})},start:function(msg){if(this.init(),"call"!=msg.data.cmd||"/"!=msg.data.id){if("call"==msg.data.cmd&&msg.data.id){var ob=this._instances[msg.data.id];ob&&ob[msg.data.fn]&&ob[msg.data.fn].apply(ob,[msg.data.data,function(t){postMessage({cbid:msg.data.cbid,data:t})}])}}else{if("createClass"==msg.data.fn){var newClass,dataObj=JSON.parse(msg.data.data);if(eval("newClass = "+dataObj.code),dataObj.localMethods){var methods=dataObj.localMethods;for(var n in methods)methods.hasOwnProperty(n)&&!function(t){newClass[t]=function(){for(var a=arguments.length,e=new Array(a),r=0;a>r;r++)e[r]=arguments[r];postMessage({msg:t,data:e,ref_id:this._ref_id})}}(n)}this._classes[dataObj.className]=newClass;try{if(dataObj.requires&&dataObj.requires.js)for(var list=dataObj.requires.js,i=0;i<list.length;i++){var url=list[i].url;this._imports[url]||(importScripts(url),this._imports[url]=!0)}}catch(e){}postMessage({cbid:msg.data.cbid,data:"Done"})}if("createObject"==msg.data.fn&&msg.data.data){var dataObj=JSON.parse(msg.data.data),newClass=this._classes[dataObj.className];if(newClass){var o_instance=Object.create(newClass);this._instances[dataObj.id]=o_instance,o_instance.sendMsg=function(t,a){postMessage({msg:t,data:a,ref_id:dataObj.id})},o_instance.trigger=o_instance.send=o_instance.sendMsg,o_instance._ref_id=dataObj.id,o_instance.init&&o_instance.init(),postMessage({cbid:msg.data.cbid,data:"Done"})}}}}}},_myTrait_._callObject=function(t,a,e,r){var s=_objRefs[t];return s&&this._callWorker(_threadPool[s.__wPool],t,a,e,r),this},_myTrait_._callWorker=function(t,a,e,r,s){_worker&&(_callBackHash[_idx]=s,"object"==typeof r&&(r=JSON.stringify(r)),t.postMessage({cmd:"call",id:a,fn:e,cbid:_idx++,data:r}))},_myTrait_._createWorker=function(t){try{if("undefined"==typeof t&&_worker)return _worker;var a="var o = "+this._serializeClass(this._baseWorker())+"\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ",e=new Blob([a],{type:"text/javascript"}),r=new Worker(window.URL.createObjectURL(e));return _callBackHash||(_callBackHash={},_idx=1),_worker=r,r.onmessage=function(t){if("object"!=typeof t.data)console.error("Unknown message from the worker ",t.data);else{if(t.data.cbid){var a=_callBackHash[t.data.cbid];delete _callBackHash[t.data.cbid],a(t.data.data)}if(t.data.ref_id){var e=_objRefs[t.data.ref_id];if(e){var r=(t.data.data,t.data.msg);if(console.log(t.data),e[r]){var s=_classDefs[e.__wClass];if(s&&s.methods[r])return void e[r].apply(e,t.data.data)}e.trigger&&e.trigger(t.data.msg,t.data.data)}}}},"undefined"!=typeof t&&(_threadPool[t]=r),r}catch(s){return null}},_myTrait_._createWorkerClass=function(t,a,e,r){var s=this.__promiseClass(),i=this;return _classDefs||(_classDefs={}),new s(function(n){var o,_;_classDefs[t]={methods:r};for(var d=i._serializeClass(a),l=0;_maxWorkerCnt>l;l++)!function(a){o?o=o.then(function(){return new s(function(s){i._callWorker(_threadPool[a],"/","createClass",{className:t,code:d,requires:e,localMethods:r},s)})}):_=o=new s(function(s){i._callWorker(_threadPool[a],"/","createClass",{className:t,code:d,requires:e,localMethods:r},s)})}(l);o.then(function(){n(!0)})})},_myTrait_._createWorkerObj=function(t,a,e){var r=this.__promiseClass(),s=this;return new r(function(r){var i=_roundRobin++%_maxWorkerCnt;e.__wPool=i,e.__wClass=t,s._callWorker(_threadPool[i],"/","createObject",{className:t,id:a},function(t){_objRefs[a]=e,r(t)})})},_myTrait_._serializeClass=function(t){var a="{",e=0;for(var r in t)e++&&(a+=","),a+=r+" : "+t[r].toString();return a+="};"},_myTrait_._workersAvailable=function(){return _worker},_myTrait_.createClass=function(t){var a={},e=this,r={};if(this._workersAvailable()){var s=t.webWorkers;for(var i in s)s.hasOwnProperty(i)&&!function(t){a[t]=function(a,r){a||(a=null),e._callObject(this._id,t,a,r)}}(i);var n=t.methods;for(var i in n)n.hasOwnProperty(i)&&!function(t,e){r[e]=e,a[e]=function(){for(var a=arguments.length,e=new Array(a),r=0;a>r;r++)e[r]=arguments[r];t.apply(this,e)}}(n[i],i)}else{console.log("** workers are not available **");var o=t.requires,_=[];for(var d in o)if("js"==d){var l=o[d];l.forEach(function(t){_.push(e._appendToHead("js",t.url))})}var s=t.webWorkers;for(var i in s)t.hasOwnProperty(i)&&!function(t,e){a[e]=function(a,e){t.apply(this,[a,e])}}(s[i],i);var n=t.methods;for(var i in n)n.hasOwnProperty(i)&&(r[i]=i,function(t){a[i]=function(a,e){t.apply(this,[a,e])}}(n[i],i))}a.on=function(t,a){this.__evt||(this.__evt={}),this.__evt[t]||(this.__evt[t]=[]),this.__evt[t].push(a)},a.trigger=function(t,a){if(this.__evt&&this.__evt[t]){var e=this;this.__evt[t].forEach(function(t){t.apply(e,[a])})}};var c=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15),e=this,f=this.__promiseClass();if(this._workersAvailable()){var u=this._createWorkerClass(c,t.webWorkers,t.requires,r),h=function(t){t||(t=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15)),this._id=t;var a=this;return new f(function(r){u.then(function(){e._createWorkerObj(c,t,a).then(function(){a.trigger("ready"),r(a)})})})};h.prototype=a}else{var h=function(t){t||(t=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15)),this._id=t;return f.resolve(this)};h.prototype=a}return h},_myTrait_.__traitInit&&!_myTrait_.hasOwnProperty("__traitInit")&&(_myTrait_.__traitInit=_myTrait_.__traitInit.slice()),_myTrait_.__traitInit||(_myTrait_.__traitInit=[]),_myTrait_.__traitInit.push(function(){if(!_initDone){_initDone=!0,_maxWorkerCnt=4,_roundRobin=0,_threadPool=[],_objRefs={};for(var t=0;_maxWorkerCnt>t;t++)this._createWorker(t)}})}(this)},Marx=function(t,a,e,r,s,i,n,o){var _,d=this;if(!(d instanceof Marx))return new Marx(t,a,e,r,s,i,n,o);var l=[t,a,e,r,s,i,n,o];if(d.__factoryClass)if(d.__factoryClass.forEach(function(t){_=t.apply(d,l)}),"function"==typeof _){if(_._classInfo.name!=Marx._classInfo.name)return new _(t,a,e,r,s,i,n,o)}else if(_)return _;d.__traitInit?d.__traitInit.forEach(function(t){t.apply(d,l)}):"function"==typeof d.init&&d.init.apply(d,l)};Marx._classInfo={name:"Marx"},Marx.prototype=new Marx_prototype,function(){"undefined"!=typeof define&&null!==define&&null!=define.amd?(__amdDefs__.Marx=Marx,this.Marx=Marx):"undefined"!=typeof module&&null!==module&&null!=module.exports?module.exports.Marx=Marx:this.Marx=Marx}.call(new Function("return this")()),"undefined"!=typeof define&&null!==define&&null!=define.amd&&define(__amdDefs__)}).call(new Function("return this")());