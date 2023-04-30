import { faker } from '@faker-js/faker'
import { TokenGenerator } from '../../../../src/application/interfaces/token-generator'

export class TokenGeneratorSpy extends TokenGenerator {
  constructor() {
    super()
    this.result = faker.datatype.uuid()

    this.decryptResult = {
      id: faker.datatype.uuid(),
    }
  }
  async generate(payload) {
    this.payload = payload
    return this.result
  }

  async decrypt(token) {
    this.decryptParams = token;

    return this.decryptResult
  }
}
