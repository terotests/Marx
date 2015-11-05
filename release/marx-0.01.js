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

      // Initialize static variables here...

      /**
       * @param Object useClass  - The Promise implementation to use
       */
      _myTrait_.__promiseClass = function (useClass) {

        if (useClass) _promiseClass = useClass;

        if (!_promiseClass) _promiseClass = Promise;

        return _promiseClass;
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
          },
          start: function start(msg) {
            this.init();
            // Root object call
            if (msg.data.cmd == "call" && msg.data.id == "/") {
              if (msg.data.fn == "createClass") {
                var newClass;
                var dataObj = JSON.parse(msg.data.data);
                eval("newClass = " + dataObj.code);
                this._classes[dataObj.className] = newClass;
                postMessage({
                  cbid: msg.data.cbid,
                  data: "Done"
                });
              }
              if (msg.data.fn == "createObject" && msg.data.data) {
                var dataObj = JSON.parse(msg.data.data);
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
                  o_instance.trigger = o_instance.send = o_instance.sendMsg;
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
          alert("_callWorker");
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
        if (typeof dataToSend == "object") dataToSend = JSON.stringify(dataToSend);
        worker.postMessage({
          cmd: "call",
          id: objectID,
          fn: functionName,
          cbid: _idx++,
          data: dataToSend
        });
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
                  var dd = oEvent.data.data;

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
       */
      _myTrait_._createWorkerClass = function (className, classObj) {
        var p = this.__promiseClass(),
            me = this;

        if (!_classDefs) _classDefs = {};
        return new p(function (success) {
          var prom, first;
          _classDefs[className] = classObj;
          var codeStr = me._serializeClass(classObj);
          for (var i = 0; i < _maxWorkerCnt; i++) {
            (function (i) {
              if (!prom) {
                first = prom = new p(function (done) {
                  me._callWorker(_threadPool[i], "/", "createClass", {
                    className: className,
                    code: codeStr
                  }, done);
                });
              } else {
                prom = prom.then(function () {
                  return new p(function (done) {
                    me._callWorker(_threadPool[i], "/", "createClass", {
                      className: className,
                      code: codeStr
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
            me = this;

        for (var n in classDef) {
          if (classDef.hasOwnProperty(n)) {
            oProto[n] = function (data, cb) {
              if (!data) data = null;
              alert("About the call " + n + " " + this._id);
              me._callObject(this._id, n, data, cb);
            };
          }
        }

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

        // create a worker object class
        var class_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        this._createWorkerClass(class_id, classDef);

        var me = this;
        var c = function c(id) {
          alert("Worker class created");
          if (!id) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          }
          this._id = id;
          me._createWorkerObj(class_id, id, this);
        };
        c.prototype = oProto;

        return c;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!_initDone) {
          _initDone = true;
          _maxWorkerCnt = 4;
          _roundRobin = 0;
          _threadPool = [];
          _objRefs = {};
          for (var i = 0; i < _maxWorkerCnt; i++) {
            this._createWorker(i);
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