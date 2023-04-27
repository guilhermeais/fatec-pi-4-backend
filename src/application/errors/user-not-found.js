import { BaseError } from "./base-error";

export class UserNotFoundError extends BaseError {
  constructor() {
    super({
      message: `Usuário não encontrado!`,
      action: "Tente novamente com outro email.",
      statusCode: 400,
      isOperational: true,
    });
    this.name = "UserNotFoundError";
  }
}
