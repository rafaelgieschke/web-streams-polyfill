var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var AssertionError = function (_Error) {
  inherits(AssertionError, _Error);

  function AssertionError() {
    classCallCheck(this, AssertionError);
    return possibleConstructorReturn(this, _Error.apply(this, arguments));
  }

  return AssertionError;
}(Error);

function assert(test) {
  if (!test) {
    throw new AssertionError();
  }
}

var betterAssert = ({
AssertionError: AssertionError,
default: assert
});

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var assert$1 = ( betterAssert && assert ) || betterAssert;

var helpers = createCommonjsModule(function (module, exports) {

  var isFakeDetached = Symbol('is "detached" for our purposes');

  function IsPropertyKey(argument) {
    return typeof argument === 'string' || (typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'symbol';
  }

  exports.typeIsObject = function (x) {
    return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null || typeof x === 'function';
  };

  exports.createDataProperty = function (o, p, v) {
    assert$1(exports.typeIsObject(o));
    Object.defineProperty(o, p, { value: v, writable: true, enumerable: true, configurable: true });
  };

  exports.createArrayFromList = function (elements) {
    // We use arrays to represent lists, so this is basically a no-op.
    // Do a slice though just in case we happen to depend on the unique-ness.
    return elements.slice();
  };

  exports.ArrayBufferCopy = function (dest, destOffset, src, srcOffset, n) {
    new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
  };

  exports.CreateIterResultObject = function (value, done) {
    assert$1(typeof done === 'boolean');
    var obj = {};
    Object.defineProperty(obj, 'value', { value: value, enumerable: true, writable: true, configurable: true });
    Object.defineProperty(obj, 'done', { value: done, enumerable: true, writable: true, configurable: true });
    return obj;
  };

  exports.IsFiniteNonNegativeNumber = function (v) {
    if (exports.IsNonNegativeNumber(v) === false) {
      return false;
    }

    if (v === Infinity) {
      return false;
    }

    return true;
  };

  exports.IsNonNegativeNumber = function (v) {
    if (typeof v !== 'number') {
      return false;
    }

    if (Number.isNaN(v)) {
      return false;
    }

    if (v < 0) {
      return false;
    }

    return true;
  };

  function Call(F, V, args) {
    if (typeof F !== 'function') {
      throw new TypeError('Argument is not a function');
    }

    return Function.prototype.apply.call(F, V, args);
  }

  exports.Call = Call;

  exports.CreateAlgorithmFromUnderlyingMethod = function (underlyingObject, methodName, algoArgCount, extraArgs) {
    assert$1(underlyingObject !== undefined);
    assert$1(IsPropertyKey(methodName));
    assert$1(algoArgCount === 0 || algoArgCount === 1);
    assert$1(Array.isArray(extraArgs));
    var method = underlyingObject[methodName];
    if (method !== undefined) {
      if (typeof method !== 'function') {
        throw new TypeError(method + ' is not a method');
      }
      switch (algoArgCount) {
        case 0:
          {
            return function () {
              return PromiseCall(method, underlyingObject, extraArgs);
            };
          }

        case 1:
          {
            return function (arg) {
              var fullArgs = [arg].concat(extraArgs);
              return PromiseCall(method, underlyingObject, fullArgs);
            };
          }
      }
    }
    return function () {
      return Promise.resolve();
    };
  };

  exports.InvokeOrNoop = function (O, P, args) {
    assert$1(O !== undefined);
    assert$1(IsPropertyKey(P));
    assert$1(Array.isArray(args));

    var method = O[P];
    if (method === undefined) {
      return undefined;
    }

    return Call(method, O, args);
  };

  function PromiseCall(F, V, args) {
    assert$1(typeof F === 'function');
    assert$1(V !== undefined);
    assert$1(Array.isArray(args));
    try {
      return Promise.resolve(Call(F, V, args));
    } catch (value) {
      return Promise.reject(value);
    }
  }

  exports.PromiseCall = PromiseCall;

  // Not implemented correctly
  exports.TransferArrayBuffer = function (O) {
    assert$1(!exports.IsDetachedBuffer(O));
    var transferredIshVersion = O.slice();

    // This is specifically to fool tests that test "is transferred" by taking a non-zero-length
    // ArrayBuffer and checking if its byteLength starts returning 0.
    Object.defineProperty(O, 'byteLength', {
      get: function get$$1() {
        return 0;
      }
    });
    O[isFakeDetached] = true;

    return transferredIshVersion;
  };

  // Not implemented correctly
  exports.IsDetachedBuffer = function (O) {
    return isFakeDetached in O;
  };

  exports.ValidateAndNormalizeHighWaterMark = function (highWaterMark) {
    highWaterMark = Number(highWaterMark);
    if (Number.isNaN(highWaterMark) || highWaterMark < 0) {
      throw new RangeError('highWaterMark property of a queuing strategy must be non-negative and non-NaN');
    }

    return highWaterMark;
  };

  exports.MakeSizeAlgorithmFromSizeFunction = function (size) {
    if (size === undefined) {
      return function () {
        return 1;
      };
    }
    if (typeof size !== 'function') {
      throw new TypeError('size property of a queuing strategy must be a function');
    }
    return function (chunk) {
      return size(chunk);
    };
  };
});
var helpers_1 = helpers.typeIsObject;
var helpers_2 = helpers.createDataProperty;
var helpers_3 = helpers.createArrayFromList;
var helpers_4 = helpers.ArrayBufferCopy;
var helpers_5 = helpers.CreateIterResultObject;
var helpers_6 = helpers.IsFiniteNonNegativeNumber;
var helpers_7 = helpers.IsNonNegativeNumber;
var helpers_8 = helpers.Call;
var helpers_9 = helpers.CreateAlgorithmFromUnderlyingMethod;
var helpers_10 = helpers.InvokeOrNoop;
var helpers_11 = helpers.PromiseCall;
var helpers_12 = helpers.TransferArrayBuffer;
var helpers_13 = helpers.IsDetachedBuffer;
var helpers_14 = helpers.ValidateAndNormalizeHighWaterMark;
var helpers_15 = helpers.MakeSizeAlgorithmFromSizeFunction;

var rethrowAssertionErrorRejection = function rethrowAssertionErrorRejection(e) {
  // Used throughout the reference implementation, as `.catch(rethrowAssertionErrorRejection)`, to ensure any errors
  // get shown. There are places in the spec where we do promise transformations and purposefully ignore or don't
  // expect any errors, but assertion errors are always problematic.
  if (e && e.constructor === assert$1.AssertionError) {
    setTimeout(function () {
      throw e;
    }, 0);
  }
};

var utils = {
  rethrowAssertionErrorRejection: rethrowAssertionErrorRejection
};

var IsFiniteNonNegativeNumber = helpers.IsFiniteNonNegativeNumber;


var DequeueValue = function DequeueValue(container) {
  assert$1('_queue' in container && '_queueTotalSize' in container);
  assert$1(container._queue.length > 0);

  var pair = container._queue.shift();
  container._queueTotalSize -= pair.size;
  if (container._queueTotalSize < 0) {
    container._queueTotalSize = 0;
  }

  return pair.value;
};

var EnqueueValueWithSize = function EnqueueValueWithSize(container, value, size) {
  assert$1('_queue' in container && '_queueTotalSize' in container);

  size = Number(size);
  if (!IsFiniteNonNegativeNumber(size)) {
    throw new RangeError('Size must be a finite, non-NaN, non-negative number.');
  }

  container._queue.push({ value: value, size: size });
  container._queueTotalSize += size;
};

var PeekQueueValue = function PeekQueueValue(container) {
  assert$1('_queue' in container && '_queueTotalSize' in container);
  assert$1(container._queue.length > 0);

  var pair = container._queue[0];
  return pair.value;
};

var ResetQueue = function ResetQueue(container) {
  assert$1('_queue' in container && '_queueTotalSize' in container);

  container._queue = [];
  container._queueTotalSize = 0;
};

var queueWithSizes = {
  DequeueValue: DequeueValue,
  EnqueueValueWithSize: EnqueueValueWithSize,
  PeekQueueValue: PeekQueueValue,
  ResetQueue: ResetQueue
};

function noop() {
  // do nothing
}

function createDebugMessage(namespace, message) {
  return '[' + namespace + '] ' + message;
}

function debug(namespace) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined') {
    if (typeof console.debug === 'function') {
      return function (message) {
        return console.debug(createDebugMessage(namespace, message));
      };
    }
    if (typeof console.log === 'function') {
      return function (message) {
        return console.log(createDebugMessage(namespace, message));
      };
    }
  }
  return noop;
}

var debug$1 = ({
default: debug
});

var require$$0 = ( debug$1 && debug ) || debug$1;

// Calls to verbose() are purely for debugging the reference implementation and tests. They are not part of the standard
// and do not appear in the standard text.
var verbose = require$$0('streams:writable-stream:verbose');

var CreateAlgorithmFromUnderlyingMethod = helpers.CreateAlgorithmFromUnderlyingMethod,
    InvokeOrNoop = helpers.InvokeOrNoop,
    ValidateAndNormalizeHighWaterMark = helpers.ValidateAndNormalizeHighWaterMark,
    IsNonNegativeNumber = helpers.IsNonNegativeNumber,
    MakeSizeAlgorithmFromSizeFunction = helpers.MakeSizeAlgorithmFromSizeFunction,
    typeIsObject = helpers.typeIsObject;
var rethrowAssertionErrorRejection$1 = utils.rethrowAssertionErrorRejection;
var DequeueValue$1 = queueWithSizes.DequeueValue,
    EnqueueValueWithSize$1 = queueWithSizes.EnqueueValueWithSize,
    PeekQueueValue$1 = queueWithSizes.PeekQueueValue,
    ResetQueue$1 = queueWithSizes.ResetQueue;


var AbortSteps = Symbol('[[AbortSteps]]');
var ErrorSteps = Symbol('[[ErrorSteps]]');

var WritableStream = function () {
  function WritableStream() {
    var underlyingSink = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        size = _ref.size,
        _ref$highWaterMark = _ref.highWaterMark,
        highWaterMark = _ref$highWaterMark === undefined ? 1 : _ref$highWaterMark;

    classCallCheck(this, WritableStream);

    InitializeWritableStream(this);

    var type = underlyingSink.type;

    if (type !== undefined) {
      throw new RangeError('Invalid type is specified');
    }

    var sizeAlgorithm = MakeSizeAlgorithmFromSizeFunction(size);
    highWaterMark = ValidateAndNormalizeHighWaterMark(highWaterMark);

    SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
  }

  WritableStream.prototype.abort = function abort(reason) {
    if (IsWritableStream(this) === false) {
      return Promise.reject(streamBrandCheckException('abort'));
    }

    if (IsWritableStreamLocked(this) === true) {
      return Promise.reject(new TypeError('Cannot abort a stream that already has a writer'));
    }

    return WritableStreamAbort(this, reason);
  };

  WritableStream.prototype.getWriter = function getWriter() {
    if (IsWritableStream(this) === false) {
      throw streamBrandCheckException('getWriter');
    }

    return AcquireWritableStreamDefaultWriter(this);
  };

  createClass(WritableStream, [{
    key: 'locked',
    get: function get$$1() {
      if (IsWritableStream(this) === false) {
        throw streamBrandCheckException('locked');
      }

      return IsWritableStreamLocked(this);
    }
  }]);
  return WritableStream;
}();

var writableStream = {
  AcquireWritableStreamDefaultWriter: AcquireWritableStreamDefaultWriter,
  CreateWritableStream: CreateWritableStream,
  IsWritableStream: IsWritableStream,
  IsWritableStreamLocked: IsWritableStreamLocked,
  WritableStream: WritableStream,
  WritableStreamAbort: WritableStreamAbort,
  WritableStreamDefaultControllerErrorIfNeeded: WritableStreamDefaultControllerErrorIfNeeded,
  WritableStreamDefaultWriterCloseWithErrorPropagation: WritableStreamDefaultWriterCloseWithErrorPropagation,
  WritableStreamDefaultWriterRelease: WritableStreamDefaultWriterRelease,
  WritableStreamDefaultWriterWrite: WritableStreamDefaultWriterWrite,
  WritableStreamCloseQueuedOrInFlight: WritableStreamCloseQueuedOrInFlight
};

// Abstract operations for the WritableStream.

function AcquireWritableStreamDefaultWriter(stream) {
  return new WritableStreamDefaultWriter(stream);
}

// Throws if and only if startAlgorithm throws.
function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm) {
  var highWaterMark = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var sizeAlgorithm = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function () {
    return 1;
  };

  assert$1(IsNonNegativeNumber(highWaterMark) === true);

  var stream = Object.create(WritableStream.prototype);
  InitializeWritableStream(stream);

  var controller = Object.create(WritableStreamDefaultController.prototype);

  SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
  return stream;
}

function InitializeWritableStream(stream) {
  stream._state = 'writable';

  // The error that will be reported by new method calls once the state becomes errored. Only set when [[state]] is
  // 'erroring' or 'errored'. May be set to an undefined value.
  stream._storedError = undefined;

  stream._writer = undefined;

  // Initialize to undefined first because the constructor of the controller checks this
  // variable to validate the caller.
  stream._writableStreamController = undefined;

  // This queue is placed here instead of the writer class in order to allow for passing a writer to the next data
  // producer without waiting for the queued writes to finish.
  stream._writeRequests = [];

  // Write requests are removed from _writeRequests when write() is called on the underlying sink. This prevents
  // them from being erroneously rejected on error. If a write() call is in-flight, the request is stored here.
  stream._inFlightWriteRequest = undefined;

  // The promise that was returned from writer.close(). Stored here because it may be fulfilled after the writer
  // has been detached.
  stream._closeRequest = undefined;

  // Close request is removed from _closeRequest when close() is called on the underlying sink. This prevents it
  // from being erroneously rejected on error. If a close() call is in-flight, the request is stored here.
  stream._inFlightCloseRequest = undefined;

  // The promise that was returned from writer.abort(). This may also be fulfilled after the writer has detached.
  stream._pendingAbortRequest = undefined;

  // The backpressure signal set by the controller.
  stream._backpressure = false;
}

function IsWritableStream(x) {
  if (!typeIsObject(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_writableStreamController')) {
    return false;
  }

  return true;
}

function IsWritableStreamLocked(stream) {
  assert$1(IsWritableStream(stream) === true);

  if (stream._writer === undefined) {
    return false;
  }

  return true;
}

function WritableStreamAbort(stream, reason) {
  var state = stream._state;
  if (state === 'closed') {
    return Promise.resolve(undefined);
  }
  if (state === 'errored') {
    return Promise.reject(stream._storedError);
  }
  var error = new TypeError('Requested to abort');
  if (stream._pendingAbortRequest !== undefined) {
    return Promise.reject(error);
  }

  assert$1(state === 'writable' || state === 'erroring');

  var wasAlreadyErroring = false;
  if (state === 'erroring') {
    wasAlreadyErroring = true;
    // reason will not be used, so don't keep a reference to it.
    reason = undefined;
  }

  var promise = new Promise(function (resolve, reject) {
    stream._pendingAbortRequest = {
      _resolve: resolve,
      _reject: reject,
      _reason: reason,
      _wasAlreadyErroring: wasAlreadyErroring
    };
  });

  if (wasAlreadyErroring === false) {
    WritableStreamStartErroring(stream, error);
  }

  return promise;
}

// WritableStream API exposed for controllers.

function WritableStreamAddWriteRequest(stream) {
  assert$1(IsWritableStreamLocked(stream) === true);
  assert$1(stream._state === 'writable');

  var promise = new Promise(function (resolve, reject) {
    var writeRequest = {
      _resolve: resolve,
      _reject: reject
    };

    stream._writeRequests.push(writeRequest);
  });

  return promise;
}

function WritableStreamDealWithRejection(stream, error) {
  verbose('WritableStreamDealWithRejection(stream, %o)', error);
  var state = stream._state;

  if (state === 'writable') {
    WritableStreamStartErroring(stream, error);
    return;
  }

  assert$1(state === 'erroring');
  WritableStreamFinishErroring(stream);
}

function WritableStreamStartErroring(stream, reason) {
  verbose('WritableStreamStartErroring(stream, %o)', reason);
  assert$1(stream._storedError === undefined);
  assert$1(stream._state === 'writable');

  var controller = stream._writableStreamController;
  assert$1(controller !== undefined);

  stream._state = 'erroring';
  stream._storedError = reason;
  var writer = stream._writer;
  if (writer !== undefined) {
    WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
  }

  if (WritableStreamHasOperationMarkedInFlight(stream) === false && controller._started === true) {
    WritableStreamFinishErroring(stream);
  }
}

function WritableStreamFinishErroring(stream) {
  verbose('WritableStreamFinishErroring()');
  assert$1(stream._state === 'erroring');
  assert$1(WritableStreamHasOperationMarkedInFlight(stream) === false);
  stream._state = 'errored';
  stream._writableStreamController[ErrorSteps]();

  var storedError = stream._storedError;

  for (var _i2 = 0, _stream$_writeRequest2 = stream._writeRequests, _length2 = _stream$_writeRequest2.length; _i2 < _length2; _i2++) {
    var writeRequest = _stream$_writeRequest2[_i2];
    writeRequest._reject(storedError);
  }

  stream._writeRequests = [];

  if (stream._pendingAbortRequest === undefined) {
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }

  var abortRequest = stream._pendingAbortRequest;
  stream._pendingAbortRequest = undefined;

  if (abortRequest._wasAlreadyErroring === true) {
    abortRequest._reject(storedError);
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }

  var promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
  promise.then(function () {
    abortRequest._resolve();
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  }, function (reason) {
    abortRequest._reject(reason);
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  });
}

function WritableStreamFinishInFlightWrite(stream) {
  assert$1(stream._inFlightWriteRequest !== undefined);
  stream._inFlightWriteRequest._resolve(undefined);
  stream._inFlightWriteRequest = undefined;
}

function WritableStreamFinishInFlightWriteWithError(stream, error) {
  assert$1(stream._inFlightWriteRequest !== undefined);
  stream._inFlightWriteRequest._reject(error);
  stream._inFlightWriteRequest = undefined;

  assert$1(stream._state === 'writable' || stream._state === 'erroring');

  WritableStreamDealWithRejection(stream, error);
}

function WritableStreamFinishInFlightClose(stream) {
  assert$1(stream._inFlightCloseRequest !== undefined);
  stream._inFlightCloseRequest._resolve(undefined);
  stream._inFlightCloseRequest = undefined;

  var state = stream._state;

  assert$1(state === 'writable' || state === 'erroring');

  if (state === 'erroring') {
    // The error was too late to do anything, so it is ignored.
    stream._storedError = undefined;
    if (stream._pendingAbortRequest !== undefined) {
      stream._pendingAbortRequest._resolve();
      stream._pendingAbortRequest = undefined;
    }
  }

  stream._state = 'closed';

  var writer = stream._writer;
  if (writer !== undefined) {
    defaultWriterClosedPromiseResolve(writer);
  }

  assert$1(stream._pendingAbortRequest === undefined);
  assert$1(stream._storedError === undefined);
}

function WritableStreamFinishInFlightCloseWithError(stream, error) {
  assert$1(stream._inFlightCloseRequest !== undefined);
  stream._inFlightCloseRequest._reject(error);
  stream._inFlightCloseRequest = undefined;

  assert$1(stream._state === 'writable' || stream._state === 'erroring');

  // Never execute sink abort() after sink close().
  if (stream._pendingAbortRequest !== undefined) {
    stream._pendingAbortRequest._reject(error);
    stream._pendingAbortRequest = undefined;
  }
  WritableStreamDealWithRejection(stream, error);
}

// TODO(ricea): Fix alphabetical order.
function WritableStreamCloseQueuedOrInFlight(stream) {
  if (stream._closeRequest === undefined && stream._inFlightCloseRequest === undefined) {
    return false;
  }

  return true;
}

function WritableStreamHasOperationMarkedInFlight(stream) {
  if (stream._inFlightWriteRequest === undefined && stream._inFlightCloseRequest === undefined) {
    verbose('WritableStreamHasOperationMarkedInFlight() is false');
    return false;
  }

  verbose('WritableStreamHasOperationMarkedInFlight() is true');
  return true;
}

function WritableStreamMarkCloseRequestInFlight(stream) {
  assert$1(stream._inFlightCloseRequest === undefined);
  assert$1(stream._closeRequest !== undefined);
  stream._inFlightCloseRequest = stream._closeRequest;
  stream._closeRequest = undefined;
}

function WritableStreamMarkFirstWriteRequestInFlight(stream) {
  assert$1(stream._inFlightWriteRequest === undefined);
  assert$1(stream._writeRequests.length !== 0);
  stream._inFlightWriteRequest = stream._writeRequests.shift();
}

function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
  verbose('WritableStreamRejectCloseAndClosedPromiseIfNeeded()');
  assert$1(stream._state === 'errored');
  if (stream._closeRequest !== undefined) {
    assert$1(stream._inFlightCloseRequest === undefined);

    stream._closeRequest._reject(stream._storedError);
    stream._closeRequest = undefined;
  }
  var writer = stream._writer;
  if (writer !== undefined) {
    defaultWriterClosedPromiseReject(writer, stream._storedError);
    writer._closedPromise.catch(function () {});
  }
}

function WritableStreamUpdateBackpressure(stream, backpressure) {
  assert$1(stream._state === 'writable');
  assert$1(WritableStreamCloseQueuedOrInFlight(stream) === false);

  var writer = stream._writer;
  if (writer !== undefined && backpressure !== stream._backpressure) {
    if (backpressure === true) {
      defaultWriterReadyPromiseReset(writer);
    } else {
      assert$1(backpressure === false);

      defaultWriterReadyPromiseResolve(writer);
    }
  }

  stream._backpressure = backpressure;
}

var WritableStreamDefaultWriter = function () {
  function WritableStreamDefaultWriter(stream) {
    classCallCheck(this, WritableStreamDefaultWriter);

    if (IsWritableStream(stream) === false) {
      throw new TypeError('WritableStreamDefaultWriter can only be constructed with a WritableStream instance');
    }
    if (IsWritableStreamLocked(stream) === true) {
      throw new TypeError('This stream has already been locked for exclusive writing by another writer');
    }

    this._ownerWritableStream = stream;
    stream._writer = this;

    var state = stream._state;

    if (state === 'writable') {
      if (WritableStreamCloseQueuedOrInFlight(stream) === false && stream._backpressure === true) {
        defaultWriterReadyPromiseInitialize(this);
      } else {
        defaultWriterReadyPromiseInitializeAsResolved(this);
      }

      defaultWriterClosedPromiseInitialize(this);
    } else if (state === 'erroring') {
      defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
      this._readyPromise.catch(function () {});
      defaultWriterClosedPromiseInitialize(this);
    } else if (state === 'closed') {
      defaultWriterReadyPromiseInitializeAsResolved(this);
      defaultWriterClosedPromiseInitializeAsResolved(this);
    } else {
      assert$1(state === 'errored');

      var storedError = stream._storedError;
      defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
      this._readyPromise.catch(function () {});
      defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
      this._closedPromise.catch(function () {});
    }
  }

  WritableStreamDefaultWriter.prototype.abort = function abort(reason) {
    if (IsWritableStreamDefaultWriter(this) === false) {
      return Promise.reject(defaultWriterBrandCheckException('abort'));
    }

    if (this._ownerWritableStream === undefined) {
      return Promise.reject(defaultWriterLockException('abort'));
    }

    return WritableStreamDefaultWriterAbort(this, reason);
  };

  WritableStreamDefaultWriter.prototype.close = function close() {
    if (IsWritableStreamDefaultWriter(this) === false) {
      return Promise.reject(defaultWriterBrandCheckException('close'));
    }

    var stream = this._ownerWritableStream;

    if (stream === undefined) {
      return Promise.reject(defaultWriterLockException('close'));
    }

    if (WritableStreamCloseQueuedOrInFlight(stream) === true) {
      return Promise.reject(new TypeError('cannot close an already-closing stream'));
    }

    return WritableStreamDefaultWriterClose(this);
  };

  WritableStreamDefaultWriter.prototype.releaseLock = function releaseLock() {
    if (IsWritableStreamDefaultWriter(this) === false) {
      throw defaultWriterBrandCheckException('releaseLock');
    }

    var stream = this._ownerWritableStream;

    if (stream === undefined) {
      return;
    }

    assert$1(stream._writer !== undefined);

    WritableStreamDefaultWriterRelease(this);
  };

  WritableStreamDefaultWriter.prototype.write = function write(chunk) {
    if (IsWritableStreamDefaultWriter(this) === false) {
      return Promise.reject(defaultWriterBrandCheckException('write'));
    }

    if (this._ownerWritableStream === undefined) {
      return Promise.reject(defaultWriterLockException('write to'));
    }

    return WritableStreamDefaultWriterWrite(this, chunk);
  };

  createClass(WritableStreamDefaultWriter, [{
    key: 'closed',
    get: function get$$1() {
      if (IsWritableStreamDefaultWriter(this) === false) {
        return Promise.reject(defaultWriterBrandCheckException('closed'));
      }

      return this._closedPromise;
    }
  }, {
    key: 'desiredSize',
    get: function get$$1() {
      if (IsWritableStreamDefaultWriter(this) === false) {
        throw defaultWriterBrandCheckException('desiredSize');
      }

      if (this._ownerWritableStream === undefined) {
        throw defaultWriterLockException('desiredSize');
      }

      return WritableStreamDefaultWriterGetDesiredSize(this);
    }
  }, {
    key: 'ready',
    get: function get$$1() {
      if (IsWritableStreamDefaultWriter(this) === false) {
        return Promise.reject(defaultWriterBrandCheckException('ready'));
      }

      return this._readyPromise;
    }
  }]);
  return WritableStreamDefaultWriter;
}();

// Abstract operations for the WritableStreamDefaultWriter.

function IsWritableStreamDefaultWriter(x) {
  if (!typeIsObject(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_ownerWritableStream')) {
    return false;
  }

  return true;
}

// A client of WritableStreamDefaultWriter may use these functions directly to bypass state check.

function WritableStreamDefaultWriterAbort(writer, reason) {
  var stream = writer._ownerWritableStream;

  assert$1(stream !== undefined);

  return WritableStreamAbort(stream, reason);
}

function WritableStreamDefaultWriterClose(writer) {
  var stream = writer._ownerWritableStream;

  assert$1(stream !== undefined);

  var state = stream._state;
  if (state === 'closed' || state === 'errored') {
    return Promise.reject(new TypeError('The stream (in ' + state + ' state) is not in the writable state and cannot be closed'));
  }

  assert$1(state === 'writable' || state === 'erroring');
  assert$1(WritableStreamCloseQueuedOrInFlight(stream) === false);

  var promise = new Promise(function (resolve, reject) {
    var closeRequest = {
      _resolve: resolve,
      _reject: reject
    };

    stream._closeRequest = closeRequest;
  });

  if (stream._backpressure === true && state === 'writable') {
    defaultWriterReadyPromiseResolve(writer);
  }

  WritableStreamDefaultControllerClose(stream._writableStreamController);

  return promise;
}

function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
  var stream = writer._ownerWritableStream;

  assert$1(stream !== undefined);

  var state = stream._state;
  if (WritableStreamCloseQueuedOrInFlight(stream) === true || state === 'closed') {
    return Promise.resolve();
  }

  if (state === 'errored') {
    return Promise.reject(stream._storedError);
  }

  assert$1(state === 'writable' || state === 'erroring');

  return WritableStreamDefaultWriterClose(writer);
}

function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
  if (writer._closedPromiseState === 'pending') {
    defaultWriterClosedPromiseReject(writer, error);
  } else {
    defaultWriterClosedPromiseResetToRejected(writer, error);
  }
  writer._closedPromise.catch(function () {});
}

function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
  verbose('WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, %o)', error);
  if (writer._readyPromiseState === 'pending') {
    defaultWriterReadyPromiseReject(writer, error);
  } else {
    defaultWriterReadyPromiseResetToRejected(writer, error);
  }
  writer._readyPromise.catch(function () {});
}

function WritableStreamDefaultWriterGetDesiredSize(writer) {
  var stream = writer._ownerWritableStream;
  var state = stream._state;

  if (state === 'errored' || state === 'erroring') {
    return null;
  }

  if (state === 'closed') {
    return 0;
  }

  return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
}

function WritableStreamDefaultWriterRelease(writer) {
  var stream = writer._ownerWritableStream;
  assert$1(stream !== undefined);
  assert$1(stream._writer === writer);

  var releasedError = new TypeError('Writer was released and can no longer be used to monitor the stream\'s closedness');

  WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);

  // The state transitions to "errored" before the sink abort() method runs, but the writer.closed promise is not
  // rejected until afterwards. This means that simply testing state will not work.
  WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);

  stream._writer = undefined;
  writer._ownerWritableStream = undefined;
}

function WritableStreamDefaultWriterWrite(writer, chunk) {
  var stream = writer._ownerWritableStream;

  assert$1(stream !== undefined);

  var controller = stream._writableStreamController;

  var chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);

  if (stream !== writer._ownerWritableStream) {
    return Promise.reject(defaultWriterLockException('write to'));
  }

  var state = stream._state;
  if (state === 'errored') {
    return Promise.reject(stream._storedError);
  }
  if (WritableStreamCloseQueuedOrInFlight(stream) === true || state === 'closed') {
    return Promise.reject(new TypeError('The stream is closing or closed and cannot be written to'));
  }
  if (state === 'erroring') {
    return Promise.reject(stream._storedError);
  }

  assert$1(state === 'writable');

  var promise = WritableStreamAddWriteRequest(stream);

  WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);

  return promise;
}

var WritableStreamDefaultController = function () {
  function WritableStreamDefaultController() {
    classCallCheck(this, WritableStreamDefaultController);

    throw new TypeError('WritableStreamDefaultController cannot be constructed explicitly');
  }

  WritableStreamDefaultController.prototype.error = function error(e) {
    if (IsWritableStreamDefaultController(this) === false) {
      throw new TypeError('WritableStreamDefaultController.prototype.error can only be used on a WritableStreamDefaultController');
    }
    var state = this._controlledWritableStream._state;
    if (state !== 'writable') {
      // The stream is closed, errored or will be soon. The sink can't do anything useful if it gets an error here, so
      // just treat it as a no-op.
      return;
    }

    WritableStreamDefaultControllerError(this, e);
  };

  WritableStreamDefaultController.prototype[AbortSteps] = function (reason) {
    return this._abortAlgorithm(reason);
  };

  WritableStreamDefaultController.prototype[ErrorSteps] = function () {
    ResetQueue$1(this);
  };

  return WritableStreamDefaultController;
}();

// Abstract operations implementing interface required by the WritableStream.

function IsWritableStreamDefaultController(x) {
  if (!typeIsObject(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_controlledWritableStream')) {
    return false;
  }

  return true;
}

function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
  assert$1(IsWritableStream(stream) === true);
  assert$1(stream._writableStreamController === undefined);

  controller._controlledWritableStream = stream;
  stream._writableStreamController = controller;

  // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
  controller._queue = undefined;
  controller._queueTotalSize = undefined;
  ResetQueue$1(controller);

  controller._started = false;

  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;

  controller._writeAlgorithm = writeAlgorithm;
  controller._closeAlgorithm = closeAlgorithm;
  controller._abortAlgorithm = abortAlgorithm;

  var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
  WritableStreamUpdateBackpressure(stream, backpressure);

  var startResult = startAlgorithm();
  var startPromise = Promise.resolve(startResult);
  startPromise.then(function () {
    assert$1(stream._state === 'writable' || stream._state === 'erroring');
    controller._started = true;
    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, function (r) {
    assert$1(stream._state === 'writable' || stream._state === 'erroring');
    controller._started = true;
    WritableStreamDealWithRejection(stream, r);
  }).catch(rethrowAssertionErrorRejection$1);
}

function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
  assert$1(underlyingSink !== undefined);

  var controller = Object.create(WritableStreamDefaultController.prototype);

  function startAlgorithm() {
    return InvokeOrNoop(underlyingSink, 'start', [controller]);
  }

  var writeAlgorithm = CreateAlgorithmFromUnderlyingMethod(underlyingSink, 'write', 1, [controller]);
  var closeAlgorithm = CreateAlgorithmFromUnderlyingMethod(underlyingSink, 'close', 0, []);
  var abortAlgorithm = CreateAlgorithmFromUnderlyingMethod(underlyingSink, 'abort', 1, []);

  SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
}

function WritableStreamDefaultControllerClose(controller) {
  EnqueueValueWithSize$1(controller, 'close', 0);
  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}

function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
  try {
    return controller._strategySizeAlgorithm(chunk);
  } catch (chunkSizeE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
    return 1;
  }
}

function WritableStreamDefaultControllerGetDesiredSize(controller) {
  return controller._strategyHWM - controller._queueTotalSize;
}

function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
  var writeRecord = { chunk: chunk };

  try {
    EnqueueValueWithSize$1(controller, writeRecord, chunkSize);
  } catch (enqueueE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
    return;
  }

  var stream = controller._controlledWritableStream;
  if (WritableStreamCloseQueuedOrInFlight(stream) === false && stream._state === 'writable') {
    var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
    WritableStreamUpdateBackpressure(stream, backpressure);
  }

  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}

// Abstract operations for the WritableStreamDefaultController.

function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
  verbose('WritableStreamDefaultControllerAdvanceQueueIfNeeded()');
  var stream = controller._controlledWritableStream;

  if (controller._started === false) {
    return;
  }

  if (stream._inFlightWriteRequest !== undefined) {
    return;
  }

  var state = stream._state;
  if (state === 'closed' || state === 'errored') {
    return;
  }
  if (state === 'erroring') {
    WritableStreamFinishErroring(stream);
    return;
  }

  if (controller._queue.length === 0) {
    return;
  }

  var writeRecord = PeekQueueValue$1(controller);
  if (writeRecord === 'close') {
    WritableStreamDefaultControllerProcessClose(controller);
  } else {
    WritableStreamDefaultControllerProcessWrite(controller, writeRecord.chunk);
  }
}

function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
  if (controller._controlledWritableStream._state === 'writable') {
    WritableStreamDefaultControllerError(controller, error);
  }
}

function WritableStreamDefaultControllerProcessClose(controller) {
  var stream = controller._controlledWritableStream;

  WritableStreamMarkCloseRequestInFlight(stream);

  DequeueValue$1(controller);
  assert$1(controller._queue.length === 0);

  var sinkClosePromise = controller._closeAlgorithm();
  sinkClosePromise.then(function () {
    WritableStreamFinishInFlightClose(stream);
  }, function (reason) {
    WritableStreamFinishInFlightCloseWithError(stream, reason);
  }).catch(rethrowAssertionErrorRejection$1);
}

function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
  var stream = controller._controlledWritableStream;

  WritableStreamMarkFirstWriteRequestInFlight(stream);

  var sinkWritePromise = controller._writeAlgorithm(chunk);
  sinkWritePromise.then(function () {
    WritableStreamFinishInFlightWrite(stream);

    var state = stream._state;
    assert$1(state === 'writable' || state === 'erroring');

    DequeueValue$1(controller);

    if (WritableStreamCloseQueuedOrInFlight(stream) === false && state === 'writable') {
      var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
      WritableStreamUpdateBackpressure(stream, backpressure);
    }

    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, function (reason) {
    WritableStreamFinishInFlightWriteWithError(stream, reason);
  }).catch(rethrowAssertionErrorRejection$1);
}

function WritableStreamDefaultControllerGetBackpressure(controller) {
  var desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
  return desiredSize <= 0;
}

// A client of WritableStreamDefaultController may use these functions directly to bypass state check.

function WritableStreamDefaultControllerError(controller, error) {
  var stream = controller._controlledWritableStream;

  assert$1(stream._state === 'writable');

  WritableStreamStartErroring(stream, error);
}

// Helper functions for the WritableStream.

function streamBrandCheckException(name) {
  return new TypeError('WritableStream.prototype.' + name + ' can only be used on a WritableStream');
}

// Helper functions for the WritableStreamDefaultWriter.

function defaultWriterBrandCheckException(name) {
  return new TypeError('WritableStreamDefaultWriter.prototype.' + name + ' can only be used on a WritableStreamDefaultWriter');
}

function defaultWriterLockException(name) {
  return new TypeError('Cannot ' + name + ' a stream using a released writer');
}

function defaultWriterClosedPromiseInitialize(writer) {
  writer._closedPromise = new Promise(function (resolve, reject) {
    writer._closedPromise_resolve = resolve;
    writer._closedPromise_reject = reject;
    writer._closedPromiseState = 'pending';
  });
}

function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
  writer._closedPromise = Promise.reject(reason);
  writer._closedPromise_resolve = undefined;
  writer._closedPromise_reject = undefined;
  writer._closedPromiseState = 'rejected';
}

function defaultWriterClosedPromiseInitializeAsResolved(writer) {
  writer._closedPromise = Promise.resolve(undefined);
  writer._closedPromise_resolve = undefined;
  writer._closedPromise_reject = undefined;
  writer._closedPromiseState = 'resolved';
}

function defaultWriterClosedPromiseReject(writer, reason) {
  assert$1(writer._closedPromise_resolve !== undefined);
  assert$1(writer._closedPromise_reject !== undefined);
  assert$1(writer._closedPromiseState === 'pending');

  writer._closedPromise_reject(reason);
  writer._closedPromise_resolve = undefined;
  writer._closedPromise_reject = undefined;
  writer._closedPromiseState = 'rejected';
}

function defaultWriterClosedPromiseResetToRejected(writer, reason) {
  assert$1(writer._closedPromise_resolve === undefined);
  assert$1(writer._closedPromise_reject === undefined);
  assert$1(writer._closedPromiseState !== 'pending');

  writer._closedPromise = Promise.reject(reason);
  writer._closedPromiseState = 'rejected';
}

function defaultWriterClosedPromiseResolve(writer) {
  assert$1(writer._closedPromise_resolve !== undefined);
  assert$1(writer._closedPromise_reject !== undefined);
  assert$1(writer._closedPromiseState === 'pending');

  writer._closedPromise_resolve(undefined);
  writer._closedPromise_resolve = undefined;
  writer._closedPromise_reject = undefined;
  writer._closedPromiseState = 'resolved';
}

function defaultWriterReadyPromiseInitialize(writer) {
  verbose('defaultWriterReadyPromiseInitialize()');
  writer._readyPromise = new Promise(function (resolve, reject) {
    writer._readyPromise_resolve = resolve;
    writer._readyPromise_reject = reject;
  });
  writer._readyPromiseState = 'pending';
}

function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
  verbose('defaultWriterReadyPromiseInitializeAsRejected(writer, %o)', reason);
  writer._readyPromise = Promise.reject(reason);
  writer._readyPromise_resolve = undefined;
  writer._readyPromise_reject = undefined;
  writer._readyPromiseState = 'rejected';
}

function defaultWriterReadyPromiseInitializeAsResolved(writer) {
  verbose('defaultWriterReadyPromiseInitializeAsResolved()');
  writer._readyPromise = Promise.resolve(undefined);
  writer._readyPromise_resolve = undefined;
  writer._readyPromise_reject = undefined;
  writer._readyPromiseState = 'fulfilled';
}

function defaultWriterReadyPromiseReject(writer, reason) {
  verbose('defaultWriterReadyPromiseReject(writer, %o)', reason);
  assert$1(writer._readyPromise_resolve !== undefined);
  assert$1(writer._readyPromise_reject !== undefined);

  writer._readyPromise_reject(reason);
  writer._readyPromise_resolve = undefined;
  writer._readyPromise_reject = undefined;
  writer._readyPromiseState = 'rejected';
}

function defaultWriterReadyPromiseReset(writer) {
  verbose('defaultWriterReadyPromiseReset()');
  assert$1(writer._readyPromise_resolve === undefined);
  assert$1(writer._readyPromise_reject === undefined);

  writer._readyPromise = new Promise(function (resolve, reject) {
    writer._readyPromise_resolve = resolve;
    writer._readyPromise_reject = reject;
  });
  writer._readyPromiseState = 'pending';
}

function defaultWriterReadyPromiseResetToRejected(writer, reason) {
  verbose('defaultWriterReadyPromiseResetToRejected(writer, %o)', reason);
  assert$1(writer._readyPromise_resolve === undefined);
  assert$1(writer._readyPromise_reject === undefined);

  writer._readyPromise = Promise.reject(reason);
  writer._readyPromiseState = 'rejected';
}

function defaultWriterReadyPromiseResolve(writer) {
  verbose('defaultWriterReadyPromiseResolve()');
  assert$1(writer._readyPromise_resolve !== undefined);
  assert$1(writer._readyPromise_reject !== undefined);

  writer._readyPromise_resolve(undefined);
  writer._readyPromise_resolve = undefined;
  writer._readyPromise_reject = undefined;
  writer._readyPromiseState = 'fulfilled';
}
var writableStream_5 = writableStream.WritableStream;

var ArrayBufferCopy = helpers.ArrayBufferCopy,
    CreateAlgorithmFromUnderlyingMethod$1 = helpers.CreateAlgorithmFromUnderlyingMethod,
    CreateIterResultObject = helpers.CreateIterResultObject,
    IsFiniteNonNegativeNumber$1 = helpers.IsFiniteNonNegativeNumber,
    InvokeOrNoop$1 = helpers.InvokeOrNoop,
    IsDetachedBuffer = helpers.IsDetachedBuffer,
    TransferArrayBuffer = helpers.TransferArrayBuffer,
    ValidateAndNormalizeHighWaterMark$1 = helpers.ValidateAndNormalizeHighWaterMark,
    IsNonNegativeNumber$1 = helpers.IsNonNegativeNumber,
    MakeSizeAlgorithmFromSizeFunction$1 = helpers.MakeSizeAlgorithmFromSizeFunction,
    createArrayFromList = helpers.createArrayFromList,
    typeIsObject$1 = helpers.typeIsObject;
var rethrowAssertionErrorRejection$2 = utils.rethrowAssertionErrorRejection;
var DequeueValue$2 = queueWithSizes.DequeueValue,
    EnqueueValueWithSize$2 = queueWithSizes.EnqueueValueWithSize,
    ResetQueue$2 = queueWithSizes.ResetQueue;
var AcquireWritableStreamDefaultWriter$1 = writableStream.AcquireWritableStreamDefaultWriter,
    IsWritableStream$1 = writableStream.IsWritableStream,
    IsWritableStreamLocked$1 = writableStream.IsWritableStreamLocked,
    WritableStreamAbort$1 = writableStream.WritableStreamAbort,
    WritableStreamDefaultWriterCloseWithErrorPropagation$1 = writableStream.WritableStreamDefaultWriterCloseWithErrorPropagation,
    WritableStreamDefaultWriterRelease$1 = writableStream.WritableStreamDefaultWriterRelease,
    WritableStreamDefaultWriterWrite$1 = writableStream.WritableStreamDefaultWriterWrite,
    WritableStreamCloseQueuedOrInFlight$1 = writableStream.WritableStreamCloseQueuedOrInFlight;


var CancelSteps = Symbol('[[CancelSteps]]');
var PullSteps = Symbol('[[PullSteps]]');

var ReadableStream = function () {
  function ReadableStream() {
    var underlyingSource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        size = _ref.size,
        highWaterMark = _ref.highWaterMark;

    classCallCheck(this, ReadableStream);

    InitializeReadableStream(this);
    var type = underlyingSource.type;
    var typeString = String(type);
    if (typeString === 'bytes') {
      if (highWaterMark === undefined) {
        highWaterMark = 0;
      }
      highWaterMark = ValidateAndNormalizeHighWaterMark$1(highWaterMark);

      if (size !== undefined) {
        throw new RangeError('The strategy for a byte stream cannot have a size function');
      }

      SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
    } else if (type === undefined) {
      if (highWaterMark === undefined) {
        highWaterMark = 1;
      }
      highWaterMark = ValidateAndNormalizeHighWaterMark$1(highWaterMark);

      var sizeAlgorithm = MakeSizeAlgorithmFromSizeFunction$1(size);

      SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
    } else {
      throw new RangeError('Invalid type is specified');
    }
  }

  ReadableStream.prototype.cancel = function cancel(reason) {
    if (IsReadableStream(this) === false) {
      return Promise.reject(streamBrandCheckException$1('cancel'));
    }

    if (IsReadableStreamLocked(this) === true) {
      return Promise.reject(new TypeError('Cannot cancel a stream that already has a reader'));
    }

    return ReadableStreamCancel(this, reason);
  };

  ReadableStream.prototype.getReader = function getReader() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        mode = _ref2.mode;

    if (IsReadableStream(this) === false) {
      throw streamBrandCheckException$1('getReader');
    }

    if (mode === undefined) {
      return AcquireReadableStreamDefaultReader(this);
    }

    mode = String(mode);

    if (mode === 'byob') {
      return AcquireReadableStreamBYOBReader(this);
    }

    throw new RangeError('Invalid mode is specified');
  };

  ReadableStream.prototype.pipeThrough = function pipeThrough(_ref3, options) {
    var writable = _ref3.writable,
        readable = _ref3.readable;

    if (writable === undefined || readable === undefined) {
      throw new TypeError('readable and writable arguments must be defined');
    }

    var promise = this.pipeTo(writable, options);

    ifIsObjectAndHasAPromiseIsHandledInternalSlotSetPromiseIsHandledToTrue(promise);

    return readable;
  };

  ReadableStream.prototype.pipeTo = function pipeTo(dest) {
    var _this = this;

    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        preventClose = _ref4.preventClose,
        preventAbort = _ref4.preventAbort,
        preventCancel = _ref4.preventCancel;

    if (IsReadableStream(this) === false) {
      return Promise.reject(streamBrandCheckException$1('pipeTo'));
    }
    if (IsWritableStream$1(dest) === false) {
      return Promise.reject(new TypeError('ReadableStream.prototype.pipeTo\'s first argument must be a WritableStream'));
    }

    preventClose = Boolean(preventClose);
    preventAbort = Boolean(preventAbort);
    preventCancel = Boolean(preventCancel);

    if (IsReadableStreamLocked(this) === true) {
      return Promise.reject(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream'));
    }
    if (IsWritableStreamLocked$1(dest) === true) {
      return Promise.reject(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream'));
    }

    var reader = AcquireReadableStreamDefaultReader(this);
    var writer = AcquireWritableStreamDefaultWriter$1(dest);

    var shuttingDown = false;

    // This is used to keep track of the spec's requirement that we wait for ongoing writes during shutdown.
    var currentWrite = Promise.resolve();

    return new Promise(function (resolve, reject) {
      // Using reader and writer, read all chunks from this and write them to dest
      // - Backpressure must be enforced
      // - Shutdown must stop all activity
      function pipeLoop() {
        if (shuttingDown === true) {
          return Promise.resolve();
        }

        return writer._readyPromise.then(function () {
          return ReadableStreamDefaultReaderRead(reader).then(function (_ref5) {
            var value = _ref5.value,
                done = _ref5.done;

            if (done === true) {
              return;
            }

            currentWrite = WritableStreamDefaultWriterWrite$1(writer, value).catch(function () {});
          });
        }).then(pipeLoop);
      }

      // Errors must be propagated forward
      isOrBecomesErrored(_this, reader._closedPromise, function (storedError) {
        if (preventAbort === false) {
          shutdownWithAction(function () {
            return WritableStreamAbort$1(dest, storedError);
          }, true, storedError);
        } else {
          shutdown(true, storedError);
        }
      });

      // Errors must be propagated backward
      isOrBecomesErrored(dest, writer._closedPromise, function (storedError) {
        if (preventCancel === false) {
          shutdownWithAction(function () {
            return ReadableStreamCancel(_this, storedError);
          }, true, storedError);
        } else {
          shutdown(true, storedError);
        }
      });

      // Closing must be propagated forward
      isOrBecomesClosed(_this, reader._closedPromise, function () {
        if (preventClose === false) {
          shutdownWithAction(function () {
            return WritableStreamDefaultWriterCloseWithErrorPropagation$1(writer);
          });
        } else {
          shutdown();
        }
      });

      // Closing must be propagated backward
      if (WritableStreamCloseQueuedOrInFlight$1(dest) === true || dest._state === 'closed') {
        var destClosed = new TypeError('the destination writable stream closed before all data could be piped to it');

        if (preventCancel === false) {
          shutdownWithAction(function () {
            return ReadableStreamCancel(_this, destClosed);
          }, true, destClosed);
        } else {
          shutdown(true, destClosed);
        }
      }

      pipeLoop().catch(function (err) {
        currentWrite = Promise.resolve();
        rethrowAssertionErrorRejection$2(err);
      });

      function waitForWritesToFinish() {
        // Another write may have started while we were waiting on this currentWrite, so we have to be sure to wait
        // for that too.
        var oldCurrentWrite = currentWrite;
        return currentWrite.then(function () {
          return oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : undefined;
        });
      }

      function isOrBecomesErrored(stream, promise, action) {
        if (stream._state === 'errored') {
          action(stream._storedError);
        } else {
          promise.catch(action).catch(rethrowAssertionErrorRejection$2);
        }
      }

      function isOrBecomesClosed(stream, promise, action) {
        if (stream._state === 'closed') {
          action();
        } else {
          promise.then(action).catch(rethrowAssertionErrorRejection$2);
        }
      }

      function shutdownWithAction(action, originalIsError, originalError) {
        if (shuttingDown === true) {
          return;
        }
        shuttingDown = true;

        if (dest._state === 'writable' && WritableStreamCloseQueuedOrInFlight$1(dest) === false) {
          waitForWritesToFinish().then(doTheRest);
        } else {
          doTheRest();
        }

        function doTheRest() {
          action().then(function () {
            return finalize(originalIsError, originalError);
          }, function (newError) {
            return finalize(true, newError);
          }).catch(rethrowAssertionErrorRejection$2);
        }
      }

      function shutdown(isError, error) {
        if (shuttingDown === true) {
          return;
        }
        shuttingDown = true;

        if (dest._state === 'writable' && WritableStreamCloseQueuedOrInFlight$1(dest) === false) {
          waitForWritesToFinish().then(function () {
            return finalize(isError, error);
          }).catch(rethrowAssertionErrorRejection$2);
        } else {
          finalize(isError, error);
        }
      }

      function finalize(isError, error) {
        WritableStreamDefaultWriterRelease$1(writer);
        ReadableStreamReaderGenericRelease(reader);

        if (isError) {
          reject(error);
        } else {
          resolve(undefined);
        }
      }
    });
  };

  ReadableStream.prototype.tee = function tee() {
    if (IsReadableStream(this) === false) {
      throw streamBrandCheckException$1('tee');
    }

    var branches = ReadableStreamTee(this, false);
    return createArrayFromList(branches);
  };

  createClass(ReadableStream, [{
    key: 'locked',
    get: function get$$1() {
      if (IsReadableStream(this) === false) {
        throw streamBrandCheckException$1('locked');
      }

      return IsReadableStreamLocked(this);
    }
  }]);
  return ReadableStream;
}();

var readableStream = {
  CreateReadableByteStream: CreateReadableByteStream,
  CreateReadableStream: CreateReadableStream,
  ReadableStream: ReadableStream,
  IsReadableStreamDisturbed: IsReadableStreamDisturbed,
  ReadableStreamDefaultControllerClose: ReadableStreamDefaultControllerClose,
  ReadableStreamDefaultControllerEnqueue: ReadableStreamDefaultControllerEnqueue,
  ReadableStreamDefaultControllerError: ReadableStreamDefaultControllerError,
  ReadableStreamDefaultControllerGetDesiredSize: ReadableStreamDefaultControllerGetDesiredSize,
  ReadableStreamDefaultControllerHasBackpressure: ReadableStreamDefaultControllerHasBackpressure,
  ReadableStreamDefaultControllerCanCloseOrEnqueue: ReadableStreamDefaultControllerCanCloseOrEnqueue
};

// Abstract operations for the ReadableStream.

function AcquireReadableStreamBYOBReader(stream) {
  return new ReadableStreamBYOBReader(stream);
}

function AcquireReadableStreamDefaultReader(stream) {
  return new ReadableStreamDefaultReader(stream);
}

// Throws if and only if startAlgorithm throws.
function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
  var highWaterMark = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var sizeAlgorithm = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {
    return 1;
  };

  assert$1(IsNonNegativeNumber$1(highWaterMark) === true);

  var stream = Object.create(ReadableStream.prototype);
  InitializeReadableStream(stream);

  var controller = Object.create(ReadableStreamDefaultController.prototype);

  SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);

  return stream;
}

// Throws if and only if startAlgorithm throws.
function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
  var highWaterMark = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var autoAllocateChunkSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  assert$1(IsNonNegativeNumber$1(highWaterMark) === true);
  if (autoAllocateChunkSize !== undefined) {
    assert$1(Number.isInteger(autoAllocateChunkSize) === true);
    assert$1(autoAllocateChunkSize > 0);
  }

  var stream = Object.create(ReadableStream.prototype);
  InitializeReadableStream(stream);

  var controller = Object.create(ReadableByteStreamController.prototype);

  SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);

  return stream;
}

function InitializeReadableStream(stream) {
  stream._state = 'readable';
  stream._reader = undefined;
  stream._storedError = undefined;
  stream._disturbed = false;
}

function IsReadableStream(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_readableStreamController')) {
    return false;
  }

  return true;
}

function IsReadableStreamDisturbed(stream) {
  assert$1(IsReadableStream(stream) === true);

  return stream._disturbed;
}

function IsReadableStreamLocked(stream) {
  assert$1(IsReadableStream(stream) === true);

  if (stream._reader === undefined) {
    return false;
  }

  return true;
}

function ReadableStreamTee(stream, cloneForBranch2) {
  assert$1(IsReadableStream(stream) === true);
  assert$1(typeof cloneForBranch2 === 'boolean');

  var reader = AcquireReadableStreamDefaultReader(stream);

  var closedOrErrored = false;
  var canceled1 = false;
  var canceled2 = false;
  var reason1 = void 0;
  var reason2 = void 0;
  var branch1 = void 0;
  var branch2 = void 0;

  var resolveCancelPromise = void 0;
  var cancelPromise = new Promise(function (resolve) {
    resolveCancelPromise = resolve;
  });

  function pullAlgorithm() {
    return ReadableStreamDefaultReaderRead(reader).then(function (result) {
      assert$1(typeIsObject$1(result));
      var value = result.value;
      var done = result.done;
      assert$1(typeof done === 'boolean');

      if (done === true && closedOrErrored === false) {
        if (canceled1 === false) {
          ReadableStreamDefaultControllerClose(branch1._readableStreamController);
        }
        if (canceled2 === false) {
          ReadableStreamDefaultControllerClose(branch2._readableStreamController);
        }
        closedOrErrored = true;
      }

      if (closedOrErrored === true) {
        return;
      }

      var value1 = value;
      var value2 = value;

      // There is no way to access the cloning code right now in the reference implementation.
      // If we add one then we'll need an implementation for serializable objects.
      // if (canceled2 === false && cloneForBranch2 === true) {
      //   value2 = StructuredDeserialize(StructuredSerialize(value2));
      // }

      if (canceled1 === false) {
        ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, value1);
      }

      if (canceled2 === false) {
        ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, value2);
      }
    });
  }

  function cancel1Algorithm(reason) {
    canceled1 = true;
    reason1 = reason;
    if (canceled2 === true) {
      var compositeReason = createArrayFromList([reason1, reason2]);
      var cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }

  function cancel2Algorithm(reason) {
    canceled2 = true;
    reason2 = reason;
    if (canceled1 === true) {
      var compositeReason = createArrayFromList([reason1, reason2]);
      var cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }

  function startAlgorithm() {}

  branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
  branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);

  reader._closedPromise.catch(function (r) {
    if (closedOrErrored === true) {
      return;
    }

    ReadableStreamDefaultControllerErrorIfNeeded(branch1._readableStreamController, r);
    ReadableStreamDefaultControllerErrorIfNeeded(branch2._readableStreamController, r);
    closedOrErrored = true;
  });

  return [branch1, branch2];
}

// ReadableStream API exposed for controllers.

function ReadableStreamAddReadIntoRequest(stream) {
  assert$1(IsReadableStreamBYOBReader(stream._reader) === true);
  assert$1(stream._state === 'readable' || stream._state === 'closed');

  var promise = new Promise(function (resolve, reject) {
    var readIntoRequest = {
      _resolve: resolve,
      _reject: reject
    };

    stream._reader._readIntoRequests.push(readIntoRequest);
  });

  return promise;
}

function ReadableStreamAddReadRequest(stream) {
  assert$1(IsReadableStreamDefaultReader(stream._reader) === true);
  assert$1(stream._state === 'readable');

  var promise = new Promise(function (resolve, reject) {
    var readRequest = {
      _resolve: resolve,
      _reject: reject
    };

    stream._reader._readRequests.push(readRequest);
  });

  return promise;
}

function ReadableStreamCancel(stream, reason) {
  stream._disturbed = true;

  if (stream._state === 'closed') {
    return Promise.resolve(undefined);
  }
  if (stream._state === 'errored') {
    return Promise.reject(stream._storedError);
  }

  ReadableStreamClose(stream);

  var sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
  return sourceCancelPromise.then(function () {
    return undefined;
  });
}

function ReadableStreamClose(stream) {
  assert$1(stream._state === 'readable');

  stream._state = 'closed';

  var reader = stream._reader;

  if (reader === undefined) {
    return undefined;
  }

  if (IsReadableStreamDefaultReader(reader) === true) {
    for (var _i2 = 0, _reader$_readRequests2 = reader._readRequests, _length2 = _reader$_readRequests2.length; _i2 < _length2; _i2++) {
      var _resolve = _reader$_readRequests2[_i2]._resolve;

      _resolve(CreateIterResultObject(undefined, true));
    }

    reader._readRequests = [];
  }

  defaultReaderClosedPromiseResolve(reader);

  return undefined;
}

function ReadableStreamError(stream, e) {
  assert$1(IsReadableStream(stream) === true);
  assert$1(stream._state === 'readable');

  stream._state = 'errored';
  stream._storedError = e;

  var reader = stream._reader;

  if (reader === undefined) {
    return undefined;
  }

  if (IsReadableStreamDefaultReader(reader) === true) {
    for (var _i4 = 0, _reader$_readRequests4 = reader._readRequests, _length4 = _reader$_readRequests4.length; _i4 < _length4; _i4++) {
      var readRequest = _reader$_readRequests4[_i4];
      readRequest._reject(e);
    }

    reader._readRequests = [];
  } else {
    assert$1(IsReadableStreamBYOBReader(reader));

    for (var _i6 = 0, _reader$_readIntoRequ2 = reader._readIntoRequests, _length6 = _reader$_readIntoRequ2.length; _i6 < _length6; _i6++) {
      var readIntoRequest = _reader$_readIntoRequ2[_i6];
      readIntoRequest._reject(e);
    }

    reader._readIntoRequests = [];
  }

  defaultReaderClosedPromiseReject(reader, e);
  reader._closedPromise.catch(function () {});
}

function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
  var reader = stream._reader;

  assert$1(reader._readIntoRequests.length > 0);

  var readIntoRequest = reader._readIntoRequests.shift();
  readIntoRequest._resolve(CreateIterResultObject(chunk, done));
}

function ReadableStreamFulfillReadRequest(stream, chunk, done) {
  var reader = stream._reader;

  assert$1(reader._readRequests.length > 0);

  var readRequest = reader._readRequests.shift();
  readRequest._resolve(CreateIterResultObject(chunk, done));
}

function ReadableStreamGetNumReadIntoRequests(stream) {
  return stream._reader._readIntoRequests.length;
}

function ReadableStreamGetNumReadRequests(stream) {
  return stream._reader._readRequests.length;
}

function ReadableStreamHasBYOBReader(stream) {
  var reader = stream._reader;

  if (reader === undefined) {
    return false;
  }

  if (IsReadableStreamBYOBReader(reader) === false) {
    return false;
  }

  return true;
}

function ReadableStreamHasDefaultReader(stream) {
  var reader = stream._reader;

  if (reader === undefined) {
    return false;
  }

  if (IsReadableStreamDefaultReader(reader) === false) {
    return false;
  }

  return true;
}

// Readers

var ReadableStreamDefaultReader = function () {
  function ReadableStreamDefaultReader(stream) {
    classCallCheck(this, ReadableStreamDefaultReader);

    if (IsReadableStream(stream) === false) {
      throw new TypeError('ReadableStreamDefaultReader can only be constructed with a ReadableStream instance');
    }
    if (IsReadableStreamLocked(stream) === true) {
      throw new TypeError('This stream has already been locked for exclusive reading by another reader');
    }

    ReadableStreamReaderGenericInitialize(this, stream);

    this._readRequests = [];
  }

  ReadableStreamDefaultReader.prototype.cancel = function cancel(reason) {
    if (IsReadableStreamDefaultReader(this) === false) {
      return Promise.reject(defaultReaderBrandCheckException('cancel'));
    }

    if (this._ownerReadableStream === undefined) {
      return Promise.reject(readerLockException('cancel'));
    }

    return ReadableStreamReaderGenericCancel(this, reason);
  };

  ReadableStreamDefaultReader.prototype.read = function read() {
    if (IsReadableStreamDefaultReader(this) === false) {
      return Promise.reject(defaultReaderBrandCheckException('read'));
    }

    if (this._ownerReadableStream === undefined) {
      return Promise.reject(readerLockException('read from'));
    }

    return ReadableStreamDefaultReaderRead(this);
  };

  ReadableStreamDefaultReader.prototype.releaseLock = function releaseLock() {
    if (IsReadableStreamDefaultReader(this) === false) {
      throw defaultReaderBrandCheckException('releaseLock');
    }

    if (this._ownerReadableStream === undefined) {
      return;
    }

    if (this._readRequests.length > 0) {
      throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
    }

    ReadableStreamReaderGenericRelease(this);
  };

  createClass(ReadableStreamDefaultReader, [{
    key: 'closed',
    get: function get$$1() {
      if (IsReadableStreamDefaultReader(this) === false) {
        return Promise.reject(defaultReaderBrandCheckException('closed'));
      }

      return this._closedPromise;
    }
  }]);
  return ReadableStreamDefaultReader;
}();

var ReadableStreamBYOBReader = function () {
  function ReadableStreamBYOBReader(stream) {
    classCallCheck(this, ReadableStreamBYOBReader);

    if (!IsReadableStream(stream)) {
      throw new TypeError('ReadableStreamBYOBReader can only be constructed with a ReadableStream instance given a ' + 'byte source');
    }
    if (IsReadableByteStreamController(stream._readableStreamController) === false) {
      throw new TypeError('Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte ' + 'source');
    }
    if (IsReadableStreamLocked(stream)) {
      throw new TypeError('This stream has already been locked for exclusive reading by another reader');
    }

    ReadableStreamReaderGenericInitialize(this, stream);

    this._readIntoRequests = [];
  }

  ReadableStreamBYOBReader.prototype.cancel = function cancel(reason) {
    if (!IsReadableStreamBYOBReader(this)) {
      return Promise.reject(byobReaderBrandCheckException('cancel'));
    }

    if (this._ownerReadableStream === undefined) {
      return Promise.reject(readerLockException('cancel'));
    }

    return ReadableStreamReaderGenericCancel(this, reason);
  };

  ReadableStreamBYOBReader.prototype.read = function read(view) {
    if (!IsReadableStreamBYOBReader(this)) {
      return Promise.reject(byobReaderBrandCheckException('read'));
    }

    if (this._ownerReadableStream === undefined) {
      return Promise.reject(readerLockException('read from'));
    }

    if (!ArrayBuffer.isView(view)) {
      return Promise.reject(new TypeError('view must be an array buffer view'));
    }

    if (IsDetachedBuffer(view.buffer) === true) {
      return Promise.reject(new TypeError('Cannot read into a view onto a detached ArrayBuffer'));
    }

    if (view.byteLength === 0) {
      return Promise.reject(new TypeError('view must have non-zero byteLength'));
    }

    return ReadableStreamBYOBReaderRead(this, view);
  };

  ReadableStreamBYOBReader.prototype.releaseLock = function releaseLock() {
    if (!IsReadableStreamBYOBReader(this)) {
      throw byobReaderBrandCheckException('releaseLock');
    }

    if (this._ownerReadableStream === undefined) {
      return;
    }

    if (this._readIntoRequests.length > 0) {
      throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
    }

    ReadableStreamReaderGenericRelease(this);
  };

  createClass(ReadableStreamBYOBReader, [{
    key: 'closed',
    get: function get$$1() {
      if (!IsReadableStreamBYOBReader(this)) {
        return Promise.reject(byobReaderBrandCheckException('closed'));
      }

      return this._closedPromise;
    }
  }]);
  return ReadableStreamBYOBReader;
}();

// Abstract operations for the readers.

function IsReadableStreamBYOBReader(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_readIntoRequests')) {
    return false;
  }

  return true;
}

function IsReadableStreamDefaultReader(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_readRequests')) {
    return false;
  }

  return true;
}

function ReadableStreamReaderGenericInitialize(reader, stream) {
  reader._ownerReadableStream = stream;
  stream._reader = reader;

  if (stream._state === 'readable') {
    defaultReaderClosedPromiseInitialize(reader);
  } else if (stream._state === 'closed') {
    defaultReaderClosedPromiseInitializeAsResolved(reader);
  } else {
    assert$1(stream._state === 'errored');

    defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
    reader._closedPromise.catch(function () {});
  }
}

// A client of ReadableStreamDefaultReader and ReadableStreamBYOBReader may use these functions directly to bypass state
// check.

function ReadableStreamReaderGenericCancel(reader, reason) {
  var stream = reader._ownerReadableStream;
  assert$1(stream !== undefined);
  return ReadableStreamCancel(stream, reason);
}

function ReadableStreamReaderGenericRelease(reader) {
  assert$1(reader._ownerReadableStream !== undefined);
  assert$1(reader._ownerReadableStream._reader === reader);

  if (reader._ownerReadableStream._state === 'readable') {
    defaultReaderClosedPromiseReject(reader, new TypeError('Reader was released and can no longer be used to monitor the stream\'s closedness'));
  } else {
    defaultReaderClosedPromiseResetToRejected(reader, new TypeError('Reader was released and can no longer be used to monitor the stream\'s closedness'));
  }
  reader._closedPromise.catch(function () {});

  reader._ownerReadableStream._reader = undefined;
  reader._ownerReadableStream = undefined;
}

function ReadableStreamBYOBReaderRead(reader, view) {
  var stream = reader._ownerReadableStream;

  assert$1(stream !== undefined);

  stream._disturbed = true;

  if (stream._state === 'errored') {
    return Promise.reject(stream._storedError);
  }

  // Controllers must implement this.
  return ReadableByteStreamControllerPullInto(stream._readableStreamController, view);
}

function ReadableStreamDefaultReaderRead(reader) {
  var stream = reader._ownerReadableStream;

  assert$1(stream !== undefined);

  stream._disturbed = true;

  if (stream._state === 'closed') {
    return Promise.resolve(CreateIterResultObject(undefined, true));
  }

  if (stream._state === 'errored') {
    return Promise.reject(stream._storedError);
  }

  assert$1(stream._state === 'readable');

  return stream._readableStreamController[PullSteps]();
}

// Controllers

var ReadableStreamDefaultController = function () {
  function ReadableStreamDefaultController() {
    classCallCheck(this, ReadableStreamDefaultController);

    throw new TypeError();
  }

  ReadableStreamDefaultController.prototype.close = function close() {
    if (IsReadableStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException('close');
    }

    if (ReadableStreamDefaultControllerCanCloseOrEnqueue(this) === false) {
      throw new TypeError('The stream is not in a state that permits close');
    }

    ReadableStreamDefaultControllerClose(this);
  };

  ReadableStreamDefaultController.prototype.enqueue = function enqueue(chunk) {
    if (IsReadableStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException('enqueue');
    }

    if (ReadableStreamDefaultControllerCanCloseOrEnqueue(this) === false) {
      throw new TypeError('The stream is not in a state that permits enqueue');
    }

    return ReadableStreamDefaultControllerEnqueue(this, chunk);
  };

  ReadableStreamDefaultController.prototype.error = function error(e) {
    if (IsReadableStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException('error');
    }

    var stream = this._controlledReadableStream;
    if (stream._state !== 'readable') {
      throw new TypeError('The stream is ' + stream._state + ' and so cannot be errored');
    }

    ReadableStreamDefaultControllerError(this, e);
  };

  ReadableStreamDefaultController.prototype[CancelSteps] = function (reason) {
    ResetQueue$2(this);
    return this._cancelAlgorithm(reason);
  };

  ReadableStreamDefaultController.prototype[PullSteps] = function () {
    var stream = this._controlledReadableStream;

    if (this._queue.length > 0) {
      var chunk = DequeueValue$2(this);

      if (this._closeRequested === true && this._queue.length === 0) {
        ReadableStreamClose(stream);
      } else {
        ReadableStreamDefaultControllerCallPullIfNeeded(this);
      }

      return Promise.resolve(CreateIterResultObject(chunk, false));
    }

    var pendingPromise = ReadableStreamAddReadRequest(stream);
    ReadableStreamDefaultControllerCallPullIfNeeded(this);
    return pendingPromise;
  };

  createClass(ReadableStreamDefaultController, [{
    key: 'desiredSize',
    get: function get$$1() {
      if (IsReadableStreamDefaultController(this) === false) {
        throw defaultControllerBrandCheckException('desiredSize');
      }

      return ReadableStreamDefaultControllerGetDesiredSize(this);
    }
  }]);
  return ReadableStreamDefaultController;
}();

// Abstract operations for the ReadableStreamDefaultController.

function IsReadableStreamDefaultController(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableStream')) {
    return false;
  }

  return true;
}

function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
  var shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
  if (shouldPull === false) {
    return undefined;
  }

  if (controller._pulling === true) {
    controller._pullAgain = true;
    return undefined;
  }

  assert$1(controller._pullAgain === false);

  controller._pulling = true;

  var pullPromise = controller._pullAlgorithm();
  pullPromise.then(function () {
    controller._pulling = false;

    if (controller._pullAgain === true) {
      controller._pullAgain = false;
      return ReadableStreamDefaultControllerCallPullIfNeeded(controller);
    }
    return undefined;
  }, function (e) {
    ReadableStreamDefaultControllerErrorIfNeeded(controller, e);
  }).catch(rethrowAssertionErrorRejection$2);

  return undefined;
}

function ReadableStreamDefaultControllerShouldCallPull(controller) {
  var stream = controller._controlledReadableStream;

  if (ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) === false) {
    return false;
  }

  if (controller._started === false) {
    return false;
  }

  if (IsReadableStreamLocked(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }

  var desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
  if (desiredSize > 0) {
    return true;
  }

  return false;
}

// A client of ReadableStreamDefaultController may use these functions directly to bypass state check.

function ReadableStreamDefaultControllerClose(controller) {
  var stream = controller._controlledReadableStream;

  assert$1(ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) === true);

  controller._closeRequested = true;

  if (controller._queue.length === 0) {
    ReadableStreamClose(stream);
  }
}

function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
  var stream = controller._controlledReadableStream;

  assert$1(ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) === true);

  if (IsReadableStreamLocked(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
    ReadableStreamFulfillReadRequest(stream, chunk, false);
  } else {
    var chunkSize = void 0;
    try {
      chunkSize = controller._strategySizeAlgorithm(chunk);
    } catch (chunkSizeE) {
      ReadableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
      throw chunkSizeE;
    }

    try {
      EnqueueValueWithSize$2(controller, chunk, chunkSize);
    } catch (enqueueE) {
      ReadableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
      throw enqueueE;
    }
  }

  ReadableStreamDefaultControllerCallPullIfNeeded(controller);

  return undefined;
}

function ReadableStreamDefaultControllerError(controller, e) {
  var stream = controller._controlledReadableStream;

  assert$1(stream._state === 'readable');

  ResetQueue$2(controller);

  ReadableStreamError(stream, e);
}

function ReadableStreamDefaultControllerErrorIfNeeded(controller, e) {
  if (controller._controlledReadableStream._state === 'readable') {
    ReadableStreamDefaultControllerError(controller, e);
  }
}

function ReadableStreamDefaultControllerGetDesiredSize(controller) {
  var stream = controller._controlledReadableStream;
  var state = stream._state;

  if (state === 'errored') {
    return null;
  }
  if (state === 'closed') {
    return 0;
  }

  return controller._strategyHWM - controller._queueTotalSize;
}

// This is used in the implementation of TransformStream.
function ReadableStreamDefaultControllerHasBackpressure(controller) {
  if (ReadableStreamDefaultControllerShouldCallPull(controller) === true) {
    return false;
  }

  return true;
}

function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
  var state = controller._controlledReadableStream._state;

  if (controller._closeRequested === false && state === 'readable') {
    return true;
  }

  return false;
}

function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
  assert$1(stream._readableStreamController === undefined);

  controller._controlledReadableStream = stream;

  controller._queue = undefined;
  controller._queueTotalSize = undefined;
  ResetQueue$2(controller);

  controller._started = false;
  controller._closeRequested = false;
  controller._pullAgain = false;
  controller._pulling = false;

  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;

  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;

  stream._readableStreamController = controller;

  var startResult = startAlgorithm();
  Promise.resolve(startResult).then(function () {
    controller._started = true;

    assert$1(controller._pulling === false);
    assert$1(controller._pullAgain === false);

    ReadableStreamDefaultControllerCallPullIfNeeded(controller);
  }, function (r) {
    ReadableStreamDefaultControllerErrorIfNeeded(controller, r);
  }).catch(rethrowAssertionErrorRejection$2);
}

function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
  assert$1(underlyingSource !== undefined);

  var controller = Object.create(ReadableStreamDefaultController.prototype);

  function startAlgorithm() {
    return InvokeOrNoop$1(underlyingSource, 'start', [controller]);
  }

  var pullAlgorithm = CreateAlgorithmFromUnderlyingMethod$1(underlyingSource, 'pull', 0, [controller]);
  var cancelAlgorithm = CreateAlgorithmFromUnderlyingMethod$1(underlyingSource, 'cancel', 1, []);

  SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
}

var ReadableStreamBYOBRequest = function () {
  function ReadableStreamBYOBRequest() {
    classCallCheck(this, ReadableStreamBYOBRequest);

    throw new TypeError('ReadableStreamBYOBRequest cannot be used directly');
  }

  ReadableStreamBYOBRequest.prototype.respond = function respond(bytesWritten) {
    if (IsReadableStreamBYOBRequest(this) === false) {
      throw byobRequestBrandCheckException('respond');
    }

    if (this._associatedReadableByteStreamController === undefined) {
      throw new TypeError('This BYOB request has been invalidated');
    }

    if (IsDetachedBuffer(this._view.buffer) === true) {
      throw new TypeError('The BYOB request\'s buffer has been detached and so cannot be used as a response');
    }

    ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
  };

  ReadableStreamBYOBRequest.prototype.respondWithNewView = function respondWithNewView(view) {
    if (IsReadableStreamBYOBRequest(this) === false) {
      throw byobRequestBrandCheckException('respond');
    }

    if (this._associatedReadableByteStreamController === undefined) {
      throw new TypeError('This BYOB request has been invalidated');
    }

    if (!ArrayBuffer.isView(view)) {
      throw new TypeError('You can only respond with array buffer views');
    }

    if (IsDetachedBuffer(view.buffer) === true) {
      throw new TypeError('The supplied view\'s buffer has been detached and so cannot be used as a response');
    }

    ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
  };

  createClass(ReadableStreamBYOBRequest, [{
    key: 'view',
    get: function get$$1() {
      if (IsReadableStreamBYOBRequest(this) === false) {
        throw byobRequestBrandCheckException('view');
      }

      return this._view;
    }
  }]);
  return ReadableStreamBYOBRequest;
}();

var ReadableByteStreamController = function () {
  function ReadableByteStreamController() {
    classCallCheck(this, ReadableByteStreamController);

    throw new TypeError('ReadableByteStreamController constructor cannot be used directly');
  }

  ReadableByteStreamController.prototype.close = function close() {
    if (IsReadableByteStreamController(this) === false) {
      throw byteStreamControllerBrandCheckException('close');
    }

    if (this._closeRequested === true) {
      throw new TypeError('The stream has already been closed; do not close it again!');
    }

    var state = this._controlledReadableByteStream._state;
    if (state !== 'readable') {
      throw new TypeError('The stream (in ' + state + ' state) is not in the readable state and cannot be closed');
    }

    ReadableByteStreamControllerClose(this);
  };

  ReadableByteStreamController.prototype.enqueue = function enqueue(chunk) {
    if (IsReadableByteStreamController(this) === false) {
      throw byteStreamControllerBrandCheckException('enqueue');
    }

    if (this._closeRequested === true) {
      throw new TypeError('stream is closed or draining');
    }

    var state = this._controlledReadableByteStream._state;
    if (state !== 'readable') {
      throw new TypeError('The stream (in ' + state + ' state) is not in the readable state and cannot be enqueued to');
    }

    if (!ArrayBuffer.isView(chunk)) {
      throw new TypeError('You can only enqueue array buffer views when using a ReadableByteStreamController');
    }

    if (IsDetachedBuffer(chunk.buffer) === true) {
      throw new TypeError('Cannot enqueue a view onto a detached ArrayBuffer');
    }

    ReadableByteStreamControllerEnqueue(this, chunk);
  };

  ReadableByteStreamController.prototype.error = function error(e) {
    if (IsReadableByteStreamController(this) === false) {
      throw byteStreamControllerBrandCheckException('error');
    }

    var stream = this._controlledReadableByteStream;
    if (stream._state !== 'readable') {
      throw new TypeError('The stream is ' + stream._state + ' and so cannot be errored');
    }

    ReadableByteStreamControllerError(this, e);
  };

  ReadableByteStreamController.prototype[CancelSteps] = function (reason) {
    if (this._pendingPullIntos.length > 0) {
      var firstDescriptor = this._pendingPullIntos[0];
      firstDescriptor.bytesFilled = 0;
    }

    ResetQueue$2(this);

    return this._cancelAlgorithm(reason);
  };

  ReadableByteStreamController.prototype[PullSteps] = function () {
    var stream = this._controlledReadableByteStream;
    assert$1(ReadableStreamHasDefaultReader(stream) === true);

    if (this._queueTotalSize > 0) {
      assert$1(ReadableStreamGetNumReadRequests(stream) === 0);

      var entry = this._queue.shift();
      this._queueTotalSize -= entry.byteLength;

      ReadableByteStreamControllerHandleQueueDrain(this);

      var view = void 0;
      try {
        view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
      } catch (viewE) {
        return Promise.reject(viewE);
      }

      return Promise.resolve(CreateIterResultObject(view, false));
    }

    var autoAllocateChunkSize = this._autoAllocateChunkSize;
    if (autoAllocateChunkSize !== undefined) {
      var buffer = void 0;
      try {
        buffer = new ArrayBuffer(autoAllocateChunkSize);
      } catch (bufferE) {
        return Promise.reject(bufferE);
      }

      var pullIntoDescriptor = {
        buffer: buffer,
        byteOffset: 0,
        byteLength: autoAllocateChunkSize,
        bytesFilled: 0,
        elementSize: 1,
        ctor: Uint8Array,
        readerType: 'default'
      };

      this._pendingPullIntos.push(pullIntoDescriptor);
    }

    var promise = ReadableStreamAddReadRequest(stream);

    ReadableByteStreamControllerCallPullIfNeeded(this);

    return promise;
  };

  createClass(ReadableByteStreamController, [{
    key: 'byobRequest',
    get: function get$$1() {
      if (IsReadableByteStreamController(this) === false) {
        throw byteStreamControllerBrandCheckException('byobRequest');
      }

      if (this._byobRequest === undefined && this._pendingPullIntos.length > 0) {
        var firstDescriptor = this._pendingPullIntos[0];
        var view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);

        var byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
        SetUpReadableStreamBYOBRequest(byobRequest, this, view);
        this._byobRequest = byobRequest;
      }

      return this._byobRequest;
    }
  }, {
    key: 'desiredSize',
    get: function get$$1() {
      if (IsReadableByteStreamController(this) === false) {
        throw byteStreamControllerBrandCheckException('desiredSize');
      }

      return ReadableByteStreamControllerGetDesiredSize(this);
    }
  }]);
  return ReadableByteStreamController;
}();

// Abstract operations for the ReadableByteStreamController.

function IsReadableByteStreamController(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableByteStream')) {
    return false;
  }

  return true;
}

function IsReadableStreamBYOBRequest(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_associatedReadableByteStreamController')) {
    return false;
  }

  return true;
}

function ReadableByteStreamControllerCallPullIfNeeded(controller) {
  var shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
  if (shouldPull === false) {
    return undefined;
  }

  if (controller._pulling === true) {
    controller._pullAgain = true;
    return undefined;
  }

  assert$1(controller._pullAgain === false);

  controller._pulling = true;

  // TODO: Test controller argument
  var pullPromise = controller._pullAlgorithm();
  pullPromise.then(function () {
    controller._pulling = false;

    if (controller._pullAgain === true) {
      controller._pullAgain = false;
      ReadableByteStreamControllerCallPullIfNeeded(controller);
    }
  }, function (e) {
    if (controller._controlledReadableByteStream._state === 'readable') {
      ReadableByteStreamControllerError(controller, e);
    }
  }).catch(rethrowAssertionErrorRejection$2);

  return undefined;
}

function ReadableByteStreamControllerClearPendingPullIntos(controller) {
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  controller._pendingPullIntos = [];
}

function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
  assert$1(stream._state !== 'errored');

  var done = false;
  if (stream._state === 'closed') {
    assert$1(pullIntoDescriptor.bytesFilled === 0);
    done = true;
  }

  var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
  if (pullIntoDescriptor.readerType === 'default') {
    ReadableStreamFulfillReadRequest(stream, filledView, done);
  } else {
    assert$1(pullIntoDescriptor.readerType === 'byob');
    ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
  }
}

function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
  var bytesFilled = pullIntoDescriptor.bytesFilled;
  var elementSize = pullIntoDescriptor.elementSize;

  assert$1(bytesFilled <= pullIntoDescriptor.byteLength);
  assert$1(bytesFilled % elementSize === 0);

  return new pullIntoDescriptor.ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
}

function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
  controller._queue.push({ buffer: buffer, byteOffset: byteOffset, byteLength: byteLength });
  controller._queueTotalSize += byteLength;
}

function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
  var elementSize = pullIntoDescriptor.elementSize;

  var currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;

  var maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
  var maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
  var maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;

  var totalBytesToCopyRemaining = maxBytesToCopy;
  var ready = false;
  if (maxAlignedBytes > currentAlignedBytes) {
    totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
    ready = true;
  }

  var queue = controller._queue;

  while (totalBytesToCopyRemaining > 0) {
    var headOfQueue = queue[0];

    var bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);

    var destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    ArrayBufferCopy(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);

    if (headOfQueue.byteLength === bytesToCopy) {
      queue.shift();
    } else {
      headOfQueue.byteOffset += bytesToCopy;
      headOfQueue.byteLength -= bytesToCopy;
    }
    controller._queueTotalSize -= bytesToCopy;

    ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);

    totalBytesToCopyRemaining -= bytesToCopy;
  }

  if (ready === false) {
    assert$1(controller._queueTotalSize === 0);
    assert$1(pullIntoDescriptor.bytesFilled > 0);
    assert$1(pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize);
  }

  return ready;
}

function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
  assert$1(controller._pendingPullIntos.length === 0 || controller._pendingPullIntos[0] === pullIntoDescriptor);

  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  pullIntoDescriptor.bytesFilled += size;
}

function ReadableByteStreamControllerHandleQueueDrain(controller) {
  assert$1(controller._controlledReadableByteStream._state === 'readable');

  if (controller._queueTotalSize === 0 && controller._closeRequested === true) {
    ReadableStreamClose(controller._controlledReadableByteStream);
  } else {
    ReadableByteStreamControllerCallPullIfNeeded(controller);
  }
}

function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
  if (controller._byobRequest === undefined) {
    return;
  }

  controller._byobRequest._associatedReadableByteStreamController = undefined;
  controller._byobRequest._view = undefined;
  controller._byobRequest = undefined;
}

function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
  assert$1(controller._closeRequested === false);

  while (controller._pendingPullIntos.length > 0) {
    if (controller._queueTotalSize === 0) {
      return;
    }

    var pullIntoDescriptor = controller._pendingPullIntos[0];

    if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) === true) {
      ReadableByteStreamControllerShiftPendingPullInto(controller);

      ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
    }
  }
}

function ReadableByteStreamControllerPullInto(controller, view) {
  var stream = controller._controlledReadableByteStream;

  var elementSize = 1;
  if (view.constructor !== DataView) {
    elementSize = view.constructor.BYTES_PER_ELEMENT;
  }

  var ctor = view.constructor;

  var buffer = TransferArrayBuffer(view.buffer);
  var pullIntoDescriptor = {
    buffer: buffer,
    byteOffset: view.byteOffset,
    byteLength: view.byteLength,
    bytesFilled: 0,
    elementSize: elementSize,
    ctor: ctor,
    readerType: 'byob'
  };

  if (controller._pendingPullIntos.length > 0) {
    controller._pendingPullIntos.push(pullIntoDescriptor);

    // No ReadableByteStreamControllerCallPullIfNeeded() call since:
    // - No change happens on desiredSize
    // - The source has already been notified of that there's at least 1 pending read(view)

    return ReadableStreamAddReadIntoRequest(stream);
  }

  if (stream._state === 'closed') {
    var emptyView = new view.constructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
    return Promise.resolve(CreateIterResultObject(emptyView, true));
  }

  if (controller._queueTotalSize > 0) {
    if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) === true) {
      var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);

      ReadableByteStreamControllerHandleQueueDrain(controller);

      return Promise.resolve(CreateIterResultObject(filledView, false));
    }

    if (controller._closeRequested === true) {
      var e = new TypeError('Insufficient bytes to fill elements in the given buffer');
      ReadableByteStreamControllerError(controller, e);

      return Promise.reject(e);
    }
  }

  controller._pendingPullIntos.push(pullIntoDescriptor);

  var promise = ReadableStreamAddReadIntoRequest(stream);

  ReadableByteStreamControllerCallPullIfNeeded(controller);

  return promise;
}

function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
  firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);

  assert$1(firstDescriptor.bytesFilled === 0);

  var stream = controller._controlledReadableByteStream;
  if (ReadableStreamHasBYOBReader(stream) === true) {
    while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
      var pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
      ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
    }
  }
}

function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
  if (pullIntoDescriptor.bytesFilled + bytesWritten > pullIntoDescriptor.byteLength) {
    throw new RangeError('bytesWritten out of range');
  }

  ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);

  if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
    // TODO: Figure out whether we should detach the buffer or not here.
    return;
  }

  ReadableByteStreamControllerShiftPendingPullInto(controller);

  var remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
  if (remainderSize > 0) {
    var end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    var remainder = pullIntoDescriptor.buffer.slice(end - remainderSize, end);
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
  }

  pullIntoDescriptor.buffer = TransferArrayBuffer(pullIntoDescriptor.buffer);
  pullIntoDescriptor.bytesFilled -= remainderSize;
  ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);

  ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
}

function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
  var firstDescriptor = controller._pendingPullIntos[0];

  var stream = controller._controlledReadableByteStream;

  if (stream._state === 'closed') {
    if (bytesWritten !== 0) {
      throw new TypeError('bytesWritten must be 0 when calling respond() on a closed stream');
    }

    ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
  } else {
    assert$1(stream._state === 'readable');

    ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
  }
}

function ReadableByteStreamControllerShiftPendingPullInto(controller) {
  var descriptor = controller._pendingPullIntos.shift();
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  return descriptor;
}

function ReadableByteStreamControllerShouldCallPull(controller) {
  var stream = controller._controlledReadableByteStream;

  if (stream._state !== 'readable') {
    return false;
  }

  if (controller._closeRequested === true) {
    return false;
  }

  if (controller._started === false) {
    return false;
  }

  if (ReadableStreamHasDefaultReader(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }

  if (ReadableStreamHasBYOBReader(stream) === true && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
    return true;
  }

  if (ReadableByteStreamControllerGetDesiredSize(controller) > 0) {
    return true;
  }

  return false;
}

// A client of ReadableByteStreamController may use these functions directly to bypass state check.

function ReadableByteStreamControllerClose(controller) {
  var stream = controller._controlledReadableByteStream;

  assert$1(controller._closeRequested === false);
  assert$1(stream._state === 'readable');

  if (controller._queueTotalSize > 0) {
    controller._closeRequested = true;

    return;
  }

  if (controller._pendingPullIntos.length > 0) {
    var firstPendingPullInto = controller._pendingPullIntos[0];
    if (firstPendingPullInto.bytesFilled > 0) {
      var e = new TypeError('Insufficient bytes to fill elements in the given buffer');
      ReadableByteStreamControllerError(controller, e);

      throw e;
    }
  }

  ReadableStreamClose(stream);
}

function ReadableByteStreamControllerEnqueue(controller, chunk) {
  var stream = controller._controlledReadableByteStream;

  assert$1(controller._closeRequested === false);
  assert$1(stream._state === 'readable');

  var buffer = chunk.buffer;
  var byteOffset = chunk.byteOffset;
  var byteLength = chunk.byteLength;
  var transferredBuffer = TransferArrayBuffer(buffer);

  if (ReadableStreamHasDefaultReader(stream) === true) {
    if (ReadableStreamGetNumReadRequests(stream) === 0) {
      ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    } else {
      assert$1(controller._queue.length === 0);

      var transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
      ReadableStreamFulfillReadRequest(stream, transferredView, false);
    }
  } else if (ReadableStreamHasBYOBReader(stream) === true) {
    // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
  } else {
    assert$1(IsReadableStreamLocked(stream) === false);
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
  }
}

function ReadableByteStreamControllerError(controller, e) {
  var stream = controller._controlledReadableByteStream;

  assert$1(stream._state === 'readable');

  ReadableByteStreamControllerClearPendingPullIntos(controller);

  ResetQueue$2(controller);
  ReadableStreamError(stream, e);
}

function ReadableByteStreamControllerGetDesiredSize(controller) {
  var stream = controller._controlledReadableByteStream;
  var state = stream._state;

  if (state === 'errored') {
    return null;
  }
  if (state === 'closed') {
    return 0;
  }

  return controller._strategyHWM - controller._queueTotalSize;
}

function ReadableByteStreamControllerRespond(controller, bytesWritten) {
  bytesWritten = Number(bytesWritten);
  if (IsFiniteNonNegativeNumber$1(bytesWritten) === false) {
    throw new RangeError('bytesWritten must be a finite');
  }

  assert$1(controller._pendingPullIntos.length > 0);

  ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
}

function ReadableByteStreamControllerRespondWithNewView(controller, view) {
  assert$1(controller._pendingPullIntos.length > 0);

  var firstDescriptor = controller._pendingPullIntos[0];

  if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
    throw new RangeError('The region specified by view does not match byobRequest');
  }
  if (firstDescriptor.byteLength !== view.byteLength) {
    throw new RangeError('The buffer of view has different capacity than byobRequest');
  }

  firstDescriptor.buffer = view.buffer;

  ReadableByteStreamControllerRespondInternal(controller, view.byteLength);
}

function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
  assert$1(stream._readableStreamController === undefined);
  if (autoAllocateChunkSize !== undefined) {
    assert$1(Number.isInteger(autoAllocateChunkSize) === true);
    assert$1(autoAllocateChunkSize > 0);
  }

  controller._controlledReadableByteStream = stream;

  controller._pullAgain = false;
  controller._pulling = false;

  ReadableByteStreamControllerClearPendingPullIntos(controller);

  // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
  controller._queue = controller._queueTotalSize = undefined;
  ResetQueue$2(controller);

  controller._closeRequested = false;
  controller._started = false;

  controller._strategyHWM = ValidateAndNormalizeHighWaterMark$1(highWaterMark);

  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;

  controller._autoAllocateChunkSize = autoAllocateChunkSize;

  controller._pendingPullIntos = [];

  stream._readableStreamController = controller;

  var startResult = startAlgorithm();
  Promise.resolve(startResult).then(function () {
    controller._started = true;

    assert$1(controller._pulling === false);
    assert$1(controller._pullAgain === false);

    ReadableByteStreamControllerCallPullIfNeeded(controller);
  }, function (r) {
    if (stream._state === 'readable') {
      ReadableByteStreamControllerError(controller, r);
    }
  }).catch(rethrowAssertionErrorRejection$2);
}

function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
  assert$1(underlyingByteSource !== undefined);

  var controller = Object.create(ReadableByteStreamController.prototype);

  function startAlgorithm() {
    return InvokeOrNoop$1(underlyingByteSource, 'start', [controller]);
  }

  var pullAlgorithm = CreateAlgorithmFromUnderlyingMethod$1(underlyingByteSource, 'pull', 0, [controller]);
  var cancelAlgorithm = CreateAlgorithmFromUnderlyingMethod$1(underlyingByteSource, 'cancel', 1, []);

  var autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
  if (autoAllocateChunkSize !== undefined) {
    if (Number.isInteger(autoAllocateChunkSize) === false || autoAllocateChunkSize <= 0) {
      throw new RangeError('autoAllocateChunkSize must be a positive integer');
    }
  }

  SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
}

function SetUpReadableStreamBYOBRequest(request, controller, view) {
  assert$1(IsReadableByteStreamController(controller) === true);
  assert$1((typeof view === 'undefined' ? 'undefined' : _typeof(view)) === 'object');
  assert$1(ArrayBuffer.isView(view) === true);
  assert$1(IsDetachedBuffer(view.buffer) === false);
  request._associatedReadableByteStreamController = controller;
  request._view = view;
}

// Helper functions for the ReadableStream.

function streamBrandCheckException$1(name) {
  return new TypeError('ReadableStream.prototype.' + name + ' can only be used on a ReadableStream');
}

// Helper functions for the readers.

function readerLockException(name) {
  return new TypeError('Cannot ' + name + ' a stream using a released reader');
}

// Helper functions for the ReadableStreamDefaultReader.

function defaultReaderBrandCheckException(name) {
  return new TypeError('ReadableStreamDefaultReader.prototype.' + name + ' can only be used on a ReadableStreamDefaultReader');
}

function defaultReaderClosedPromiseInitialize(reader) {
  reader._closedPromise = new Promise(function (resolve, reject) {
    reader._closedPromise_resolve = resolve;
    reader._closedPromise_reject = reject;
  });
}

function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
  reader._closedPromise = Promise.reject(reason);
  reader._closedPromise_resolve = undefined;
  reader._closedPromise_reject = undefined;
}

function defaultReaderClosedPromiseInitializeAsResolved(reader) {
  reader._closedPromise = Promise.resolve(undefined);
  reader._closedPromise_resolve = undefined;
  reader._closedPromise_reject = undefined;
}

function defaultReaderClosedPromiseReject(reader, reason) {
  assert$1(reader._closedPromise_resolve !== undefined);
  assert$1(reader._closedPromise_reject !== undefined);

  reader._closedPromise_reject(reason);
  reader._closedPromise_resolve = undefined;
  reader._closedPromise_reject = undefined;
}

function defaultReaderClosedPromiseResetToRejected(reader, reason) {
  assert$1(reader._closedPromise_resolve === undefined);
  assert$1(reader._closedPromise_reject === undefined);

  reader._closedPromise = Promise.reject(reason);
}

function defaultReaderClosedPromiseResolve(reader) {
  assert$1(reader._closedPromise_resolve !== undefined);
  assert$1(reader._closedPromise_reject !== undefined);

  reader._closedPromise_resolve(undefined);
  reader._closedPromise_resolve = undefined;
  reader._closedPromise_reject = undefined;
}

// Helper functions for the ReadableStreamDefaultReader.

function byobReaderBrandCheckException(name) {
  return new TypeError('ReadableStreamBYOBReader.prototype.' + name + ' can only be used on a ReadableStreamBYOBReader');
}

// Helper functions for the ReadableStreamDefaultController.

function defaultControllerBrandCheckException(name) {
  return new TypeError('ReadableStreamDefaultController.prototype.' + name + ' can only be used on a ReadableStreamDefaultController');
}

// Helper functions for the ReadableStreamBYOBRequest.

function byobRequestBrandCheckException(name) {
  return new TypeError('ReadableStreamBYOBRequest.prototype.' + name + ' can only be used on a ReadableStreamBYOBRequest');
}

// Helper functions for the ReadableByteStreamController.

function byteStreamControllerBrandCheckException(name) {
  return new TypeError('ReadableByteStreamController.prototype.' + name + ' can only be used on a ReadableByteStreamController');
}

// Helper function for ReadableStream pipeThrough

function ifIsObjectAndHasAPromiseIsHandledInternalSlotSetPromiseIsHandledToTrue(promise) {
  try {
    // This relies on the brand-check that is enforced by Promise.prototype.then(). As with the rest of the reference
    // implementation, it doesn't attempt to do the right thing if someone has modified the global environment.
    Promise.prototype.then.call(promise, undefined, function () {});
  } catch (e) {
    // The brand check failed, therefore the internal slot is not present and there's nothing further to do.
  }
}
var readableStream_3 = readableStream.ReadableStream;

var createDataProperty = helpers.createDataProperty;


var byteLengthQueuingStrategy = function () {
  function ByteLengthQueuingStrategy(_ref) {
    var highWaterMark = _ref.highWaterMark;
    classCallCheck(this, ByteLengthQueuingStrategy);

    createDataProperty(this, 'highWaterMark', highWaterMark);
  }

  ByteLengthQueuingStrategy.prototype.size = function size(chunk) {
    return chunk.byteLength;
  };

  return ByteLengthQueuingStrategy;
}();

var createDataProperty$1 = helpers.createDataProperty;


var countQueuingStrategy = function () {
  function CountQueuingStrategy(_ref) {
    var highWaterMark = _ref.highWaterMark;
    classCallCheck(this, CountQueuingStrategy);

    createDataProperty$1(this, 'highWaterMark', highWaterMark);
  }

  CountQueuingStrategy.prototype.size = function size() {
    return 1;
  };

  return CountQueuingStrategy;
}();

// Calls to verbose() are purely for debugging the reference implementation and tests. They are not part of the standard
// and do not appear in the standard text.
var verbose$1 = require$$0('streams:transform-stream:verbose');
var InvokeOrNoop$2 = helpers.InvokeOrNoop,
    CreateAlgorithmFromUnderlyingMethod$2 = helpers.CreateAlgorithmFromUnderlyingMethod,
    PromiseCall = helpers.PromiseCall,
    typeIsObject$2 = helpers.typeIsObject,
    ValidateAndNormalizeHighWaterMark$2 = helpers.ValidateAndNormalizeHighWaterMark,
    IsNonNegativeNumber$2 = helpers.IsNonNegativeNumber,
    MakeSizeAlgorithmFromSizeFunction$2 = helpers.MakeSizeAlgorithmFromSizeFunction;
var CreateReadableStream$1 = readableStream.CreateReadableStream,
    ReadableStreamDefaultControllerClose$1 = readableStream.ReadableStreamDefaultControllerClose,
    ReadableStreamDefaultControllerEnqueue$1 = readableStream.ReadableStreamDefaultControllerEnqueue,
    ReadableStreamDefaultControllerError$1 = readableStream.ReadableStreamDefaultControllerError,
    ReadableStreamDefaultControllerGetDesiredSize$1 = readableStream.ReadableStreamDefaultControllerGetDesiredSize,
    ReadableStreamDefaultControllerHasBackpressure$1 = readableStream.ReadableStreamDefaultControllerHasBackpressure,
    ReadableStreamDefaultControllerCanCloseOrEnqueue$1 = readableStream.ReadableStreamDefaultControllerCanCloseOrEnqueue;
var CreateWritableStream$1 = writableStream.CreateWritableStream,
    WritableStreamDefaultControllerErrorIfNeeded$1 = writableStream.WritableStreamDefaultControllerErrorIfNeeded;

// Class TransformStream

var TransformStream = function () {
  function TransformStream() {
    var transformer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var writableStrategy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var readableStrategy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, TransformStream);

    var readableType = transformer.readableType;

    if (readableType !== undefined) {
      throw new RangeError('Invalid readable type specified');
    }

    var writableType = transformer.writableType;

    if (writableType !== undefined) {
      throw new RangeError('Invalid writable type specified');
    }

    var writableSizeFunction = writableStrategy.size;
    var writableSizeAlgorithm = MakeSizeAlgorithmFromSizeFunction$2(writableSizeFunction);
    var writableHighWaterMark = writableStrategy.highWaterMark;
    if (writableHighWaterMark === undefined) {
      writableHighWaterMark = 1;
    }
    writableHighWaterMark = ValidateAndNormalizeHighWaterMark$2(writableHighWaterMark);

    var readableSizeFunction = readableStrategy.size;
    var readableSizeAlgorithm = MakeSizeAlgorithmFromSizeFunction$2(readableSizeFunction);
    var readableHighWaterMark = readableStrategy.highWaterMark;
    if (readableHighWaterMark === undefined) {
      readableHighWaterMark = 0;
    }
    readableHighWaterMark = ValidateAndNormalizeHighWaterMark$2(readableHighWaterMark);

    var startPromise_resolve = void 0;
    var startPromise = new Promise(function (resolve) {
      startPromise_resolve = resolve;
    });

    InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
    SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);

    var startResult = InvokeOrNoop$2(transformer, 'start', [this._transformStreamController]);
    startPromise_resolve(startResult);
  }

  createClass(TransformStream, [{
    key: 'readable',
    get: function get$$1() {
      if (IsTransformStream(this) === false) {
        throw streamBrandCheckException$2('readable');
      }

      return this._readable;
    }
  }, {
    key: 'writable',
    get: function get$$1() {
      if (IsTransformStream(this) === false) {
        throw streamBrandCheckException$2('writable');
      }

      return this._writable;
    }
  }]);
  return TransformStream;
}();

// Transform Stream Abstract Operations

function CreateTransformStream(startAlgorithm, transformAlgorithm, flushAlgorithm) {
  var writableHighWaterMark = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var writableSizeAlgorithm = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {
    return 1;
  };
  var readableHighWaterMark = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var readableSizeAlgorithm = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : function () {
    return 1;
  };

  assert$1(IsNonNegativeNumber$2(writableHighWaterMark));
  assert$1(IsNonNegativeNumber$2(readableHighWaterMark));

  var stream = Object.create(TransformStream.prototype);

  var startPromise_resolve = void 0;
  var startPromise = new Promise(function (resolve) {
    startPromise_resolve = resolve;
  });

  InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);

  var controller = Object.create(TransformStreamDefaultController.prototype);

  SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);

  var startResult = startAlgorithm();
  startPromise_resolve(startResult);
  return stream;
}

function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
  function startAlgorithm() {
    return startPromise;
  }

  function writeAlgorithm(chunk) {
    return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
  }

  function abortAlgorithm() {
    return TransformStreamDefaultSinkAbortAlgorithm(stream);
  }

  function closeAlgorithm() {
    return TransformStreamDefaultSinkCloseAlgorithm(stream);
  }

  stream._writable = CreateWritableStream$1(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);

  function pullAlgorithm() {
    return TransformStreamDefaultSourcePullAlgorithm(stream);
  }

  function cancelAlgorithm(reason) {
    TransformStreamErrorWritableAndUnblockWrite(stream, reason);
    return Promise.resolve();
  }

  stream._readable = CreateReadableStream$1(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);

  // The [[backpressure]] slot is set to undefined so that it can be initialised by TransformStreamSetBackpressure.
  stream._backpressure = undefined;
  stream._backpressureChangePromise = undefined;
  stream._backpressureChangePromise_resolve = undefined;
  TransformStreamSetBackpressure(stream, true);

  // Used by IsWritableStream() which is called by SetUpTransformStreamDefaultController().
  stream._transformStreamController = undefined;
}

function IsTransformStream(x) {
  if (!typeIsObject$2(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_transformStreamController')) {
    return false;
  }

  return true;
}

// This is a no-op if both sides are already errored.
function TransformStreamError(stream, e) {
  verbose$1('TransformStreamError()');

  if (stream._readable._state === 'readable') {
    ReadableStreamDefaultControllerError$1(stream._readable._readableStreamController, e);
  }
  TransformStreamErrorWritableAndUnblockWrite(stream, e);
}

function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
  WritableStreamDefaultControllerErrorIfNeeded$1(stream._writable._writableStreamController, e);
  if (stream._backpressure === true) {
    // Pretend that pull() was called to permit any pending write() calls to complete. TransformStreamSetBackpressure()
    // cannot be called from enqueue() or pull() once the ReadableStream is errored, so this will will be the final time
    // _backpressure is set.
    TransformStreamSetBackpressure(stream, false);
  }
}

function TransformStreamSetBackpressure(stream, backpressure) {
  verbose$1('TransformStreamSetBackpressure() [backpressure = ' + backpressure + ']');

  // Passes also when called during construction.
  assert$1(stream._backpressure !== backpressure);

  if (stream._backpressureChangePromise !== undefined) {
    stream._backpressureChangePromise_resolve();
  }

  stream._backpressureChangePromise = new Promise(function (resolve) {
    stream._backpressureChangePromise_resolve = resolve;
  });

  stream._backpressure = backpressure;
}

// Class TransformStreamDefaultController

var TransformStreamDefaultController = function () {
  function TransformStreamDefaultController() {
    classCallCheck(this, TransformStreamDefaultController);

    throw new TypeError('TransformStreamDefaultController instances cannot be created directly');
  }

  TransformStreamDefaultController.prototype.enqueue = function enqueue(chunk) {
    if (IsTransformStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException$1('enqueue');
    }

    TransformStreamDefaultControllerEnqueue(this, chunk);
  };

  TransformStreamDefaultController.prototype.error = function error(reason) {
    if (IsTransformStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException$1('error');
    }

    TransformStreamDefaultControllerError(this, reason);
  };

  TransformStreamDefaultController.prototype.terminate = function terminate() {
    if (IsTransformStreamDefaultController(this) === false) {
      throw defaultControllerBrandCheckException$1('terminate');
    }

    TransformStreamDefaultControllerTerminate(this);
  };

  createClass(TransformStreamDefaultController, [{
    key: 'desiredSize',
    get: function get$$1() {
      if (IsTransformStreamDefaultController(this) === false) {
        throw defaultControllerBrandCheckException$1('desiredSize');
      }

      var readableController = this._controlledTransformStream._readable._readableStreamController;
      return ReadableStreamDefaultControllerGetDesiredSize$1(readableController);
    }
  }]);
  return TransformStreamDefaultController;
}();

// Transform Stream Default Controller Abstract Operations

function IsTransformStreamDefaultController(x) {
  if (!typeIsObject$2(x)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(x, '_controlledTransformStream')) {
    return false;
  }

  return true;
}

function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
  assert$1(IsTransformStream(stream) === true);
  assert$1(stream._transformStreamController === undefined);

  controller._controlledTransformStream = stream;
  stream._transformStreamController = controller;

  controller._transformAlgorithm = transformAlgorithm;
  controller._flushAlgorithm = flushAlgorithm;
}

function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
  assert$1(transformer !== undefined);

  var controller = Object.create(TransformStreamDefaultController.prototype);

  var transformAlgorithm = function transformAlgorithm(chunk) {
    try {
      TransformStreamDefaultControllerEnqueue(controller, chunk);
      return Promise.resolve();
    } catch (transformResultE) {
      return Promise.reject(transformResultE);
    }
  };
  var transformMethod = transformer.transform;
  if (transformMethod !== undefined) {
    if (typeof transformMethod !== 'function') {
      throw new TypeError('transform is not a method');
    }
    transformAlgorithm = function transformAlgorithm(chunk) {
      var transformPromise = PromiseCall(transformMethod, transformer, [chunk, controller]);
      return transformPromise.catch(function (e) {
        TransformStreamError(stream, e);
        throw e;
      });
    };
  }

  var flushAlgorithm = CreateAlgorithmFromUnderlyingMethod$2(transformer, 'flush', 0, [controller]);

  SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
}

function TransformStreamDefaultControllerEnqueue(controller, chunk) {
  verbose$1('TransformStreamDefaultControllerEnqueue()');

  var stream = controller._controlledTransformStream;
  var readableController = stream._readable._readableStreamController;
  if (ReadableStreamDefaultControllerCanCloseOrEnqueue$1(readableController) === false) {
    throw new TypeError('Readable side is not in a state that permits enqueue');
  }

  // We throttle transform invocations based on the backpressure of the ReadableStream, but we still
  // accept TransformStreamDefaultControllerEnqueue() calls.

  try {
    ReadableStreamDefaultControllerEnqueue$1(readableController, chunk);
  } catch (e) {
    // This happens when readableStrategy.size() throws.
    TransformStreamErrorWritableAndUnblockWrite(stream, e);

    throw stream._readable._storedError;
  }

  var backpressure = ReadableStreamDefaultControllerHasBackpressure$1(readableController);
  if (backpressure !== stream._backpressure) {
    assert$1(backpressure === true);
    TransformStreamSetBackpressure(stream, true);
  }
}

function TransformStreamDefaultControllerError(controller, e) {
  TransformStreamError(controller._controlledTransformStream, e);
}

function TransformStreamDefaultControllerTerminate(controller) {
  verbose$1('TransformStreamDefaultControllerTerminate()');

  var stream = controller._controlledTransformStream;
  var readableController = stream._readable._readableStreamController;

  if (ReadableStreamDefaultControllerCanCloseOrEnqueue$1(readableController) === true) {
    ReadableStreamDefaultControllerClose$1(readableController);
  }

  var error = new TypeError('TransformStream terminated');
  TransformStreamErrorWritableAndUnblockWrite(stream, error);
}

// TransformStreamDefaultSink Algorithms

function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
  verbose$1('TransformStreamDefaultSinkWriteAlgorithm()');

  assert$1(stream._writable._state === 'writable');

  var controller = stream._transformStreamController;

  if (stream._backpressure === true) {
    var backpressureChangePromise = stream._backpressureChangePromise;
    assert$1(backpressureChangePromise !== undefined);
    return backpressureChangePromise.then(function () {
      var writable = stream._writable;
      var state = writable._state;
      if (state === 'erroring') {
        throw writable._storedError;
      }
      assert$1(state === 'writable');
      return controller._transformAlgorithm(chunk);
    });
  }

  return controller._transformAlgorithm(chunk);
}

function TransformStreamDefaultSinkAbortAlgorithm(stream) {
  // abort() is not called synchronously, so it is possible for abort() to be called when the stream is already
  // errored.
  var e = new TypeError('Writable side aborted');
  TransformStreamError(stream, e);
  return Promise.resolve();
}

function TransformStreamDefaultSinkCloseAlgorithm(stream) {
  verbose$1('TransformStreamDefaultSinkCloseAlgorithm()');

  // stream._readable cannot change after construction, so caching it across a call to user code is safe.
  var readable = stream._readable;

  var flushPromise = stream._transformStreamController._flushAlgorithm();
  // Return a promise that is fulfilled with undefined on success.
  return flushPromise.then(function () {
    if (readable._state === 'errored') {
      throw readable._storedError;
    }
    var readableController = readable._readableStreamController;
    if (ReadableStreamDefaultControllerCanCloseOrEnqueue$1(readableController) === true) {
      ReadableStreamDefaultControllerClose$1(readableController);
    }
  }).catch(function (r) {
    TransformStreamError(stream, r);
    throw readable._storedError;
  });
}

// TransformStreamDefaultSource Algorithms

function TransformStreamDefaultSourcePullAlgorithm(stream) {
  verbose$1('TransformStreamDefaultSourcePullAlgorithm()');

  // Invariant. Enforced by the promises returned by start() and pull().
  assert$1(stream._backpressure === true);

  assert$1(stream._backpressureChangePromise !== undefined);

  TransformStreamSetBackpressure(stream, false);

  // Prevent the next pull() call until there is backpressure.
  return stream._backpressureChangePromise;
}

var transformStream = { CreateTransformStream: CreateTransformStream, TransformStream: TransformStream };

// Helper functions for the TransformStreamDefaultController.

function defaultControllerBrandCheckException$1(name) {
  return new TypeError('TransformStreamDefaultController.prototype.' + name + ' can only be used on a TransformStreamDefaultController');
}

// Helper functions for the TransformStream.

function streamBrandCheckException$2(name) {
  return new TypeError('TransformStream.prototype.' + name + ' can only be used on a TransformStream');
}
var transformStream_2 = transformStream.TransformStream;

export { readableStream_3 as ReadableStream, writableStream_5 as WritableStream, byteLengthQueuingStrategy as ByteLengthQueuingStrategy, countQueuingStrategy as CountQueuingStrategy, transformStream_2 as TransformStream };
//# sourceMappingURL=ponyfill.mjs.map
