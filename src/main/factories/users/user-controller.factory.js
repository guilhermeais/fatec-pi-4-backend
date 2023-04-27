import { UserController } from '../../../application/controllers/user-controller'
import { makeSigninUser } from './signin-user.factory'
import { makeSignupUser } from './signup-user.factory'

export function makeUserController() {
  return new UserController({
    signupUserUseCase: makeSignupUser(),
    signinUserUseCase: makeSigninUser(),
  })
}
