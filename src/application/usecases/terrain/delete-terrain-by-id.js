import { TerrainNotFoundError } from '../../errors'
import { TerrainRepository } from '../../repositories/terrain-repository'

export class DeleteTerrainById {
  constructor({ terrainRepository = new TerrainRepository() }) {
    this.terrainRepository = terrainRepository
  }

  async execute(id) {
    const terrain = await this.terrainRepository.findById(id)

    if (!terrain) {
      throw new TerrainNotFoundError()
    }

    await this.terrainRepository.delete(id)

    return terrain
  }
}