import { Terrain } from '../../../../src/domain/entities/terrain'
import { faker } from '@faker-js/faker'
import { Location } from '../../../../src/domain/value-objects/location'

export function mockTerrain() {
  return Terrain.create({
    name: faker.name.firstName(),
    ownerId: faker.datatype.uuid(),
    locations:[
      new Location({
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      })
    ]
  })
}
