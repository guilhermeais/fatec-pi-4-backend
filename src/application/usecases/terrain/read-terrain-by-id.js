import { TerrainNotFoundError } from '../../errors'
import { TerrainRepository } from '../../repositories/terrain-repository'

export class ReadTerrainById {
  constructor({ terrainRepository = new TerrainRepository() }) {
    this.terrainRepository = terrainRepository
  }

  async execute(id) {
    const terrain = await this.terrainRepository.findById(id)

    if (!terrain) {
      throw new TerrainNotFoundError()
    }

    return terrain
  }
}