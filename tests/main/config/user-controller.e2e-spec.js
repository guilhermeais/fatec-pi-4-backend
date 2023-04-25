import supertest from 'supertest'
import app from '../../../src/main/app'
import { faker } from '@faker-js/faker'

describe('UserController e2e tests', () => {
  describe('POST /auth/sign-up', () => {
    test('should return 201 with the user and accessToken', async () => {
      const request = {
        name: faker.name.firstName(),
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }

      const response = await supertest(app.app)
        .post('/auth/sign-up')
        .send(request)

      expect(response.status).toBe(200)
      expect(response.body.user.name).toEqual(request.name)
      expect(response.body.user.email).toEqual(request.email)
      expect(response.body.user.id).toEqual(expect.any(String))
      expect(response.body).toHaveProperty('accessToken')
    })
  })
})
