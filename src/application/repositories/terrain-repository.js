import { NotImplementedError } from '../errors';

export class TerrainRepository {
  /**
   * @param { import('../../domain/entities/terrain').Terrain } terrain
   * @returns { Promise<import('../../domain/entities/terrain').Terrain> }
   */
   save(terrain) {
    throw new NotImplementedError({
      className: 'TerrainRepository',
      methodName: 'createTerrain'
    })
  }
}