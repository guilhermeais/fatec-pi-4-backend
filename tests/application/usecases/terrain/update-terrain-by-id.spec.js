import { faker } from '@faker-js/faker'
import {
  InvalidLocation,
  TerrainNotFoundError,
} from '../../../../src/application/errors'
import { UpdateTerrainById } from '../../../../src/application/usecases/terrain/update-terrain-by-id'
import { TerrainRepositorySpy } from '../../../mocks/application/repositories/terrain-repository.spy'
import { mockTerrain } from '../../../mocks/domain/entities/terrain.mock'

describe('UpdateTerrainById', () => {
  function makeSut() {
    const terrainRepositorySpy = new TerrainRepositorySpy()

    const sut = new UpdateTerrainById({
      terrainRepository: terrainRepositorySpy,
    })

    return {
      sut,
      terrainRepositorySpy,
    }
  }
  test('should throw if the terrain does not exists', async () => {
    const { sut, terrainRepositorySpy } = makeSut()
    terrainRepositorySpy.findByIdResult = null
    const terrainData = mockTerrain()
    

    const promise = sut.execute(faker.datatype.uuid(), terrainData)

    await expect(promise).rejects.toThrow(
      new TerrainNotFoundError()
    )
  })

  test('should update the terrain on the repository', async () => {
    const { sut, terrainRepositorySpy } = makeSut()

    const terrainData = mockTerrain()

    await sut.execute(faker.datatype.uuid(), terrainData)

    expect(terrainRepositorySpy.updateParams).toEqual({
      name: terrainData.name,
      locations: terrainData.locations,
      ...terrainRepositorySpy.findByIdResult,
    })
  })

  test('should return the updated terrain', async () => {
    const { sut, terrainRepositorySpy } = makeSut()

    const terrainData = mockTerrain()

    const terrain = await sut.execute(faker.datatype.uuid(), terrainData)

    expect(terrain).toEqual(terrainRepositorySpy.findByIdResult)
  })

  test('should throw InvalidLocation if location is invalid', async () => {
    const { sut } = makeSut()

    const terrainData = mockTerrain()
    terrainData.locations = [
      {
        longitude: null,
        latitude: null,
      },
    ]

    const promise = sut.execute(faker.datatype.uuid(), terrainData)

    await expect(promise).rejects.toThrow(
      new InvalidLocation('Longitude não informada.')
    )
  })
})
