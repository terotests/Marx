(function(){var __amdDefs__={},Marx_prototype=function(){!function(_myTrait_){var _callBackHash,_idx,_worker,_initDone,_objRefs,_threadPool,_maxWorkerCnt,_roundRobin,_objPool,_promiseClass,_classDefs;_myTrait_.__promiseClass=function(a){return a&&(_promiseClass=a),_promiseClass||(_promiseClass=Promise),_promiseClass},_myTrait_._baseWorker=function(t){return{init:function(){this._initDone||(this._initDone=!0,this._classes={},this._instances={})},start:function(msg){if(this.init(),"call"!=msg.data.cmd||"/"!=msg.data.id){if("call"==msg.data.cmd&&msg.data.id){var ob=this._instances[msg.data.id];ob&&ob[msg.data.fn]&&ob[msg.data.fn].apply(ob,[msg.data.data,function(a){postMessage({cbid:msg.data.cbid,data:a})}])}}else{if("createClass"==msg.data.fn){var newClass,dataObj=JSON.parse(msg.data.data);eval("newClass = "+dataObj.code),this._classes[dataObj.className]=newClass,postMessage({cbid:msg.data.cbid,data:"Done"})}if("createObject"==msg.data.fn&&msg.data.data){var dataObj=JSON.parse(msg.data.data),newClass=this._classes[dataObj.className];if(newClass){var o_instance=Object.create(newClass);this._instances[dataObj.id]=o_instance,o_instance.sendMsg=function(a,t){postMessage({msg:a,data:t,ref_id:dataObj.id})},o_instance.trigger=o_instance.send=o_instance.sendMsg,o_instance._ref_id=dataObj.id,o_instance.init&&o_instance.init(),postMessage({cbid:msg.data.cbid,data:"Done"})}}}}}},_myTrait_._callObject=function(a,t,e,r){var n=_objRefs[a];return n&&this._callWorker(_threadPool[n.__wPool],a,t,e,r),this},_myTrait_._callWorker=function(a,t,e,r,n){_worker&&(_callBackHash[_idx]=n,"object"==typeof r&&(r=JSON.stringify(r)),a.postMessage({cmd:"call",id:t,fn:e,cbid:_idx++,data:r}))},_myTrait_._createWorker=function(a){try{if("undefined"==typeof a&&_worker)return _worker;var t="var o = "+this._serializeClass(this._baseWorker())+"\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ",e=new Blob([t],{type:"text/javascript"}),r=new Worker(window.URL.createObjectURL(e));return _callBackHash||(_callBackHash={},_idx=1),_worker=r,r.onmessage=function(a){if("object"!=typeof a.data)console.error("Unknown message from the worker ",a.data);else{if(a.data.cbid){var t=_callBackHash[a.data.cbid];delete _callBackHash[a.data.cbid],t(a.data.data)}if(a.data.ref_id){var e=_objRefs[a.data.ref_id];if(e){{a.data.data}e.trigger&&e.trigger(a.data.msg,a.data.data)}}}},"undefined"!=typeof a&&(_threadPool[a]=r),r}catch(n){return null}},_myTrait_._createWorkerClass=function(a,t){var e=this.__promiseClass(),r=this;return _classDefs||(_classDefs={}),new e(function(n){var i,s;_classDefs[a]=t;for(var o=r._serializeClass(t),_=0;_maxWorkerCnt>_;_++)!function(t){i?i=i.then(function(){return new e(function(e){r._callWorker(_threadPool[t],"/","createClass",{className:a,code:o},e)})}):s=i=new e(function(e){r._callWorker(_threadPool[t],"/","createClass",{className:a,code:o},e)})}(_);i.then(function(){n(!0)})})},_myTrait_._createWorkerObj=function(a,t,e){var r=this.__promiseClass(),n=this;return new r(function(r){var i=_roundRobin++%_maxWorkerCnt;e.__wPool=i,e.__wClass=a,n._callWorker(_threadPool[i],"/","createObject",{className:a,id:t},function(a){_objRefs[t]=e,r(a)})})},_myTrait_._serializeClass=function(a){var t="{",e=0;for(var r in a)e++&&(t+=","),t+=r+" : "+a[r].toString();return t+="};"},_myTrait_._workersAvailable=function(){return _worker},_myTrait_.createClass=function(a){var t={},e=this;for(var r in a)a.hasOwnProperty(r)&&(t[r]=function(a,t){a||(a=null),alert("About the call "+r+" "+this._id),e._callObject(this._id,r,a,t)});t.on=function(a,t){this.__evt||(this.__evt={}),this.__evt[a]||(this.__evt[a]=[]),this.__evt[a].push(t)},t.trigger=function(a,t){if(this.__evt&&this.__evt[a]){var e=this;this.__evt[a].forEach(function(a){a.apply(e,[t])})}};var n=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);this._createWorkerClass(n,a);var e=this,i=function(a){alert("Worker class created"),a||(a=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15)),this._id=a,e._createWorkerObj(n,a,this)};return i.prototype=t,i},_myTrait_.__traitInit&&!_myTrait_.hasOwnProperty("__traitInit")&&(_myTrait_.__traitInit=_myTrait_.__traitInit.slice()),_myTrait_.__traitInit||(_myTrait_.__traitInit=[]),_myTrait_.__traitInit.push(function(){if(!_initDone){_initDone=!0,_maxWorkerCnt=4,_roundRobin=0,_threadPool=[],_objRefs={};for(var a=0;_maxWorkerCnt>a;a++)this._createWorker(a)}})}(this)},Marx=function(a,t,e,r,n,i,s,o){var _,c=this;if(!(c instanceof Marx))return new Marx(a,t,e,r,n,i,s,o);var l=[a,t,e,r,n,i,s,o];if(c.__factoryClass)if(c.__factoryClass.forEach(function(a){_=a.apply(c,l)}),"function"==typeof _){if(_._classInfo.name!=Marx._classInfo.name)return new _(a,t,e,r,n,i,s,o)}else if(_)return _;c.__traitInit?c.__traitInit.forEach(function(a){a.apply(c,l)}):"function"==typeof c.init&&c.init.apply(c,l)};Marx._classInfo={name:"Marx"},Marx.prototype=new Marx_prototype,function(){"undefined"!=typeof define&&null!==define&&null!=define.amd?(__amdDefs__.Marx=Marx,this.Marx=Marx):"undefined"!=typeof module&&null!==module&&null!=module.exports?module.exports.Marx=Marx:this.Marx=Marx}.call(new Function("return this")()),"undefined"!=typeof define&&null!==define&&null!=define.amd&&define(__amdDefs__)}).call(new Function("return this")());