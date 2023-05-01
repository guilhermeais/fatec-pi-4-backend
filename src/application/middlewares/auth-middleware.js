import { UnauthorizedError } from '../errors'
import { LoadUserByToken } from '../usecases/auth/load-user-by-token'

export class AuthMiddleware {
  #loadUserByToken

  constructor({ loadUserByToken = new LoadUserByToken() }) {
    this.#loadUserByToken = loadUserByToken
  }

  async handle({ accessToken }) {
    if (!accessToken) {
      throw new UnauthorizedError({
        message: 'Faltando o token de usuário na requisição!',
        action: 'Autentique-se novamente.'
      })
    }

    const user = await this.#loadUserByToken.execute({ accessToken })

    return user
  }
}
