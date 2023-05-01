import { ReadUserTerrains } from '../../../application/usecases/terrain/read-user-terrains'
import { database } from '../../../infra/data/helpers/firebase-helpers'
import { FirebaseTerrainRepository } from '../../../infra/data/terrain-repository/firebase-terrain-repository'

export function makeReadUserTerrains() {
  return new ReadUserTerrains({
    terrainRepository: new FirebaseTerrainRepository({
      firebaseDatabase: database,
    }),
  })
}