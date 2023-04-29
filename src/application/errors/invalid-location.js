import { BaseError } from './base-error'

export class InvalidLocation extends BaseError {
  constructor(cause, action = 'Verifique as informações da localização e tente novamente mais tarde.') {
    super({
      message: cause,
      action,
      statusCode: 400,
      isOperational: true,
    })
    this.name = 'InvalidLocation'
  }
}
