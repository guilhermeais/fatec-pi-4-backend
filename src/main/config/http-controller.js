import { makeUserController } from '../factories/users/user-controller.factory'
import { BaseHTTPServer } from '../../infra/http/base-http-server'
import { makeTerrainController } from '../factories/terrains/terrain-controller.factory'

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
    this.#registerTerrainRoutes()
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

  #registerTerrainRoutes() {
    const terrainController = makeTerrainController()
    this.httpServer.get(
      '/terrains/:id',
      terrainController.readTerrainById.bind(terrainController)
    )
    this.httpServer.post(
      '/terrains',
      terrainController.createTerrain.bind(terrainController)
    )
    this.httpServer.patch(
      '/terrains/:id',
      terrainController.updateTerrain.bind(terrainController)
    )
    this.httpServer.delete(
      '/terrains/:id',
      terrainController.deleteTerrainById.bind(terrainController)
    )
  }
}
