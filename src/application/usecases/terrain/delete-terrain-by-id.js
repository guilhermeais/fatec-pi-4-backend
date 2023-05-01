import { ForbiddenOperation, TerrainNotFoundError } from '../../errors'
import { TerrainRepository } from '../../repositories/terrain-repository'

export class DeleteTerrainById {
  constructor({ terrainRepository = new TerrainRepository() }) {
    this.terrainRepository = terrainRepository
  }

  async execute(id, userTryingToDelete) {
    const terrain = await this.terrainRepository.findById(id)

    if (!terrain) {
      throw new TerrainNotFoundError()
    }

    const userIsNotOwner = terrain.ownerId !== userTryingToDelete.id

    if (userIsNotOwner) {
      throw new ForbiddenOperation({
        action:
          'Para deletar um terreno você deve ser dono dele! Verifique seu acesso e tente novamente.',
      })
    }

    await this.terrainRepository.delete(id)
  }
}
