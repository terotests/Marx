// The code template begins here
"use strict";

(function () {

  var __amdDefs__ = {};

  // The class definition is here...
  var Marx_prototype = function Marx_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _callBackHash;
      var _idx;
      var _worker;
      var _initDone;
      var _objRefs;
      var _threadPool;
      var _maxWorkerCnt;
      var _roundRobin;
      var _objPool;
      var _promiseClass;
      var _classDefs;
      var _loadedLibs;
      var _isNode;
      var _processPool;

      // Initialize static variables here...

      /**
       * @param Object useClass  - The Promise implementation to use
       */
      _myTrait_.__promiseClass = function (useClass) {

        if (useClass) _promiseClass = useClass;

        if (!_promiseClass) {

          if (typeof Promise != "undefined") {
            _promiseClass = Promise;
          }

          if (this._isNodeJS()) {
            throw new Error("Promise is not defined");
          }
        }

        return _promiseClass;
      };

      /**
       * @param float elemType
       * @param float url
       */
      _myTrait_._appendToHead = function (elemType, url) {

        if (!url) {
          url = elemType;
          var parts = url.split(".");
          elemType = parts.pop(); // for example file.css -> css
        }
        var p = this.__promiseClass();
        if (p) {
          if (!_loadedLibs) {
            _loadedLibs = {};
          }
          // if loading, return the promise
          if (_loadedLibs[url]) {
            return _loadedLibs[url];
          }
          _loadedLibs[url] = new p(function (accept, fail) {

            var ext;
            if (elemType == "js") {
              ext = document.createElement("script");
              ext.src = url;
            }
            if (elemType == "css") {
              ext = document.createElement("link");
              ext.setAttribute("rel", "stylesheet");
              ext.setAttribute("type", "text/css");
              ext.setAttribute("href", url);
            }
            if (!ext) {
              fail("Unknown element type " + url);
              return;
            }
            ext.onload = function () {
              accept(url);
            };
            ext.onerror = function () {
              fail(url);
            };
            document.head.appendChild(ext);
          });
          return _loadedLibs[url];
        }
      };

      /**
       * @param float t
       */
      _myTrait_._baseProcess = function (t) {

        // emulate the web worker call

        // just create s normal JS class
        function baseProcess() {

          // constructor phase, classical JS style   
          this._initDone = true;
          this._classes = {};
          this._instances = {};
          this._imports = {};
          this._messageCnt = 0;
          this._execptionCnt = 0;

          var postMessage = function postMessage(msg) {
            process.send(msg);
          };

          this.onMsg = function (pData) {

            var msg = {
              data: pData
            };
            try {
              this._messageCnt++;
              if (msg.data.cmd == "call" && msg.data.id == "/") {

                // TODO: finalize this
                if (msg.data.fn == "heapUsage") {
                  var usage = {};
                  if (process && process.memoryUsage) {
                    var o = process.memoryUsage();
                    usage = {
                      rss: o.rss,
                      heapTotal: o.heapTotal,
                      heapUsed: o.heapUsed,
                      heapUsage: parseInt(100 * o.heapUsed / o.heapTotal),
                      fromTotalGb: parseFloat(100 * o.heapTotal / (1024 * 1024 * 1024)).toFixed(2)
                    };
                  }
                  postMessage({
                    cbid: msg.data.cbid,
                    data: usage
                  });
                }
                if (msg.data.fn == "listClasses") {

                  postMessage({
                    cbid: msg.data.cbid,
                    data: {
                      list: Object.keys(this._classes)
                    }
                  });
                }
                if (msg.data.fn == "classMetrics") {
                  var usage = {};

                  usage.requireCnt = Object.keys(this._imports).length;
                  usage.instanceCnt = Object.keys(this._instances).length;
                  usage.classCnt = Object.keys(this._classes).length;
                  usage.messageCnt = this._messageCnt;
                  usage.errors = this._execptionCnt;

                  postMessage({
                    cbid: msg.data.cbid,
                    data: usage
                  });
                }
                if (msg.data.fn == "createClass") {

                  // creating a new class at the node.js
                  var newClass;
                  var dataObj = msg.data.data; // -- no more JSON parse here
                  eval("newClass = " + dataObj.code);

                  if (dataObj.localMethods) {
                    var methods = dataObj.localMethods;
                    for (var n in methods) {
                      if (methods.hasOwnProperty(n)) {
                        (function (n) {
                          newClass[n] = function (data) {

                            var len = arguments.length,
                                args = new Array(len);
                            for (var i = 0; i < len; i++) args[i] = arguments[i];
                            postMessage({
                              msg: n,
                              data: args,
                              ref_id: this._ref_id
                            });
                          };
                        })(n);
                      }
                    }
                  }
                  this._classes[dataObj.className] = newClass;

                  try {
                    // -- import the scripts
                    if (dataObj.requires && dataObj.requires.js) {
                      var list = dataObj.requires.js;
                      for (var i = 0; i < list.length; i++) {
                        var mod = list[i];
                        // TODO: loading external resources might be done differently
                        if (mod.name) {
                          if (mod.assignTo && mod.varName) {
                            global[mod.assignTo] = require(mod.name)[mod.varName];
                          } else {
                            if (mod.assignTo) {
                              global[mod.assignTo] = require(mod.name);
                            }
                          }
                        }
                      }
                    }
                  } catch (e) {
                    this._execptionCnt++;
                  }

                  postMessage({
                    cbid: msg.data.cbid,
                    data: "Done"
                  });
                }
                if (msg.data.fn == "createObject" && msg.data.data) {

                  var dataObj = msg.data.data;
                  var newClass = this._classes[dataObj.className];
                  if (newClass) {
                    var o_instance = Object.create(newClass);
                    this._instances[dataObj.id] = o_instance;

                    o_instance.sendMsg = function (msg, data, cb) {
                      postMessage({
                        msg: msg,
                        data: data,
                        ref_id: dataObj.id
                      });
                    };
                    o_instance.send = o_instance.sendMsg;
                    o_instance._ref_id = dataObj.id;
                    // call constructor, if any
                    if (o_instance.init) o_instance.init();
                    postMessage({
                      cbid: msg.data.cbid,
                      data: "Done"
                    });
                  }
                }
                return;
              }
              if (msg.data.cmd == "call" && msg.data.id) {
                var ob = this._instances[msg.data.id];
                if (ob) {
                  if (msg.data.fn == "terminate") {
                    console.log("=== Marx TERMINATE Called ===");
                    if (ob["terminate"]) ob["terminate"]();
                    delete this._instances[msg.data.id];
                    return;
                  }
                  if (ob[msg.data.fn]) {
                    ob[msg.data.fn].apply(ob, [msg.data.data, function (msgData) {
                      postMessage({
                        cbid: msg.data.cbid,
                        data: msgData
                      });
                    }]);
                  }
                } else {}
              }
            } catch (e) {
              console.log("error " + e.message);
              this._execptionCnt++;
            }
          };
        }

        var base = new baseProcess();
        process.on("message", function (msg) {
          base.onMsg(msg);
        });
      };

      /**
       * The bootstrap for the worker to receive and delegate commands. This is the code running at the worker -side of the pool.
       * @param float t
       */
      _myTrait_._baseWorker = function (t) {
        return {
          init: function init() {
            if (this._initDone) return;
            this._initDone = true;
            this._classes = {};
            this._instances = {};
            this._imports = {};
          },
          start: function start(msg) {
            this.init();
            // Root object call
            if (msg.data.cmd == "call" && msg.data.id == "/") {
              if (msg.data.fn == "createClass") {
                var newClass;
                var dataObj = msg.data.data;
                eval("newClass = " + dataObj.code);

                if (dataObj.localMethods) {
                  var methods = dataObj.localMethods;
                  for (var n in methods) {
                    if (methods.hasOwnProperty(n)) {
                      (function (n) {
                        newClass[n] = function (data) {

                          var len = arguments.length,
                              args = new Array(len);
                          for (var i = 0; i < len; i++) args[i] = arguments[i];
                          postMessage({
                            msg: n,
                            data: args,
                            ref_id: this._ref_id
                          });
                        };
                      })(n);
                    }
                  }
                }
                this._classes[dataObj.className] = newClass;

                try {
                  // -- import the scripts
                  if (dataObj.requires && dataObj.requires.js) {
                    var list = dataObj.requires.js;
                    for (var i = 0; i < list.length; i++) {
                      var url = list[i].url;
                      if (this._imports[url]) continue;
                      importScripts(url);
                      this._imports[url] = true;
                    }
                  }
                } catch (e) {}

                postMessage({
                  cbid: msg.data.cbid,
                  data: "Done"
                });
              }
              if (msg.data.fn == "createObject" && msg.data.data) {
                var dataObj = msg.data.data;
                var newClass = this._classes[dataObj.className];
                if (newClass) {
                  var o_instance = Object.create(newClass);
                  this._instances[dataObj.id] = o_instance;

                  o_instance.sendMsg = function (msg, data, cb) {
                    postMessage({
                      msg: msg,
                      data: data,
                      ref_id: dataObj.id
                    });
                  };
                  o_instance.send = o_instance.sendMsg;
                  o_instance._ref_id = dataObj.id;
                  // call constructor, if any
                  if (o_instance.init) o_instance.init();
                  postMessage({
                    cbid: msg.data.cbid,
                    data: "Done"
                  });
                }
              }
              return;
            }
            if (msg.data.cmd == "call" && msg.data.id) {
              var ob = this._instances[msg.data.id];
              if (ob) {
                if (msg.data.fn == "terminate") {
                  if (ob["terminate"]) ob["terminate"]();
                  delete this._instances[msg.data.id];
                  return;
                }
                if (ob[msg.data.fn]) {
                  ob[msg.data.fn].apply(ob, [msg.data.data, function (msgData) {
                    postMessage({
                      cbid: msg.data.cbid,
                      data: msgData
                    });
                  }]);
                }
              } else {}
            }
          }
        };
      };

      /**
       * @param String id  - Object ID to call
       * @param String fnName  - Name of function
       * @param String data  - Data as string
       * @param function callback  - Callback when done
       */
      _myTrait_._callObject = function (id, fnName, data, callback) {
        var o = _objRefs[id];
        if (o) {
          this._callWorker(_threadPool[o.__wPool], id, fnName, data, callback);
        }
        return this;
      };

      /**
       * @param Object worker  - Web Worker to call
       * @param String objectID  - ID of function or / to call the root
       * @param Name of function to call functionName  - Name of the function to call
       * @param String dataToSend  - Data, converted to string if object
       * @param function callBack  - callback
       */
      _myTrait_._callWorker = function (worker, objectID, functionName, dataToSend, callBack) {
        if (!_worker) return;

        _callBackHash[_idx] = callBack;

        if (this._isNodeJS()) {
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
      };

      /**
       * @param String name  - Metrics to collect, &quot;heapUsage&quot;
       * @param Function callBack  - Callback after data has been collected
       */
      _myTrait_._collectMemoryUsage = function (name, callBack) {

        var tot_cnt = 0;
        for (var i in _threadPool) tot_cnt++;

        var results = [],
            me = this;

        // TODO: implement this for proprieatry browser interfaces if available
        // window.performance.memory

        for (var i in _threadPool) {
          (function (i) {
            me._callWorker(_threadPool[i], "/", name, {}, function (res) {
              res.name = "Worker Process " + i;
              tot_cnt--;
              results.push(res);

              if (tot_cnt == 0) callBack(results);
            });
          })(i);
        }
        return this;
      };

      /**
       * @param int index  - The Child process index
       * @param String forkFile  - The name of the file to fork
       */
      _myTrait_._createProcess = function (index, forkFile) {

        try {

          // currently only one worker in the system...
          if (typeof index == "undefined") {
            if (_worker) return _worker;
          }

          var cp = require("child_process");
          var ww = cp.fork(forkFile);

          if (!_callBackHash) {
            _callBackHash = {};
            _idx = 1;
          }
          _worker = ww;

          ww.on("message", function (oEvent) {
            if (typeof oEvent == "object") {
              if (oEvent.cbid) {
                var cb = _callBackHash[oEvent.cbid];
                if (cb) {
                  delete _callBackHash[oEvent.cbid];
                  cb(oEvent.data);
                }
              }
              if (oEvent.ref_id) {
                var oo = _objRefs[oEvent.ref_id];

                if (oo) {
                  var dd = oEvent.data,
                      msg = oEvent.msg;

                  if (oo[msg]) {
                    var cDef = _classDefs[oo.__wClass];
                    if (cDef && cDef.methods[msg]) {
                      oo[msg].apply(oo, oEvent.data);
                      return;
                    }
                  }
                  // trigger message if directed abstract msg to some object
                  if (oo.trigger) {
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
          if (typeof index != "undefined") {
            _threadPool[index] = ww;
          }
          return ww;
        } catch (e) {
          return null;
        }
      };

      /**
       * @param int index  - Thread index
       */
      _myTrait_._createWorker = function (index) {
        try {

          // currently only one worker in the system...
          if (typeof index == "undefined") {
            if (_worker) return _worker;
          }

          var theCode = "var o = " + this._serializeClass(this._baseWorker()) + "\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ";
          var blob = new Blob([theCode], {
            type: "text/javascript"
          });
          var ww = new Worker(window.URL.createObjectURL(blob));
          if (!_callBackHash) {
            _callBackHash = {};
            _idx = 1;
          }
          _worker = ww;
          ww.onmessage = function (oEvent) {
            if (typeof oEvent.data == "object") {
              if (oEvent.data.cbid) {
                var cb = _callBackHash[oEvent.data.cbid];
                delete _callBackHash[oEvent.data.cbid];
                cb(oEvent.data.data);
              }
              if (oEvent.data.ref_id) {
                var oo = _objRefs[oEvent.data.ref_id];

                if (oo) {
                  var dd = oEvent.data.data,
                      msg = oEvent.data.msg;
                  // console.log(oEvent.data);
                  if (oo[msg]) {
                    var cDef = _classDefs[oo.__wClass];
                    if (cDef && cDef.methods[msg]) {
                      oo[msg].apply(oo, oEvent.data.data);
                      return;
                    }
                  }
                  // trigger message if directed abstract msg to some object
                  if (oo.trigger) {
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
          if (typeof index != "undefined") {
            _threadPool[index] = ww;
          }
          return ww;
        } catch (e) {
          return null;
        }
      };

      /**
       * @param float className
       * @param float classObj
       * @param float requires
       * @param float localMethods
       */
      _myTrait_._createWorkerClass = function (className, classObj, requires, localMethods) {
        var p = this.__promiseClass(),
            me = this;

        if (!_classDefs) _classDefs = {};
        return new p(function (success) {
          var prom, first;
          _classDefs[className] = {
            methods: localMethods
          };
          var codeStr = me._serializeClass(classObj);
          for (var i = 0; i < _maxWorkerCnt; i++) {
            (function (i) {
              if (!prom) {
                first = prom = new p(function (done) {
                  me._callWorker(_threadPool[i], "/", "createClass", {
                    className: className,
                    code: codeStr,
                    requires: requires,
                    localMethods: localMethods
                  }, done);
                });
              } else {
                prom = prom.then(function () {
                  return new p(function (done) {
                    me._callWorker(_threadPool[i], "/", "createClass", {
                      className: className,
                      code: codeStr,
                      requires: requires,
                      localMethods: localMethods
                    }, done);
                  });
                });
              }
            })(i);
          }
          prom.then(function () {
            success(true);
          });
        });
      };

      /**
       * @param String className  - Class of the Object
       * @param String id  - Object ID
       * @param Object refObj  - The reference object, this object will be set __wPool index so that each call for this object will be directed to the correct worker pool
       */
      _myTrait_._createWorkerObj = function (className, id, refObj) {
        var p = this.__promiseClass(),
            me = this;
        return new p(function (success) {

          var pool_index = _roundRobin++ % _maxWorkerCnt;

          // set the pool and class
          refObj.__wPool = pool_index;
          refObj.__wClass = className;

          me._callWorker(_threadPool[pool_index], "/", "createObject", {
            className: className,
            id: id
          }, function (result) {
            _objRefs[id] = refObj;
            success(result);
          });
        });
      };

      /**
       * @param float t
       */
      _myTrait_._isNodeJS = function (t) {
        if (typeof _isNode == "undefined") {
          _isNode = new Function("try { return this == global; } catch(e) { return false; }")();
        }
        return _isNode;
      };

      /**
       * @param String name  - Metrics to collect
       * @param Function callBackFn  - Function to call when done
       */
      _myTrait_._metrics = function (name, callBackFn) {
        return this._collectMemoryUsage(name, callBackFn);
      };

      /**
       * The code which is run under the node.js child process. This code is listening messages from the master process, creates the classes and objects.
       * @param float t
       */
      _myTrait_._nodeChildProcess = function (t) {};

      /**
       * @param Object o  - The Object with functions as properties
       */
      _myTrait_._serializeClass = function (o) {
        var res = "{";
        var i = 0;
        for (var n in o) {
          if (i++) res += ",";
          res += n + " : " + o[n].toString();
        }
        res += "};";
        return res;
      };

      /**
       * @param float t
       */
      _myTrait_._workersAvailable = function (t) {
        return _worker;
      };

      /**
       * Creates the class to be used as worker. Functions `on` and `trigger` are reserved for listening messages from the workers.
       * @param Object classDef  - The object to implement
       */
      _myTrait_.createClass = function (classDef) {
        var oProto = {},
            me = this,
            localMethods = {},
            localPromises = [];

        // if there are no workers available, emulate calls locally
        if (!this._workersAvailable()) {

          console.log("** workers are not available **");

          // files to load for the JS files to execute...
          var requires = classDef.requires;

          for (var fileType in requires) {
            if (fileType == "js") {
              var list = requires[fileType];
              list.forEach(function (file) {
                //  append the JS files to the head...
                localPromises.push(me._appendToHead("js", file.url));
              });
            }
          }
          // the worker functions will be acting locally
          var workers = classDef.webWorkers;
          for (var n in workers) {
            if (workers.hasOwnProperty(n)) {
              (function (fn, n) {
                oProto[n] = function (data, cb) {
                  fn.apply(this, [data, cb]);
                };
              })(workers[n], n);
            }
          }
          var cDef = classDef.methods;
          for (var n in cDef) {
            if (cDef.hasOwnProperty(n)) {
              localMethods[n] = n;
              (function (fn) {
                oProto[n] = function (data, cb) {
                  fn.apply(this, [data, cb]);
                };
              })(cDef[n], n);
            }
          }
        } else {

          // just accept the workers only...
          var workers = classDef.webWorkers || classDef.processWorkers;
          for (var n in workers) {
            if (workers.hasOwnProperty(n)) {
              (function (n) {
                oProto[n] = function (data, cb) {
                  if (!data) data = null;
                  me._callObject(this._id, n, data, cb);
                };
              })(n);
            }
          }

          var cDef = classDef.methods;
          for (var n in cDef) {
            if (cDef.hasOwnProperty(n)) {

              (function (fn, n) {
                localMethods[n] = n;
                oProto[n] = fn;
              })(cDef[n], n);
            }
          }
        }

        var imports = [];

        oProto.on = function (msg, fn) {
          if (!this.__evt) this.__evt = {};
          if (!this.__evt[msg]) this.__evt[msg] = [];
          this.__evt[msg].push(fn);
        };
        oProto.trigger = function (msg, data) {
          if (!this.__evt) return;
          if (!this.__evt[msg]) return;
          var me = this;
          this.__evt[msg].forEach(function (fn) {
            fn.apply(me, [data]);
          });
        };

        localMethods["trigger"] = "trigger";

        // create a worker object class
        var class_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        var me = this,
            p = this.__promiseClass();

        if (this._workersAvailable()) {
          // the create class promise, if workers are available
          var cProm = this._createWorkerClass(class_id, classDef.webWorkers || classDef.processWorkers, classDef.requires, localMethods);
          var c = function c(id) {

            if (!id) {
              id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            }
            this._id = id;
            var obj = this;

            return new p(function (resolve) {
              cProm.then(function () {
                me._createWorkerObj(class_id, id, obj).then(function () {
                  obj.trigger("ready");
                  resolve(obj);
                });
              });
            });
          };
          c.prototype = oProto;
        } else {

          var c = function c(id) {
            if (!id) {
              id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            }
            this._id = id;
            var obj = this;

            return new p(function (resolve) {
              if (localPromises.length == 0) {
                resolve(obj);
                return;
              }
              var start = localPromises.pop();
              var next;
              while (next = localPromises.pop()) {
                start = start.then(function () {
                  return next;
                });
              }
              start.then(function () {
                resolve(obj);
              });
            });
          };
          c.prototype = oProto;
        }

        return c;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (options) {

        if (!_initDone) {

          if (!options) options = {};

          _initDone = true;
          _maxWorkerCnt = options.processCnt || 4;
          _roundRobin = 0;
          _threadPool = [];
          _objRefs = {};
          _processPool = []; // for node.js child processes

          if (options.isChild) {
            return;
          }

          // create workers only if not in node.js (assuming browser then)
          if (!this._isNodeJS()) {
            for (var i = 0; i < _maxWorkerCnt; i++) {
              this._createWorker(i);
            }
          } else {

            for (var i = 0; i < _maxWorkerCnt; i++) {
              this._createProcess(i, options.forkFile);
            }
          }
        }
      });
    })(this);
  };

  var Marx = function Marx(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof Marx) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != Marx._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new Marx(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  Marx._classInfo = {
    name: "Marx"
  };
  Marx.prototype = new Marx_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["Marx"] = Marx;
      this.Marx = Marx;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["Marx"] = Marx;
    } else {
      this.Marx = Marx;
    }
  }).call(new Function("return this")());

  if (typeof define !== "undefined" && define !== null && define.amd != null) {
    define(__amdDefs__);
  }
}).call(new Function("return this")());

// TODO: error handling postMessage("no instance found");

// TODO: error handling postMessage("no instance found");