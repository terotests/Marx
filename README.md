# Marx - the worker class

Using the Marx is as follows:

```javascript
var marx = Marx();
var myClass = marx.createClass({
    hello : function(data, cb) {
        cb("hello "+data);
        
        // or trigger message
        var me = this;
        setTimeout( function() {
            me.trigger("secondmsg", "me again")
        },2000);        
    }
})

var obj = new myClass();
obj.on("ready", function() {
    // callback
    obj.hello("there", function(response) {
        console.log(response);
    })    
    // listen to messages
    obj.on("secondmsg", function(response) {
        console.log(response);
    })      
})
```

Codepen:
http://codepen.io/teroktolonen/pen/wKErBX?editors=001
















   

 


   
#### Class Marx


- [__promiseClass](README.md#Marx___promiseClass)
- [_appendToHead](README.md#Marx__appendToHead)
- [_baseWorker](README.md#Marx__baseWorker)
- [_callObject](README.md#Marx__callObject)
- [_callWorker](README.md#Marx__callWorker)
- [_createWorker](README.md#Marx__createWorker)
- [_createWorkerClass](README.md#Marx__createWorkerClass)
- [_createWorkerObj](README.md#Marx__createWorkerObj)
- [_serializeClass](README.md#Marx__serializeClass)
- [_workersAvailable](README.md#Marx__workersAvailable)
- [createClass](README.md#Marx_createClass)



   


   





   
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
        
        
### <a name="Marx___promiseClass"></a>Marx::__promiseClass(useClass)
`useClass` The Promise implementation to use
 


*The source code for the function*:
```javascript

if(useClass) _promiseClass = useClass;

if(!_promiseClass) _promiseClass = Promise;

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
      if (msg.data.fn == "createClass") {
        var newClass;
        var dataObj = JSON.parse( msg.data.data );
        eval("newClass = " + dataObj.code);
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
        var dataObj = JSON.parse( msg.data.data );
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
          o_instance.trigger = o_instance.send = o_instance.sendMsg;
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
if(typeof(dataToSend) == "object") dataToSend = JSON.stringify(dataToSend);
worker.postMessage({
  cmd: "call",
  id: objectID,
  fn: functionName,
  cbid: _idx++,
  data: dataToSend
});

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
                  var dd = oEvent.data.data;
                  
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

### <a name="Marx__createWorkerClass"></a>Marx::_createWorkerClass(className, classObj, requires)


*The source code for the function*:
```javascript
var p = this.__promiseClass(), me = this;

if(!_classDefs) _classDefs = {};
return new p(
    function(success) {
        var prom, first;
        _classDefs[className] = classObj;
        var codeStr = me._serializeClass(classObj);
        for(var i=0; i<_maxWorkerCnt; i++) {
            ( function(i) {
            if(!prom) {
                first = prom = new p(function(done) {
                    me._callWorker(_threadPool[i], "/", "createClass",  {
                        className: className,
                        code: codeStr,
                        requires : requires
                    }, done );
                });
            } else {
                prom = prom.then( function() {
                    return new p(function(done) {
                        me._callWorker(_threadPool[i], "/", "createClass",  {
                            className: className,
                            code: codeStr,
                            requires : requires
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
        
        me._callWorker(_threadPool[pool_index], "/", "createObject",  {
            className: className,
            id: id
        }, function( result ) {
            _objRefs[id] = refObj;
            success( result ); 
        });
});

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
    me = this;
    

// if there are no workers available, emulate calls locally
if(!this._workersAvailable()) {
     // files to load for the JS files to execute...
    var requires = classDef.requires,
        promises = [];
    for(var fileType in requires) {
        if(fileType=="js") {
            var list = requires[fileType];
            list.forEach( function(file) {
                //  append the JS files to the head...
                promises.push( me._appendToHead( "js", file.url ) );
            });
        }
    }
    // the worker functions will be acting locally
    var workers = classDef.webWorkers;
    for(var n in workers) {
        if(classDef.hasOwnProperty(n)) {
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
            (function(fn) {
                oProto[n] = function(data, cb) {
                    fn.apply(this, [data, cb]);
                }
            })(cDef[n],n);
        }
    }    
    
    
} else {   

    // just accept the workers only...
    var workers = classDef.webWorkers;
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
                oProto[n] = function() {
                    var len = arguments.length,
                        args = new Array(len);
                    for(var i=0; i<len; i++) args[i] = arguments[i];
                    fn.apply(this, args);
                }
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
                


var me = this,
    p = this.__promiseClass();

if(this._workersAvailable()) {
    // the create class promise, if workers are available
    var cProm = this._createWorkerClass( class_id, classDef.webWorkers, classDef.requires );
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
        
        return p.resolve(this);
    };
    c.prototype = oProto;    
}

return c;


```

### Marx::constructor( t )

```javascript

if(!_initDone) {
    _initDone = true;
    _maxWorkerCnt = 4;
    _roundRobin = 0;
    _threadPool = [];
    _objRefs = {};
    for(var i=0; i<_maxWorkerCnt;i++) {
        this._createWorker(i);
    }
    
}

```
        


   


   




