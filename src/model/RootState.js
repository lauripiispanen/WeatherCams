import { Subject, combineLatest, merge, from } from 'rxjs'
import { switchMap, map, startWith, withLatestFrom, filter, pluck } from 'rxjs/operators'

import { fetchWeatherData } from './WeatherData'

export default function(
  TrafficApi
) {
  const SelectedCamera = new Subject()

  const CameraData = from(TrafficApi.getCameraStations()).pipe(startWith([]))
  
  const SelectedCameraData = SelectedCamera.pipe(
    withLatestFrom(CameraData),
    map(([ cameraId, cameraData ]) => cameraData.find((d) => d.id === cameraId))
  )

  const NearestWeatherStation = SelectedCamera.pipe(
    filter((camera) => camera != null),
    pluck('nearestWeatherStationId')
  )

  const CurrentWeather = merge(
    NearestWeatherStation.pipe(
      filter((id) => id != null),
      switchMap(fetchWeatherData)
    ),
    NearestWeatherStation.pipe(
      filter((id) => id == null),
      map(() => null)
    )
  )

  const MapRegion = SelectedCameraData.pipe(
    filter((camera) => camera != null),
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

  return {
    RootState,
    SelectedCamera
  }
}

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