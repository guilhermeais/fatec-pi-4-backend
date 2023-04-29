import { TerrainRepository } from '../../../application/repositories/terrain-repository';

export class InMemoryTerrainRepository extends TerrainRepository {
  constructor() {
    super()
    this.terrains = []
  }

  async save(terrain) {
    this.terrains.push(terrain)
  }
}