import { faker } from '@faker-js/faker'
import { SignInUser } from '../../../../src/application/usecases/user/signin-user'
import { HasherSpy } from '../../../mocks/application/interfaces/hasher.spy'
import { TokenGeneratorSpy } from '../../../mocks/application/interfaces/token-generator.spy'
import { UserRepositorySpy } from '../../../mocks/application/repositories/user-repository.spy'
import {
  InvalidPasswordError,
  UserNotFoundError,
} from '../../../../src/application/errors'

describe('SignInUser', () => {
  function makeSut() {
    const hasherSpy = new HasherSpy()
    const userRepositorySpy = new UserRepositorySpy()
    const tokenGeneratorSpy = new TokenGeneratorSpy()

    const sut = new SignInUser({
      hasher: hasherSpy,
      userRepository: userRepositorySpy,
      tokenGenerator: tokenGeneratorSpy,
    })

    return {
      sut,
      hasherSpy,
      userRepositorySpy,
      tokenGeneratorSpy,
    }
  }

  function makeLoginData() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  }

  test('should throw UserNotFound if provided email is invalid', async () => {
    const { sut, userRepositorySpy } = makeSut()
    userRepositorySpy.findByEmailResult = null
    const loginRequest = makeLoginData()
    await expect(sut.execute(loginRequest)).rejects.toThrow(
      new UserNotFoundError(loginRequest.email)
    )

    expect(userRepositorySpy.findByEmailParams).toBe(loginRequest.email)
  })

  test('should throw InvalidPasswordError if password does not match', async () => {
    const { sut, hasherSpy, userRepositorySpy } = makeSut()
    hasherSpy.compareResult = false
    const loginRequest = makeLoginData()
    await expect(sut.execute(loginRequest)).rejects.toThrow(
      new InvalidPasswordError()
    )

    expect(hasherSpy.compareParams).toEqual([
      loginRequest.password,
      userRepositorySpy.findByEmailResult.password,
    ])
  })

  test('should return some user information and the access token', async () => {
    const { sut, hasherSpy, userRepositorySpy, tokenGeneratorSpy } = makeSut()
    const loginRequest = makeLoginData()
    const { user, accessToken } = await sut.execute(loginRequest)

    expect(user).toEqual({
      id: userRepositorySpy.findByEmailResult.id,
      name: userRepositorySpy.findByEmailResult.name,
      email: userRepositorySpy.findByEmailResult.email,
      address: userRepositorySpy.findByEmailResult.address,
    })

    expect(hasherSpy.compareParams).toEqual([
      loginRequest.password,
      userRepositorySpy.findByEmailResult.password,
    ])

    expect(tokenGeneratorSpy.payload).toEqual({
      id: userRepositorySpy.findByEmailResult.id,
    })
    expect(accessToken).toBe(tokenGeneratorSpy.result)
  })
})
