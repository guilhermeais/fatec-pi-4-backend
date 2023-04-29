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
}
