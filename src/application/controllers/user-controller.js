export class UserController {
  #signupUserUseCase;
  /**
   * 
   * @param {{
   *  signupUserUseCase: import('../usecases/user/signup-user').SignUpUser
   * }} dependencies 
   */
  constructor({ signupUserUseCase  } = {}) {
    this.#signupUserUseCase = signupUserUseCase
  }
  
  async signup(request) {
    /**
     * @todo Analisar um padrão para implementar o validações na controller
     */
    const { 
      name, address, email, password
    } = request

    const result = await this.#signupUserUseCase.execute({
      name, address, email, password
    })

    return result
  }
}
