import { BaseError } from './base-error'

export class InvalidPasswordError extends BaseError {
  constructor() {
    super({
      message: `Senha inválida!`,
      action: 'Tente novamente com outra senha.',
      statusCode: 403,
      isOperational: true,
    })
    this.name = 'InvalidPasswordError'
  }
}
