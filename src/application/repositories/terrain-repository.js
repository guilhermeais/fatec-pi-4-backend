import { NotImplementedError } from '../errors'

export class TerrainRepository {
  /**
   * @param { import('../../domain/entities/terrain').Terrain } terrain
   * @returns { Promise<import('../../domain/entities/terrain').Terrain> }
   */
  save(terrain) {
    throw new NotImplementedError({
      className: 'TerrainRepository',
      methodName: 'createTerrain',
    })
  }
  /**
   * @param {string} id
   * @param { import('../../domain/entities/terrain').Terrain } terrain
   * @returns { Promise<import('../../domain/entities/terrain').Terrain> }
   */
  update(id, terrain) {
    throw new NotImplementedError({
      className: 'TerrainRepository',
      methodName: 'updateTerrain',
    })
  }

  /**
   *
   * @param {string} id
   * @returns { Promise<import('../../domain/entities/terrain').Terrain> }
   */
  findById(id) {
    throw new NotImplementedError({
      className: 'TerrainRepository',
      methodName: 'findTerrainById',
    })
  }

  /**
   *
   * @param {string} id
   * @returns { Promise<import('../../domain/entities/terrain').Terrain> }
   */
  delete(id) {
    throw new NotImplementedError({
      className: 'TerrainRepository',
      methodName: 'deleteTerrain',
    })
  }

  /**
   *
   * @param {string} userId
   * @returns { Promise<import('../../domain/entities/terrain').Terrain[]> }
   */
  findByUserId(userId) {
    throw new NotImplementedError({
      className: 'TerrainRepository',
      methodName: 'findByUserId',
    })
  }
}
