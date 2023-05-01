import { LoadUserByToken } from '../../../application/usecases/auth/load-user-by-token'
import { JwtTokenGenerator } from '../../../infra/cryptography/token-generator/jwt-token-generator'
import { database } from '../../../infra/data/helpers/firebase-helpers'
import { FirebaseUserRepository } from '../../../infra/data/user-repository/firebase-user-repository'

export function makeLoadUserByToken() {
  return new LoadUserByToken({
    decrypter: new JwtTokenGenerator(),
    userRepository: new FirebaseUserRepository({
      firebaseDatabase: database,
    }),
  })
}
