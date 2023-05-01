import { BaseError } from "./base-error";

export class TerrainNotFoundError extends BaseError {
  constructor() {
    super({
      message: `Terreno não encontrado!`,
      action: "Tente novamente mais tarde.",
      statusCode: 404,
      isOperational: true,
    });
    this.name = "TerrainNotFoundError";
  }
}
