import { NotImplementedError } from '../../application/errors'

export class BaseHTTPServer {
  #app

  get app() {
    return this.#app
  }

  get(path, callback, { middlewares = [] }) {
    throw new NotImplementedError({
      methodName: 'get',
      className: this.constructor.name,
    })
  }

  post(path, callback, { middlewares = [] }) {
    throw new NotImplementedError({
      methodName: 'post',
      className: this.constructor.name,
    })
  }

  put(path, callback, { middlewares = [] }) {
    throw new NotImplementedError({
      methodName: 'put',
      className: this.constructor.name,
    })
  }

  delete(path, callback, { middlewares = [] }) {
    throw new NotImplementedError({
      methodName: 'delete',
      className: this.constructor.name,
    })
  }

  patch(path, callback, { middlewares = [] }) {
    throw new NotImplementedError({
      methodName: 'patch',
      className: this.constructor.name,
    })
  }

  async listen(port, callback) {
    throw new NotImplementedError({
      methodName: 'listen',
      className: this.constructor.name,
    })
  }

  async close() {
    throw new NotImplementedError({
      methodName: 'close',
      className: this.constructor.name,
    })
  }
}
