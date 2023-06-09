import { TerrainController } from '../../../application/controllers/terrain-controller'
import { makeCreateTerrain } from './create-terrain.factory'
import { makeUpdateTerrainById } from './update-terrain-by-id.factory'
import { makeReadTerrainById } from './read-terrain-by-id.factory'
import { makeDeleteTerrainById } from './delete-terrain-by-id.factory'
import { makeReadUserTerrains } from './read-user-terrains.factory'

export function makeTerrainController() {
  return new TerrainController({
    createTerrainUseCase: makeCreateTerrain(),
    updateTerrainUseCase: makeUpdateTerrainById(),
    readTerrainUseCase: makeReadTerrainById(),
    deleteTerrainUseCase: makeDeleteTerrainById(),
    readUserTerrainsUseCase: makeReadUserTerrains()
  })
}
