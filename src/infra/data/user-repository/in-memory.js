import { UserRepository } from '../../../application/repositories/user-repository';

export class InMemoryUserRepository extends UserRepository {
  constructor() {
    super()
    this.users = []
  }

  async findByEmail(email) {
    return this.users.find((user) => user.email === email)
  }

  async save(user) {
    this.users.push(user)
  }
}