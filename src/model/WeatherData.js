import { Observable, from } from 'rxjs'
import { flatMap, map } from "rxjs/operators"

export function fetchWeatherData(stationId) {
    const weatherDataObservable = Observable.create((observer) => {
        fetch(`https://tie.digitraffic.fi/api/v1/data/weather-data/${stationId}`)
          .then((r) => r.json())
          .then(observer.next.bind(observer))
      })
    
    return weatherDataObservable.pipe(
        flatMap((weatherData) => from(weatherData.weatherStations)),
        map(stationDataToStation)
    )
}

function stationDataToStation(stationData) {
    return stationData.sensorValues
               .filter((sensor) => interestingSensors.includes(sensor.name))
               .reduce((acc, sensor) => {
                   acc[sensor.name] = sensor
                   return acc
               }, {})
}

const interestingSensors = [
    "ILMA",
    "TIE_1",
    "KESKITUULI",
    "MAKSIMITUULI",
    "TUULENSUUNTA",
    "SADE",
    "SADESUMMA",
    "NAKYVYYS"
]