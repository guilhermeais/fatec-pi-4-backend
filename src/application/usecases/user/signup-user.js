import { User } from '../../../domain/entities/user'
import { EmailInUseError } from '../../errors'
import { Hasher } from '../../interfaces/hasher'
import { TokenGenerator } from '../../interfaces/token-generator'
import { UserRepository } from '../../repositories/user-repository'

export class SignUpUser {
  constructor({
    userRepository = new UserRepository(),
    hasher = new Hasher(),
    tokenGenerator = new TokenGenerator(),
  }) {
    this.userRepository = userRepository
    this.hasher = hasher
    this.tokenGenerator = tokenGenerator
  }

  async execute({ name, address, email, password }) {
    const emailInUse = await this.userRepository.findByEmail(email)
    if (!emailInUse) {
      throw new EmailInUseError(email)
    }

    const hashedPassword = await this.hasher.hash(password)
    const user = User.create({ name, address, email, password: hashedPassword })
    await this.userRepository.save(user)
    const accessToken = await this.tokenGenerator.generate({ id: user.id })
    return { user, accessToken }
  }
}
