import { defineFeature, loadFeature } from 'jest-cucumber'
import { SignUpUser } from '../../../src/application/usecases/user/signup-user'
import { UserRepositorySpy } from '../../mocks/application/repositories/user-repository.spy'
import { HasherSpy } from '../../mocks/application/interfaces/hasher.spy'
import { TokenGeneratorSpy } from '../../mocks/application/interfaces/token-generator.spy'
import { mockUser } from '../../mocks/domain/entities/user.mock'
import MockDate from 'mockdate'

const features = loadFeature('../../requirements/signup-user.feature', {
  loadRelativePath: true,
})

defineFeature(features, test => {
  function makeSut() {
    const userRepositorySpy = new UserRepositorySpy()
    const hasherSpy = new HasherSpy()
    const tokenGeneratorSpy = new TokenGeneratorSpy()

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

  test('Successfully get the user token', ({ given, and, then }) => {
    const { sut, userRepositorySpy, hasherSpy, tokenGeneratorSpy } = sutFactory

    let mockedUser
    let result

    given(
      'a valid user with name, addres, email, password, confirmPassword',
      () => {
        mockedUser = mockUser()
        Reflect.deleteProperty(mockedUser, 'id')
      }
    )

    then(
      'the user will be created and will be added to the account database',
      async () => {
        result = await sut.execute(mockedUser)
        expect(userRepositorySpy.saveParams).toEqual({
          ...mockedUser,
          id: expect.any(String),
          password: hasherSpy.result,
        })
      }
    )

    and('return the user and the access token', async () => {
      expect(result.user.name).toEqual(mockedUser.name)
      expect(result.user.address).toEqual(mockedUser.address)

      expect(result.accessToken).toEqual(tokenGeneratorSpy.result)
    })
  })
})
