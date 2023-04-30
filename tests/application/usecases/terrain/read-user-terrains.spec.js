import { ReadUserTerrains } from '../../../../src/application/usecases/terrain/read-user-terrains'
import { TerrainRepositorySpy } from '../../../mocks/application/repositories/terrain-repository.spy'

describe('ReadUserTerrains', () => {
  function makeSut() {
    const terrainRepositorySpy = new TerrainRepositorySpy()
    const sut = new ReadUserTerrains({
      terrainRepository: terrainRepositorySpy,
    })

    return {
      sut,
      terrainRepositorySpy,
    }
  }

  test('should return the terrains of the user', async () => {
    const { sut, terrainRepositorySpy } = makeSut()

    const terrains = await sut.execute('user-id')

    expect(terrains).toEqual(terrainRepositorySpy.findByUserIdResult)
    expect(terrainRepositorySpy.findByUserIdParams).toBe('user-id')
  });
})
