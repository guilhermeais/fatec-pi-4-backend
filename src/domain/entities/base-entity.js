import { randomUUID } from 'crypto'

export class BaseEntity {
  #errors = []

  get errors() {
    return this.#errors
  }

  get hasErrors() {
    return this.#errors.length > 0
  }

  addError(error) {
    this.#errors.push(error)
  }

  clearErrors() {
    this.#errors = []
  }

  constructor(params = {}) {
    params.id = params.id || randomUUID()
    params.createdAt = params.createdAt || new Date()
    params.updatedAt = params.updatedAt || new Date()
    
    Object.assign(this, params)
  }
}
