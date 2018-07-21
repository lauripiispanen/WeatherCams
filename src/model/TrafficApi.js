export function getCameraStations() {
  return fetch("https://tie.digitraffic.fi/api/v1/metadata/camera-stations?lastUpdated=false")
          .then((r) => r.json())
          .then(mapCameraData)
}

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
  