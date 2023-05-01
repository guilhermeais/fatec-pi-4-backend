export class TerrainController {
  #createTerrainUseCase
  #updateTerrainUseCase
  #readTerrainUseCase
  #deleteTerrainUseCase
  #readUserTerrainsUseCase
  /**
   *
   * @param {{
   *  createTerrainUseCase: import('../usecases/terrain/create-terrain').CreateTerrain,
   *  updateTerrainUseCase: import('../usecases/terrain/update-terrain-by-id').UpdateTerrainById
   *  readTerrainUseCase: import('../usecases/terrain/read-terrain-by-id').ReadTerrain
   *  deleteTerrainUseCase: import('../usecases/terrain/delete-terrain-by-id').DeleteTerrainById
   * readUserTerrainsUseCase: import('../usecases/terrain/read-user-terrains').ReadUserTerrains
   * }} dependencies
   */
  constructor({
    createTerrainUseCase,
    updateTerrainUseCase,
    readTerrainUseCase,
    deleteTerrainUseCase,
    readUserTerrainsUseCase,
  } = {}) {
    this.#createTerrainUseCase = createTerrainUseCase
    this.#updateTerrainUseCase = updateTerrainUseCase
    this.#readTerrainUseCase = readTerrainUseCase
    this.#deleteTerrainUseCase = deleteTerrainUseCase
    this.#readUserTerrainsUseCase = readUserTerrainsUseCase
  }

  async createTerrain(request) {
    const { name, locations } = request

    const result = await this.#createTerrainUseCase.execute({
      ownerId: request.user.id,
      name,
      locations,
    })

    return result
  }

  async updateTerrain(request) {
    const { id, name, locations } = request

    const result = await this.#updateTerrainUseCase.execute(
      id,
      {
        name,
        locations,
      },
      request.user
    )

    return result
  }

  async readTerrainById(request) {
    const { id } = request

    const result = await this.#readTerrainUseCase.execute(id)

    return result
  }

  async readUserTerrains(request) {
    const result = await this.#readUserTerrainsUseCase.execute(request.user.id)

    return result
  }

  async deleteTerrainById(request) {
    const { id, user } = request
    const result = await this.#deleteTerrainUseCase.execute(id, user)

    return result
  }
}
