import { BaseEntity } from './base-entity'

export class User extends BaseEntity {
  constructor(params) {
    super(params)

    this.name = params.name
    this.address = params.address
    this.email = params.email
    this.password = params.password
  }

  static create({ id, name, address, email, password }) {
    return new User({ id, name, address, email, password })
  }
}
