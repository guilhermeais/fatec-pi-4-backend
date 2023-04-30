import { TerrainNotFoundError } from '../../../../src/application/errors'
import { ReadTerrainById } from '../../../../src/application/usecases/terrain/read-terrain-by-id'
import { TerrainRepositorySpy } from '../../../mocks/application/repositories/terrain-repository.spy'

describe('ReadTerrainById', () => {
  function makeSut() {
    const terrainRepositorySpy = new TerrainRepositorySpy()
    const sut = new ReadTerrainById({
      terrainRepository: terrainRepositorySpy,
    })

    return {
      sut,
      terrainRepositorySpy,
    }
  }

  test('should throw TerrainNotFoundError if terrain id is not found', async () => {
    const { sut, terrainRepositorySpy } = makeSut()
    terrainRepositorySpy.findByIdResult = null

    const promise = sut.execute('invalid-id')

    await expect(promise).rejects.toThrow(
      new TerrainNotFoundError()
    )

    expect(terrainRepositorySpy.findByIdParams).toBe('invalid-id')
  });

  test('should return the founded terrain', async () => {
    const { sut, terrainRepositorySpy } = makeSut()

    const terrain = await sut.execute('valid-id')

    expect(terrain).toEqual(terrainRepositorySpy.findByIdResult)
    expect(terrainRepositorySpy.findByIdParams).toBe('valid-id')
  });
})
