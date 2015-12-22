// The code template begins here
'use strict';

(function () {

  var __amdDefs__ = {};

  // The class definition is here...
  var Marx_prototype = function Marx_prototype() {
    // Then create the traits and subclasses for this class here...

    // the subclass definition comes around here then

    // The class definition is here...
    var _promise_prototype = function _promise_prototype() {
      // Then create the traits and subclasses for this class here...

      // trait comes here...

      (function (_myTrait_) {

        // Initialize static variables here...

        /**
         * @param float someVar
         */
        _myTrait_.isArray = function (someVar) {
          return Object.prototype.toString.call(someVar) === '[object Array]';
        };

        /**
         * @param Function fn
         */
        _myTrait_.isFunction = function (fn) {
          return Object.prototype.toString.call(fn) == '[object Function]';
        };

        /**
         * @param Object obj
         */
        _myTrait_.isObject = function (obj) {
          return obj === Object(obj);
        };
      })(this);

      // the subclass definition comes around here then

      // The class definition is here...
      var later_prototype = function later_prototype() {
        // Then create the traits and subclasses for this class here...

        (function (_myTrait_) {
          var _initDone;
          var _callers;
          var _oneTimers;
          var _everies;
          var _framers;
          var _localCnt;
          var _easings;
          var _easeFns;

          // Initialize static variables here...

          /**
           * @param float t
           */
          _myTrait_._easeFns = function (t) {
            _easings = {
              easeIn: function easeIn(t) {
                return t * t;
              },
              easeOut: function easeOut(t) {
                return -1 * t * (t - 2);
              },
              easeInOut: function easeInOut(t) {
                if (t < 0.5) return t * t;
                return -1 * t * (t - 2);
              },
              easeInCubic: function easeInCubic(t) {
                return t * t * t;
              },
              easeOutCubic: function easeOutCubic(t) {
                return (1 - t) * (1 - t) * (1 - t) + 1;
              },
              pow: function pow(t) {
                return Math.pow(t, parseFloat(1.5 - t));
              },
              linear: function linear(t) {
                return t;
              }
            };
          };

          /**
           * @param function fn
           * @param float thisObj
           * @param float args
           */
          _myTrait_.add = function (fn, thisObj, args) {
            if (thisObj || args) {
              var tArgs;
              if (Object.prototype.toString.call(args) === '[object Array]') {
                tArgs = args;
              } else {
                tArgs = Array.prototype.slice.call(arguments, 2);
                if (!tArgs) tArgs = [];
              }
              _callers.push([thisObj, fn, tArgs]);
            } else {
              _callers.push(fn);
            }
          };

          /**
           * @param float name
           * @param float fn
           */
          _myTrait_.addEasingFn = function (name, fn) {
            _easings[name] = fn;
          };

          /**
           * @param float seconds
           * @param float fn
           * @param float name
           */
          _myTrait_.after = function (seconds, fn, name) {

            if (!name) {
              name = 'aft_' + _localCnt++;
            }

            _everies[name] = {
              step: Math.floor(seconds * 1000),
              fn: fn,
              nextTime: 0,
              remove: true
            };
          };

          /**
           * @param function fn
           */
          _myTrait_.asap = function (fn) {
            this.add(fn);
          };

          /**
           * @param String name  - Name of the easing to use
           * @param int delay  - Delay of the transformation in ms
           * @param function callback  - Callback to set the values
           * @param function over  - When animation is over
           */
          _myTrait_.ease = function (name, delay, callback, over) {

            var fn = _easings[name];
            if (!fn) fn = _easings.pow;
            var id_name = 'e_' + _localCnt++;
            _easeFns[id_name] = {
              easeFn: fn,
              duration: delay,
              cb: callback,
              over: over
            };
          };

          /**
           * @param float seconds
           * @param float fn
           * @param float name
           */
          _myTrait_.every = function (seconds, fn, name) {

            if (!name) {
              name = 't7491_' + _localCnt++;
            }

            _everies[name] = {
              step: Math.floor(seconds * 1000),
              fn: fn,
              nextTime: 0
            };
          };

          if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty('__traitInit')) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
          if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
          _myTrait_.__traitInit.push(function (interval, fn) {
            if (!_initDone) {
              this._easeFns();
              _localCnt = 1;

              var frame, cancelFrame;
              if (typeof window != 'undefined') {
                var frame = window['requestAnimationFrame'],
                    cancelFrame = window['cancelRequestAnimationFrame'];
                ['', 'ms', 'moz', 'webkit', 'o'].forEach(function (x) {
                  if (!frame) {
                    frame = window[x + 'RequestAnimationFrame'];
                    cancelFrame = window[x + 'CancelAnimationFrame'] || window[x + 'CancelRequestAnimationFrame'];
                  }
                });
              }

              var is_node_js = new Function('try { return this == global; } catch(e) { return false; }')();

              if (is_node_js) {
                frame = function (cb) {
                  return setImmediate(cb); // (cb,1);
                };
              } else {
                if (!frame) {
                  frame = function (cb) {
                    return setTimeout(cb, 16);
                  };
                }
              }

              if (!cancelFrame) cancelFrame = function (id) {
                clearTimeout(id);
              };

              _callers = [];
              _oneTimers = {};
              _everies = {};
              _framers = [];
              _easeFns = {};
              var lastMs = 0;

              var _callQueQue = function _callQueQue() {
                var ms = new Date().getTime(),
                    elapsed = lastMs - ms;

                if (lastMs == 0) elapsed = 0;
                var fn;
                while (fn = _callers.shift()) {
                  if (Object.prototype.toString.call(fn) === '[object Array]') {
                    fn[1].apply(fn[0], fn[2]);
                  } else {
                    fn();
                  }
                }

                for (var i = 0; i < _framers.length; i++) {
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
                for (var n in _easeFns) {
                  if (_easeFns.hasOwnProperty(n)) {
                    var v = _easeFns[n];
                    if (!v.start) v.start = ms;
                    var delta = ms - v.start,
                        dt = delta / v.duration;
                    if (dt >= 1) {
                      dt = 1;
                      delete _easeFns[n];
                    }
                    v.cb(v.easeFn(dt));
                    if (dt == 1 && v.over) v.over();
                  }
                }

                for (var n in _oneTimers) {
                  if (_oneTimers.hasOwnProperty(n)) {
                    var v = _oneTimers[n];
                    v[0](v[1]);
                    delete _oneTimers[n];
                  }
                }

                for (var n in _everies) {
                  if (_everies.hasOwnProperty(n)) {
                    var v = _everies[n];
                    if (v.nextTime < ms) {
                      if (v.remove) {
                        if (v.nextTime > 0) {
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
                    if (v.until) {
                      if (v.until < ms) {
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
          });

          /**
           * @param  key
           * @param float fn
           * @param float value
           */
          _myTrait_.once = function (key, fn, value) {
            // _oneTimers

            _oneTimers[key] = [fn, value];
          };

          /**
           * @param function fn
           */
          _myTrait_.onFrame = function (fn) {

            _framers.push(fn);
          };

          /**
           * @param float fn
           */
          _myTrait_.removeFrameFn = function (fn) {

            var i = _framers.indexOf(fn);
            if (i >= 0) {
              if (fn._onRemove) {
                fn._onRemove();
              }
              _framers.splice(i, 1);
              return true;
            } else {
              return false;
            }
          };
        })(this);
      };

      var later = function later(a, b, c, d, e, f, g, h) {
        var m = this,
            res;
        if (m instanceof later) {
          var args = [a, b, c, d, e, f, g, h];
          if (m.__factoryClass) {
            m.__factoryClass.forEach(function (initF) {
              res = initF.apply(m, args);
            });
            if (typeof res == 'function') {
              if (res._classInfo.name != later._classInfo.name) return new res(a, b, c, d, e, f, g, h);
            } else {
              if (res) return res;
            }
          }
          if (m.__traitInit) {
            m.__traitInit.forEach(function (initF) {
              initF.apply(m, args);
            });
          } else {
            if (typeof m.init == 'function') m.init.apply(m, args);
          }
        } else return new later(a, b, c, d, e, f, g, h);
      };
      // inheritance is here

      later._classInfo = {
        name: 'later'
      };
      later.prototype = new later_prototype();

      (function () {
        if (typeof define !== 'undefined' && define !== null && define.amd != null) {
          __amdDefs__['later'] = later;
          this.later = later;
        } else if (typeof module !== 'undefined' && module !== null && module.exports != null) {
          module.exports['later'] = later;
        } else {
          this.later = later;
        }
      }).call(new Function('return this')());

      (function (_myTrait_) {

        // Initialize static variables here...

        /**
         * @param Array firstArg
         */
        _myTrait_.all = function (firstArg) {

          var args;
          if (this.isArray(firstArg)) {
            args = firstArg;
          } else {
            args = Array.prototype.slice.call(arguments, 0);
          }
          // console.log(args);
          var targetLen = args.length,
              rCnt = 0,
              myPromises = [],
              myResults = new Array(targetLen);

          return this.then(function () {

            var allPromise = _promise();
            if (args.length == 0) {
              allPromise.resolve([]);
            }
            args.forEach(function (b, index) {
              if (b.then) {
                // console.log("All, looking for ", b, " state = ", b._state);
                myPromises.push(b);

                b.then(function (v) {
                  myResults[index] = v;
                  // console.log("Got a promise...",b, " cnt = ", rCnt);
                  rCnt++;
                  if (rCnt == targetLen) {
                    allPromise.resolve(myResults);
                  }
                }, function (v) {
                  allPromise.reject(v);
                });
              } else {
                allPromise.reject('Not list of promises');
              }
            });

            return allPromise;
          });
        };

        /**
         * @param function collectFn
         * @param array promiseList
         * @param Object results
         */
        _myTrait_.collect = function (collectFn, promiseList, results) {

          var args;
          if (this.isArray(promiseList)) {
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

          return this.then(function () {

            var allPromise = _promise();
            args.forEach(function (b, index) {
              if (b.then) {
                // console.log("All, looking for ", b, " state = ", b._state);
                myPromises.push(b);

                b.then(function (v) {
                  rCnt++;
                  isReady = collectFn(v, myResults);
                  if (isReady && !noMore || noMore == false && targetLen == rCnt) {
                    allPromise.resolve(myResults);
                    noMore = true;
                  }
                }, function (v) {
                  allPromise.reject(v);
                });
              } else {
                allPromise.reject('Not list of promises');
              }
            });

            return allPromise;
          });
        };

        /**
         * @param function fn
         */
        _myTrait_.fail = function (fn) {
          return this.then(null, fn);
        };

        /**
         * @param float withValue
         */
        _myTrait_.fulfill = function (withValue) {
          // if(this._fulfilled || this._rejected) return;

          if (this._rejected) return;
          if (this._fulfilled && withValue != this._stateValue) {
            return;
          }

          var me = this;
          this._fulfilled = true;
          this._stateValue = withValue;

          var chCnt = this._childPromises.length;

          while (chCnt--) {
            var p = this._childPromises.shift();
            if (p._onFulfill) {
              try {
                var x = p._onFulfill(withValue);
                // console.log("Returned ",x);
                if (typeof x != 'undefined') {
                  p.resolve(x);
                } else {
                  p.fulfill(withValue);
                }
              } catch (e) {
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
        };

        /**
         * @param float fname
         * @param float fn
         */
        _myTrait_.genPlugin = function (fname, fn) {
          var me = this;
          this.plugin(fname, function () {
            var args = Array.prototype.slice.call(arguments, 0);
            console.log('Plugin args', args);
            var myPromise = _promise();
            this.then(function (v) {
              var args2 = Array.prototype.slice.call(arguments, 0);
              var z = args.concat(args2);
              var res = fn.apply(this, z);
              myPromise.resolve(res);
            }, function (r) {
              myPromise.reject(r);
            });
            return myPromise;
          });
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty('__traitInit')) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (onFulfilled, onRejected) {
          // 0 = pending
          // 1 = fullfilled
          // 2 = error

          this._state = 0;
          this._stateValue = null;
          this._isAPromise = true;
          this._childPromises = [];

          if (this.isFunction(onFulfilled)) this._onFulfill = onFulfilled;
          if (this.isFunction(onRejected)) this._onReject = onRejected;

          if (!onRejected && this.isFunction(onFulfilled)) {

            // ?? possible to call immediately??

            var me = this;
            later().asap(function () {
              onFulfilled(function (v) {
                me.resolve(v);
              }, function (v) {
                me.resolve(v);
              });
            });
          }
        });

        /**
         * @param float t
         */
        _myTrait_.isFulfilled = function (t) {
          return this._state == 1;
        };

        /**
         * @param float t
         */
        _myTrait_.isPending = function (t) {
          return this._state == 0;
        };

        /**
         * @param bool v
         */
        _myTrait_.isRejected = function (v) {
          return this._state == 2;
        };

        /**
         * @param float fname
         * @param float fn
         */
        _myTrait_.nodeStyle = function (fname, fn) {
          var me = this;
          this.plugin(fname, function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var last,
                userCb,
                cbIndex = 0;
            if (args.length >= 0) {
              last = args[args.length - 1];
              if (Object.prototype.toString.call(last) == '[object Function]') {
                userCb = last;
                cbIndex = args.length - 1;
              }
            }

            var mainPromise = wishes().pending();
            this.then(function () {
              var nodePromise = wishes().pending();
              var args2 = Array.prototype.slice.call(arguments, 0);
              console.log('Orig args', args);
              console.log('Then args', args2);
              var z;
              if (args.length == 0) z = args2;
              if (args2.length == 0) z = args;
              if (!z) z = args2.concat(args);
              cbIndex = z.length; // 0,fn... 2
              if (userCb) cbIndex--;
              z[cbIndex] = function (err) {
                if (err) {
                  console.log('Got error ', err);
                  nodePromise.reject(err);
                  mainPromise.reject(err);
                  return;
                }
                if (userCb) {
                  var args = Array.prototype.slice.call(arguments);
                  var res = userCb.apply(this, args);
                  mainPromise.resolve(res);
                } else {
                  var args = Array.prototype.slice.call(arguments, 1);
                  mainPromise.resolve.apply(mainPromise, args);
                }
              };
              nodePromise.then(function (v) {
                mainPromise.resolve(v);
              });

              console.log('nodeStyle after concat', z);
              var res = fn.apply(this, z);
              // myPromise.resolve(res);
              // return nodePromise;
              return nodePromise;
            }, function (v) {
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
          });
        };

        /**
         * @param function fn
         */
        _myTrait_.onStateChange = function (fn) {

          if (!this._listeners) this._listeners = [];

          this._listeners.push(fn);
        };

        /**
         * @param float n
         * @param float fn
         */
        _myTrait_.plugin = function (n, fn) {

          _myTrait_[n] = fn;

          return this;
        };

        /**
         * @param Object obj
         */
        _myTrait_.props = function (obj) {
          var args = [];

          for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
              args.push({
                name: n,
                promise: obj[n]
              });
            }
          }

          // console.log(args);
          var targetLen = args.length,
              rCnt = 0,
              myPromises = [],
              myResults = {};

          return this.then(function () {

            var allPromise = wishes().pending();
            args.forEach(function (def) {
              var b = def.promise,
                  name = def.name;
              if (b.then) {
                // console.log("All, looking for ", b, " state = ", b._state);
                myPromises.push(b);

                b.then(function (v) {
                  myResults[name] = v;
                  rCnt++;
                  if (rCnt == targetLen) {
                    allPromise.resolve(myResults);
                  }
                }, function (v) {
                  allPromise.reject(v);
                });
              } else {
                allPromise.reject('Not list of promises');
              }
            });

            return allPromise;
          });
        };

        /**
         * @param Object withReason
         */
        _myTrait_.reject = function (withReason) {

          // if(this._rejected || this._fulfilled) return;

          // conso

          if (this._fulfilled) return;
          if (this._rejected && withReason != this._rejectReason) return;

          this._state = 2;
          this._rejected = true;
          this._rejectReason = withReason;
          var me = this;

          var chCnt = this._childPromises.length;
          while (chCnt--) {
            var p = this._childPromises.shift();

            if (p._onReject) {
              try {
                p._onReject(withReason);
                p.reject(withReason);
              } catch (e) {
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
        };

        /**
         * @param Object reason
         */
        _myTrait_.rejectReason = function (reason) {
          if (reason) {
            this._rejectReason = reason;
            return;
          }
          return this._rejectReason;
        };

        /**
         * @param Object x
         */
        _myTrait_.resolve = function (x) {

          // console.log("Resolving ", x);

          // can not do this many times...
          if (this._state > 0) return;

          if (x == this) {
            // error
            this._rejectReason = 'TypeError';
            this.reject(this._rejectReason);
            return;
          }

          if (this.isObject(x) && x._isAPromise) {

            //
            this._state = x._state;
            this._stateValue = x._stateValue;
            this._rejectReason = x._rejectReason;
            // ...
            if (this._state === 0) {
              var me = this;
              x.onStateChange(function () {
                if (x._state == 1) {
                  // console.log("State change");
                  me.resolve(x.value());
                }
                if (x._state == 2) {
                  me.reject(x.rejectReason());
                }
              });
            }
            if (this._state == 1) {
              // console.log("Resolved to be Promise was fulfilled ", x._stateValue);
              this.fulfill(this._stateValue);
            }
            if (this._state == 2) {
              // console.log("Relved to be Promise was rejected ", x._rejectReason);
              this.reject(this._rejectReason);
            }
            return;
          }
          if (this.isObject(x) && x.then && this.isFunction(x.then)) {
            // console.log("Thenable ", x);
            var didCall = false;
            try {
              // Call the x.then
              var me = this;
              x.then.call(x, function (y) {
                if (didCall) return;
                // we have now value for the promise...
                // console.log("Got value from Thenable ", y);
                me.resolve(y);
                didCall = true;
              }, function (r) {
                if (didCall) return;
                // console.log("Got reject from Thenable ", r);
                me.reject(r);
                didCall = true;
              });
            } catch (e) {
              if (!didCall) this.reject(e);
            }
            return;
          }
          this._state = 1;
          this._stateValue = x;

          // fulfill the promise...
          this.fulfill(x);
        };

        /**
         * @param float newState
         */
        _myTrait_.state = function (newState) {
          if (typeof newState != 'undefined') {
            this._state = newState;
          }
          return this._state;
        };

        /**
         * @param function onFulfilled
         * @param function onRejected
         */
        _myTrait_.then = function (onFulfilled, onRejected) {

          if (!onRejected) onRejected = function () {};

          var p = new _promise(onFulfilled, onRejected);
          var me = this;

          if (this._state == 1) {
            later().asap(function () {
              me.fulfill(me.value());
            });
          }
          if (this._state == 2) {
            later().asap(function () {
              me.reject(me.rejectReason());
            });
          }
          this._childPromises.push(p);
          return p;
        };

        /**
         * @param float t
         */
        _myTrait_.triggerStateChange = function (t) {
          var me = this;
          if (!this._listeners) return;
          this._listeners.forEach(function (fn) {
            fn(me);
          });
          // one-timer
          this._listeners.length = 0;
        };

        /**
         * @param float v
         */
        _myTrait_.value = function (v) {
          if (typeof v != 'undefined') {
            this._stateValue = v;
            return this;
          }
          return this._stateValue;
        };
      })(this);
    };

    var _promise = function _promise(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof _promise) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == 'function') {
            if (res._classInfo.name != _promise._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == 'function') m.init.apply(m, args);
        }
      } else return new _promise(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    _promise._classInfo = {
      name: '_promise'
    };
    _promise.prototype = new _promise_prototype();

    (function () {
      if (typeof define !== 'undefined' && define !== null && define.amd != null) {
        __amdDefs__['_promise'] = _promise;
        this._promise = _promise;
      } else if (typeof module !== 'undefined' && module !== null && module.exports != null) {
        module.exports['_promise'] = _promise;
      } else {
        this._promise = _promise;
      }
    }).call(new Function('return this')());

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

          if (typeof Promise != 'undefined') {
            _promiseClass = Promise;
          }

          if (typeof _promise != 'undefined') {
            _promiseClass = _promise;
          }

          if (!_promiseClass && this._isNodeJS()) {
            throw new Error('Promise is not defined');
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
          var parts = url.split('.');
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
            if (elemType == 'js') {
              ext = document.createElement('script');
              ext.src = url;
            }
            if (elemType == 'css') {
              ext = document.createElement('link');
              ext.setAttribute('rel', 'stylesheet');
              ext.setAttribute('type', 'text/css');
              ext.setAttribute('href', url);
            }
            if (!ext) {
              fail('Unknown element type ' + url);
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
              if (msg.data.cmd == 'call' && msg.data.id == '/') {

                // TODO: finalize this
                if (msg.data.fn == 'heapUsage') {
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
                if (msg.data.fn == 'listClasses') {

                  postMessage({
                    cbid: msg.data.cbid,
                    data: {
                      list: Object.keys(this._classes)
                    }
                  });
                }
                if (msg.data.fn == 'classMetrics') {
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
                if (msg.data.fn == 'createClass') {

                  // creating a new class at the node.js
                  var newClass;
                  var dataObj = msg.data.data; // -- no more JSON parse here
                  eval('newClass = ' + dataObj.code);

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
                    data: 'Done'
                  });
                }
                if (msg.data.fn == 'createObject' && msg.data.data) {

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
                      data: 'Done'
                    });
                  }
                }
                return;
              }
              if (msg.data.cmd == 'call' && msg.data.id) {
                var ob = this._instances[msg.data.id];
                if (ob) {
                  if (msg.data.fn == 'terminate') {
                    console.log('=== Marx TERMINATE Called ===');
                    if (ob['terminate']) ob['terminate']();
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
              console.log('error ' + e.message);
              this._execptionCnt++;
            }
          };
        }

        var base = new baseProcess();
        process.on('message', function (msg) {
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

            if (msg.data.cmd == 'call' && msg.data.id == '/') {
              if (msg.data.fn == 'extendClass') {
                var newClass;
                var dataObj = msg.data.data;
                eval('newClass = ' + dataObj.code);

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
                for (var nnn in newClass) {
                  if (newClass.hasOwnProperty(nnn)) {
                    this._classes[dataObj.className][nnn] = newClass[nnn];
                  }
                }

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
                  data: 'Done'
                });
              }

              if (msg.data.fn == 'createClass') {
                var newClass;
                var dataObj = msg.data.data;
                eval('newClass = ' + dataObj.code);

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
                  data: 'Done'
                });
              }
              if (msg.data.fn == 'createObject' && msg.data.data) {
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
                    data: 'Done'
                  });
                }
              }
              return;
            }
            if (msg.data.cmd == 'call' && msg.data.id) {
              var ob = this._instances[msg.data.id];
              if (ob) {
                if (msg.data.fn == 'terminate') {
                  if (ob['terminate']) ob['terminate']();
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
            cmd: 'call',
            id: objectID,
            fn: functionName,
            cbid: _idx++,
            data: dataToSend
          });
        } else {
          // might remove this form client side too...
          // if(typeof(dataToSend) == "object") dataToSend = JSON.stringify(dataToSend);
          worker.postMessage({
            cmd: 'call',
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
            me._callWorker(_threadPool[i], '/', name, {}, function (res) {
              res.name = 'Worker Process ' + i;
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
          if (typeof index == 'undefined') {
            if (_worker) return _worker;
          }

          var cp = require('child_process');
          var ww = cp.fork(forkFile);

          if (!_callBackHash) {
            _callBackHash = {};
            _idx = 1;
          }
          _worker = ww;

          ww.on('message', function (oEvent) {
            if (typeof oEvent == 'object') {
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
            console.error('Unknown message from the worker ', oEvent);
          });
          if (typeof index != 'undefined') {
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
          if (typeof index == 'undefined') {
            if (_worker) return _worker;
          }

          var theCode = 'var o = ' + this._serializeClass(this._baseWorker()) + '\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ';
          var blob = new Blob([theCode], {
            type: 'text/javascript'
          });
          var ww = new Worker(window.URL.createObjectURL(blob));
          if (!_callBackHash) {
            _callBackHash = {};
            _idx = 1;
          }
          _worker = ww;
          ww.onmessage = function (oEvent) {
            if (typeof oEvent.data == 'object') {
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
            console.error('Unknown message from the worker ', oEvent.data);
          };
          if (typeof index != 'undefined') {
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
       * @param float bExtend
       */
      _myTrait_._createWorkerClass = function (className, classObj, requires, localMethods, bExtend) {
        var p = this.__promiseClass(),
            me = this;

        if (!_classDefs) _classDefs = {};

        var remote_fn = 'createClass';
        if (bExtend) {
          remote_fn = 'extendClass';
        }

        return new p(function (success) {
          var prom, first;
          if (bExtend) {
            for (var lName in localMethods) {
              if (localMethods.hasOwnProperty(lName)) {
                _classDefs[className].methods[lName] = localMethods[lName];
              }
            }
          } else {
            _classDefs[className] = {
              methods: localMethods
            };
          }
          var codeStr = me._serializeClass(classObj);
          for (var i = 0; i < _maxWorkerCnt; i++) {
            (function (i) {
              if (!prom) {
                first = prom = new p(function (done) {
                  me._callWorker(_threadPool[i], '/', remote_fn, {
                    className: className,
                    code: codeStr,
                    requires: requires,
                    localMethods: localMethods
                  }, done);
                });
              } else {
                prom = prom.then(function () {
                  return new p(function (done) {
                    me._callWorker(_threadPool[i], '/', remote_fn, {
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

          _objRefs[id] = refObj;

          me._callWorker(_threadPool[pool_index], '/', 'createObject', {
            className: className,
            id: id
          }, function (result) {

            success(result);
          });
        });
      };

      /**
       * @param float t
       */
      _myTrait_._isNodeJS = function (t) {
        if (typeof _isNode == 'undefined') {
          _isNode = new Function('try { return this == global; } catch(e) { return false; }')();
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
        var res = '{';
        var i = 0;
        for (var n in o) {
          if (i++) res += ',';
          res += n + ' : ' + o[n].toString();
        }
        res += '};';
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

          console.log('** workers are not available **');

          // files to load for the JS files to execute...
          var requires = classDef.requires;

          for (var fileType in requires) {
            if (fileType == 'js') {
              var list = requires[fileType];
              list.forEach(function (file) {
                //  append the JS files to the head...
                localPromises.push(me._appendToHead('js', file.url));
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
              (function (fn, n) {
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

        // create a worker object class
        var class_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        localMethods['trigger'] = 'trigger';

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
                  obj.trigger('ready');
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

        // Static method to extend the class befor the show begins
        // NOTE: currently available only for web workers...
        c.extendClass = function (classDef) {

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
          return me._createWorkerClass(class_id, classDef.webWorkers || classDef.processWorkers, classDef.requires, localMethods, true);
        };

        return c;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty('__traitInit')) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
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
        if (typeof res == 'function') {
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
        if (typeof m.init == 'function') m.init.apply(m, args);
      }
    } else return new Marx(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  Marx._classInfo = {
    name: 'Marx'
  };
  Marx.prototype = new Marx_prototype();

  (function () {
    if (typeof define !== 'undefined' && define !== null && define.amd != null) {
      __amdDefs__['Marx'] = Marx;
      this.Marx = Marx;
    } else if (typeof module !== 'undefined' && module !== null && module.exports != null) {
      module.exports['Marx'] = Marx;
    } else {
      this.Marx = Marx;
    }
  }).call(new Function('return this')());

  if (typeof define !== 'undefined' && define !== null && define.amd != null) {
    define(__amdDefs__);
  }
}).call(new Function('return this')());

// TODO: error handling postMessage("no instance found");

// TODO: error handling postMessage("no instance found");