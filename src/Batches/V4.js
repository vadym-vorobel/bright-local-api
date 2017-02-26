import Promise from 'promise-polyfill';


export class V4 {
  constructor(api) {
    this.api = api;
  }

  /**
   * @param {boolean} stopOnJobError
   * @return boolean|number
   */
  create(stopOnJobError = false) {
    return new Promise((resolve) => {
      this.api.call('/v4/batch', { 'stop-on-job-error': Number(stopOnJobError) })
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
   * @param {number} batchId
   * @return boolean
   */
  commit(batchId) {
    return new Promise((resolve) => {
      this.api.put('/v4/batch', { 'batch-id': batchId })
        .then(response => resolve(response.status))
        .catch((error) => {
          throw new Error(`Error while commiting the batch: ${error}`);
        });
    });
  }

  /**
   * @param {number} batchId
   * @return boolean|mixed
   */
  getResults(batchId) {
    return new Promise((resolve) => {
      this.api.get('/v1/get-batch-results', { 'batch-id': batchId })
        .then(response => resolve(response.status))
        .catch((error) => {
          throw new Error(`Error while getting result from the batch: ${error}`);
        });
    });
  }

  /**
   * @param {number} batchId
   * @return boolean
   */
  deleteRequest(batchId) {
    return new Promise((resolve) => {
      this.api.deleteRequest('/v4/batch', { 'batch-id': batchId })
        .then(response => resolve(response.success))
        .catch((error) => {
          throw new Error(`Error while deleting the batch: ${error}`);
        });
    });
  }
}
