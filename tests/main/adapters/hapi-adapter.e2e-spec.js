import supertest from 'supertest'
import { HapiHTTPServer } from '../../../src/main/adapters/hapi-adapter'
import { vitest } from 'vitest'
import { BaseError } from '../../../src/application/errors'

describe('HapiHTTPServer', () => {
  /**
   * @type {HapiHTTPServer}
   */
  let hapiHttpServer

  beforeEach(() => {
    hapiHttpServer = new HapiHTTPServer()
  })

  describe('GET', () => {
    test('should create a route with get method', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get(path)

      expect(response.status).toBe(200)
    })

    test('should send query params to the request', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get(
        path.concat('?abc=123')
      )

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ abc: '123' })
    })

    test('should send path params to the request', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get('/test/123')

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ id: '123' })
    })

    test('should return the method result', async () => {
      const path = '/test/:id'
      const mockedResult = [
        {
          foo: 'bar',
        },
      ]
      const callback = vitest.fn(request => mockedResult)
      const middlewares = []

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get('/test/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockedResult)
    })

    test('should return 500 if method throws', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => {
        throw new Error('test')
      })
      const middlewares = []

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get('/test/123')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
    })

    test('should return the error for the client if its an operation error', async () => {
      const clientError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        isOperational: true,
        action: 'some-action',
      })

      const path = '/test'
      const callback = vitest.fn(request => {
        throw clientError
      })

      hapiHttpServer.get(path, callback)

      const response = await supertest(hapiHttpServer.app).get(path)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: clientError.message,
        action: clientError.action,
      })
    })

    test('should execute all middlewares before', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get(path)

      expect(response.status).toBe(200)
      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should inject the middleware result into request payload', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get(path)

      expect(response.status).toBe(200)
      expect(callback).toHaveBeenCalledWith({
        foo: 'bar',
        bar: 'foo',
      })
    })

    test('should return internal error if the middleware throws an error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new Error('test')
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get(path)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })

    test('should return the error if the middleware throws an operation error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        action: 'some-action',
        isOperational: true,
      })
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.get(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).get(path)

      expect(response.status).toBe(mockedError.statusCode)
      expect(response.body).toEqual({
        error: mockedError.message,
        action: mockedError.action,
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('POST', () => {
    test('should create a route with post method', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).post(path)

      expect(response.status).toBe(200)
    })


    test('should send body params to the request', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app)
        .post('/test')
        .send({ id: '123' })

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ id: '123' })
    })

    test('should return the method result', async () => {
      const path = '/test/:id'
      const mockedResult = [
        {
          foo: 'bar',
        },
      ]
      const callback = vitest.fn(request => mockedResult)
      const middlewares = []

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).post('/test/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockedResult)
    })

    test('should return 500 if method throws', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => {
        throw new Error('test')
      })
      const middlewares = []

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).post('/test/123')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
    })

    test('should return the error for the client if its an operation error', async () => {
      const clientError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        isOperational: true,
        action: 'some-action',
      })

      const path = '/test'
      const callback = vitest.fn(request => {
        throw clientError
      })

      hapiHttpServer.post(path, callback)

      const response = await supertest(hapiHttpServer.app).post(path)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: clientError.message,
        action: clientError.action,
      })
    })

    test('should execute all middlewares before', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).post(path)

      expect(response.status).toBe(200)
      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should inject the middleware result into request payload', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).post(path)

      expect(response.status).toBe(200)
      expect(callback).toHaveBeenCalledWith({
        foo: 'bar',
        bar: 'foo',
      })
    })

    test('should return internal error if the middleware throws an error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new Error('test')
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).post(path)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })

    test('should return the error if the middleware throws an operation error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        action: 'some-action',
        isOperational: true,
      })
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.post(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).post(path)

      expect(response.status).toBe(mockedError.statusCode)
      expect(response.body).toEqual({
        error: mockedError.message,
        action: mockedError.action,
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('PUT', () => {
    test('should create a route with put method', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).put(path)

      expect(response.status).toBe(200)
    })


    test('should send body params to the request', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app)
        .put('/test')
        .send({ id: '123' })

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ id: '123' })
    })

    test('should send path params to the request', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app)
        .put('/test/123')
        .send({ abc: '123' })

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ id: '123', abc: '123' })
    })

    test('should return the method result', async () => {
      const path = '/test/:id'
      const mockedResult = [
        {
          foo: 'bar',
        },
      ]
      const callback = vitest.fn(request => mockedResult)
      const middlewares = []

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).put('/test/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockedResult)
    })

    test('should return 500 if method throws', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => {
        throw new Error('test')
      })
      const middlewares = []

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).put('/test/123')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
    })

    test('should return the error for the client if its an operation error', async () => {
      const clientError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        isOperational: true,
        action: 'some-action',
      })

      const path = '/test'
      const callback = vitest.fn(request => {
        throw clientError
      })

      hapiHttpServer.put(path, callback)

      const response = await supertest(hapiHttpServer.app).put(path)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: clientError.message,
        action: clientError.action,
      })
    })

    test('should execute all middlewares before', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).put(path)

      expect(response.status).toBe(200)
      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should inject the middleware result into request payload', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).put(path)

      expect(response.status).toBe(200)
      expect(callback).toHaveBeenCalledWith({
        foo: 'bar',
        bar: 'foo',
      })
    })

    test('should return internal error if the middleware throws an error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new Error('test')
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).put(path)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })

    test('should return the error if the middleware throws an operation error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        action: 'some-action',
        isOperational: true,
      })
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.put(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).put(path)

      expect(response.status).toBe(mockedError.statusCode)
      expect(response.body).toEqual({
        error: mockedError.message,
        action: mockedError.action,
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('PATCH', () => {
    test('should create a route with patch method', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).patch(path)

      expect(response.status).toBe(200)
    })


    test('should send body params to the request', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app)
        .patch('/test')
        .send({ id: '123' })

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ id: '123' })
    })

    test('should send path params to the request', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app)
        .patch('/test/123')
        .send({ abc: '123' })

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ id: '123', abc: '123' })
    })

    test('should return the method result', async () => {
      const path = '/test/:id'
      const mockedResult = [
        {
          foo: 'bar',
        },
      ]
      const callback = vitest.fn(request => mockedResult)
      const middlewares = []

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).patch('/test/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockedResult)
    })

    test('should return 500 if method throws', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => {
        throw new Error('test')
      })
      const middlewares = []

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).patch('/test/123')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
    })

    test('should return the error for the client if its an operation error', async () => {
      const clientError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        isOperational: true,
        action: 'some-action',
      })

      const path = '/test'
      const callback = vitest.fn(request => {
        throw clientError
      })

      hapiHttpServer.patch(path, callback)

      const response = await supertest(hapiHttpServer.app).patch(path)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: clientError.message,
        action: clientError.action,
      })
    })

    test('should execute all middlewares before', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).patch(path)

      expect(response.status).toBe(200)
      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should inject the middleware result into request payload', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).patch(path)

      expect(response.status).toBe(200)
      expect(callback).toHaveBeenCalledWith({
        foo: 'bar',
        bar: 'foo',
      })
    })

    test('should return internal error if the middleware throws an error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new Error('test')
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).patch(path)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })

    test('should return the error if the middleware throws an operation error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        action: 'some-action',
        isOperational: true,
      })
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.patch(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).patch(path)

      expect(response.status).toBe(mockedError.statusCode)
      expect(response.body).toEqual({
        error: mockedError.message,
        action: mockedError.action,
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('DELETE', () => {
    test('should create a route with delete method', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).delete(path)

      expect(response.status).toBe(200)
    })


    test('should send path params to the request', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => request)
      const middlewares = []

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app)
        .delete('/test/123')

      expect(response.status).toBe(200)

      expect(callback).toHaveBeenCalledWith({ id: '123' })
    })

    test('should return the method result', async () => {
      const path = '/test/:id'
      const mockedResult = [
        {
          foo: 'bar',
        },
      ]
      const callback = vitest.fn(request => mockedResult)
      const middlewares = []

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).delete('/test/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockedResult)
    })

    test('should return 500 if method throws', async () => {
      const path = '/test/:id'
      const callback = vitest.fn(request => {
        throw new Error('test')
      })
      const middlewares = []

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).delete('/test/123')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
    })

    test('should return the error for the client if its an operation error', async () => {
      const clientError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        isOperational: true,
        action: 'some-action',
      })

      const path = '/test'
      const callback = vitest.fn(request => {
        throw clientError
      })

      hapiHttpServer.delete(path, callback)

      const response = await supertest(hapiHttpServer.app).delete(path)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: clientError.message,
        action: clientError.action,
      })
    })

    test('should execute all middlewares before', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).delete(path)

      expect(response.status).toBe(200)
      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should inject the middleware result into request payload', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const middlewares = [
        {
          handle: vitest.fn(request => ({ foo: 'bar' })),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).delete(path)

      expect(response.status).toBe(200)
      expect(callback).toHaveBeenCalledWith({
        foo: 'bar',
        bar: 'foo',
      })
    })

    test('should return internal error if the middleware throws an error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new Error('test')
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).delete(path)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })

    test('should return the error if the middleware throws an operation error', async () => {
      const path = '/test'
      const callback = vitest.fn(request => request)
      const mockedError = new BaseError({
        message: 'Some client error!',
        statusCode: 400,
        action: 'some-action',
        isOperational: true,
      })
      const middlewares = [
        {
          handle: vitest.fn().mockRejectedValue(mockedError),
        },
        {
          handle: vitest.fn(request => ({ bar: 'foo' })),
        },
      ]

      hapiHttpServer.delete(path, callback, { middlewares })

      const response = await supertest(hapiHttpServer.app).delete(path)

      expect(response.status).toBe(mockedError.statusCode)
      expect(response.body).toEqual({
        error: mockedError.message,
        action: mockedError.action,
      })

      expect(middlewares[0].handle).toHaveBeenCalledTimes(1)
      expect(middlewares[1].handle).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })
  })
})
