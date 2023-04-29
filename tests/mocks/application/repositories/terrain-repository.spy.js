import { TerrainRepository } from '../../../../src/application/repositories/terrain-repository'
import { mockTerrain } from '../../domain/entities/terrain.mock'

export class TerrainRepositorySpy extends TerrainRepository {
  constructor() {
    super()
    this.saveParams = null
    this.saveResult = mockTerrain()
  }

  async save(Terrain) {
    this.saveParams = Terrain
    return Promise.resolve(this.saveResult)
  }
}
