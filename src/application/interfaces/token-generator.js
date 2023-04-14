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
}
