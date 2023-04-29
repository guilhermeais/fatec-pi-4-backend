import { BaseError } from './base-error'

export class InvalidTerrain extends BaseError {
  constructor(cause, action = 'Verifique as informações do terreno e tente novamente mais tarde.') {
    super({
      message: cause,
      action,
      statusCode: 400,
      isOperational: true,
    })
    this.name = 'EmailInUseError'
  }
}
