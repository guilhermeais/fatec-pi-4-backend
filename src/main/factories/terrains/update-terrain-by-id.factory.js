import { UpdateTerrainById } from '../../../application/usecases/terrain/update-terrain-by-id'
import { database } from '../../../infra/data/helpers/firebase-helpers'
import { FirebaseTerrainRepository } from '../../../infra/data/terrain-repository/firebase-terrain-repository'

export function makeUpdateTerrainById() {
  return new UpdateTerrainById({
    terrainRepository: new FirebaseTerrainRepository({
      firebaseDatabase: database,
    }),
  })
}
