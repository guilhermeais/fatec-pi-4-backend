import { User } from '../../domain/entities/user'
import { NotImplementedError } from '../errors/not-implemented-error'

export class UserRepository {
  /**
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async save(user) {
    throw new NotImplementedError({
      className: this.constructor.name,
      methodName: this.save.name,
    })
  }
  
  /**
   *
   * @param {string} email
   * @returns {Promise<User>}
   */
  async findByEmail(email) {
    throw new NotImplementedError({
      className: this.constructor.name,
      methodName: this.findByEmail.name,
    })
  }
}
