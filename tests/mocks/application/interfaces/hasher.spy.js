import { faker } from '@faker-js/faker';
import { Hasher } from '../../../../src/application/interfaces/hasher';

export class HasherSpy extends Hasher {
  constructor() {
    super();
    this.result = faker.datatype.uuid();
  }
  async hash(value) {
    this.value = value;
    return this.result;
  }
}