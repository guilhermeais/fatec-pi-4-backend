import { faker } from '@faker-js/faker'
import { TokenGenerator } from '../../../../src/application/interfaces/token-generator'

export class TokenGeneratorSpy extends TokenGenerator {
  constructor() {
    super()
    this.result = faker.datatype.uuid()
  }
  async generate(payload) {
    this.payload = payload
    return this.result
  }
}
