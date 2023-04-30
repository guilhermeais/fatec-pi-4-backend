import supertest from 'supertest'
import app from '../../../src/main/app'
import { faker } from '@faker-js/faker'
import {
  database,
} from '../../../src/infra/data/helpers/firebase-helpers'
import { User } from '../../../src/domain/entities/user'
import bcrypt from 'bcrypt'
import firebaseTestHelpers from '../../firebase-test-helpers'

describe('UserController e2e tests', () => {
  beforeAll(async () => {
    await firebaseTestHelpers.connect()
    await firebaseTestHelpers.testEnvironment.clearDatabase()
  })

  beforeEach(async () => {
    await firebaseTestHelpers.testEnvironment.clearDatabase()
  })

  afterAll(async () => {
    await firebaseTestHelpers.testEnvironment.clearDatabase()
    await firebaseTestHelpers.reset()
  })

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

      const userAtDatabase = await database.ref(`users/${response.body.user.id}`).get()

      expect(userAtDatabase.val().name).toEqual(request.name)
    })
  })

  describe('POST /auth/sign-in', () => {
    async function createUser() {
      const user = User.create({
        name: faker.name.firstName(),
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })

      await database
        .ref(`users/${user.id}`)
        .set({ ...user, password: bcrypt.hashSync(user.password, 12) })
      return user
    }

    test('should return 201 with the user and accessToken if valid email and password was provided', async () => {
      const user = await createUser()

      const response = await supertest(app.app).post('/auth/sign-in').send({
        email: user.email,
        password: user.password,
      })

      expect(response.status).toBe(200)
      expect(response.body.user.name).toEqual(user.name)
      expect(response.body.user.email).toEqual(user.email)
      expect(response.body.user.id).toEqual(user.id)
      expect(response.body).toHaveProperty('accessToken')
    })

    test('should return 401 if password is invalid', async () => {
      const user = await createUser()

      const response = await supertest(app.app).post('/auth/sign-in').send({
        email: user.email,
        password: 'invalid_password',
      })

      expect(response.status).toBe(401)
    });

    test('should return 400 if email does not exists', async () => {
      const user = await createUser()

      const response = await supertest(app.app).post('/auth/sign-in').send({
        email: 'invalid_email',
        password: user.password,
      })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Usuário não encontrado!')
    });
  })
})
