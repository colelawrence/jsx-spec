(() => {
  // src/jsxSpec/h.ts
  function h(elemName, props, ...children) {
    const fixChildren = flattenChildren(...children);
    if (typeof elemName === "string")
      return new DOMSpecElement([elemName, props, ...fixChildren]);
    else
      return elemName(props, ...fixChildren);
  }
  function flattenChildren(...children) {
    return Array.from(children).flatMap((a) => {
      if (a instanceof DOMSpecElement)
        return a;
      if (typeof a === "string") {
        return new DOMSpecElement(a);
      } else if (a instanceof Array) {
        return flattenChildren(...a);
      } else {
        return new DOMSpecElement(typeof a === "number" ? String(a) : a);
      }
    });
  }
  class DOMSpecElement {
    constructor(spec) {
      this.spec = spec;
    }
  }

  // node_modules/tslib/tslib.es6.js
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (b2.hasOwnProperty(p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  // node_modules/rxjs/_esm5/internal/util/isFunction.js
  function isFunction(x) {
    return typeof x === "function";
  }

  // node_modules/rxjs/_esm5/internal/config.js
  var _enable_super_gross_mode_that_will_cause_bad_things = false;
  var config = {
    Promise: void 0,
    set useDeprecatedSynchronousErrorHandling(value) {
      if (value) {
        var error = /* @__PURE__ */ new Error();
        /* @__PURE__ */ console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" + error.stack);
      } else if (_enable_super_gross_mode_that_will_cause_bad_things) {
        /* @__PURE__ */ console.log("RxJS: Back to a better error behavior. Thank you. <3");
      }
      _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
      return _enable_super_gross_mode_that_will_cause_bad_things;
    }
  };

  // node_modules/rxjs/_esm5/internal/util/hostReportError.js
  function hostReportError(err) {
    setTimeout(function() {
      throw err;
    }, 0);
  }

  // node_modules/rxjs/_esm5/internal/Observer.js
  var empty = {
    closed: true,
    next: function(value) {
    },
    error: function(err) {
      if (config.useDeprecatedSynchronousErrorHandling) {
        throw err;
      } else {
        hostReportError(err);
      }
    },
    complete: function() {
    }
  };

  // node_modules/rxjs/_esm5/internal/util/isArray.js
  var isArray = /* @__PURE__ */ function() {
    return Array.isArray || function(x) {
      return x && typeof x.length === "number";
    };
  }();

  // node_modules/rxjs/_esm5/internal/util/isObject.js
  function isObject(x) {
    return x !== null && typeof x === "object";
  }

  // node_modules/rxjs/_esm5/internal/util/UnsubscriptionError.js
  var UnsubscriptionErrorImpl = /* @__PURE__ */ function() {
    function UnsubscriptionErrorImpl2(errors) {
      Error.call(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
        return i + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
      return this;
    }
    UnsubscriptionErrorImpl2.prototype = /* @__PURE__ */ Object.create(Error.prototype);
    return UnsubscriptionErrorImpl2;
  }();
  var UnsubscriptionError = UnsubscriptionErrorImpl;

  // node_modules/rxjs/_esm5/internal/Subscription.js
  var Subscription = /* @__PURE__ */ function() {
    function Subscription5(unsubscribe) {
      this.closed = false;
      this._parentOrParents = null;
      this._subscriptions = null;
      if (unsubscribe) {
        this._ctorUnsubscribe = true;
        this._unsubscribe = unsubscribe;
      }
    }
    Subscription5.prototype.unsubscribe = function() {
      var errors;
      if (this.closed) {
        return;
      }
      var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
      this.closed = true;
      this._parentOrParents = null;
      this._subscriptions = null;
      if (_parentOrParents instanceof Subscription5) {
        _parentOrParents.remove(this);
      } else if (_parentOrParents !== null) {
        for (var index = 0; index < _parentOrParents.length; ++index) {
          var parent_1 = _parentOrParents[index];
          parent_1.remove(this);
        }
      }
      if (isFunction(_unsubscribe)) {
        if (_ctorUnsubscribe) {
          this._unsubscribe = void 0;
        }
        try {
          _unsubscribe.call(this);
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
        }
      }
      if (isArray(_subscriptions)) {
        var index = -1;
        var len = _subscriptions.length;
        while (++index < len) {
          var sub = _subscriptions[index];
          if (isObject(sub)) {
            try {
              sub.unsubscribe();
            } catch (e) {
              errors = errors || [];
              if (e instanceof UnsubscriptionError) {
                errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
              } else {
                errors.push(e);
              }
            }
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    };
    Subscription5.prototype.add = function(teardown) {
      var subscription = teardown;
      if (!teardown) {
        return Subscription5.EMPTY;
      }
      switch (typeof teardown) {
        case "function":
          subscription = new Subscription5(teardown);
        case "object":
          if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== "function") {
            return subscription;
          } else if (this.closed) {
            subscription.unsubscribe();
            return subscription;
          } else if (!(subscription instanceof Subscription5)) {
            var tmp = subscription;
            subscription = new Subscription5();
            subscription._subscriptions = [tmp];
          }
          break;
        default: {
          throw new Error("unrecognized teardown " + teardown + " added to Subscription.");
        }
      }
      var _parentOrParents = subscription._parentOrParents;
      if (_parentOrParents === null) {
        subscription._parentOrParents = this;
      } else if (_parentOrParents instanceof Subscription5) {
        if (_parentOrParents === this) {
          return subscription;
        }
        subscription._parentOrParents = [_parentOrParents, this];
      } else if (_parentOrParents.indexOf(this) === -1) {
        _parentOrParents.push(this);
      } else {
        return subscription;
      }
      var subscriptions = this._subscriptions;
      if (subscriptions === null) {
        this._subscriptions = [subscription];
      } else {
        subscriptions.push(subscription);
      }
      return subscription;
    };
    Subscription5.prototype.remove = function(subscription) {
      var subscriptions = this._subscriptions;
      if (subscriptions) {
        var subscriptionIndex = subscriptions.indexOf(subscription);
        if (subscriptionIndex !== -1) {
          subscriptions.splice(subscriptionIndex, 1);
        }
      }
    };
    Subscription5.EMPTY = function(empty2) {
      empty2.closed = true;
      return empty2;
    }(new Subscription5());
    return Subscription5;
  }();
  function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function(errs, err) {
      return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
    }, []);
  }

  // node_modules/rxjs/_esm5/internal/symbol/rxSubscriber.js
  var rxSubscriber = /* @__PURE__ */ function() {
    return typeof Symbol === "function" ? /* @__PURE__ */ Symbol("rxSubscriber") : "@@rxSubscriber_" + /* @__PURE__ */ Math.random();
  }();

  // node_modules/rxjs/_esm5/internal/Subscriber.js
  var Subscriber = /* @__PURE__ */ function(_super) {
    __extends(Subscriber5, _super);
    function Subscriber5(destinationOrNext, error, complete) {
      var _this = _super.call(this) || this;
      _this.syncErrorValue = null;
      _this.syncErrorThrown = false;
      _this.syncErrorThrowable = false;
      _this.isStopped = false;
      switch (arguments.length) {
        case 0:
          _this.destination = empty;
          break;
        case 1:
          if (!destinationOrNext) {
            _this.destination = empty;
            break;
          }
          if (typeof destinationOrNext === "object") {
            if (destinationOrNext instanceof Subscriber5) {
              _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
              _this.destination = destinationOrNext;
              destinationOrNext.add(_this);
            } else {
              _this.syncErrorThrowable = true;
              _this.destination = new SafeSubscriber(_this, destinationOrNext);
            }
            break;
          }
        default:
          _this.syncErrorThrowable = true;
          _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
          break;
      }
      return _this;
    }
    Subscriber5.prototype[rxSubscriber] = function() {
      return this;
    };
    Subscriber5.create = function(next, error, complete) {
      var subscriber = new Subscriber5(next, error, complete);
      subscriber.syncErrorThrowable = false;
      return subscriber;
    };
    Subscriber5.prototype.next = function(value) {
      if (!this.isStopped) {
        this._next(value);
      }
    };
    Subscriber5.prototype.error = function(err) {
      if (!this.isStopped) {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber5.prototype.complete = function() {
      if (!this.isStopped) {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber5.prototype.unsubscribe = function() {
      if (this.closed) {
        return;
      }
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
    };
    Subscriber5.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber5.prototype._error = function(err) {
      this.destination.error(err);
      this.unsubscribe();
    };
    Subscriber5.prototype._complete = function() {
      this.destination.complete();
      this.unsubscribe();
    };
    Subscriber5.prototype._unsubscribeAndRecycle = function() {
      var _parentOrParents = this._parentOrParents;
      this._parentOrParents = null;
      this.unsubscribe();
      this.closed = false;
      this.isStopped = false;
      this._parentOrParents = _parentOrParents;
      return this;
    };
    return Subscriber5;
  }(Subscription);
  var SafeSubscriber = /* @__PURE__ */ function(_super) {
    __extends(SafeSubscriber2, _super);
    function SafeSubscriber2(_parentSubscriber, observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      _this._parentSubscriber = _parentSubscriber;
      var next;
      var context = _this;
      if (isFunction(observerOrNext)) {
        next = observerOrNext;
      } else if (observerOrNext) {
        next = observerOrNext.next;
        error = observerOrNext.error;
        complete = observerOrNext.complete;
        if (observerOrNext !== empty) {
          context = Object.create(observerOrNext);
          if (isFunction(context.unsubscribe)) {
            _this.add(context.unsubscribe.bind(context));
          }
          context.unsubscribe = _this.unsubscribe.bind(_this);
        }
      }
      _this._context = context;
      _this._next = next;
      _this._error = error;
      _this._complete = complete;
      return _this;
    }
    SafeSubscriber2.prototype.next = function(value) {
      if (!this.isStopped && this._next) {
        var _parentSubscriber = this._parentSubscriber;
        if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
          this.__tryOrUnsub(this._next, value);
        } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
          this.unsubscribe();
        }
      }
    };
    SafeSubscriber2.prototype.error = function(err) {
      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;
        var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
        if (this._error) {
          if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
            this.__tryOrUnsub(this._error, err);
            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, this._error, err);
            this.unsubscribe();
          }
        } else if (!_parentSubscriber.syncErrorThrowable) {
          this.unsubscribe();
          if (useDeprecatedSynchronousErrorHandling) {
            throw err;
          }
          hostReportError(err);
        } else {
          if (useDeprecatedSynchronousErrorHandling) {
            _parentSubscriber.syncErrorValue = err;
            _parentSubscriber.syncErrorThrown = true;
          } else {
            hostReportError(err);
          }
          this.unsubscribe();
        }
      }
    };
    SafeSubscriber2.prototype.complete = function() {
      var _this = this;
      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;
        if (this._complete) {
          var wrappedComplete = function() {
            return _this._complete.call(_this._context);
          };
          if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
            this.__tryOrUnsub(wrappedComplete);
            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, wrappedComplete);
            this.unsubscribe();
          }
        } else {
          this.unsubscribe();
        }
      }
    };
    SafeSubscriber2.prototype.__tryOrUnsub = function(fn, value) {
      try {
        fn.call(this._context, value);
      } catch (err) {
        this.unsubscribe();
        if (config.useDeprecatedSynchronousErrorHandling) {
          throw err;
        } else {
          hostReportError(err);
        }
      }
    };
    SafeSubscriber2.prototype.__tryOrSetError = function(parent, fn, value) {
      if (!config.useDeprecatedSynchronousErrorHandling) {
        throw new Error("bad call");
      }
      try {
        fn.call(this._context, value);
      } catch (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
          parent.syncErrorValue = err;
          parent.syncErrorThrown = true;
          return true;
        } else {
          hostReportError(err);
          return true;
        }
      }
      return false;
    };
    SafeSubscriber2.prototype._unsubscribe = function() {
      var _parentSubscriber = this._parentSubscriber;
      this._context = null;
      this._parentSubscriber = null;
      _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber2;
  }(Subscriber);

  // node_modules/rxjs/_esm5/internal/util/canReportError.js
  function canReportError(observer) {
    while (observer) {
      var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
      if (closed_1 || isStopped) {
        return false;
      } else if (destination && destination instanceof Subscriber) {
        observer = destination;
      } else {
        observer = null;
      }
    }
    return true;
  }

  // node_modules/rxjs/_esm5/internal/util/toSubscriber.js
  function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
      if (nextOrObserver instanceof Subscriber) {
        return nextOrObserver;
      }
      if (nextOrObserver[rxSubscriber]) {
        return nextOrObserver[rxSubscriber]();
      }
    }
    if (!nextOrObserver && !error && !complete) {
      return new Subscriber(empty);
    }
    return new Subscriber(nextOrObserver, error, complete);
  }

  // node_modules/rxjs/_esm5/internal/symbol/observable.js
  var observable = /* @__PURE__ */ function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();

  // node_modules/rxjs/_esm5/internal/util/identity.js
  function identity(x) {
    return x;
  }

  // node_modules/rxjs/_esm5/internal/util/pipe.js
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }

  // node_modules/rxjs/_esm5/internal/Observable.js
  var Observable = /* @__PURE__ */ function() {
    function Observable5(subscribe) {
      this._isScalar = false;
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable5.prototype.lift = function(operator) {
      var observable3 = new Observable5();
      observable3.source = this;
      observable3.operator = operator;
      return observable3;
    };
    Observable5.prototype.subscribe = function(observerOrNext, error, complete) {
      var operator = this.operator;
      var sink = toSubscriber(observerOrNext, error, complete);
      if (operator) {
        sink.add(operator.call(sink, this.source));
      } else {
        sink.add(this.source || config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
      }
      if (config.useDeprecatedSynchronousErrorHandling) {
        if (sink.syncErrorThrowable) {
          sink.syncErrorThrowable = false;
          if (sink.syncErrorThrown) {
            throw sink.syncErrorValue;
          }
        }
      }
      return sink;
    };
    Observable5.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
          sink.syncErrorThrown = true;
          sink.syncErrorValue = err;
        }
        if (canReportError(sink)) {
          sink.error(err);
        } else {
          console.warn(err);
        }
      }
    };
    Observable5.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var subscription;
        subscription = _this.subscribe(function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            if (subscription) {
              subscription.unsubscribe();
            }
          }
        }, reject, resolve);
      });
    };
    Observable5.prototype._subscribe = function(subscriber) {
      var source = this.source;
      return source && source.subscribe(subscriber);
    };
    Observable5.prototype[observable] = function() {
      return this;
    };
    Observable5.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      if (operations.length === 0) {
        return this;
      }
      return pipeFromArray(operations)(this);
    };
    Observable5.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var value;
        _this.subscribe(function(x) {
          return value = x;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve(value);
        });
      });
    };
    Observable5.create = function(subscribe) {
      return new Observable5(subscribe);
    };
    return Observable5;
  }();
  function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
      promiseCtor = config.Promise || Promise;
    }
    if (!promiseCtor) {
      throw new Error("no Promise impl found");
    }
    return promiseCtor;
  }

  // node_modules/rxjs/_esm5/internal/util/ObjectUnsubscribedError.js
  var ObjectUnsubscribedErrorImpl = /* @__PURE__ */ function() {
    function ObjectUnsubscribedErrorImpl2() {
      Error.call(this);
      this.message = "object unsubscribed";
      this.name = "ObjectUnsubscribedError";
      return this;
    }
    ObjectUnsubscribedErrorImpl2.prototype = /* @__PURE__ */ Object.create(Error.prototype);
    return ObjectUnsubscribedErrorImpl2;
  }();
  var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

  // node_modules/rxjs/_esm5/internal/SubjectSubscription.js
  var SubjectSubscription = /* @__PURE__ */ function(_super) {
    __extends(SubjectSubscription3, _super);
    function SubjectSubscription3(subject, subscriber) {
      var _this = _super.call(this) || this;
      _this.subject = subject;
      _this.subscriber = subscriber;
      _this.closed = false;
      return _this;
    }
    SubjectSubscription3.prototype.unsubscribe = function() {
      if (this.closed) {
        return;
      }
      this.closed = true;
      var subject = this.subject;
      var observers = subject.observers;
      this.subject = null;
      if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
        return;
      }
      var subscriberIndex = observers.indexOf(this.subscriber);
      if (subscriberIndex !== -1) {
        observers.splice(subscriberIndex, 1);
      }
    };
    return SubjectSubscription3;
  }(Subscription);

  // node_modules/rxjs/_esm5/internal/Subject.js
  var SubjectSubscriber = /* @__PURE__ */ function(_super) {
    __extends(SubjectSubscriber2, _super);
    function SubjectSubscriber2(destination) {
      var _this = _super.call(this, destination) || this;
      _this.destination = destination;
      return _this;
    }
    return SubjectSubscriber2;
  }(Subscriber);
  var Subject = /* @__PURE__ */ function(_super) {
    __extends(Subject3, _super);
    function Subject3() {
      var _this = _super.call(this) || this;
      _this.observers = [];
      _this.closed = false;
      _this.isStopped = false;
      _this.hasError = false;
      _this.thrownError = null;
      return _this;
    }
    Subject3.prototype[rxSubscriber] = function() {
      return new SubjectSubscriber(this);
    };
    Subject3.prototype.lift = function(operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };
    Subject3.prototype.next = function(value) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
      if (!this.isStopped) {
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
          copy[i].next(value);
        }
      }
    };
    Subject3.prototype.error = function(err) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
      this.hasError = true;
      this.thrownError = err;
      this.isStopped = true;
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();
      for (var i = 0; i < len; i++) {
        copy[i].error(err);
      }
      this.observers.length = 0;
    };
    Subject3.prototype.complete = function() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
      this.isStopped = true;
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();
      for (var i = 0; i < len; i++) {
        copy[i].complete();
      }
      this.observers.length = 0;
    };
    Subject3.prototype.unsubscribe = function() {
      this.isStopped = true;
      this.closed = true;
      this.observers = null;
    };
    Subject3.prototype._trySubscribe = function(subscriber) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else {
        return _super.prototype._trySubscribe.call(this, subscriber);
      }
    };
    Subject3.prototype._subscribe = function(subscriber) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else if (this.hasError) {
        subscriber.error(this.thrownError);
        return Subscription.EMPTY;
      } else if (this.isStopped) {
        subscriber.complete();
        return Subscription.EMPTY;
      } else {
        this.observers.push(subscriber);
        return new SubjectSubscription(this, subscriber);
      }
    };
    Subject3.prototype.asObservable = function() {
      var observable3 = new Observable();
      observable3.source = this;
      return observable3;
    };
    Subject3.create = function(destination, source) {
      return new AnonymousSubject(destination, source);
    };
    return Subject3;
  }(Observable);
  var AnonymousSubject = /* @__PURE__ */ function(_super) {
    __extends(AnonymousSubject2, _super);
    function AnonymousSubject2(destination, source) {
      var _this = _super.call(this) || this;
      _this.destination = destination;
      _this.source = source;
      return _this;
    }
    AnonymousSubject2.prototype.next = function(value) {
      var destination = this.destination;
      if (destination && destination.next) {
        destination.next(value);
      }
    };
    AnonymousSubject2.prototype.error = function(err) {
      var destination = this.destination;
      if (destination && destination.error) {
        this.destination.error(err);
      }
    };
    AnonymousSubject2.prototype.complete = function() {
      var destination = this.destination;
      if (destination && destination.complete) {
        this.destination.complete();
      }
    };
    AnonymousSubject2.prototype._subscribe = function(subscriber) {
      var source = this.source;
      if (source) {
        return this.source.subscribe(subscriber);
      } else {
        return Subscription.EMPTY;
      }
    };
    return AnonymousSubject2;
  }(Subject);

  // node_modules/rxjs/_esm5/internal/BehaviorSubject.js
  var BehaviorSubject = /* @__PURE__ */ function(_super) {
    __extends(BehaviorSubject2, _super);
    function BehaviorSubject2(_value) {
      var _this = _super.call(this) || this;
      _this._value = _value;
      return _this;
    }
    Object.defineProperty(BehaviorSubject2.prototype, "value", {
      get: function() {
        return this.getValue();
      },
      enumerable: true,
      configurable: true
    });
    BehaviorSubject2.prototype._subscribe = function(subscriber) {
      var subscription = _super.prototype._subscribe.call(this, subscriber);
      if (subscription && !subscription.closed) {
        subscriber.next(this._value);
      }
      return subscription;
    };
    BehaviorSubject2.prototype.getValue = function() {
      if (this.hasError) {
        throw this.thrownError;
      } else if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else {
        return this._value;
      }
    };
    BehaviorSubject2.prototype.next = function(value) {
      _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject2;
  }(Subject);

  // node_modules/rxjs/_esm5/internal/util/isObservable.js
  function isObservable(obj) {
    return !!obj && (obj instanceof Observable || typeof obj.lift === "function" && typeof obj.subscribe === "function");
  }

  // src/jsxSpec/renderSpec.ts
  function renderSpec(structure) {
    return renderSpecDoc(document, structure);
  }
  const booleanProps = new Set([
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "draggable",
    "hidden",
    "loop",
    "multiple",
    "novalidate",
    "open",
    "readonly",
    "required",
    "reversed",
    "scoped",
    "selected",
    "spellcheck",
    "wrap"
  ]);
  function renderSpecDoc(doc, structure) {
    if (structure instanceof DOMSpecElement)
      structure = structure.spec;
    if (typeof structure === "string")
      return {dom: doc.createTextNode(structure)};
    const sub = new Subscription();
    if (isObservable(structure)) {
      let wrappedNode = document.createTextNode("");
      let {dom: wrappedDom} = renderSpecDoc(doc, [
        "render-observable",
        null,
        wrappedNode
      ]);
      let wrappedSub = void 0;
      sub.add(structure.subscribe((spec) => {
        const oldNode = wrappedNode;
        const rendered = renderSpecDoc(doc, spec);
        wrappedNode = rendered.dom;
        oldNode.replaceWith(wrappedNode);
        if (wrappedSub) {
          sub.remove(wrappedSub);
          wrappedSub.unsubscribe();
        }
        wrappedSub = rendered.subscription;
        if (wrappedSub) {
          sub.add(wrappedSub);
        }
      }));
      return {dom: wrappedDom, subscription: sub};
    }
    if (structure["nodeType"] != null)
      return {dom: structure};
    const tagName = structure[0];
    if (tagName.indexOf(" ") > 0) {
      throw new RangeError(`Unexpected space in tagName ("${tagName}")`);
    }
    const dom = doc.createElement(tagName);
    const attrs = structure[1];
    let ref = void 0;
    if (attrs != null) {
      for (let name in attrs) {
        const attrVal = attrs[name];
        const directAssign = name.startsWith("on") || booleanProps.has(name);
        if (attrVal != null) {
          if (isObservable(attrVal)) {
            if (name === "$style") {
              if (isObservable(attrs.style))
                throw new RangeError("Cannot combine style$ property with an Observable [style] property.");
              sub.add(attrVal.subscribe((value) => {
                Object.assign(dom.style, value);
              }));
            } else if (directAssign) {
              sub.add(attrVal.subscribe((value) => {
                if (dom[name] !== value)
                  dom[name] = value;
              }));
            } else
              sub.add(attrVal.subscribe((value) => {
                if (value == null)
                  dom.removeAttribute(name);
                else
                  dom.setAttribute(name, String(value));
              }));
          } else if (attrVal != null) {
            if (directAssign) {
              dom[name] = attrVal;
            } else if (name === "ref") {
              ref = attrVal;
            } else
              dom.setAttribute(name, attrVal);
          }
        }
      }
    }
    for (let i = 2; i < structure.length; i++) {
      let child = structure[i];
      const {dom: inner, subscription} = renderSpecDoc(doc, child);
      if (subscription)
        sub.add(subscription);
      dom.appendChild(inner);
    }
    ref?.(dom);
    return {dom, subscription: sub};
  }

  // src/app.tsx
  const $name = new BehaviorSubject("world");
  const render = renderSpec(/* @__PURE__ */ h("div", {
    ref: (a) => setTimeout(() => console.log("div ref", a.outerHTML, a.offsetWidth), 0)
  }, /* @__PURE__ */ h(SuperLabel, {
    name: $name,
    class: "golden"
  }), /* @__PURE__ */ h("br", null), /* @__PURE__ */ h("input", {
    ref: console.log.bind(console, "ref"),
    oninput: onInputValue((updatedValue) => $name.next(updatedValue)),
    value: $name
  })));
  function onInputValue(then) {
    return function() {
      return then(this.value);
    };
  }
  document.body.append(render.dom);
  function SuperLabel({
    name,
    ...labelProps
  }) {
    return /* @__PURE__ */ h("label", {
      ...labelProps
    }, name, "\u{1F526}");
  }
})();
//# sourceMappingURL=main.js.map
