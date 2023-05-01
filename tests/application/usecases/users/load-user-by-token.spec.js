import { faker } from '@faker-js/faker'
import { LoadUserByToken } from '../../../../src/application/usecases/auth/load-user-by-token'
import { TokenGeneratorSpy } from '../../../mocks/application/interfaces/token-generator.spy'
import { UserRepositorySpy } from '../../../mocks/application/repositories/user-repository.spy'
import { vitest } from 'vitest'
import { UnauthorizedError } from '../../../../src/application/errors'

describe('LoadUserByToken', () => {
  function makeSut() {
    const userRepositorySpy = new UserRepositorySpy()
    const descrypterSpy = new TokenGeneratorSpy()

    const sut = new LoadUserByToken({
      userRepository: userRepositorySpy,
      decrypter: descrypterSpy,
    })

    return {
      sut,
      userRepositorySpy,
      descrypterSpy,
    }
  }

  test('should return the decrypted user on success', async () => {
    const { sut, userRepositorySpy, descrypterSpy } = makeSut()

    const accessToken = `Bearer ${faker.datatype.uuid()}`
    const token = accessToken.split(' ').pop()
    const user = await sut.execute({ accessToken })

    expect(user).toEqual(userRepositorySpy.findByIdResult)

    expect(descrypterSpy.decryptParams).toBe(token)
    expect(userRepositorySpy.findByIdParams).toBe(
      descrypterSpy.decryptResult.id
    )
  })

  test('should throw UnauthorizedError if the decrypter throws', async () => {
    const { sut, descrypterSpy } = makeSut()
    const mockedDecryptError = new Error('decrypt_error')
    vitest.spyOn(descrypterSpy, 'decrypt').mockRejectedValue(mockedDecryptError)

    const accessToken = faker.datatype.uuid()

    const promise = sut.execute({ accessToken })

    await expect(promise).rejects.toThrow(
      new UnauthorizedError({
        message: `Token inválido: ${mockedDecryptError.message}`,
      })
    )
  })

  test('should throw UnauthorizedError if the decrypter returns null or undefined', async () => {
    const { sut, descrypterSpy } = makeSut()
    descrypterSpy.decryptResult = null
    const accessToken = faker.datatype.uuid()

    const promise = sut.execute({ accessToken })

    await expect(promise).rejects.toThrow(
      new UnauthorizedError({
        message: `Token inválido!`,
      })
    )
  })

  test('should throw UnauthorizedError if decrypted user id is not found', async () => {
    const { sut, userRepositorySpy, descrypterSpy } = makeSut()
    userRepositorySpy.findByIdResult = null
    const accessToken = faker.datatype.uuid()

    const promise = sut.execute({ accessToken })

    await expect(promise).rejects.toThrow(new UnauthorizedError())
    expect(userRepositorySpy.findByIdParams).toBe(
      descrypterSpy.decryptResult.id
    )
  })
})
