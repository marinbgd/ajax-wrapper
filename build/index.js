"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MINUTE_IN_MS = 60000;
var DEFAULT_FETCH_CACHE_TIME = MINUTE_IN_MS;

var Fetcher =
/*#__PURE__*/
function () {
  function Fetcher() {
    _classCallCheck(this, Fetcher);

    this.cache = {};
  }

  _createClass(Fetcher, [{
    key: "get",
    value: function get(_ref) {
      var _window,
          _this = this;

      var url = _ref.url,
          _ref$params = _ref.params,
          params = _ref$params === void 0 ? null : _ref$params,
          _ref$headers = _ref.headers,
          headers = _ref$headers === void 0 ? null : _ref$headers,
          _ref$isCached = _ref.isCached,
          isCached = _ref$isCached === void 0 ? false : _ref$isCached,
          _ref$cacheExpireInMs = _ref.cacheExpireInMs,
          cacheExpireInMs = _ref$cacheExpireInMs === void 0 ? DEFAULT_FETCH_CACHE_TIME : _ref$cacheExpireInMs;

      var urlWithParams = this._addParamsToUrl(url, params);

      var options = this._addHeadersToOptions(headers);

      var fetchPromiseCallArgs = this._getFetchArgs(urlWithParams, options);

      if (isCached && this._isAjaxRequestInProgress(urlWithParams)) {
        return this._getAjaxRequestInProgress(urlWithParams);
      }

      if (isCached && this._isCachedResponseValid({
        urlWithParams: urlWithParams,
        cacheExpireInMs: cacheExpireInMs
      })) {
        return this._getCachedResponse(urlWithParams);
      }

      var fetchPromise = (_window = window).fetch.apply(_window, _toConsumableArray(fetchPromiseCallArgs)).then(this._handleFetchErrors).then(function (response) {
        return response.json();
      }).then(function (response) {
        _this._persistResponse({
          urlWithParams: urlWithParams,
          response: response,
          cacheExpireInMs: cacheExpireInMs
        });

        return response;
      })["finally"](function () {
        _this._clearAjaxRequestPromise(urlWithParams);
      });

      if (isCached) {
        this._persistAjaxRequestPromise({
          urlWithParams: urlWithParams,
          ajaxPromise: fetchPromise
        });
      }

      return fetchPromise;
    }
  }, {
    key: "_getCachedResponse",
    value: function _getCachedResponse(urlWithParams) {
      return Promise.resolve(this.cache[urlWithParams].response);
    }
  }, {
    key: "_isCachedResponseValid",
    value: function _isCachedResponseValid(_ref2) {
      var urlWithParams = _ref2.urlWithParams,
          cacheExpireInMs = _ref2.cacheExpireInMs;

      if (!(this.cache[urlWithParams] && this.cache[urlWithParams].response)) {
        return false;
      }

      var cachedResponse = this.cache[urlWithParams];
      var cacheTimeMs = cachedResponse.timestamp.getTime();
      var timeNowInMs = new Date().getTime();
      var diffInMs = timeNowInMs - cacheTimeMs;
      return diffInMs < cacheExpireInMs;
    }
  }, {
    key: "_persistResponse",
    value: function _persistResponse(_ref3) {
      var urlWithParams = _ref3.urlWithParams,
          response = _ref3.response,
          cacheExpireInMs = _ref3.cacheExpireInMs;
      this.cache[urlWithParams] = _objectSpread({}, this.cache[urlWithParams], {
        response: response,
        cacheExpireInMs: cacheExpireInMs,
        timestamp: new Date()
      });
    }
  }, {
    key: "_isAjaxRequestInProgress",
    value: function _isAjaxRequestInProgress(urlWithParams) {
      return !!(this.cache[urlWithParams] && this.cache[urlWithParams].ajaxPromise);
    }
  }, {
    key: "_getAjaxRequestInProgress",
    value: function _getAjaxRequestInProgress(urlWithParams) {
      return this.cache[urlWithParams].ajaxPromise;
    }
  }, {
    key: "_persistAjaxRequestPromise",
    value: function _persistAjaxRequestPromise(_ref4) {
      var urlWithParams = _ref4.urlWithParams,
          ajaxPromise = _ref4.ajaxPromise;
      this.cache[urlWithParams] = _objectSpread({}, this.cache[urlWithParams], {
        ajaxPromise: ajaxPromise
      });
    }
  }, {
    key: "_clearAjaxRequestPromise",
    value: function _clearAjaxRequestPromise(urlWithParams) {
      if (!this.cache[urlWithParams]) {
        this.cache[urlWithParams] = {};
      }

      this.cache[urlWithParams].ajaxPromise = null;
    }
  }, {
    key: "_handleFetchErrors",
    value: function _handleFetchErrors(fetchResponse) {
      if (!fetchResponse.ok) {
        throw Error(fetchResponse.statusText);
      }

      return fetchResponse;
    }
  }, {
    key: "_getFetchArgs",
    value: function _getFetchArgs(urlWithParams, options) {
      var fetchPromiseCallArgs = [urlWithParams];

      if (options) {
        fetchPromiseCallArgs = [urlWithParams, options];
      }

      return fetchPromiseCallArgs;
    }
  }, {
    key: "_getEncodedParams",
    value: function _getEncodedParams(params) {
      if (!params) {
        return params;
      }

      var encodedParams = {};
      Object.keys(params).forEach(function (key) {
        var encodedKey = window.encodeURIComponent(key);
        var encodedParam = window.encodeURIComponent(params[key]);
        encodedParams[encodedKey] = encodedParam;
      });
      return encodedParams;
    }
  }, {
    key: "_addParamsToUrl",
    value: function _addParamsToUrl(url, params) {
      if (!params) {
        return url;
      }

      var encodedParams = this._getEncodedParams(params);

      var keys = Object.keys(encodedParams);
      var orderedKeys = keys.sort();
      var urlWithQuery = url;
      orderedKeys.forEach(function (key, index) {
        if (index === 0) {
          urlWithQuery += "?".concat(key, "=").concat(encodedParams[key]);
        } else {
          urlWithQuery += "&".concat(key, "=").concat(encodedParams[key]);
        }
      });
      return urlWithQuery;
    }
  }, {
    key: "_addHeadersToOptions",
    value: function _addHeadersToOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!headers) {
        return options;
      }

      var newHeaders = new Headers(headers);
      return _objectSpread({}, options, {
        headers: newHeaders
      });
    }
  }, {
    key: "resetCache",
    value: function resetCache() {
      this.cache = {};
    }
  }]);

  return Fetcher;
}();

var defaultInstance = new Fetcher();
var _default = defaultInstance;
exports["default"] = _default;
