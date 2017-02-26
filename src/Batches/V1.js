import Promise from 'promise-polyfill';


export class V1 {
  constructor(api) {
    this.api = api;
  }

  /**
   * @param {string} customerRef
   * @return boolean|string
   */
  create(customerRef = '') {
    return new Promise((resolve) => {
      this.api.call('/v1/create-batch-id', { 'customer-ref': customerRef })
        .then((response) => {
          const batchId = response.success && response['batch-id'];

          resolve(batchId);
        })
        .catch((error) => {
          throw new Error(`Error while creating the batch: ${error}`);
        });
    });
  }

  /**
   * @param {string} batchId
   * @return boolean
   */
  commit(batchId) {
    return new Promise((resolve) => {
      this.api.call('/v1/commit-batch', { 'batch-id': batchId })
        .then(response => resolve(response.status))
        .catch((error) => {
          throw new Error(`Error while commiting the batch: ${error}`);
        });
    });
  }

  /**
   * @param {string} batchId
   * @return boolean|mixed
   */
  getResults(batchId) {
    return new Promise((resolve) => {
      this.api.call('/v1/get-batch-results', { 'batch-id': batchId })
        .then(response => resolve(response.status))
        .catch((error) => {
          throw new Error(`Error while getting result from the batch: ${error}`);
        });
    });
  }
}
