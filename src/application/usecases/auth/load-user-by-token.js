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
    let decrypted = null
    const token = accessToken.split(' ').pop()

    try {
      decrypted = await this.decrypter.decrypt(token)
    } catch (error) {
      throw new UnauthorizedError({
        message: `Token inválido: ${error.message}`,
      })
    }

    if (!decrypted) {
      throw new UnauthorizedError({
        message: 'Token inválido!',
      })
    }
    const { id: userId } = decrypted

    user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    return user
  }
}
