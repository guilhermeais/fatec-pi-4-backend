import { Hasher } from '../../../application/interfaces/hasher'
import bcrypt from 'bcrypt'

export class BcryptHasher extends Hasher {
  constructor({ salt = 12 } = {}) {
    super()
    this.salt = salt
  }

  async hash(password) {
    return await bcrypt.hash(password, this.salt)
  }

  async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }
}
