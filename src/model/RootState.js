import { Subject, Observable } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

import { fetchWeatherData } from './WeatherData'

export const SelectedCamera = new Subject()

export const CurrentWeather = SelectedCamera.pipe(
  map((camera) => camera.nearestWeatherStationId),
  switchMap(fetchWeatherData)
)

const RootState = Observable.create((observer) => {
  fetch("https://tie.digitraffic.fi/api/v1/metadata/camera-stations?lastUpdated=false")
    .then((r) => r.json())
    .then(mapCameraData)
    .then((cameraData) => {
      observer.next({
        cameraData,
        selectedCamera: cameraData[1]
      })
    })
})

function mapCameraData(rawCameraData) {
  return rawCameraData.features.map(extractSingleCamera).filter((i) => i !== null)
}

function extractSingleCamera(featureInfo) {
  if (featureInfo.properties === null || featureInfo.geometry === null) {
    return null
  }
  return {
    coordinates: featureInfo.geometry.coordinates,
    name: featureInfo.properties.name,
    id: featureInfo.id,
    names: featureInfo.properties.names,
    presets: featureInfo.properties.presets,
    nearestWeatherStationId: featureInfo.properties.nearestWeatherStationId
  }
}

export default RootState