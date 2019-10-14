'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.V4 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var V4 = exports.V4 = function () {
  function V4(api) {
    _classCallCheck(this, V4);

    this.api = api;
  }

  /**
   * @param {boolean} stopOnJobError
   * @param {string} callback
   * @return boolean|number
   */


  _createClass(V4, [{
    key: 'create',
    value: function create() {
      var _this = this;

      var stopOnJobError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return new _promisePolyfill2.default(function (resolve) {
        var data = { 'stop-on-job-error': Number(stopOnJobError) };

        if (callback !== '') {
          data.callback = callback;
        }

        _this.api.call('/v4/batch', data).then(function (response) {
          var batchId = response.success && response['batch-id'];

          resolve(batchId);
        }).catch(function (error) {
          throw new Error('Error while creating the batch: ' + error);
        });
      });
    }

    /**
     * @param {number} batchId
     * @return boolean
     */

  }, {
    key: 'commit',
    value: function commit(batchId) {
      var _this2 = this;

      return new _promisePolyfill2.default(function (resolve) {
        _this2.api.put('/v4/batch', { 'batch-id': batchId }).then(function (response) {
          return resolve(response.success);
        }).catch(function (error) {
          throw new Error('Error while committing the batch: ' + error);
        });
      });
    }

    /**
     * @param {number} batchId
     * @return boolean|mixed
     */

  }, {
    key: 'getResults',
    value: function getResults(batchId) {
      var _this3 = this;

      return new _promisePolyfill2.default(function (resolve) {
        _this3.api.get('/v4/batch', { 'batch-id': batchId }).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          throw new Error('Error while getting result from the batch: ' + error);
        });
      });
    }

    /**
     * @param {number} batchId
     * @return boolean
     */

  }, {
    key: 'delete',
    value: function _delete(batchId) {
      var _this4 = this;

      return new _promisePolyfill2.default(function (resolve) {
        _this4.api.delete('/v4/batch', { 'batch-id': batchId }).then(function (response) {
          return resolve(response.success);
        }).catch(function (error) {
          throw new Error('Error while deleting the batch: ' + error);
        });
      });
    }
  }]);

  return V4;
}();