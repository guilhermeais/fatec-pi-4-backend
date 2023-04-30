import { TerrainRepository } from '../../../../src/application/repositories/terrain-repository'
import { mockTerrain } from '../../domain/entities/terrain.mock'

export class TerrainRepositorySpy extends TerrainRepository {
  constructor() {
    super()
    this.saveParams = null
    this.saveResult = mockTerrain()

    this.findByIdParams = null
    this.findByIdResult = mockTerrain()

    this.updateParams = null
    this.updateResult = mockTerrain()

    this.findByUserIdResult = [mockTerrain()]
  }

  async save(Terrain) {
    this.saveParams = Terrain
    return Promise.resolve(this.saveResult)
  }

  async findById(id) {
    this.findByIdParams = id
    return Promise.resolve(this.findByIdResult)
  }

  async update(id, Terrain) {
    this.updateParams = Terrain
    return Promise.resolve(this.updateResult)
  }

  async delete(id) {
    this.deleteParams = id
    return Promise.resolve()
  }

  async findByUserId(userId) {
    this.findByUserIdParams = userId
    return Promise.resolve(this.findByUserIdResult)
  }
}
