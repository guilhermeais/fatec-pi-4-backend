import { SignUpUser } from '../../../application/usecases/user/signup-user';
import { JwtTokenGenerator } from '../../../infra/cryptography/token-generator/jwt-token-generator';
import { InMemoryUserRepository } from '../../../infra/data/user-repository/in-memory';
import { makeBcryptHasher } from '../criptography/hasher/bcrypt-hasher.factory';

export function makeSignupUser() {
  return new SignUpUser({
    hasher: makeBcryptHasher(),
    tokenGenerator: new JwtTokenGenerator(),
    userRepository: new InMemoryUserRepository(),
  });
}