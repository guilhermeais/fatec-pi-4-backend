export class TerrainController {
  #createTerrainUseCase
  #updateTerrainUseCase
  /**
   *
   * @param {{
   *  createTerrainUseCase: import('../usecases/terrain/create-terrain').CreateTerrain,
   *  updateTerrainUseCase: import('../usecases/terrain/update-terrain-by-id').UpdateTerrainById
   * }} dependencies
   */
  constructor({ createTerrainUseCase, updateTerrainUseCase } = {}) {
    this.#createTerrainUseCase = createTerrainUseCase
    this.#updateTerrainUseCase = updateTerrainUseCase
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

  async updateTerrain(request) {
    const { id, name, locations } = request

    const result = await this.#updateTerrainUseCase.execute(id, {
      name,
      locations,
    })

    return result
  }
}
