import { UserRepository } from '../../../../src/application/repositories/user-repository'
import { mockUser } from '../../domain/entities/user.mock'

export class UserRepositorySpy extends UserRepository {
  constructor() {
    super()
    this.saveParams = null
    this.saveResult = mockUser()

    this.findByEmailParams = null
    this.findByEmailResult = mockUser()
  }

  async save(user) {
    this.saveParams = user
    return Promise.resolve(this.saveResult)
  }

  async findByEmail(email) {
    this.findByEmailParams = email
    return Promise.resolve(this.findByEmailResult)
  }
}
