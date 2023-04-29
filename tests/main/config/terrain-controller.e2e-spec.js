import supertest from 'supertest'
import app from '../../../src/main/app'
import { faker } from '@faker-js/faker'
import { database } from '../../../src/infra/data/helpers/firebase-helpers'
import firebaseTestHelpers from '../../firebase-test-helpers'
import { Terrain } from '../../../src/domain/entities/terrain'
import { mockTerrain } from '../../mocks/domain/entities/terrain.mock'
import { User } from '../../../src/domain/entities/user'
import { Location } from '../../../src/domain/value-objects/location'

describe('TerrainController e2e tests', () => {
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

  async function createTerrain() {
    const owner = await createUser()
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

  describe('POST /terrains', () => {
    test('should return 201 with the terrain', async () => {
      const owner = await createUser()
      const request = {
        name: faker.address.streetName(),
        locations: [
          Location.create({
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
          }),
        ],
        ownerId: owner.id,
      }

      const response = await supertest(app.app).post('/terrains').send(request)

      expect(response.status).toBe(200)
      expect(response.body.name).toEqual(request.name)
      expect(response.body.location).toEqual(request.location)
      expect(response.body.id).toEqual(expect.any(String))

      const userAtDatabase = await database
        .ref(`terrains/${response.body.id}`)
        .get()

      expect(userAtDatabase.val().name).toEqual(request.name)
    })

    test('should return 400 if location is invalid', async () => {
      const owner = await createUser()
      const request = {
        name: faker.address.streetName(),
        locations: [
          {
            latitude: faker.address.latitude(),
            longitude: null,
          },
        ],
        ownerId: owner.id,
      }

      const response = await supertest(app.app).post('/terrains').send(request)

      expect(response.status).toBe(400)
      expect(response.body.error).toEqual('Longitude não informada.')
    })

    test('should return 400 if user does not exists', async () => {
      const request = {
        name: faker.address.streetName(),
        locations: [
          {
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
          },
        ],
        ownerId: 'any_id',
      }

      const response = await supertest(app.app).post('/terrains').send(request)

      expect(response.status).toBe(400)
      expect(response.body.error).toEqual(
        'Usuário dono do terreno não encontrado.'
      )
    })
  })

  describe('PATCH /terrains/{id}', () => {
    test('should return 200 and update the existing terrain', async () => {
      const terrain = await createTerrain()
      const request = {
        name: faker.address.streetName(),
      }

      const response = await supertest(app.app)
        .patch(`/terrains/${terrain.id}`)
        .send(request)

      expect(response.status).toBe(200)

      const updatedTerrain = (
        await database.ref(`terrains/${terrain.id}`).get()
      ).toJSON()

      expect(updatedTerrain.name).toEqual(request.name)
      expect(updatedTerrain.name).not.toEqual(terrain.name)
    })

    test('should return 400 if location is invalid', async () => {
      const terrain = await createTerrain()
      
      const request = {
        name: faker.address.streetName(),
        locations: [
          {
            latitude: faker.address.latitude(),
            longitude: null,
          },
        ],
      }

      const response = await supertest(app.app).patch('/terrains/'.concat(terrain.id)).send(request)

      expect(response.status).toBe(400)
      expect(response.body.error).toEqual('Longitude não informada.')
    });

    // test('should return 400 if user does not exists', async () => {
    //   const request = {
    //     name: faker.address.streetName(),
    //     locations: [
    //       {
    //         latitude: faker.address.latitude(),
    //         longitude:  faker.address.longitude(),
    //       },
    //     ],
    //     ownerId: 'any_id',
    //   }

    //   const response = await supertest(app.app).post('/terrains').send(request)

    //   expect(response.status).toBe(400)
    //   expect(response.body.error).toEqual(
    //     'Usuário dono do terreno não encontrado.'
    //   )
    // });
  })
})
