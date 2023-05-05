import { makeUserController } from '../factories/auth/user-controller.factory'
import { BaseHTTPServer } from '../../infra/http/base-http-server'
import { makeAuthMiddleware } from '../factories/auth/auth-middleware.factory'

export class HttpController {
  constructor({ httpServer = new BaseHTTPServer() }) {
    this.httpServer = httpServer
  }

  static create({ httpServer = new BaseHTTPServer() } = {}) {
    const httpController = new HttpController({
      httpServer,
    })
    httpController.registerRoutes()
    return httpController.httpServer
  }

  registerRoutes() {
    this.#registerAuthRoutes()
  }

  #registerAuthRoutes() {
    const userController = makeUserController()
    this.httpServer.post(
      '/auth/sign-up',
      userController.signup.bind(userController)
    )

    this.httpServer.post(
      '/auth/sign-in',
      userController.signin.bind(userController)
    )
  }
}
