import { TerrainRepository } from '../../../application/repositories/terrain-repository'

export class FirebaseTerrainRepository extends TerrainRepository {
  /**
   * @type {import('firebase/compat/index').default.database.Database}
   */
  #firebaseDatabase

  constructor({ firebaseDatabase }) {
    super()
    this.#firebaseDatabase = firebaseDatabase
  }

  async save(terrain) {
    await this.#firebaseDatabase.ref(`terrains/${terrain.id}`).set(terrain)
    return terrain
  }
}
