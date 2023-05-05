import { AuthMiddleware } from '../../../application/middlewares/auth-middleware'
import { makeLoadUserByToken } from './load-user-by-token.factory'

export function makeAuthMiddleware() {
  return new AuthMiddleware({
    loadUserByToken: makeLoadUserByToken(),
  })
}
