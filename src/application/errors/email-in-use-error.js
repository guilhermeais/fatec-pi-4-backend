import { BaseError } from './base-error'

export class EmailInUseError extends BaseError {
  constructor(email) {
    super({
      message: `Email ${email} já está em uso!`,
      action: 'Tente novamente com outro email.',
      statusCode: 400,
      isOperational: true,
    })
    this.name = 'EmailInUseError'
  }
}
