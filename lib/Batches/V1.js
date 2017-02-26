'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.V1 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var V1 = exports.V1 = function () {
  function V1(api) {
    _classCallCheck(this, V1);

    this.api = api;
  }

  /**
   * @param {string} customerRef
   * @return boolean|string
   */


  _createClass(V1, [{
    key: 'create',
    value: function create() {
      var _this = this;

      var customerRef = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return new _promisePolyfill2.default(function (resolve) {
        _this.api.call('/v1/create-batch-id', { 'customer-ref': customerRef }).then(function (response) {
          var batchId = response.success && response['batch-id'];

          resolve(batchId);
        }).catch(function (error) {
          throw new Error('Error while creating the batch: ' + error);
        });
      });
    }

    /**
     * @param {string} batchId
     * @return boolean
     */

  }, {
    key: 'commit',
    value: function commit(batchId) {
      var _this2 = this;

      return new _promisePolyfill2.default(function (resolve) {
        _this2.api.call('/v1/commit-batch', { 'batch-id': batchId }).then(function (response) {
          return resolve(response.status);
        }).catch(function (error) {
          throw new Error('Error while commiting the batch: ' + error);
        });
      });
    }

    /**
     * @param {string} batchId
     * @return boolean|mixed
     */

  }, {
    key: 'getResults',
    value: function getResults(batchId) {
      var _this3 = this;

      return new _promisePolyfill2.default(function (resolve) {
        _this3.api.call('/v1/get-batch-results', { 'batch-id': batchId }).then(function (response) {
          return resolve(response.status);
        }).catch(function (error) {
          throw new Error('Error while getting result from the batch: ' + error);
        });
      });
    }
  }]);

  return V1;
}();