import { ReadTerrainById } from '../../../application/usecases/terrain/read-terrain-by-id'
import { database } from '../../../infra/data/helpers/firebase-helpers'
import { FirebaseTerrainRepository } from '../../../infra/data/terrain-repository/firebase-terrain-repository'

export function makeReadTerrainById() {
  return new ReadTerrainById({
    terrainRepository: new FirebaseTerrainRepository({
      firebaseDatabase: database,
    }),
  })
}