export class UserController {
  #signupUserUseCase
  #signinUserUseCase
  /**
   *
   * @param {{
   *  signupUserUseCase: import('../usecases/user/signup-user').SignUpUser
   *  signinUserUseCase: import('../usecases/user/signin-user').SignInUser
   * }} dependencies
   */
  constructor({ signupUserUseCase, signinUserUseCase } = {}) {
    this.#signupUserUseCase = signupUserUseCase
    this.#signinUserUseCase = signinUserUseCase
  }

  async signup(request) {
    /**
     * @todo Analisar um padrão para implementar o validações na controller
     */
    const { name, address, email, password } = request

    const result = await this.#signupUserUseCase.execute({
      name,
      address,
      email,
      password,
    })

    return result
  }

  async signin(request) {
    const { email, password } = request

    const result = await this.#signinUserUseCase.execute({
      email,
      password,
    })

    return result
  }
}
