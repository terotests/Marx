(function(){var __amdDefs__={},Marx_prototype=function(){!function(_myTrait_){var _callBackHash,_idx,_worker,_initDone,_objRefs,_threadPool,_maxWorkerCnt,_roundRobin,_objPool,_promiseClass,_classDefs,_loadedLibs,_isNode,_processPool;_myTrait_.__promiseClass=function(a){if(a&&(_promiseClass=a),!_promiseClass&&("undefined"!=typeof Promise&&(_promiseClass=Promise),this._isNodeJS()))throw new Error("Promise is not defined");return _promiseClass},_myTrait_._appendToHead=function(a,t){if(!t){t=a;var e=t.split(".");a=e.pop()}var s=this.__promiseClass();return s?(_loadedLibs||(_loadedLibs={}),_loadedLibs[t]?_loadedLibs[t]:(_loadedLibs[t]=new s(function(e,s){var r;return"js"==a&&(r=document.createElement("script"),r.src=t),"css"==a&&(r=document.createElement("link"),r.setAttribute("rel","stylesheet"),r.setAttribute("type","text/css"),r.setAttribute("href",t)),r?(r.onload=function(){e(t)},r.onerror=function(){s(t)},void document.head.appendChild(r)):void s("Unknown element type "+t)}),_loadedLibs[t])):void 0},_myTrait_._baseProcess=function(t){function baseProcess(){this._initDone=!0,this._classes={},this._instances={},this._imports={};var postMessage=function(a){process.send(a)};this.onMsg=function(pData){var msg={data:pData};try{if("call"==msg.data.cmd&&"/"==msg.data.id){if("createClass"==msg.data.fn){var newClass,dataObj=msg.data.data;if(eval("newClass = "+dataObj.code),dataObj.localMethods){var methods=dataObj.localMethods;for(var n in methods)methods.hasOwnProperty(n)&&!function(a){newClass[a]=function(){for(var t=arguments.length,e=new Array(t),s=0;t>s;s++)e[s]=arguments[s];postMessage({msg:a,data:e,ref_id:this._ref_id})}}(n)}this._classes[dataObj.className]=newClass;try{if(dataObj.requires&&dataObj.requires.js)for(var list=dataObj.requires.js,i=0;i<list.length;i++){var mod=list[i];mod.name&&(mod.assignTo&&mod.varName?global[mod.assignTo]=require(mod.name)[mod.varName]:mod.assignTo&&(global[mod.assignTo]=require(mod.name)))}}catch(e){}postMessage({cbid:msg.data.cbid,data:"Done"})}if("createObject"==msg.data.fn&&msg.data.data){var dataObj=msg.data.data,newClass=this._classes[dataObj.className];if(newClass){var o_instance=Object.create(newClass);this._instances[dataObj.id]=o_instance,o_instance.sendMsg=function(a,t){postMessage({msg:a,data:t,ref_id:dataObj.id})},o_instance.send=o_instance.sendMsg,o_instance._ref_id=dataObj.id,o_instance.init&&o_instance.init(),postMessage({cbid:msg.data.cbid,data:"Done"})}}return}if("call"==msg.data.cmd&&msg.data.id){var ob=this._instances[msg.data.id];ob&&ob[msg.data.fn]&&ob[msg.data.fn].apply(ob,[msg.data.data,function(a){postMessage({cbid:msg.data.cbid,data:a})}])}}catch(e){console.log("error "+e.message)}}}var base=new baseProcess;process.on("message",function(a){base.onMsg(a)})},_myTrait_._baseWorker=function(t){return{init:function(){this._initDone||(this._initDone=!0,this._classes={},this._instances={},this._imports={})},start:function(msg){if(this.init(),"call"!=msg.data.cmd||"/"!=msg.data.id){if("call"==msg.data.cmd&&msg.data.id){var ob=this._instances[msg.data.id];ob&&ob[msg.data.fn]&&ob[msg.data.fn].apply(ob,[msg.data.data,function(a){postMessage({cbid:msg.data.cbid,data:a})}])}}else{if("createClass"==msg.data.fn){var newClass,dataObj=JSON.parse(msg.data.data);if(eval("newClass = "+dataObj.code),dataObj.localMethods){var methods=dataObj.localMethods;for(var n in methods)methods.hasOwnProperty(n)&&!function(a){newClass[a]=function(){for(var t=arguments.length,e=new Array(t),s=0;t>s;s++)e[s]=arguments[s];postMessage({msg:a,data:e,ref_id:this._ref_id})}}(n)}this._classes[dataObj.className]=newClass;try{if(dataObj.requires&&dataObj.requires.js)for(var list=dataObj.requires.js,i=0;i<list.length;i++){var url=list[i].url;this._imports[url]||(importScripts(url),this._imports[url]=!0)}}catch(e){}postMessage({cbid:msg.data.cbid,data:"Done"})}if("createObject"==msg.data.fn&&msg.data.data){var dataObj=JSON.parse(msg.data.data),newClass=this._classes[dataObj.className];if(newClass){var o_instance=Object.create(newClass);this._instances[dataObj.id]=o_instance,o_instance.sendMsg=function(a,t){postMessage({msg:a,data:t,ref_id:dataObj.id})},o_instance.send=o_instance.sendMsg,o_instance._ref_id=dataObj.id,o_instance.init&&o_instance.init(),postMessage({cbid:msg.data.cbid,data:"Done"})}}}}}},_myTrait_._callObject=function(a,t,e,s){var r=_objRefs[a];return r&&this._callWorker(_threadPool[r.__wPool],a,t,e,s),this},_myTrait_._callWorker=function(a,t,e,s,r){_worker&&(_callBackHash[_idx]=r,this._isNodeJS()?a.send({cmd:"call",id:t,fn:e,cbid:_idx++,data:s}):("object"==typeof s&&(s=JSON.stringify(s)),a.postMessage({cmd:"call",id:t,fn:e,cbid:_idx++,data:s})))},_myTrait_._createProcess=function(a,t){try{if("undefined"==typeof a&&_worker)return _worker;var e=require("child_process"),s=e.fork(t);return _callBackHash||(_callBackHash={},_idx=1),_worker=s,s.on("message",function(a){if("object"!=typeof a)console.error("Unknown message from the worker ",a);else{if(a.cbid){var t=_callBackHash[a.cbid];t&&(delete _callBackHash[a.cbid],t(a.data))}if(a.ref_id){var e=_objRefs[a.ref_id];if(e){var s=(a.data,a.msg);if(e[s]){var r=_classDefs[e.__wClass];if(r&&r.methods[s])return void e[s].apply(e,a.data)}e.trigger&&e.trigger(a.msg,a.data)}}}}),"undefined"!=typeof a&&(_threadPool[a]=s),s}catch(r){return null}},_myTrait_._createWorker=function(a){try{if("undefined"==typeof a&&_worker)return _worker;var t="var o = "+this._serializeClass(this._baseWorker())+"\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ",e=new Blob([t],{type:"text/javascript"}),s=new Worker(window.URL.createObjectURL(e));return _callBackHash||(_callBackHash={},_idx=1),_worker=s,s.onmessage=function(a){if("object"!=typeof a.data)console.error("Unknown message from the worker ",a.data);else{if(a.data.cbid){var t=_callBackHash[a.data.cbid];delete _callBackHash[a.data.cbid],t(a.data.data)}if(a.data.ref_id){var e=_objRefs[a.data.ref_id];if(e){var s=(a.data.data,a.data.msg);if(console.log(a.data),e[s]){var r=_classDefs[e.__wClass];if(r&&r.methods[s])return void e[s].apply(e,a.data.data)}e.trigger&&e.trigger(a.data.msg,a.data.data)}}}},"undefined"!=typeof a&&(_threadPool[a]=s),s}catch(r){return null}},_myTrait_._createWorkerClass=function(a,t,e,s){var r=this.__promiseClass(),i=this;return _classDefs||(_classDefs={}),new r(function(n){var o,d;_classDefs[a]={methods:s};for(var _=i._serializeClass(t),c=0;_maxWorkerCnt>c;c++)!function(t){o?o=o.then(function(){return new r(function(r){i._callWorker(_threadPool[t],"/","createClass",{className:a,code:_,requires:e,localMethods:s},r)})}):d=o=new r(function(r){i._callWorker(_threadPool[t],"/","createClass",{className:a,code:_,requires:e,localMethods:s},r)})}(c);o.then(function(){n(!0)})})},_myTrait_._createWorkerObj=function(a,t,e){var s=this.__promiseClass(),r=this;return new s(function(s){var i=_roundRobin++%_maxWorkerCnt;e.__wPool=i,e.__wClass=a,r._callWorker(_threadPool[i],"/","createObject",{className:a,id:t},function(a){_objRefs[t]=e,s(a)})})},_myTrait_._isNodeJS=function(){return"undefined"==typeof _isNode&&(_isNode=new Function("try { return this == global; } catch(e) { return false; }")()),_isNode},_myTrait_._nodeChildProcess=function(){},_myTrait_._serializeClass=function(a){var t="{",e=0;for(var s in a)e++&&(t+=","),t+=s+" : "+a[s].toString();return t+="};"},_myTrait_._workersAvailable=function(){return _worker},_myTrait_.createClass=function(a){var t={},e=this,s={},r=[];if(this._workersAvailable()){var i=a.webWorkers||a.processWorkers;for(var n in i)i.hasOwnProperty(n)&&!function(a){t[a]=function(t,s){t||(t=null),e._callObject(this._id,a,t,s)}}(n);var o=a.methods;for(var n in o)o.hasOwnProperty(n)&&!function(a,e){s[e]=e,t[e]=a}(o[n],n)}else{console.log("** workers are not available **");var d=a.requires;for(var _ in d)if("js"==_){var c=d[_];c.forEach(function(a){r.push(e._appendToHead("js",a.url))})}var i=a.webWorkers;for(var n in i)i.hasOwnProperty(n)&&!function(a,e){t[e]=function(t,e){a.apply(this,[t,e])}}(i[n],n);var o=a.methods;for(var n in o)o.hasOwnProperty(n)&&(s[n]=n,function(a){t[n]=function(t,e){a.apply(this,[t,e])}}(o[n],n))}t.on=function(a,t){this.__evt||(this.__evt={}),this.__evt[a]||(this.__evt[a]=[]),this.__evt[a].push(t)},t.trigger=function(a,t){if(this.__evt&&this.__evt[a]){var e=this;this.__evt[a].forEach(function(a){a.apply(e,[t])})}},s.trigger="trigger";var l=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15),e=this,f=this.__promiseClass();if(this._workersAvailable()){var u=this._createWorkerClass(l,a.webWorkers||a.processWorkers,a.requires,s),m=function(a){a||(a=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15)),this._id=a;var t=this;return new f(function(s){u.then(function(){e._createWorkerObj(l,a,t).then(function(){t.trigger("ready"),s(t)})})})};m.prototype=t}else{var m=function(a){a||(a=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15)),this._id=a;var t=this;return new f(function(a){if(0==r.length)return void a(t);for(var e,s=r.pop();e=r.pop();)s=s.then(function(){return e});s.then(function(){a(t)})})};m.prototype=t}return m},_myTrait_.__traitInit&&!_myTrait_.hasOwnProperty("__traitInit")&&(_myTrait_.__traitInit=_myTrait_.__traitInit.slice()),_myTrait_.__traitInit||(_myTrait_.__traitInit=[]),_myTrait_.__traitInit.push(function(a){if(!_initDone){if(a||(a={}),_initDone=!0,_maxWorkerCnt=a.processCnt||4,_roundRobin=0,_threadPool=[],_objRefs={},_processPool=[],a.isChild)return;if(this._isNodeJS())for(var t=0;_maxWorkerCnt>t;t++)this._createProcess(t,a.forkFile);else for(var t=0;_maxWorkerCnt>t;t++)this._createWorker(t)}})}(this)},Marx=function(a,t,e,s,r,i,n,o){var d,_=this;if(!(_ instanceof Marx))return new Marx(a,t,e,s,r,i,n,o);var c=[a,t,e,s,r,i,n,o];if(_.__factoryClass)if(_.__factoryClass.forEach(function(a){d=a.apply(_,c)}),"function"==typeof d){if(d._classInfo.name!=Marx._classInfo.name)return new d(a,t,e,s,r,i,n,o)}else if(d)return d;_.__traitInit?_.__traitInit.forEach(function(a){a.apply(_,c)}):"function"==typeof _.init&&_.init.apply(_,c)};Marx._classInfo={name:"Marx"},Marx.prototype=new Marx_prototype,function(){"undefined"!=typeof define&&null!==define&&null!=define.amd?(__amdDefs__.Marx=Marx,this.Marx=Marx):"undefined"!=typeof module&&null!==module&&null!=module.exports?module.exports.Marx=Marx:this.Marx=Marx}.call(new Function("return this")()),"undefined"!=typeof define&&null!==define&&null!=define.amd&&define(__amdDefs__)}).call(new Function("return this")());