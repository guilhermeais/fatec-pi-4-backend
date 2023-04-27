import { defineFeature, loadFeature } from 'jest-cucumber'
import supertest from 'supertest'
import app from '../../../src/main/app'
import { mockUser } from '../../mocks/domain/entities/user.mock'
const features = loadFeature('../../requirements/signup-user.feature', {
  loadRelativePath: true,
})
import MockDate from 'mockdate'
import firebaseTestHelpers from '../../firebase-test-helpers'
import { database } from '../../../src/infra/data/helpers/firebase-helpers'

defineFeature(features, test => {

  beforeAll(async () => {
    MockDate.set(new Date())

    await firebaseTestHelpers.connect()
    await firebaseTestHelpers.testEnvironment.clearDatabase()
  })

  beforeEach(async () => {
    await firebaseTestHelpers.testEnvironment.clearDatabase()
  })

  afterAll(async () => {
    MockDate.reset()
    await firebaseTestHelpers.testEnvironment.clearDatabase()
    await firebaseTestHelpers.reset()
  })

  test('Successfully get the user token', async ({ given, and, then }) => {
    let mockedUser
    let result

    given('a valid user with name, addres, email, password', () => {
      mockedUser = mockUser()
      Reflect.deleteProperty(mockedUser, 'id')
    })

    then(
      'the user will be created and will be added to the account database',
      async () => {
        result = await supertest(app.app).post('/auth/sign-up').send(mockedUser)

        expect(result.status).toBe(200)
        const userAtDatabase = await database.ref(`users/${result.body.user.id}`).get()

        expect(userAtDatabase.val().name).toEqual(mockedUser.name)
      }
    )

    and('return the user and the access token', async () => {
      expect(result.body.user.name).toEqual(mockedUser.name)
      expect(result.body.user.email).toEqual(mockedUser.email)
      expect(result.body.user.id).toEqual(expect.any(String))
      expect(result.body).toHaveProperty('accessToken')
    })
  })
})
