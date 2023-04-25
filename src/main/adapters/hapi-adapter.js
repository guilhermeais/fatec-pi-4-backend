import { BaseHTTPServer } from '../../infra/http/base-http-server'
import Hapi from '@hapi/hapi'

export class HapiHTTPServer extends BaseHTTPServer {
  #app
  #port
  constructor({ port = process.env.PORT || 3000 } = {}) {
    super()
    this.#port = port
    this.#app = Hapi.server({
      port: Number(this.#port),
      host: process.env.HOST || 'localhost',
    })
  }

  get app() {
    return this.#app.listener
  }

  async listen(port, callback) {
    await this.#app.start()
    console.log(`Server running on ${this.#app.info.uri}`)
  }

  async close() {
    await this.#app.stop()
  }

  get(path, callback) {
    this.#app.route({
      method: 'GET',
      path,
      handler: (request, reply) => {
        try {
          const response = callback({
            ...request.query,
            ...request.params,
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return reply.response(error).code(500)
        }
      },
    })
  }

  post(path, callback) {
    this.#app.route({
      method: 'POST',
      path,
      handler: (request, reply) => {
        try {
          const response = callback({
            ...request.payload,
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          const statusCode = error.statusCode || 500
          return reply.response(error).code(statusCode)
        }
      },
    })
  }

  put(path, callback) {
    this.#app.route({
      method: 'PUT',
      path,
      handler: (request, reply) => {
        try {
          const response = callback({
            ...request.payload,
            ...request.params
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return reply.response(error).code(500)
        }
      },
    })
  }

  delete(path, callback) {
    this.#app.route({
      method: 'DELETE',
      path,
      handler: (request, reply) => {
        try {
          const response = callback({
            ...request.params
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return reply.response(error).code(500)
        }
      },
    })
  }
}
