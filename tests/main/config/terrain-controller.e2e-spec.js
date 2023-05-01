import supertest from 'supertest'
import app from '../../../src/main/app'
import { faker } from '@faker-js/faker'
import { database } from '../../../src/infra/data/helpers/firebase-helpers'
import firebaseTestHelpers from '../../firebase-test-helpers'
import { Terrain } from '../../../src/domain/entities/terrain'
import { mockTerrain } from '../../mocks/domain/entities/terrain.mock'
import { User } from '../../../src/domain/entities/user'
import { Location } from '../../../src/domain/value-objects/location'
import { env } from '../../../src/main/config/env'
import * as jwt from 'jsonwebtoken'

describe('TerrainController e2e tests', () => {
  beforeAll(async () => {
    await firebaseTestHelpers.connect()
    await firebaseTestHelpers.testEnvironment.clearDatabase()
  })

  // beforeEach(async () => {
  //   await firebaseTestHelpers.testEnvironment.clearDatabase()
  // })

  afterAll(async () => {
    await firebaseTestHelpers.testEnvironment.clearDatabase()
    await firebaseTestHelpers.reset()
  })

  async function createUser() {
    const user = User.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

    await database.ref(`users/${user.id}`).set(user)
    return user
  }

  async function makeAccessToken(user) {
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET)

    return token
  }

  async function createTerrain(owner) {
    const terrain = Terrain.create({
      name: faker.address.streetName(),
      locations: [
        Location.create({
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
        }),
      ],
      ownerId: owner.id,
    })

    await database.ref(`terrains/${terrain.id}`).set(terrain)
    return terrain
  }

  describe('GET /terrains', () => {
    test('should return all user terrains', async () => {
      const user = await createUser()
      const [terrain, accessToken] = await Promise.all([
        createTerrain(user),
        makeAccessToken(user),
      ])

      const response = await supertest(app.app)
        .get('/terrains')
        .set('authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.length).toEqual(1)
      expect(response.body[0].id).toEqual(terrain.id)
    })

    test('should not show others users terrains', async () => {
      const user = await createUser()
      const accessToken = await makeAccessToken(user)

      const otherUser = await createUser()
      await createTerrain(otherUser)

      const response = await supertest(app.app)
        .get('/terrains')
        .set('authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.length).toEqual(0)
    })
  })

  describe('POST /terrains', () => {
    test('should return 201 with the terrain', async () => {
      const user = await createUser()
      const accessToken = await makeAccessToken(user)
      const request = {
        name: faker.address.streetName(),
        locations: [
          Location.create({
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
          }),
        ],
      }

      const response = await supertest(app.app)
        .post('/terrains')
        .set('authorization', `Bearer ${accessToken}`)
        .send(request)

      expect(response.status).toBe(200)
      expect(response.body.name).toEqual(request.name)
      expect(response.body.location).toEqual(request.location)
      expect(response.body.id).toEqual(expect.any(String))

      const userAtDatabase = await database
        .ref(`terrains/${response.body.id}`)
        .get()

      expect(userAtDatabase.val().name).toEqual(request.name)
      expect(userAtDatabase.val().ownerId).toEqual(user.id)
    })

    test('should return 400 if location is invalid', async () => {
      const user = await createUser()
      const accessToken = await makeAccessToken(user)
      const request = {
        name: faker.address.streetName(),
        locations: [
          {
            latitude: faker.address.latitude(),
            longitude: null,
          },
        ],
      }

      const response = await supertest(app.app)
        .post('/terrains')
        .set('authorization', `Bearer ${accessToken}`)
        .send(request)

      expect(response.status).toBe(400)
      expect(response.body.error).toEqual('Longitude não informada.')
    })
  })

  describe('PATCH /terrains/{id}', () => {
    test('should return 200 and update the existing terrain', async () => {
      const user = await createUser()
      const [terrain, accessToken] = await Promise.all([
        createTerrain(user),
        makeAccessToken(user),
      ])
      const request = {
        name: faker.address.streetName(),
      }

      const response = await supertest(app.app)
        .patch(`/terrains/${terrain.id}`)
        .set('authorization', `Bearer ${accessToken}`)
        .send(request)

      expect(response.status).toBe(200)

      const updatedTerrain = (
        await database.ref(`terrains/${terrain.id}`).get()
      ).toJSON()

      expect(updatedTerrain.name).toEqual(request.name)
      expect(updatedTerrain.name).not.toEqual(terrain.name)
    })
    test('should return 401 if user is not terrain owner', async () => {
      const user = await createUser()
      const [accessToken] = await Promise.all([makeAccessToken(user)])

      const otherUser = await createUser()
      const otherUserTerrain = await createTerrain(otherUser)

      const request = {
        name: faker.address.streetName(),
        locations: [
          {
            latitude: faker.address.latitude(),
            longitude: null,
          },
        ],
      }
      const response = await supertest(app.app)
        .patch(`/terrains/${otherUserTerrain.id}`)
        .set('authorization', `Bearer ${accessToken}`)
        .send(request)

      expect(response.status).toBe(401)
      expect(response.body.error).toEqual(
        'Você não pode atualizar um terreno que não é seu!'
      )
    })

    test('should return 400 if location is invalid', async () => {
      const user = await createUser()
      const [terrain, accessToken] = await Promise.all([
        createTerrain(user),
        makeAccessToken(user),
      ])

      const request = {
        name: faker.address.streetName(),
        locations: [
          {
            latitude: faker.address.latitude(),
            longitude: null,
          },
        ],
      }
      const response = await supertest(app.app)
        .patch(`/terrains/${terrain.id}`)
        .set('authorization', `Bearer ${accessToken}`)
        .send(request)

      expect(response.status).toBe(400)
      expect(response.body.error).toEqual('Longitude não informada.')
    })
  })

  describe('DELETE /terrains/{id}', () => {
    test('should return 200 and delete the existing terrain', async () => {
      const user = await createUser()
      const [terrain, accessToken] = await Promise.all([
        createTerrain(user),
        makeAccessToken(user),
      ])

      const response = await supertest(app.app)
        .delete(`/terrains/${terrain.id}`)
        .set('authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(204)

      const deletedTerrainDb = (
        await database.ref(`terrains/${terrain.id}`).get()
      ).toJSON()

      expect(deletedTerrainDb).toBeNull()
    })

    test('should return 401 if the user is not the terrain owner', async () => {
      const user = await createUser()
      const [accessToken] = await Promise.all([makeAccessToken(user)])

      const otherUser = await createUser()
      const otherUserTerrain = await createTerrain(otherUser)

      const response = await supertest(app.app)
        .delete(`/terrains/${otherUserTerrain.id}`)
        .set('authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(401)
    })

    test('should return 404 if the terrain does not exists', async () => {
      const user = await createUser()
      const accessToken = await makeAccessToken(user)

      const response = await supertest(app.app)
        .delete(`/terrains/${faker.datatype.uuid()}`)
        .set('authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(404)
    });
  })
})
