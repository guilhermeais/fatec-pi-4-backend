import { SignUpUser } from '../../../application/usecases/auth/signup-user';
import { JwtTokenGenerator } from '../../../infra/cryptography/token-generator/jwt-token-generator';
import { database } from '../../../infra/data/helpers/firebase-helpers';
import { FirebaseUserRepository } from '../../../infra/data/user-repository/firebase-user-repository';
import { makeBcryptHasher } from '../criptography/hasher/bcrypt-hasher.factory';

export function makeSignupUser() {
  return new SignUpUser({
    hasher: makeBcryptHasher(),
    tokenGenerator: new JwtTokenGenerator(),
    userRepository: new FirebaseUserRepository({
      firebaseDatabase: database,
    }),
  });
}