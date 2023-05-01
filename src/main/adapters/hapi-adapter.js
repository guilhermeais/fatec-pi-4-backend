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
          action: error?.action,
        })
        .code(statusCode)
    }

    return reply
      .response({
        error: 'Internal Server Error',
      })
      .code(statusCode)
  }

  #adaptMiddlewares(middlewares) {
    return middlewares.map(middleware => {
      return async request => {
        const accessToken =
          request.headers.authorization ||
          request.headers['x-access-token'] ||
          ''

        const response = await middleware.handle({
          ...request.payload,
          ...request.params,
          ...request.query,
          accessToken,
        })

        const name = middleware.constructor.name
        request.pre = {
          ...request.pre,
          [name]: {
            ...response,
            ...request.pre?.[name],
          },
        }

        return response
      }
    })
  }

  #requestPreToPayload(request) {
    return Object.values(request.pre || {}).reduce((allObjects, currObject) => {
      allObjects = {
        ...allObjects,
        ...currObject,
      }

      return allObjects
    }, {})
  }

  #replaceIfHasParams(path) {
    const hasParams = path.includes(':')
    if (hasParams) {
      const paramMatchRegex = /:(\w+)/g
      return path.replace(paramMatchRegex, '{$1}')
    }
    return path
  }

  get(path, callback, { middlewares = [] } = {}) {
    this.#app.route({
      method: 'GET',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          if (middlewares) {
            const adaptedMiddlewares = this.#adaptMiddlewares(middlewares)

            for (const middleware of adaptedMiddlewares) {
              await middleware(request, reply)
            }
          }

          const response = await callback({
            ...request.query,
            ...request.params,
            ...this.#requestPreToPayload(request),
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  post(path, callback, { middlewares = [] } = {}) {
    this.#app.route({
      method: 'POST',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        console.info('[HapiHTTPServer] request.payload', request.payload)
        try {
          if (middlewares) {
            const adaptedMiddlewares = this.#adaptMiddlewares(middlewares)
            for (const middleware of adaptedMiddlewares) {
              await middleware(request, reply)
            }
          }

          const response = await callback({
            ...request.payload,
            ...this.#requestPreToPayload(request),
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  put(path, callback, { middlewares = [] } = {}) {
    this.#app.route({
      method: 'PUT',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          if (middlewares) {
            const adaptedMiddlewares = this.#adaptMiddlewares(middlewares)

            for (const middleware of adaptedMiddlewares) {
              await middleware(request, reply)
            }
          }

          const response = await callback({
            ...request.payload,
            ...request.params,
            ...this.#requestPreToPayload(request),
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  patch(path, callback, { middlewares = [] } = {}) {
    this.#app.route({
      method: 'PATCH',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          if (middlewares) {
            const adaptedMiddlewares = this.#adaptMiddlewares(middlewares)

           
            for (const middleware of adaptedMiddlewares) {
              await middleware(request, reply)
            }
          }

          const response = await callback({
            ...request.payload,
            ...request.params,
            ...this.#requestPreToPayload(request),
          })

          return response
        } catch (error) {
          console.error(`[HapiHTTPServerError]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }

  delete(path, callback, { middlewares = [] } = {}) {
    this.#app.route({
      method: 'DELETE',
      path: this.#replaceIfHasParams(path),
      handler: async (request, reply) => {
        try {
          if (middlewares) {
            const adaptedMiddlewares = this.#adaptMiddlewares(middlewares)

            for (const middleware of adaptedMiddlewares) {
              await middleware(request, reply)
            }
          }

          const response = await callback({
            ...request.params,
            ...this.#requestPreToPayload(request),
          })

          return response || reply.response().code(204)
        } catch (error) {
          console.error(`[HapiHTTPServer]: ${error.message}`, error)
          return this.#handleError(error, reply)
        }
      },
    })
  }
}
