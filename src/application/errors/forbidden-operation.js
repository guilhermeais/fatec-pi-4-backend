import { BaseError } from './base-error'

export class ForbiddenOperation extends BaseError {
  constructor({
    message = 'Você não tem permissão para realizar esta operação',
    action = 'Verifique seu acesso e tente novamente!',
  }) {
    super({
      message,
      action,
      isOperational: true,
      statusCode: 401,
    })
  }
}
