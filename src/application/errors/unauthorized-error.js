import { BaseError } from './base-error'

export class UnauthorizedError extends BaseError {
  constructor({
    message = 'Usuário não autenticado!',
    action = 'Reinicie o site e realize o login novamente.',
  } = {}) {
    super({
      message,
      action,
      statusCode: 403,
      isOperational: true,
    })
    this.name = 'UnauthorizedError'
  }
}
