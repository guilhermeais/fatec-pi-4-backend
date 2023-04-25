import { UserController } from '../../../application/controllers/user-controller'
import { makeSignupUser } from './signup-user.factory'

export function makeUserController() {
  return new UserController({
    signupUserUseCase: makeSignupUser(),
  })
}
