import { CreateTerrain } from '../../../application/usecases/terrain/create-terrain';
import { database } from '../../../infra/data/helpers/firebase-helpers';
import { FirebaseTerrainRepository } from '../../../infra/data/terrain-repository/firebase-terrain-repository';
import { FirebaseUserRepository } from '../../../infra/data/user-repository/firebase-user-repository';

export function makeCreateTerrain() {
  return new CreateTerrain({
    userRepository: new FirebaseUserRepository({
      firebaseDatabase: database,
    }),
    terrainRepository: new FirebaseTerrainRepository({
      firebaseDatabase: database,
    })
  });
}