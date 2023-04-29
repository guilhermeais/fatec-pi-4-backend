export class TerrainController {
  #createTerrainUseCase
  #updateTerrainUseCase
  #readTerrainUseCase
  /**
   *
   * @param {{
   *  createTerrainUseCase: import('../usecases/terrain/create-terrain').CreateTerrain,
   *  updateTerrainUseCase: import('../usecases/terrain/update-terrain-by-id').UpdateTerrainById
   *  readTerrainUseCase: import('../usecases/terrain/read-terrain-by-id').ReadTerrain
   * }} dependencies
   */
  constructor({ createTerrainUseCase, updateTerrainUseCase, readTerrainUseCase } = {}) {
    this.#createTerrainUseCase = createTerrainUseCase
    this.#updateTerrainUseCase = updateTerrainUseCase
    this.#readTerrainUseCase = readTerrainUseCase
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

  async readTerrainById(request) {
    const { id } = request

    const result = await this.#readTerrainUseCase.execute(id)

    return result
  }
}
