import { UserNotFoundError, InvalidPasswordError } from '../../errors'
import { Hasher } from '../../interfaces/hasher'
import { TokenGenerator } from '../../interfaces/token-generator'
import { UserRepository } from '../../repositories/user-repository'

export class SignInUser {
  constructor({
    userRepository = new UserRepository(),
    hasher = new Hasher(),
    tokenGenerator = new TokenGenerator(),
  }) {
    this.userRepository = userRepository
    this.hasher = hasher
    this.tokenGenerator = tokenGenerator
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UserNotFoundError(email)
    }

    const isValidPassword = await this.hasher.compare(password, user.password)
    if (!isValidPassword) {
      throw new InvalidPasswordError()
    }

    const accessToken = await this.tokenGenerator.generate({ id: user.id })
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
      accessToken,
    }
  }
}
