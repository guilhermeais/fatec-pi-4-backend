import { Terrain } from '../../../domain/entities/terrain'
import { InvalidTerrain } from '../../errors'
import { TerrainRepository } from '../../repositories/terrain-repository'
import { UserRepository } from '../../repositories/user-repository'

export class CreateTerrain {
  constructor({
    terrainRepository = new TerrainRepository(),
    userRepository = new UserRepository(),
  }) {
    this.terrainRepository = terrainRepository
    this.userRepository = userRepository
  }

  async execute(terrainData) {
    const userExists = await this.userRepository.findById(terrainData.ownerId)

    if (!userExists) {
      throw new InvalidTerrain(
        'Usuário dono do terreno não encontrado.',
        'Verifique se você está autenticado corretamente e tente novamente.'
      )
    }

    const terrain = Terrain.create(terrainData)
    await this.terrainRepository.save(terrain)

    return terrain
  }
}
