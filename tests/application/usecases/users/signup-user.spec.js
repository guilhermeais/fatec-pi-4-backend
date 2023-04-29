import { SignUpUser } from '../../../../src/application/usecases/user/signup-user'
import { HasherSpy } from '../../../mocks/application/interfaces/hasher.spy'
import { TokenGeneratorSpy } from '../../../mocks/application/interfaces/token-generator.spy'
import { UserRepositorySpy } from '../../../mocks/application/repositories/user-repository.spy'
import MockDate from 'mockdate'
import { mockUser } from '../../../mocks/domain/entities/user.mock'
import { EmailInUseError } from '../../../../src/application/errors'

describe('SignUpUser', () => {
  function makeSut() {
    const userRepositorySpy = new UserRepositorySpy()
    const hasherSpy = new HasherSpy()
    const tokenGeneratorSpy = new TokenGeneratorSpy()

    userRepositorySpy.findByEmailResult = null
    const sut = new SignUpUser({
      userRepository: userRepositorySpy,
      hasher: hasherSpy,
      tokenGenerator: tokenGeneratorSpy,
    })
    return { sut, userRepositorySpy, hasherSpy, tokenGeneratorSpy }
  }

  let sutFactory = makeSut()

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sutFactory = makeSut()
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call userRepository.findByEmail with correct email', async () => {
    const { sut, userRepositorySpy } = sutFactory

    const user = mockUser()

    await sut.execute(user)

    expect(userRepositorySpy.findByEmailParams).toBe(user.email)
  })

  test('should throw EmailInUseError if email is already in use', async () => {
    const { sut, userRepositorySpy } = sutFactory
    userRepositorySpy.findByEmailResult = mockUser()
    const user = mockUser()

    const promise = sut.execute(user)

    await expect(promise).rejects.toThrow(new EmailInUseError(user.email))
  })

  test('should call hasher.hash with correct password', async () => {
    const { sut, hasherSpy } = sutFactory

    const user = mockUser()

    await sut.execute(user)

    expect(hasherSpy.value).toBe(user.password)
  })

  test('should call userRepository.save with correct values', async () => {
    const { sut, userRepositorySpy, hasherSpy } = sutFactory

    const user = mockUser()

    await sut.execute(user)

    expect(userRepositorySpy.saveParams).toEqual({
      ...user,
      id: expect.any(String),
      password: hasherSpy.result,
    })
  })

  test('should call tokenGenerator.generate with correct user id', async () => {
    const { sut, tokenGeneratorSpy, userRepositorySpy } = sutFactory

    const user = mockUser()

    await sut.execute(user)

    expect(tokenGeneratorSpy.payload).toEqual({ id: expect.any(String) })
  })

  test('should return the user and the accessToken', async () => {
    const { sut, userRepositorySpy, tokenGeneratorSpy } = sutFactory

    const user = mockUser()

    const result = await sut.execute(user)

    expect(result).toEqual({
      user: {
        id: expect.any(String),
        name: user.name,
        email: user.email,
        address: user.address,
      },
      accessToken: tokenGeneratorSpy.result,
    })  
  });
})
