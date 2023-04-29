import { InvalidLocation, InvalidTerrain } from '../../../../src/application/errors'
import { CreateTerrain } from '../../../../src/application/usecases/terrain/create-terrain'
import { TerrainRepositorySpy } from '../../../mocks/application/repositories/terrain-repository.spy'
import { UserRepositorySpy } from '../../../mocks/application/repositories/user-repository.spy'
import { mockTerrain } from '../../../mocks/domain/entities/terrain.mock'

describe('CreateTerrain', () => {
  function makeSut() {
    const userRepositorySpy = new UserRepositorySpy()
    const terrainRepositorySpy = new TerrainRepositorySpy()

    const sut = new CreateTerrain({
      userRepository: userRepositorySpy,
      terrainRepository: terrainRepositorySpy,
    })

    return {
      sut,
      userRepositorySpy,
      terrainRepositorySpy,
    }
  }

  test('should throw InvalidTerrain if the user owner of the terrain does not exists', async () => {
    const { sut, userRepositorySpy } = makeSut()

    userRepositorySpy.findByIdResult = null

    const promise = sut.execute(mockTerrain())

    await expect(promise).rejects.toThrow(
      new InvalidTerrain(
        'Usuário dono do terreno não encontrado.',
        'Verifique se você está autenticado corretamente e tente novamente.'
      )
    )
  })

  test('should save the terrain on the repository', async () => {
    const { sut, terrainRepositorySpy } = makeSut()

    const terrainData = mockTerrain()

    await sut.execute(terrainData)

    expect(terrainRepositorySpy.saveParams).toEqual(terrainData)
  });

  test('should return the created terrain', async () => {
    const { sut, terrainRepositorySpy } = makeSut()

    const terrainData = mockTerrain()

    const terrain = await sut.execute(terrainData)

    expect(terrain).toEqual(terrainData)
  });

  test('should throw InvalidLocation if location is invalid', async () => {
    const { sut } = makeSut()

    const terrainData = mockTerrain()
    terrainData.locations = [
      {
        longitude: null,
        latitude: null,
      },
    ]

    const promise = sut.execute(terrainData)

    await expect(promise).rejects.toThrow(
      new InvalidLocation('Longitude não informada.')
    )
  });
})
