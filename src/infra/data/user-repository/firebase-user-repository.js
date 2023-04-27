import { UserRepository } from '../../../application/repositories/user-repository'
import { User } from '../../../domain/entities/user'

export class FirebaseUserRepository extends UserRepository {
  /**
   * @type {import('firebase/compat/index').default.database.Database}
   */
  #firebaseDatabase

  constructor({ firebaseDatabase }) {
    super()
    this.#firebaseDatabase = firebaseDatabase
  }

  async save(user) {
    await this.#firebaseDatabase.ref(`users/${user.id}`).set(user)
    return user
  }

  async findByEmail(email) {
    const snapshot = await this.#firebaseDatabase
      .ref('users')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
    const value = snapshot.val()
    if (!value) {
      return null
    }
    const [id] = Object.keys(value)
    const { name, password } = value[id]
    return User.create({ id, name, email, password })
  }
}
