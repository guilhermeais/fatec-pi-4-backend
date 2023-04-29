import { Location } from '../../../domain/value-objects/location'
import { TerrainNotFoundError } from '../../errors'
import { TerrainRepository } from '../../repositories/terrain-repository'

export class UpdateTerrainById {
  constructor({ terrainRepository = new TerrainRepository() }) {
    this.terrainRepository = terrainRepository
  }

  async execute(id, { name, locations }) {
    const terrain = await this.terrainRepository.findById(id)

    if (!terrain) {
      throw new TerrainNotFoundError()
    }

    terrain.name = name
    terrain.locations = locations ? locations.map(Location.create) : terrain.locations

    await this.terrainRepository.update(id, terrain)

    return terrain
  }
}
