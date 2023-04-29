export class TerrainController {
  #createTerrainUseCase
  /**
   *
   * @param {{
   *  createTerrainUseCase: import('../usecases/terrain/create-terrain').CreateTerrain
   * }} dependencies
   */
  constructor({ createTerrainUseCase } = {}) {
    this.#createTerrainUseCase = createTerrainUseCase
  }

  async createTerrain(request) {
    const { ownerId, name, locations } = request

    const result = await this.#createTerrainUseCase.execute({
      ownerId,
      name,
      locations,
    })

    return result
  }
}
