import { TerrainRepository } from '../../repositories/terrain-repository'

export class ReadUserTerrains {
  constructor({ terrainRepository = new TerrainRepository() }) {
    this.terrainRepository = terrainRepository
  }

  async execute(userId) {
    const userTerrains = await this.terrainRepository.findByUserId(userId)

    return userTerrains
  }
}
