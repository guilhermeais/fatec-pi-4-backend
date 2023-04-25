import { TokenGenerator } from '../../../application/interfaces/token-generator'
import jwt from 'jsonwebtoken'

export class JwtTokenGenerator extends TokenGenerator {
  constructor({
    secret = process.env.JWT_SECRET || 'secret',
    expiresIn = process.env.JWT_EXPIRES_IN || '1d',
  } = {}) {
    super()
    if (!secret) {
      throw new Error('Missing JWT secret at .env')
    }
    this.secret = secret
    this.expiresIn = expiresIn
  }
  async generate(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
  }
}
