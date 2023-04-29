import { TerrainController } from '../../../application/controllers/terrain-controller'
import { makeCreateTerrain } from './create-terrain.factory'

export function makeTerrainController() {
  return new TerrainController({
    createTerrainUseCase: makeCreateTerrain()
  })
}
