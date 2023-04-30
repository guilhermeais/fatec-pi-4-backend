import { faker } from '@faker-js/faker'
import { Hasher } from '../../../../src/application/interfaces/hasher'

export class HasherSpy extends Hasher {
  constructor() {
    super()
    this.hashResult = faker.datatype.uuid()
    this.compareResult = true
  }
  async hash(value) {
    this.hashParams = value
    return this.hashResult
  }

  async compare(...params) {
    this.compareParams = params
    return Promise.resolve(this.compareResult)
  }
}
