import { Subject, Observable, combineLatest, merge } from 'rxjs'
import { switchMap, map, startWith, withLatestFrom, filter, pluck } from 'rxjs/operators'

import { fetchWeatherData } from './WeatherData'

export const SelectedCamera = new Subject()

export const CameraData = Observable.create((observer) => {
  fetch("https://tie.digitraffic.fi/api/v1/metadata/camera-stations?lastUpdated=false")
    .then((r) => r.json())
    .then(mapCameraData)
    .then(observer.next.bind(observer))
}).pipe(startWith([]))

const SelectedCameraData = SelectedCamera.pipe(
  withLatestFrom(CameraData),
  map(([ cameraId, cameraData ]) => cameraData.find((d) => d.id === cameraId))
)

const NearestWeatherStation = SelectedCamera.pipe(
  pluck('nearestWeatherStationId')
)

export const CurrentWeather = merge(
  NearestWeatherStation.pipe(
    filter((id) => id !== undefined),
    switchMap(fetchWeatherData)
  ),
  NearestWeatherStation.pipe(
    filter((id) => id === undefined),
    map(() => null)
  )
)

export const MapRegion = SelectedCameraData.pipe(
  map((data) => {
    const [ longitude, latitude ] = data.coordinates
    return {
      latitude,
      longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }
  })
)

const RootState = combineLatest(
  CameraData,
  CurrentWeather.pipe(startWith(null)),
  SelectedCameraData.pipe(startWith(null)),
  MapRegion.pipe(startWith(DEFAULT_MAP_REGION)),
  (cameraData, currentWeather, selectedCamera, mapRegion) => ({
    cameraData,
    currentWeather,
    selectedCamera,
    mapRegion
})).pipe(startWith(INITIAL_STATE))

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

export const DEFAULT_MAP_REGION = {
  latitude: 65.32411,
  longitude: 25.748151,
  latitudeDelta: 10.42,
  longitudeDelta: 4.21,
}

export const INITIAL_STATE = {
  cameraData: [],
  currentWeather: null,
  selectedCamera: null,
  mapRegion: DEFAULT_MAP_REGION
}

function log(stream) {
  stream.subscribe(console.log.bind(console))
}