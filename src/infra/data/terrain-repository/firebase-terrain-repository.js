import { TerrainRepository } from '../../../application/repositories/terrain-repository'
import { Terrain } from '../../../domain/entities/terrain'

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
    await this.#firebaseDatabase.ref(`/terrains/${terrain.id}`).set(terrain)
    return terrain
  }

  async findById(id) {
    const snapshot = await this.#firebaseDatabase.ref(`/terrains/${id}`).get()
    const terrainExists = snapshot.exists()

    return terrainExists ? Terrain.create(snapshot.toJSON()) : null
  }

  async update(id, terrain) {
    await this.#firebaseDatabase.ref(`terrains/${id}`).set(terrain)
    return terrain
  }

  async delete(id) {
    return await this.#firebaseDatabase.ref(`terrains/${id}`).remove()
  }

}
