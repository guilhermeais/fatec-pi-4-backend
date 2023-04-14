import { User } from '../../../../src/domain/entities/user'
import { faker } from '@faker-js/faker'

export function mockUser() {
  return User.create({
    name: faker.name.firstName(),
    address: faker.address.streetAddress(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })
}
