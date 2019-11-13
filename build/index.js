"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    key: "_getCachedResponse",
    value: function _getCachedResponse(urlWithParams) {
      return Promise.resolve(this.cache[urlWithParams].response);
    }
  }, {
    key: "_isCachedResponseValid",
    value: function _isCachedResponseValid(_ref) {
      var urlWithParams = _ref.urlWithParams,
          cacheExpireInMs = _ref.cacheExpireInMs;

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
    value: function _persistResponse(_ref2) {
      var urlWithParams = _ref2.urlWithParams,
          response = _ref2.response,
          cacheExpireInMs = _ref2.cacheExpireInMs;
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
    value: function _persistAjaxRequestPromise(_ref3) {
      var urlWithParams = _ref3.urlWithParams,
          ajaxPromise = _ref3.ajaxPromise;
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

      return _objectSpread({}, options, {
        headers: headers
      });
    }
  }, {
    key: "_addBodyToOptions",
    value: function _addBodyToOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!data) {
        return options;
      }

      return _objectSpread({}, options, {
        body: JSON.stringify(data)
      });
    }
  }, {
    key: "resetCache",
    value: function resetCache() {
      this.cache = {};
    }
  }, {
    key: "get",
    value: function get(_ref4) {
      var _window,
          _this = this;

      var url = _ref4.url,
          _ref4$params = _ref4.params,
          params = _ref4$params === void 0 ? null : _ref4$params,
          _ref4$headers = _ref4.headers,
          headers = _ref4$headers === void 0 ? null : _ref4$headers,
          _ref4$isCached = _ref4.isCached,
          isCached = _ref4$isCached === void 0 ? false : _ref4$isCached,
          _ref4$cacheExpireInMs = _ref4.cacheExpireInMs,
          cacheExpireInMs = _ref4$cacheExpireInMs === void 0 ? DEFAULT_FETCH_CACHE_TIME : _ref4$cacheExpireInMs;

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
    key: "_makeRequest",
    value: function _makeRequest(_ref5) {
      var _window2;

      var url = _ref5.url,
          _ref5$data = _ref5.data,
          data = _ref5$data === void 0 ? null : _ref5$data,
          _ref5$params = _ref5.params,
          params = _ref5$params === void 0 ? null : _ref5$params,
          _ref5$headers = _ref5.headers,
          headers = _ref5$headers === void 0 ? null : _ref5$headers,
          method = _ref5.method;
      var defaultOptions = {
        method: method
      };

      var urlWithParams = this._addParamsToUrl(url, params);

      var fetchOptions = this._addBodyToOptions(defaultOptions, data);

      var options = this._addHeadersToOptions(fetchOptions, headers);

      var fetchPromiseCallArgs = this._getFetchArgs(urlWithParams, options);

      return (_window2 = window).fetch.apply(_window2, _toConsumableArray(fetchPromiseCallArgs)).then(this._handleFetchErrors).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "post",
    value: function post(_ref6) {
      var url = _ref6.url,
          _ref6$data = _ref6.data,
          data = _ref6$data === void 0 ? null : _ref6$data,
          _ref6$params = _ref6.params,
          params = _ref6$params === void 0 ? null : _ref6$params,
          _ref6$headers = _ref6.headers,
          headers = _ref6$headers === void 0 ? null : _ref6$headers;
      return this._makeRequest({
        url: url,
        data: data,
        params: params,
        headers: headers,
        method: 'post'
      });
    }
  }, {
    key: "put",
    value: function put(_ref7) {
      var url = _ref7.url,
          _ref7$data = _ref7.data,
          data = _ref7$data === void 0 ? null : _ref7$data,
          _ref7$params = _ref7.params,
          params = _ref7$params === void 0 ? null : _ref7$params,
          _ref7$headers = _ref7.headers,
          headers = _ref7$headers === void 0 ? null : _ref7$headers;
      return this._makeRequest({
        url: url,
        data: data,
        params: params,
        headers: headers,
        method: 'put'
      });
    }
  }, {
    key: "patch",
    value: function patch(_ref8) {
      var url = _ref8.url,
          _ref8$data = _ref8.data,
          data = _ref8$data === void 0 ? null : _ref8$data,
          _ref8$params = _ref8.params,
          params = _ref8$params === void 0 ? null : _ref8$params,
          _ref8$headers = _ref8.headers,
          headers = _ref8$headers === void 0 ? null : _ref8$headers;
      return this._makeRequest({
        url: url,
        data: data,
        params: params,
        headers: headers,
        method: 'patch'
      });
    }
  }, {
    key: "delete",
    value: function _delete(_ref9) {
      var url = _ref9.url,
          _ref9$data = _ref9.data,
          data = _ref9$data === void 0 ? null : _ref9$data,
          _ref9$params = _ref9.params,
          params = _ref9$params === void 0 ? null : _ref9$params,
          _ref9$headers = _ref9.headers,
          headers = _ref9$headers === void 0 ? null : _ref9$headers;
      return this._makeRequest({
        url: url,
        data: data,
        params: params,
        headers: headers,
        method: 'delete'
      });
    }
  }]);

  return Fetcher;
}();

var defaultInstance = new Fetcher();
var _default = defaultInstance;
exports["default"] = _default;
