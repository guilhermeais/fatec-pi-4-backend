export class TerrainController {
  #createTerrainUseCase
  #updateTerrainUseCase
  #readTerrainUseCase
  #deleteTerrainUseCase
  /**
   *
   * @param {{
   *  createTerrainUseCase: import('../usecases/terrain/create-terrain').CreateTerrain,
   *  updateTerrainUseCase: import('../usecases/terrain/update-terrain-by-id').UpdateTerrainById
   *  readTerrainUseCase: import('../usecases/terrain/read-terrain-by-id').ReadTerrain
   *  deleteTerrainUseCase: import('../usecases/terrain/delete-terrain-by-id').DeleteTerrainById
   * }} dependencies
   */
  constructor({ createTerrainUseCase, updateTerrainUseCase, readTerrainUseCase, deleteTerrainUseCase } = {}) {
    this.#createTerrainUseCase = createTerrainUseCase
    this.#updateTerrainUseCase = updateTerrainUseCase
    this.#readTerrainUseCase = readTerrainUseCase
    this.#deleteTerrainUseCase = deleteTerrainUseCase
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

  async deleteTerrainById(request) {
    const { id } = request
    const result = await this.#deleteTerrainUseCase.execute(id)

    return result
  }
}
