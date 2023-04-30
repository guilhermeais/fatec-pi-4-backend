import { NotImplementedError } from '../errors'

export class TokenGenerator {
  /**
   *
   * @param {object} payload
   * @returns {Promise<string>}
   */
  async generate(payload) {
    throw new NotImplementedError({
      className: this.constructor.name,
      methodName: this.generate.name,
    })
  }

   /**
   *
   * @param {string} token
   * @returns {Promise<object>}
   */
   async decrypt(token) {
    throw new NotImplementedError({
      className: this.constructor.name,
      methodName: this.generate.name,
    })
  }
}
