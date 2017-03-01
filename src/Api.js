import cryptoJs from 'crypto-js';
import request from 'request';
import Promise from 'promise-polyfill';


/** API endpoint URL */
const ENDPOINT = 'https://tools.brightlocal.com/seo-tools/api';
/** expiry can't be more than 30 minutes (1800 seconds) */
const MAX_EXPIRY = 1800;

const HTTP_METHODS = {
  POST: 'post',
  GET: 'get',
  PUT: 'put',
  DELETE: 'delete',
};


export class Api {
  constructor(apiKey, apiSecret, endpoint = '') {
    this.allowedHttpMethods = Object.keys(HTTP_METHODS).map(key =>
      HTTP_METHODS[key]);

    this.endpoint = endpoint || ENDPOINT;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  _getUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  _getSigAndExpires() {
    const expires = this._getUnixTimestamp() + MAX_EXPIRY;

    // eslint-disable-next-line new-cap
    const hash = cryptoJs.HmacSHA1(`${this.apiKey}${expires}`, this.apiSecret);

    const sig = hash.toString(cryptoJs.enc.Base64);

    return {
      sig, expires
    };
  }

  /**
   * @param {string} method
   * @param {object} params
   * @param {string} httpMethod
   * @throws Exception
   * @return Promise
   */
  call(method, params = {}, httpMethod = HTTP_METHODS.POST) {
    if (this.allowedHttpMethods.indexOf(httpMethod) === -1) {
      throw new Error('Invalid HTTP method specified.');
    }

    const methodName = method.replace('/seo-tools/api', '');

    // some methods only require api key but there's no harm in also sending
    // sig and expires to those methods
    const sigAndExpires = this._getSigAndExpires();

    const requestParams = Object.assign({
      'api-key': this.apiKey
    }, params, sigAndExpires);

    const requestUrl = `${this.endpoint}/${methodName.replace('/', '')}`;

    const requestKey = httpMethod === HTTP_METHODS.GET ? 'qs' : 'form';

    const options = {
      uri: requestUrl,
      json: true,
      method: httpMethod,
      [requestKey]: requestParams,
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(new Error(`[bright-local-api]#call Error: ${error}`));
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
  get(method, params = {}) {
    return this.call(method, params, HTTP_METHODS.GET);
  }

  /**
   * @param {string} method
   * @param {object} params
   * @return Promise
   */
  post(method, params = {}) {
    return this.call(method, params, HTTP_METHODS.POST);
  }

  /**
   * @param {string} method
   * @param {object} params
   * @return Promise
   */
  put(method, params = {}) {
    return this.call(method, params, HTTP_METHODS.PUT);
  }

  /**
   * @param {string} method
   * @param {object} params
   * @return Promise
   */
  delete(method, params = {}) {
    return this.call(method, params, HTTP_METHODS.DELETE);
  }

  /**
   * @return int|null
   */
  getLastHttpCode() {
    return this.lastHttpCode;
  }
}
