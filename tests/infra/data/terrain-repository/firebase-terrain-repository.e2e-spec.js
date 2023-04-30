import { FirebaseTerrainRepository } from '../../../../src/infra/data/terrain-repository/firebase-terrain-repository'
import firebaseTestHelpers from '../../../firebase-test-helpers'
import { mockTerrain } from '../../../mocks/domain/entities/terrain.mock'

describe('FirebaseTerrainRepository', () => {
  let sut
  let firebaseDatabase
  beforeAll(async () => {
    await firebaseTestHelpers.connect()
    await firebaseTestHelpers.testEnvironment.clearDatabase()
  })

  beforeEach(async () => {
    await firebaseTestHelpers.testEnvironment.clearDatabase()
    firebaseDatabase = firebaseTestHelpers.database
    sut = new FirebaseTerrainRepository({ firebaseDatabase })
  })

  afterAll(async () => {
    await firebaseTestHelpers.testEnvironment.clearDatabase()
    await firebaseTestHelpers.reset()
  })

  describe('findByUserId()', () => {
    test('should return all the terrains with specific owner id', async () => {
      const ownerId = 'owner-id'
      const mockedTerrains = [
        { ...mockTerrain(), ownerId },
        { ...mockTerrain() },
      ]
      await Promise.all(
        mockedTerrains.map(async terrain => {
          await firebaseTestHelpers.database
            .ref(`terrains/${terrain.id}`)
            .set(terrain)
        })
      )

      const terrains = await sut.findByUserId(ownerId)
      const expectedTerrains = [mockedTerrains[0], ]
      expect(terrains.length).toEqual(1)
      expect(terrains[0].id).toEqual(expectedTerrains[0].id)
    })
  })
})
