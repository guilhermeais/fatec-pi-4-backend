import { TerrainController } from '../../../application/controllers/terrain-controller'
import { makeCreateTerrain } from './create-terrain.factory'
import { makeUpdateTerrainById } from './update-terrain-by-id.factory'

export function makeTerrainController() {
  return new TerrainController({
    createTerrainUseCase: makeCreateTerrain(),
    updateTerrainUseCase: makeUpdateTerrainById()
  })
}
