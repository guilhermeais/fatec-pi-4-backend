import { DeleteTerrainById } from '../../../../src/application/usecases/terrain/delete-terrain-by-id'
import { TerrainRepositorySpy } from '../../../mocks/application/repositories/terrain-repository.spy'

describe('DeleteTerrainById', () => {
  function makeSut() {
    const terrainRepositorySpy = new TerrainRepositorySpy()
    const sut = new DeleteTerrainById({
      terrainRepository: terrainRepositorySpy,
    })

    return {
      sut,
      terrainRepositorySpy,
    }
  }

  test('should throw TerrainNotFoundError if non existing id is provided', async () => {
    const { sut, terrainRepositorySpy } = makeSut()
    terrainRepositorySpy.findByIdResult = null

    const promise = sut.execute('invalid-id', 'user-id')

    await expect(promise).rejects.toThrow(new TerrainNotFoundError())

    expect(terrainRepositorySpy.findByIdParams).toBe('invalid-id')
  })

  test('should throw ForbiddenOperation if user trying to delete the terrain is not the terrain owner', async () => {
    const { sut, terrainRepositorySpy } = makeSut()
    terrainRepositorySpy.findByIdResult = {
      userId: 'another-user-id',
    }

    const promise = sut.execute('valid-id', 'user-id')

    await expect(promise).rejects.toThrow(
      new ForbiddenOperation({
        action:
          'Para deletar um terreno você deve ser dono dele! Verifique seu acesso e tente novamente.',
      })
    )

    expect(terrainRepositorySpy.findByIdParams).toBe('valid-id')
  })

  test('should delete the terrain', async () => {
    const { sut, terrainRepositorySpy } = makeSut()

    await sut.execute('valid-id', terrainRepositorySpy.findByIdResults.ownerId)

    expect(terrainRepositorySpy.findByIdParams).toBe('valid-id')
    expect(terrainRepositorySpy.deleteParams).toBe('valid-id')
  })
})
