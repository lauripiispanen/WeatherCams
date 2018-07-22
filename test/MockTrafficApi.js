const CameraStationFixture = require('./fixtures/camera-stations.json')
import { mapCameraData } from '../src/model/TrafficApi'

export function getCameraStations() {
  return Promise.resolve(CameraStationFixture).then(mapCameraData)
}