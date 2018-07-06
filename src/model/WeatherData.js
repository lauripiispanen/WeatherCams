import { Observable } from 'rxjs'
import { map } from "rxjs/operators"

export function fetchWeatherData(stationId) {
    const weatherDataObservable = Observable.create((observer) => {
        fetch(`https://tie.digitraffic.fi/api/v1/data/weather-data/${stationId}`)
          .then((r) => r.json())
          .then(observer.next.bind(observer))
      })
    
    return weatherDataObservable.pipe(map((weatherData) => {
        return weatherData.weatherStations
    }))
}