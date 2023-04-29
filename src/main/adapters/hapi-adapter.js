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

  #logRoutes() {
    console.info('[HapiHTTPServer]: Routes:')
    this.#app.table().forEach(route => {
      console.info(
        `[HapiHTTPServer]: ${route.method.toUpperCase()} ${route.path}`
      )
    })
  }

  async listen(port, callback) {
    this.#logRoutes()
    await this.#app.start()
    console.log(`Server running on ${this.#app.info.uri}`)
  }

  async close() {
    await this.#app.stop()
  }

  #handleError(error, reply) {
    console.error(`[HapiHTTPServer]: ${error.message}`, error)
    const statusCode = error.statusCode || 500
    if (error.isOperational) {
      return reply
        .response({
          error: error.message,
        })
        .code(statusCode)
    }
    return reply
      .response({
        error: 'Internal Server Error',
      })
      .code(statusCode)
  }

  get(path, callback) {
    this.#app.route({
      method: 'GET',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          const response = await callback({
            ...request.query,
            ...request.params,
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  post(path, callback) {
    this.#app.route({
      method: 'POST',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        console.info('[HapiHTTPServer] request.payload', request.payload)
        try {
          const response = await callback({
            ...request.payload,
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  put(path, callback) {
    this.#app.route({
      method: 'PUT',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          const response = await callback({
            ...request.payload,
            ...request.params,
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  patch(path, callback) {
    this.#app.route({
      method: 'PATCH',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          const response = await callback({
            ...request.payload,
            ...request.params,
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServerError]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  delete(path, callback) {
    this.#app.route({
      method: 'DELETE',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          const response = await callback({
            ...request.params,
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  #replaceIfHasParams(path) {
    const hasParams = path.includes(':')
    if (hasParams) {
      const paramMatchRegex = /:(\w+)/g
      return path.replace(paramMatchRegex, '{$1}')
    }
    return path
  }
}
