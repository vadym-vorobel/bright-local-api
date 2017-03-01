'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Api = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** API endpoint URL */
var ENDPOINT = 'https://tools.brightlocal.com/seo-tools/api';
/** expiry can't be more than 30 minutes (1800 seconds) */
var MAX_EXPIRY = 1800;

var HTTP_METHODS = {
  POST: 'post',
  GET: 'get',
  PUT: 'put',
  DELETE: 'delete'
};

var Api = exports.Api = function () {
  function Api(apiKey, apiSecret) {
    var endpoint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    _classCallCheck(this, Api);

    this.allowedHttpMethods = Object.keys(HTTP_METHODS).map(function (key) {
      return HTTP_METHODS[key];
    });

    this.endpoint = endpoint || ENDPOINT;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  _createClass(Api, [{
    key: '_getUnixTimestamp',
    value: function _getUnixTimestamp() {
      return Math.floor(Date.now() / 1000);
    }
  }, {
    key: '_getSigAndExpires',
    value: function _getSigAndExpires() {
      var expires = this._getUnixTimestamp() + MAX_EXPIRY;

      // eslint-disable-next-line new-cap
      var hash = _cryptoJs2.default.HmacSHA1('' + this.apiKey + expires, this.apiSecret);

      var sig = hash.toString(_cryptoJs2.default.enc.Base64);

      return {
        sig: sig, expires: expires
      };
    }

    /**
     * @param {string} method
     * @param {object} params
     * @param {string} httpMethod
     * @throws Exception
     * @return Promise
     */

  }, {
    key: 'call',
    value: function call(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var httpMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : HTTP_METHODS.POST;

      if (this.allowedHttpMethods.indexOf(httpMethod) === -1) {
        throw new Error('Invalid HTTP method specified.');
      }

      var methodName = method.replace('/seo-tools/api', '');

      // some methods only require api key but there's no harm in also sending
      // sig and expires to those methods
      var sigAndExpires = this._getSigAndExpires();

      var requestParams = Object.assign({
        'api-key': this.apiKey
      }, params, sigAndExpires);

      var requestUrl = this.endpoint + '/' + methodName.replace('/', '');

      var requestKey = httpMethod === HTTP_METHODS.GET ? 'qs' : 'form';

      var options = _defineProperty({
        uri: requestUrl,
        json: true,
        method: httpMethod
      }, requestKey, requestParams);

      return new _promisePolyfill2.default(function (resolve, reject) {
        (0, _request2.default)(options, function (error, response, body) {
          if (error) {
            reject(new Error('[bright-local-api]#call Error: ' + error));
          } else {
            resolve(body);
          }
        });
      });
    }

    /**
     * @param {string} method
     * @param {object} params
     * @return Promise
     */

  }, {
    key: 'get',
    value: function get(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.call(method, params, HTTP_METHODS.GET);
    }

    /**
     * @param {string} method
     * @param {object} params
     * @return Promise
     */

  }, {
    key: 'post',
    value: function post(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.call(method, params, HTTP_METHODS.POST);
    }

    /**
     * @param {string} method
     * @param {object} params
     * @return Promise
     */

  }, {
    key: 'put',
    value: function put(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.call(method, params, HTTP_METHODS.PUT);
    }

    /**
     * @param {string} method
     * @param {object} params
     * @return Promise
     */

  }, {
    key: 'delete',
    value: function _delete(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.call(method, params, HTTP_METHODS.DELETE);
    }

    /**
     * @return int|null
     */

  }, {
    key: 'getLastHttpCode',
    value: function getLastHttpCode() {
      return this.lastHttpCode;
    }
  }]);

  return Api;
}();