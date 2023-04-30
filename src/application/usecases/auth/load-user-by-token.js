import { UnauthorizedError } from '../../errors'
import { TokenGenerator } from '../../interfaces/token-generator'
import { UserRepository } from '../../repositories/user-repository'

export class LoadUserByToken {
  constructor({
    userRepository = new UserRepository(),
    decrypter = new TokenGenerator(),
  }) {
    this.userRepository = userRepository
    this.decrypter = decrypter
  }

  async execute({ accessToken }) {
    let user = null

    try {
      const { id: userId } = await this.decrypter.decrypt(accessToken)

      user = await this.userRepository.findById(userId)
    } catch (error) {
      throw new UnauthorizedError({
        message: `Token inválido: ${error.message}`,
      })
    }

    if (!user) {
      throw new UnauthorizedError()
    }

    return user
  }
}
