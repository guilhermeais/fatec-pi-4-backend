import { BcryptHasher } from '../../../../infra/cryptography/hasher/bcrypt-hasher';

export function makeBcryptHasher() {
  const salt = process.env.BCRYPT_SALT || 12
  return new BcryptHasher({
    salt: Number(salt)
  })
}