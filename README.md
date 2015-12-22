# Marx - the worker class

Using the Marx is as follows:

```javascript
var marx = Marx();
var myClass = marx.createClass({
    webWorkers : {
        // web worker function
        hello : function(data, cb) {
            cb("Hello "+data);
        }
    }
})
(new myClass()).then( function(obj) {
    // call function inside the web worker
    obj.hello("Hello Web Worker!", function(result) {
        // do something with result
        console.log(result);
    });;
});
````

A bit more complex example with support for local functions

```javascript
var marx = Marx();
var myClass = marx.createClass({
    requires : {
        js : [
            {
                url : "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"
            }
        ]  
    },
    webWorkers : {
        // web worker function
        hello : function(data, cb) {
            if(typeof(_) != "undefined") {
                data+=" we had lodash";
            }
            cb("hello "+data);
        }
    },
    // defines the methods of the UI thread or local functions
    methods : {
        localFn : function(data) {
            // the web worker can also call this with
            // this.localFn( data );
        }   
    }
})

(new myClass()).then( function(obj) {
    // call function inside the web worker
    obj.hello("Hello Web Worker!", function(result) {
        // do something with result
        console.log(result);
    });;
});
```

Listening to the events from web worker

```javascript
    obj.on("message", function(data) {
    ));
```

Codepen:
http://codepen.io/teroktolonen/pen/ojPGww?editors=001


## node.js

Bootstrap for the base script, in the example "mp.js"
```javascript
var m = require("./marx-0.10.js").Marx({ isChild : true });
m.__promiseClass( require("bluebird") );
m._baseProcess();
```

Usage:

```javascript
var Marx = require("./marx-0.10.js").Marx;

var m = new Marx({
    forkFile : "./mp.js",
    processCnt : 4
});

m.__promiseClass( require("bluebird") );

var myPooler = m.createClass({
    requires : {
       js : [
         {
             name : "babel-core", assignTo : "babel"
         }
       ]
    },
    processWorkers : {
        init : function() {
           console.log("Process worker init called");
           this._name = "Babel compiler ";

        },
        compile : function(theCode) {
           // uses some module to compile code in background
           console.log(theCode);
           var res = babel.transform(theCode);
           this.readTheCode( res.code );
        }
    },
    methods : {
        readTheCode : function(msg) {
            // back in the main process
            console.log("The code "+msg);
        }
    }
});

(new myPooler()).then( function(obj) {
    obj.compile("o => 3");
});

```

## Extending the class

Function `marxClass.extendClass` returns a promise which resolves when the class has been update. NOTE: existing objects are not effected.

```javascript
marxClass.extendClass({
    requires : {
      js : [
        { url : "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js"}
      ]
    },  
    webWorkers : {
      get_ast : function() {
          if(this._ast) {
              this.trigger("ast", this._ast);
              this.trigger("lod", _.indexOf([1, 2, 1, 2], 2));
          }
      }
    },
    methods : {
      ok : function() {
        alert("Extend ok")
      }
    }
}).then(
  function() {
  // ...
  });
  
```




















   

 


   
#### Class Marx


- [__promiseClass](README.md#Marx___promiseClass)
- [_appendToHead](README.md#Marx__appendToHead)
- [_baseProcess](README.md#Marx__baseProcess)
- [_baseWorker](README.md#Marx__baseWorker)
- [_callObject](README.md#Marx__callObject)
- [_callWorker](README.md#Marx__callWorker)
- [_collectMemoryUsage](README.md#Marx__collectMemoryUsage)
- [_createProcess](README.md#Marx__createProcess)
- [_createWorker](README.md#Marx__createWorker)
- [_createWorkerClass](README.md#Marx__createWorkerClass)
- [_createWorkerObj](README.md#Marx__createWorkerObj)
- [_isNodeJS](README.md#Marx__isNodeJS)
- [_metrics](README.md#Marx__metrics)
- [_nodeChildProcess](README.md#Marx__nodeChildProcess)
- [_serializeClass](README.md#Marx__serializeClass)
- [_workersAvailable](README.md#Marx__workersAvailable)
- [createClass](README.md#Marx_createClass)



   
    
    


   
      
            
#### Class _promise


- [all](README.md#_promise_all)
- [collect](README.md#_promise_collect)
- [fail](README.md#_promise_fail)
- [fulfill](README.md#_promise_fulfill)
- [genPlugin](README.md#_promise_genPlugin)
- [isFulfilled](README.md#_promise_isFulfilled)
- [isPending](README.md#_promise_isPending)
- [isRejected](README.md#_promise_isRejected)
- [nodeStyle](README.md#_promise_nodeStyle)
- [onStateChange](README.md#_promise_onStateChange)
- [plugin](README.md#_promise_plugin)
- [props](README.md#_promise_props)
- [reject](README.md#_promise_reject)
- [rejectReason](README.md#_promise_rejectReason)
- [resolve](README.md#_promise_resolve)
- [state](README.md#_promise_state)
- [then](README.md#_promise_then)
- [triggerStateChange](README.md#_promise_triggerStateChange)
- [value](README.md#_promise_value)



   
    
##### trait util_fns

- [isArray](README.md#util_fns_isArray)
- [isFunction](README.md#util_fns_isFunction)
- [isObject](README.md#util_fns_isObject)


    
    
    
    


   
      
    
      
            
#### Class later


- [_easeFns](README.md#later__easeFns)
- [add](README.md#later_add)
- [addEasingFn](README.md#later_addEasingFn)
- [after](README.md#later_after)
- [asap](README.md#later_asap)
- [ease](README.md#later_ease)
- [every](README.md#later_every)
- [once](README.md#later_once)
- [onFrame](README.md#later_onFrame)
- [removeFrameFn](README.md#later_removeFrameFn)



   


   



      
    



      
    





   
# Class Marx


The class has following internal singleton variables:
        
* _callBackHash
        
* _idx
        
* _worker
        
* _initDone
        
* _objRefs
        
* _threadPool
        
* _maxWorkerCnt
        
* _roundRobin
        
* _objPool
        
* _promiseClass
        
* _classDefs
        
* _loadedLibs
        
* _isNode
        
* _processPool
        
        
### <a name="Marx___promiseClass"></a>Marx::__promiseClass(useClass)
`useClass` The Promise implementation to use
 


*The source code for the function*:
```javascript

if(useClass) _promiseClass = useClass;

if(!_promiseClass) {

    if(typeof(Promise) != "undefined") {
        _promiseClass = Promise;
    }    

    if(typeof(_promise) != "undefined") {
        _promiseClass = _promise;
    }        
    
    if(!_promiseClass && this._isNodeJS()) {
        throw new Error('Promise is not defined');
    }
}

return _promiseClass;
```

### <a name="Marx__appendToHead"></a>Marx::_appendToHead(elemType, url)


*The source code for the function*:
```javascript

if(!url) {
    url = elemType;
    var parts = url.split(".");
    elemType = parts.pop(); // for example file.css -> css
}
var p = this.__promiseClass();
if(p) {
    if(!_loadedLibs) {
        _loadedLibs = {};
    }
    // if loading, return the promise
    if(_loadedLibs[url]) {
        return _loadedLibs[url];
    }
    _loadedLibs[url] = new p(
        function(accept, fail) {

            var ext;
            if(elemType == "js") {
                ext = document.createElement("script");
                ext.src = url;
            }
            if(elemType == "css") {
                ext = document.createElement("link");
                ext.setAttribute("rel", "stylesheet");
                ext.setAttribute("type", "text/css");
                ext.setAttribute("href", url);        
                 
            }
            if(!ext) {
                fail("Unknown element type "+url);
                return;
            }
            ext.onload = function () {
                accept(url);
            }
            ext.onerror = function() {
                fail(url);
            }     
            document.head.appendChild(ext);

        });
    return _loadedLibs[url];
}

```

### <a name="Marx__baseProcess"></a>Marx::_baseProcess(t)


*The source code for the function*:
```javascript

// emulate the web worker call



// just create s normal JS class
function baseProcess() {

  // constructor phase, classical JS style    
  this._initDone = true;
  this._classes = {};
  this._instances = {};
  this._imports = {};
  this._messageCnt =0;
  this._execptionCnt=0;

  var postMessage = function(msg) {
      process.send(msg);
  }
  
  this.onMsg = function(pData) {

    var msg = { data : pData };
    try {
        this._messageCnt++;
    if (msg.data.cmd == "call" && msg.data.id == "/") {
      
      // TODO: finalize this
      if( msg.data.fn == "heapUsage") {
        var usage = {};
        if(process && process.memoryUsage) {
            var o = process.memoryUsage();
            usage = {
                rss : o.rss,
                heapTotal : o.heapTotal,
                heapUsed : o.heapUsed,
                heapUsage : parseInt( 100* o.heapUsed / o.heapTotal),
                fromTotalGb : parseFloat( 100* o.heapTotal / (1024*1024*1024) ).toFixed(2)
            };
        }
        postMessage({
          cbid: msg.data.cbid,
          data : usage
        });         
      }   
      if( msg.data.fn == "listClasses") {

        postMessage({
          cbid: msg.data.cbid,
          data : {
              list : Object.keys(this._classes)
          }
        });         
      }       
      if( msg.data.fn == "classMetrics") {
        var usage = {};
        
        usage.requireCnt    = Object.keys(this._imports).length;
        usage.instanceCnt = Object.keys(this._instances).length;
        usage.classCnt    = Object.keys(this._classes).length;
        usage.messageCnt = this._messageCnt;
        usage.errors = this._execptionCnt;
        
        postMessage({
          cbid: msg.data.cbid,
          data : usage
        });         
      }        
      if (msg.data.fn == "createClass") {
          
        // creating a new class at the node.js 
        var newClass;
        var dataObj =  msg.data.data; // -- no more JSON parse here
        eval("newClass = " + dataObj.code);
        
          if(dataObj.localMethods) {
              var methods = dataObj.localMethods;
              for(var n in methods) {
                  if(methods.hasOwnProperty(n)) {
                      (function(n) {
                          newClass[n] = function(data) {

                              var len = arguments.length,
                                  args = new Array(len);
                              for(var i=0; i<len; i++) args[i] = arguments[i];
                              postMessage({
                                msg : n,
                                data : args,
                                ref_id : this._ref_id
                              });                           
                          }
                      })(n);
                  }
              }
          }        
        this._classes[dataObj.className] = newClass;
        
        try {
            // -- import the scripts
            if(dataObj.requires && dataObj.requires.js) {
                var list = dataObj.requires.js;
                for(var i=0; i<list.length;i++) {
                    var mod = list[i];
                    // TODO: loading external resources might be done differently
                    if(mod.name) {
                        if(mod.assignTo && mod.varName) {
                            global[mod.assignTo] = require( mod.name )[mod.varName];
                        } else {
                            if(mod.assignTo) {
                                global[mod.assignTo] = require( mod.name );
                            }                 
                        }
                    }
                }
            }
        } catch(e) {
            this._execptionCnt++;
        }
        
        postMessage({
          cbid: msg.data.cbid,
          data : "Done"
        });        
      }
      if (msg.data.fn== "createObject" && msg.data.data ) {

        var dataObj =  msg.data.data ;
        var newClass = this._classes[dataObj.className];
        if (newClass) {
          var o_instance = Object.create(newClass);
          this._instances[dataObj.id] = o_instance;
          
          o_instance.sendMsg = function(msg, data, cb) {
              postMessage({
                msg : msg,
                data : data,
                ref_id : dataObj.id
              });             
          }
          o_instance.send = o_instance.sendMsg;
          o_instance._ref_id = dataObj.id;
          // call constructor, if any
          if(o_instance.init) o_instance.init();
          postMessage({
            cbid: msg.data.cbid,
            data : "Done"
          });
        }
      }
      return;
    }
    if (msg.data.cmd == "call" && msg.data.id) {
      var ob = this._instances[msg.data.id];
      if (ob) {
        if(msg.data.fn == "terminate") {
            console.log("=== Marx TERMINATE Called ===");
            if( ob["terminate"] ) ob["terminate"]();
            delete this._instances[msg.data.id]; 
            return;
        }           
        if (ob[msg.data.fn]) {
          ob[msg.data.fn].apply(ob, [msg.data.data, function(msgData) {
            postMessage({
              cbid: msg.data.cbid,
              data : msgData
            });
          }]);
        }
      } else {
         // TODO: error handling postMessage("no instance found");
      }
    }
    } catch(e) {
        console.log("error "+e.message);
        this._execptionCnt++;
    }
  }
}

var base = new baseProcess();
process.on('message', function(msg) {
      base.onMsg(msg);
  });
```

### <a name="Marx__baseWorker"></a>Marx::_baseWorker(t)

The bootstrap for the worker to receive and delegate commands. This is the code running at the worker -side of the pool.
*The source code for the function*:
```javascript
return {
  init: function() {
    if (this._initDone) return;
    this._initDone = true;
    this._classes = {};
    this._instances = {};
    this._imports = {};
  },
  start: function(msg) {
    this.init();
    // Root object call

    if (msg.data.cmd == "call" && msg.data.id == "/") {
      if (msg.data.fn == "extendClass") {
        var newClass;
        var dataObj = msg.data.data;
        eval("newClass = " + dataObj.code);
        
          if(dataObj.localMethods) {
              var methods = dataObj.localMethods;
              for(var n in methods) {
                  if(methods.hasOwnProperty(n)) {
                      (function(n) {
                          newClass[n] = function(data) {

                              var len = arguments.length,
                                  args = new Array(len);
                              for(var i=0; i<len; i++) args[i] = arguments[i];
                              postMessage({
                                msg : n,
                                data : args,
                                ref_id : this._ref_id
                              });                           
                          }
                      })(n);
                  }
              }
          }        
        for(var nnn in newClass) {
            if(newClass.hasOwnProperty(nnn)) {
                this._classes[dataObj.className][nnn] = newClass[nnn];
            }
        }

        try {
            // -- import the scripts
            if(dataObj.requires && dataObj.requires.js) {
                var list = dataObj.requires.js;
                for(var i=0; i<list.length;i++) {
                    var url = list[i].url;
                    if(this._imports[url]) continue;
                    importScripts(url);
                    this._imports[url] = true;
                }
            }
        } catch(e) {
            
        }
        
        postMessage({
          cbid: msg.data.cbid,
          data : "Done"
        });        
      }    

      if (msg.data.fn == "createClass") {
        var newClass;
        var dataObj = msg.data.data;
        eval("newClass = " + dataObj.code);
        
          if(dataObj.localMethods) {
              var methods = dataObj.localMethods;
              for(var n in methods) {
                  if(methods.hasOwnProperty(n)) {
                      (function(n) {
                          newClass[n] = function(data) {

                              var len = arguments.length,
                                  args = new Array(len);
                              for(var i=0; i<len; i++) args[i] = arguments[i];
                              postMessage({
                                msg : n,
                                data : args,
                                ref_id : this._ref_id
                              });                           
                          }
                      })(n);
                  }
              }
          }        
        this._classes[dataObj.className] = newClass;
        
        try {
            // -- import the scripts
            if(dataObj.requires && dataObj.requires.js) {
                var list = dataObj.requires.js;
                for(var i=0; i<list.length;i++) {
                    var url = list[i].url;
                    if(this._imports[url]) continue;
                    importScripts(url);
                    this._imports[url] = true;
                }
            }
        } catch(e) {
            
        }
        
        postMessage({
          cbid: msg.data.cbid,
          data : "Done"
        });        
      }
      if (msg.data.fn== "createObject" && msg.data.data ) {
        var dataObj = msg.data.data;
        var newClass = this._classes[dataObj.className];
        if (newClass) {
          var o_instance = Object.create(newClass);
          this._instances[dataObj.id] = o_instance;
          
          o_instance.sendMsg = function(msg, data, cb) {
              postMessage({
                msg : msg,
                data : data,
                ref_id : dataObj.id
              });             
          }
          o_instance.send = o_instance.sendMsg;
          o_instance._ref_id = dataObj.id;
          // call constructor, if any
          if(o_instance.init) o_instance.init();
          postMessage({
            cbid: msg.data.cbid,
            data : "Done"
          });
        }
      }
      return;
    }
    if (msg.data.cmd == "call" && msg.data.id) {
      var ob = this._instances[msg.data.id];
      if (ob) {
        if(msg.data.fn == "terminate") {
            if( ob["terminate"] ) ob["terminate"]();
            delete this._instances[msg.data.id]; 
            return;
        }  
        if (ob[msg.data.fn]) {
          ob[msg.data.fn].apply(ob, [msg.data.data, function(msgData) {
            postMessage({
              cbid: msg.data.cbid,
              data : msgData
            });
          }]);
        }
      } else {
         // TODO: error handling postMessage("no instance found");
      }
    }
  }
}
```

### <a name="Marx__callObject"></a>Marx::_callObject(id, fnName, data, callback)
`id` Object ID to call
 
`fnName` Name of function
 
`data` Data as string
 
`callback` Callback when done
 


*The source code for the function*:
```javascript
var o = _objRefs[id];
if(o) {
    this._callWorker(_threadPool[o.__wPool], id, fnName, data, callback );
}
return this;

```

### <a name="Marx__callWorker"></a>Marx::_callWorker(worker, objectID, functionName, dataToSend, callBack)
`worker` Web Worker to call
 
`objectID` ID of function or / to call the root
 
`functionName` Name of the function to call 
 
`dataToSend` Data, converted to string if object
 
`callBack` callback
 


*The source code for the function*:
```javascript
if(!_worker) return;

_callBackHash[_idx] = callBack;

if(this._isNodeJS()) {
    worker.send({
      cmd: "call",
      id: objectID,
      fn: functionName,
      cbid: _idx++,
      data: dataToSend
    });    
} else {
    // might remove this form client side too...
    // if(typeof(dataToSend) == "object") dataToSend = JSON.stringify(dataToSend);
    worker.postMessage({
      cmd: "call",
      id: objectID,
      fn: functionName,
      cbid: _idx++,
      data: dataToSend
    });
}

```

### <a name="Marx__collectMemoryUsage"></a>Marx::_collectMemoryUsage(name, callBack)
`name` Metrics to collect, &quot;heapUsage&quot;
 
`callBack` Callback after data has been collected
 


*The source code for the function*:
```javascript

var tot_cnt=0;
for(var i in _threadPool) tot_cnt++;

var results = [],
    me = this;
    
// TODO: implement this for proprieatry browser interfaces if available
// window.performance.memory

for(var i in _threadPool) {
    (function(i) {
        me._callWorker(_threadPool[i], "/", name, {}, function(res) {
            res.name = "Worker Process "+i;
            tot_cnt--;
            results.push(res);
            
            if(tot_cnt==0) callBack( results );
        });
    })(i);
}
return this;
```

### <a name="Marx__createProcess"></a>Marx::_createProcess(index, forkFile)
`index` The Child process index
 
`forkFile` The name of the file to fork
 


*The source code for the function*:
```javascript

try {
    
    // currently only one worker in the system...
    if(typeof(index) == "undefined") {
        if(_worker) return _worker;
    }
    
    
    var cp = require('child_process');
    var ww = cp.fork(forkFile);
    
    if(!_callBackHash) {
        _callBackHash = {};
        _idx = 1;
    }
    _worker = ww;
    
    ww.on("message", function(oEvent) {
        if (typeof(oEvent) == "object") {
          if(oEvent.cbid) {
              var cb = _callBackHash[oEvent.cbid];
              if(cb) {
                  delete _callBackHash[oEvent.cbid];
                  cb( oEvent.data );
              }
          }
          if(oEvent.ref_id) {
              var oo = _objRefs[oEvent.ref_id];
              
              if(oo) {
                  var dd = oEvent.data,
                      msg = oEvent.msg;

                  if(oo[msg]) {
                      var cDef = _classDefs[oo.__wClass];
                      if(cDef && cDef.methods[msg]) {
                          oo[msg].apply(oo, oEvent.data);
                          return;
                      }
                  }
                  // trigger message if directed abstract msg to some object
                  if(oo.trigger) {
                      // call event handler with .on(oEvent.data.msg, ...)
                      oo.trigger(oEvent.msg, oEvent.data);
                  } 
              }
          }          
          return;
        }
        // unknown message
        console.error("Unknown message from the worker ", oEvent);
    });    
    if(typeof(index) != "undefined") {
        _threadPool[index] = ww;
    }    
    return ww;
} catch(e) {
    return null;
}
```

### <a name="Marx__createWorker"></a>Marx::_createWorker(index)
`index` Thread index
 


*The source code for the function*:
```javascript
try {
    
    // currently only one worker in the system...
    if(typeof(index) == "undefined") {
        if(_worker) return _worker;
    }
    
    var theCode = "var o = " + this._serializeClass(this._baseWorker()) +
      "\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ";
    var blob = new Blob([theCode], {
      type: "text/javascript"
    });
    var ww = new Worker(window.URL.createObjectURL(blob));
    if(!_callBackHash) {
        _callBackHash = {};
        _idx = 1;
    }
    _worker = ww;
    ww.onmessage = function(oEvent) {
        if (typeof(oEvent.data) == "object") {
          if(oEvent.data.cbid) {
              var cb = _callBackHash[oEvent.data.cbid];
              delete _callBackHash[oEvent.data.cbid];
              cb( oEvent.data.data );
          }
          if(oEvent.data.ref_id) {
              var oo = _objRefs[oEvent.data.ref_id];
              if(oo) {
                  var dd = oEvent.data.data,
                      msg = oEvent.data.msg;
                  if(oo[msg]) {
                      var cDef = _classDefs[oo.__wClass];
                      if(cDef && cDef.methods[msg]) {
                          oo[msg].apply(oo, oEvent.data.data);
                          return;
                      }
                  }
                  // trigger message if directed abstract msg to some object
                  if(oo.trigger) {
                      // call event handler with .on(oEvent.data.msg, ...)
                      oo.trigger(oEvent.data.msg, oEvent.data.data);
                  } 
              }
          }          
          return;
        }
        // unknown message
        console.error("Unknown message from the worker ", oEvent.data);
    };    
    if(typeof(index) != "undefined") {
        _threadPool[index] = ww;
    }    
    return ww;
} catch(e) {
    return null;
}
```

### <a name="Marx__createWorkerClass"></a>Marx::_createWorkerClass(className, classObj, requires, localMethods, bExtend)


*The source code for the function*:
```javascript
var p = this.__promiseClass(), me = this;

if(!_classDefs) _classDefs = {};

var remote_fn = "createClass";
if(bExtend) {
    remote_fn = "extendClass";
}

return new p(
    function(success) {
        var prom, first;
        if(bExtend) {
            for(var lName in localMethods) {
                if(localMethods.hasOwnProperty(lName)) {
                    _classDefs[className].methods[lName] = localMethods[lName];
                }
            }
        } else {
            _classDefs[className] = {
                methods : localMethods
            };
        }
        var codeStr = me._serializeClass(classObj);
        for(var i=0; i<_maxWorkerCnt; i++) {
            ( function(i) {
            if(!prom) {
                first = prom = new p(function(done) {
                    me._callWorker(_threadPool[i], "/", remote_fn,  {
                        className: className,
                        code: codeStr,
                        requires : requires,
                        localMethods : localMethods
                    }, done );
                });
            } else {
                prom = prom.then( function() {
                    return new p(function(done) {
                        me._callWorker(_threadPool[i], "/", remote_fn,  {
                            className: className,
                            code: codeStr,
                            requires : requires,
                            localMethods : localMethods
                        }, done );
                    })
                })
            }
            })(i);
        }
        prom.then( function() {
            success(true);
        })

});
```

### <a name="Marx__createWorkerObj"></a>Marx::_createWorkerObj(className, id, refObj)
`className` Class of the Object
 
`id` Object ID
 
`refObj` The reference object, this object will be set __wPool index so that each call for this object will be directed to the correct worker pool
 


*The source code for the function*:
```javascript
var p = this.__promiseClass(), me = this;
return new p(
    function(success) {
        
        var pool_index = (_roundRobin++) % _maxWorkerCnt;
        
        // set the pool and class
        refObj.__wPool = pool_index;
        refObj.__wClass = className;
        
        _objRefs[id] = refObj;
        
        me._callWorker(_threadPool[pool_index], "/", "createObject",  {
            className: className,
            id: id
        }, function( result ) {
            
            success( result ); 
        });
});

```

### <a name="Marx__isNodeJS"></a>Marx::_isNodeJS(t)


*The source code for the function*:
```javascript
if(typeof(_isNode)=="undefined") {
    _isNode =  (new Function("try { return this == global; } catch(e) { return false; }"))();
}
return _isNode;
```

### <a name="Marx__metrics"></a>Marx::_metrics(name, callBackFn)
`name` Metrics to collect
 
`callBackFn` Function to call when done
 


*The source code for the function*:
```javascript
return this._collectMemoryUsage(name, callBackFn);
```

### <a name="Marx__nodeChildProcess"></a>Marx::_nodeChildProcess(t)

The code which is run under the node.js child process. This code is listening messages from the master process, creates the classes and objects.
*The source code for the function*:
```javascript

```

### <a name="Marx__serializeClass"></a>Marx::_serializeClass(o)
`o` The Object with functions as properties
 


*The source code for the function*:
```javascript
var res = "{";
var i = 0;
for (var n in o) {
    if (i++) res += ",";
    res += n + " : " + (o[n].toString());
}
res += "};";
return res;

```

### <a name="Marx__workersAvailable"></a>Marx::_workersAvailable(t)


*The source code for the function*:
```javascript
return _worker;
```

### <a name="Marx_createClass"></a>Marx::createClass(classDef)
`classDef` The object to implement
 

Creates the class to be used as worker. Functions `on` and `trigger` are reserved for listening messages from the workers.
*The source code for the function*:
```javascript
var oProto = {},
    me = this,
    localMethods = {},
    localPromises = [];
    

// if there are no workers available, emulate calls locally
if(!this._workersAvailable()) {
    
    console.log("** workers are not available **");
    
     // files to load for the JS files to execute...
    var requires = classDef.requires;
        
    for(var fileType in requires) {
        if(fileType=="js") {
            var list = requires[fileType];
            list.forEach( function(file) {
                //  append the JS files to the head...
                localPromises.push( me._appendToHead( "js", file.url ) );
            });
        }
    }
    // the worker functions will be acting locally
    var workers = classDef.webWorkers;
    for(var n in workers) {
        if(workers.hasOwnProperty(n)) {
            (function(fn,n) {
                oProto[n] = function(data, cb) {
                    fn.apply(this, [data, cb]);
                }
            })(workers[n],n);
        }
    }    
    var cDef = classDef.methods;
    for(var n in cDef) {
        if(cDef.hasOwnProperty(n)) {
            localMethods[n] = n;
            (function(fn, n) {
                oProto[n] = function(data, cb) {
                    fn.apply(this, [data, cb]);
                }
            })(cDef[n],n);
        }
    }    
    
    
} else {   

    // just accept the workers only...
    var workers = classDef.webWorkers || classDef.processWorkers;
    for(var n in workers) {
        if(workers.hasOwnProperty(n)) {
            (function(n) {
                oProto[n] = function(data, cb) {
                    if(!data) data = null;
                    me._callObject( this._id, n, data, cb );
                }
            })(n);
        }
    }

    var cDef = classDef.methods;
    for(var n in cDef) {
        if(cDef.hasOwnProperty(n)) {
            
            (function(fn,n) {
                localMethods[n] = n;
                oProto[n] = fn;
            })(cDef[n],n);
        }
    }    
}

var imports = [];

oProto.on = function(msg, fn) {
    if(!this.__evt) this.__evt = {};
    if(!this.__evt[msg]) this.__evt[msg] = [];
    this.__evt[msg].push(fn);
}
oProto.trigger = function(msg, data) {
    if(!this.__evt) return;
    if(!this.__evt[msg]) return;
    var me = this;
    this.__evt[msg].forEach( function(fn) {
        fn.apply(me, [data]);
    })
}

// create a worker object class
var class_id =  Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);  



localMethods["trigger"] = "trigger";


            

var me = this,
    p = this.__promiseClass();

if(this._workersAvailable()) {
    // the create class promise, if workers are available
    var cProm = this._createWorkerClass( class_id, classDef.webWorkers || classDef.processWorkers, classDef.requires, localMethods );
    var c = function(id) {
    
        if(!id) {
            id =  Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15);        
        }
        this._id = id;
        var obj = this;
        
        return new p(
            function(resolve) {
                cProm.then( 
                    function() {
                        me._createWorkerObj( class_id, id, obj ).then(function() {
                            obj.trigger("ready");
                            resolve(obj);
                        })
                    });
            });
    };
    c.prototype = oProto;
} else {
    
    var c = function(id) {
        if(!id) {
            id =  Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15);        
        }
        this._id = id;
        var obj = this;
        
        return new p(function(resolve) {
            if(localPromises.length==0) {
                resolve(obj);
                return;
            }
            var start = localPromises.pop();
            var next;
            while(next = localPromises.pop()) {
                start = start.then( function() {
                    return next;
                })
            }
            start.then( function() {
                resolve(obj);
            })

        })
    };
    c.prototype = oProto;    
}

// Static method to extend the class befor the show begins
// NOTE: currently available only for web workers...
c.extendClass = function(classDef) {

    var workers = classDef.webWorkers || classDef.processWorkers;
    for(var n in workers) {
        if(workers.hasOwnProperty(n)) {
            (function(n) {
                oProto[n] = function(data, cb) {
                    if(!data) data = null;
                    me._callObject( this._id, n, data, cb );
                }
            })(n);
        }
    }
    
    var cDef = classDef.methods;
    for(var n in cDef) {
        if(cDef.hasOwnProperty(n)) {
            
            (function(fn,n) {
                localMethods[n] = n;
                oProto[n] = fn;
            })(cDef[n],n);
            
        }
    } 
    return me._createWorkerClass( class_id, 
                                    classDef.webWorkers || classDef.processWorkers, 
                                    classDef.requires, 
                                    localMethods, true );
}


return c;


```

### Marx::constructor( options )
Options for the marx: 

```javascript
{
   processCnt : 4,
   forkFile : &quot;&quot;   // the file to use when forking the child process under node.js
}

```
```javascript

if(!_initDone) {
    
    if(!options) options = {};
    
    _initDone = true;
    _maxWorkerCnt = options.processCnt || 4;
    _roundRobin = 0;
    _threadPool = [];
    _objRefs = {};
    _processPool = [];// for node.js child processes
    
    if(options.isChild) {
        return;
    }
    
    // create workers only if not in node.js (assuming browser then)
    if(!this._isNodeJS()) {
        for(var i=0; i<_maxWorkerCnt;i++) {
            this._createWorker(i);
        }
    } else {

        for(var i=0; i<_maxWorkerCnt;i++) {
            this._createProcess(i, options.forkFile);
        }        
    }

}

```
        


   
    
    


   
      
            
# Class _promise


The class has following internal singleton variables:
        
        
### <a name="_promise_all"></a>_promise::all(firstArg)


*The source code for the function*:
```javascript

var args;
if(this.isArray(firstArg)) {
  args = firstArg;
} else {
  args = Array.prototype.slice.call(arguments, 0);
}
// console.log(args);
var targetLen = args.length,
    rCnt = 0,
    myPromises = [],
    myResults = new Array(targetLen);
    
return this.then(
    function() {
 
        var allPromise = _promise();
        if(args.length==0) {
            allPromise.resolve([]);
        }
        args.forEach( function(b, index) {
            if(b.then) {
                // console.log("All, looking for ", b, " state = ", b._state);
                myPromises.push(b);
                
                b.then(function(v) {
                    myResults[index] = v;
                    // console.log("Got a promise...",b, " cnt = ", rCnt);
                    rCnt++;
                    if(rCnt==targetLen) {
                        allPromise.resolve(myResults);
                    }
                }, function(v) {
                    allPromise.reject(v);
                });
                
            } else {
                allPromise.reject("Not list of promises");
            }
        })
        
        return allPromise;
        
    });



    

```

### <a name="_promise_collect"></a>_promise::collect(collectFn, promiseList, results)


*The source code for the function*:
```javascript

var args;
if(this.isArray(promiseList)) {
  args = promiseList;
} else {
  args = [promiseList];
}

// console.log(args);
var targetLen = args.length,
    isReady = false,
    noMore = false,
    rCnt = 0,
    myPromises = [],
    myResults = results || {};
    
return this.then(
    function() {
 
        var allPromise = _promise();
        args.forEach( function(b, index) {
            if(b.then) {
                // console.log("All, looking for ", b, " state = ", b._state);
                myPromises.push(b);
                
                b.then(function(v) {
                    rCnt++;
                    isReady = collectFn(v, myResults);
                    if( (isReady && !noMore) || (noMore==false && targetLen == rCnt) ) {
                        allPromise.resolve(myResults);
                        noMore = true;
                    }
                }, function(v) {
                    allPromise.reject(v);
                });
                
            } else {
                allPromise.reject("Not list of promises");
            }
        })
        
        return allPromise;
        
    });

```

### <a name="_promise_fail"></a>_promise::fail(fn)


*The source code for the function*:
```javascript
return this.then(null, fn);
```

### <a name="_promise_fulfill"></a>_promise::fulfill(withValue)


*The source code for the function*:
```javascript
// if(this._fulfilled || this._rejected) return;

if(this._rejected) return;
if(this._fulfilled && withValue != this._stateValue) {
    return;
}

var me = this;
this._fulfilled = true;
this._stateValue = withValue;

var chCnt = this._childPromises.length;

while(chCnt--) {
    var p = this._childPromises.shift();
    if(p._onFulfill) {
        try {
            var x = p._onFulfill(withValue);
            // console.log("Returned ",x);
            if(typeof(x)!="undefined") {
                p.resolve(x);
            } else {
                p.fulfill(withValue);
            }
        } catch(e) {
            // console.error(e);
            /*
                If either onFulfilled or onRejected throws an exception e, promise2 
                must be rejected with e as the reason.            
            */
            p.reject(e);
        }
    } else {
        /*
            If onFulfilled is not a function and promise1 is fulfilled, promise2 must be 
            fulfilled with the same value as promise1        
        */
        p.fulfill(withValue);
    }
};
// this._childPromises.length = 0;
this._state = 1;
this.triggerStateChange();

```

### <a name="_promise_genPlugin"></a>_promise::genPlugin(fname, fn)


*The source code for the function*:
```javascript
var me = this;
this.plugin(fname,
    function() {
        var args = Array.prototype.slice.call(arguments,0);
        console.log("Plugin args", args);
        var myPromise = _promise();
        this.then(function(v) {
            var args2 = Array.prototype.slice.call(arguments,0);
            var z = args.concat(args2);
            var res = fn.apply(this,z); 
            myPromise.resolve(res);
        }, function(r) {
            myPromise.reject(r);
        });
        return myPromise;

    }
);
```

### _promise::constructor( onFulfilled, onRejected )

```javascript
// 0 = pending
// 1 = fullfilled
// 2 = error

this._state = 0;
this._stateValue = null;
this._isAPromise = true;
this._childPromises = [];

if(this.isFunction(onFulfilled))
    this._onFulfill = onFulfilled;
if(this.isFunction(onRejected))
    this._onReject = onRejected;
    
if(!onRejected && this.isFunction(onFulfilled) ) {
    
    // ?? possible to call immediately??
    
    var me = this;
    later().asap(
        function() {
            onFulfilled( function(v) {
                me.resolve(v)
            }, function(v) {
                me.resolve(v);
            });           
    });
 
}
```
        
### <a name="_promise_isFulfilled"></a>_promise::isFulfilled(t)


*The source code for the function*:
```javascript
return this._state == 1;
```

### <a name="_promise_isPending"></a>_promise::isPending(t)


*The source code for the function*:
```javascript
return this._state == 0;
```

### <a name="_promise_isRejected"></a>_promise::isRejected(v)


*The source code for the function*:
```javascript
return this._state == 2;
```

### <a name="_promise_nodeStyle"></a>_promise::nodeStyle(fname, fn)


*The source code for the function*:
```javascript
var me = this;
this.plugin(fname,
    function() {
        var args = Array.prototype.slice.call(arguments,0);
        var last, userCb, cbIndex=0;
        if(args.length>=0) {
            last = args[args.length-1];
            if(Object.prototype.toString.call(last) == '[object Function]') {
                userCb = last;
                cbIndex = args.length-1;
            }
        }

        var mainPromise = wishes().pending();
        this.then(function() {
            var nodePromise = wishes().pending();
            var args2 = Array.prototype.slice.call(arguments,0);
            console.log("Orig args", args);
            console.log("Then args", args2);
            var z;
            if(args.length==0) 
                z = args2;
            if(args2.length==0)
                z = args;
            if(!z) z = args2.concat(args);
            cbIndex = z.length; // 0,fn... 2
            if(userCb) cbIndex--;
            z[cbIndex] = function(err) {
                if(err) {
                    console.log("Got error ",err);
                    nodePromise.reject(err);
                    mainPromise.reject(err);
                    return;
                }
                if(userCb) {
                    var args = Array.prototype.slice.call(arguments);
                    var res = userCb.apply(this, args);
                    mainPromise.resolve(res);
                } else {
                    var args = Array.prototype.slice.call(arguments,1);
                    mainPromise.resolve.apply(mainPromise,args);
                }
            }
            nodePromise.then( function(v) {
                mainPromise.resolve(v);
            });
            
            console.log("nodeStyle after concat", z);
            var res = fn.apply(this,z); 
            // myPromise.resolve(res);
            // return nodePromise;
            return nodePromise;
        }, function(v) {
            mainPromise.reject(v);
        });
        return mainPromise;
        /*
           log("..... now waiting "+ms);
           var p = waitFor(ms);
           p.then( function(v) {
               myPromise.resolve(v);
           });
       */
    }
);
```

### <a name="_promise_onStateChange"></a>_promise::onStateChange(fn)


*The source code for the function*:
```javascript

if(!this._listeners)
    this._listeners = [];

this._listeners.push(fn);
```

### <a name="_promise_plugin"></a>_promise::plugin(n, fn)


*The source code for the function*:
```javascript

_myTrait_[n] = fn;

return this;
```

### <a name="_promise_props"></a>_promise::props(obj)


*The source code for the function*:
```javascript
var args = [];

for(var n in obj) {
    if(obj.hasOwnProperty(n)) {
        args.push({
           name : n,
           promise : obj[n]
        });
    }
}


// console.log(args);
var targetLen = args.length,
    rCnt = 0,
    myPromises = [],
    myResults = {};
    
return this.then(
    function() {
 
        var allPromise = wishes().pending();
        args.forEach( function(def) {
            var b = def.promise,
                name = def.name;
            if(b.then) {
                // console.log("All, looking for ", b, " state = ", b._state);
                myPromises.push(b);
                
                b.then(function(v) {
                    myResults[name] = v;
                    rCnt++;
                    if(rCnt==targetLen) {
                        allPromise.resolve(myResults);
                    }
                }, function(v) {
                    allPromise.reject(v);
                });
                
            } else {
                allPromise.reject("Not list of promises");
            }
        })
        
        return allPromise;
        
    });

```

### <a name="_promise_reject"></a>_promise::reject(withReason)


*The source code for the function*:
```javascript

// if(this._rejected || this._fulfilled) return;

// conso

if(this._fulfilled) return;
if(this._rejected && withReason != this._rejectReason) return;


this._state = 2;
this._rejected = true;
this._rejectReason = withReason;
var me = this;

var chCnt = this._childPromises.length;
while(chCnt--) {
    var p = this._childPromises.shift();

    if(p._onReject) {
        try {
            p._onReject(withReason);
            p.reject(withReason);
        } catch(e) {
            /*
                If either onFulfilled or onRejected throws an exception e, promise2 
                must be rejected with e as the reason.            
            */
            p.reject(e);
        }
    } else {
        /*
            If onFulfilled is not a function and promise1 is fulfilled, promise2 must be 
            fulfilled with the same value as promise1        
        */
        p.reject(withReason);
    }
};

// this._childPromises.length = 0;
this.triggerStateChange();

```

### <a name="_promise_rejectReason"></a>_promise::rejectReason(reason)


*The source code for the function*:
```javascript
if(reason) {
    this._rejectReason = reason;
    return;
}
return this._rejectReason;
```

### <a name="_promise_resolve"></a>_promise::resolve(x)


*The source code for the function*:
```javascript

// console.log("Resolving ", x);

// can not do this many times...
if(this._state>0) return;

if(x==this) {
    // error
    this._rejectReason = "TypeError";
    this.reject(this._rejectReason);
    return;
}

if(this.isObject(x) && x._isAPromise) {
    
    // 
    this._state = x._state;
    this._stateValue = x._stateValue;
    this._rejectReason = x._rejectReason;
    // ... 
    if(this._state===0) {
        var me = this;
        x.onStateChange( function() {
            if(x._state==1) {
                // console.log("State change");
                me.resolve(x.value());
            } 
            if(x._state==2) {
                me.reject(x.rejectReason());                
            }
        });
    }
    if(this._state==1) {
        // console.log("Resolved to be Promise was fulfilled ", x._stateValue);
        this.fulfill(this._stateValue);    
    }
    if(this._state==2) {
        // console.log("Relved to be Promise was rejected ", x._rejectReason);
        this.reject(this._rejectReason);
    }
    return;
}
if(this.isObject(x) && x.then && this.isFunction(x.then)) {
    // console.log("Thenable ", x);
    var didCall = false;
    try {
        // Call the x.then
        var  me = this;
        x.then.call(x, 
            function(y) {
                if(didCall) return;
                // we have now value for the promise...
                // console.log("Got value from Thenable ", y);
                me.resolve(y);
                didCall = true;
            },
            function(r) {
                if(didCall) return;
                // console.log("Got reject from Thenable ", r);
                me.reject(r);
                didCall = true;
            });
    } catch(e) {
        if(!didCall) this.reject(e);
    }
    return;    
}
this._state = 1;
this._stateValue = x;

// fulfill the promise...
this.fulfill(x);

```

### <a name="_promise_state"></a>_promise::state(newState)


*The source code for the function*:
```javascript
if(typeof(newState)!="undefined") {
    this._state = newState;
}
return this._state;
```

### <a name="_promise_then"></a>_promise::then(onFulfilled, onRejected)


*The source code for the function*:
```javascript

if(!onRejected) onRejected = function() {};

var p = new _promise(onFulfilled, onRejected);
var me = this;

if(this._state==1) {
    later().asap( function() {
        me.fulfill(me.value());
    });
}
if(this._state==2) {
    later().asap( function() {
        me.reject(me.rejectReason());
    });
}
this._childPromises.push(p);
return p;



```

### <a name="_promise_triggerStateChange"></a>_promise::triggerStateChange(t)


*The source code for the function*:
```javascript
var me = this;
if(!this._listeners) return;
this._listeners.forEach( function(fn) {
    fn(me); 
});
// one-timer
this._listeners.length = 0;
```

### <a name="_promise_value"></a>_promise::value(v)


*The source code for the function*:
```javascript
if(typeof(v)!="undefined") {
    this._stateValue = v;
    return this;
}
return this._stateValue;
```



   
    
## trait util_fns

The class has following internal singleton variables:
        
        
### <a name="util_fns_isArray"></a>util_fns::isArray(someVar)


*The source code for the function*:
```javascript
return Object.prototype.toString.call( someVar ) === '[object Array]';
```

### <a name="util_fns_isFunction"></a>util_fns::isFunction(fn)


*The source code for the function*:
```javascript
return Object.prototype.toString.call(fn) == '[object Function]';
```

### <a name="util_fns_isObject"></a>util_fns::isObject(obj)


*The source code for the function*:
```javascript
return obj === Object(obj);
```


    
    
    
    


   
      
    
      
            
# Class later


The class has following internal singleton variables:
        
* _initDone
        
* _callers
        
* _oneTimers
        
* _everies
        
* _framers
        
* _localCnt
        
* _easings
        
* _easeFns
        
        
### <a name="later__easeFns"></a>later::_easeFns(t)


*The source code for the function*:
```javascript
_easings = { 
    easeIn : function(t) {
        return t*t;
    },
    easeOut : function(t) {
        return -1*t*(t-2);
    },   
    easeInOut : function(t) {
        if(t < 0.5) return t*t;
        return -1*t*(t-2);
    },
    easeInCubic : function(t) {
        return t*t*t;
    },
    easeOutCubic : function(t) {
        return (1-t)*(1-t)*(1-t) + 1;
    },    
    pow : function(t) {
        return Math.pow(t,parseFloat(1.5-t));
    },
    linear : function(t) {
        return t;
    }
}

```

### <a name="later_add"></a>later::add(fn, thisObj, args)


*The source code for the function*:
```javascript
if(thisObj || args) {
   var tArgs;
   if( Object.prototype.toString.call( args ) === '[object Array]' ) {
       tArgs = args;
   } else {
       tArgs = Array.prototype.slice.call(arguments, 2);
       if(!tArgs) tArgs = [];
   }
   _callers.push([thisObj, fn, tArgs]);   
} else {
    _callers.push(fn);
}
```

### <a name="later_addEasingFn"></a>later::addEasingFn(name, fn)


*The source code for the function*:
```javascript
_easings[name] = fn;
```

### <a name="later_after"></a>later::after(seconds, fn, name)


*The source code for the function*:
```javascript

if(!name) {
    name = "aft_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0,
    remove : true
};
```

### <a name="later_asap"></a>later::asap(fn)


*The source code for the function*:
```javascript
this.add(fn);

```

### <a name="later_ease"></a>later::ease(name, delay, callback, over)
`name` Name of the easing to use
 
`delay` Delay of the transformation in ms
 
`callback` Callback to set the values
 
`over` When animation is over
 


*The source code for the function*:
```javascript

var fn = _easings[name];
if(!fn) fn = _easings.pow;
var id_name = "e_"+(_localCnt++);
_easeFns[id_name] = {
    easeFn : fn,
    duration : delay,
    cb : callback,
    over : over
};



```

### <a name="later_every"></a>later::every(seconds, fn, name)


*The source code for the function*:
```javascript

if(!name) {
    name = "t7491_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0
};
```

### later::constructor( interval, fn )

```javascript
if(!_initDone) {
   this._easeFns();
   _localCnt=1;
 
   var frame, cancelFrame;
   if(typeof(window) != "undefined") {
       var frame = window['requestAnimationFrame'], 
           cancelFrame= window['cancelRequestAnimationFrame'];
       ['', 'ms', 'moz', 'webkit', 'o'].forEach( function(x) { 
           if(!frame) {
            frame = window[x+'RequestAnimationFrame'];
            cancelFrame = window[x+'CancelAnimationFrame'] 
                                       || window[x+'CancelRequestAnimationFrame'];
           }
        });
   }
 
   var is_node_js = (new Function("try { return this == global; } catch(e) { return false; }"))();
   
   if(is_node_js) {
       frame= function(cb) {
            return setImmediate(cb);// (cb,1);
       }; 
   } else {
        if (!frame) {
            frame= function(cb) {
                return setTimeout(cb, 16);
            };       
        }
   }
 
    if (!cancelFrame)
        cancelFrame = function(id) {
            clearTimeout(id);
        };    
        
    _callers = [];
    _oneTimers = {};
    _everies = {};
    _framers = [];
    _easeFns = {};
    var lastMs = 0;
    
    var _callQueQue = function() {
       var ms = (new Date()).getTime(),
           elapsed = lastMs - ms;
       
       if(lastMs==0) elapsed = 0;
       var fn;
       while(fn=_callers.shift()) {
          if(Object.prototype.toString.call( fn ) === '[object Array]' ) {
              fn[1].apply(fn[0], fn[2]);
          } else {
              fn();
          }
           
       }
       
       for(var i=0; i<_framers.length;i++) {
           var fFn = _framers[i];
           fFn();
       }
       /*
_easeFns.push({
    easeFn : fn,
    duration : delay,
    cb : callback
});
       
       */
       for(var n in _easeFns) {
           if(_easeFns.hasOwnProperty(n)) {
               var v = _easeFns[n];
               if(!v.start) v.start = ms;
               var delta = ms - v.start,
                   dt = delta / v.duration;
               if(dt>=1) {
                   dt = 1;
                   delete _easeFns[n];
               }
               v.cb(v.easeFn(dt));
               if((dt == 1) && v.over) v.over();
           }
       }   

       for(var n in _oneTimers) {
           if(_oneTimers.hasOwnProperty(n)) {
               var v = _oneTimers[n];
               v[0](v[1]);
               delete _oneTimers[n];
           }
       }
       
       for(var n in _everies) {
           if(_everies.hasOwnProperty(n)) {
               var v = _everies[n];
               if(v.nextTime < ms) {
                   if(v.remove) {
                       if(v.nextTime > 0) {
                          v.fn(); 
                          delete _everies[n];
                       } else {
                          v.nextTime = ms + v.step; 
                       }
                   } else {
                       v.fn();
                       v.nextTime = ms + v.step;
                   }
               }
               if(v.until) {
                   if(v.until < ms) {
                       delete _everies[n];
                   }
               }
           }
       }       
       
       frame(_callQueQue);
       lastMs = ms;
    };
    _callQueQue();
    _initDone = true;
}
```
        
### <a name="later_once"></a>later::once(key, fn, value)


*The source code for the function*:
```javascript
// _oneTimers

_oneTimers[key] = [fn,value];
```

### <a name="later_onFrame"></a>later::onFrame(fn)


*The source code for the function*:
```javascript

_framers.push(fn);
```

### <a name="later_removeFrameFn"></a>later::removeFrameFn(fn)


*The source code for the function*:
```javascript

var i = _framers.indexOf(fn);
if(i>=0) {
    if(fn._onRemove) {
        fn._onRemove();
    }
    _framers.splice(i,1);
    return true;
} else {
    return false;
}
```



   


   



      
    



      
    




