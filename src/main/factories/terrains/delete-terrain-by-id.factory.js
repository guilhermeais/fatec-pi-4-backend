import { DeleteTerrainById } from '../../../application/usecases/terrain/delete-terrain-by-id'
import { database } from '../../../infra/data/helpers/firebase-helpers'
import { FirebaseTerrainRepository } from '../../../infra/data/terrain-repository/firebase-terrain-repository'

export function makeDeleteTerrainById() {
  return new DeleteTerrainById({
    terrainRepository: new FirebaseTerrainRepository({
      firebaseDatabase: database,
    }),
  })
}
