import { Location } from '../../../domain/value-objects/location'
import { ForbiddenOperation, TerrainNotFoundError } from '../../errors'
import { TerrainRepository } from '../../repositories/terrain-repository'

export class UpdateTerrainById {
  constructor({ terrainRepository = new TerrainRepository() }) {
    this.terrainRepository = terrainRepository
  }

  async execute(id, { name, locations = [] }, userTryingToUpdate) {
    const terrain = await this.terrainRepository.findById(id)

    if (!terrain) {
      throw new TerrainNotFoundError()
    }

    if(userTryingToUpdate.id !== terrain.ownerId) {
      throw new ForbiddenOperation({
        message: 'Você não pode atualizar um terreno que não é seu!',
        action: 'Realize a atualização utilizando os meios corretos.'
      })
    }

    terrain.name = name
    terrain.locations = locations ? locations.map(Location.create) : terrain.locations

    await this.terrainRepository.update(id, terrain)

    return terrain
  }
}
