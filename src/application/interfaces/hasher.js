import { NotImplementedError } from '../errors'

export class Hasher {
  /**
   *
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    throw new NotImplementedError({
      className: this.constructor.name,
      methodName: this.hash.name,
    })
  }

  /**
   * 
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  async compare(password, hashedPassword) {
    throw new NotImplementedError({
      className: this.constructor.name,
      methodName: this.compare.name,
    })
  }
}
