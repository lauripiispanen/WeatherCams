import React from 'react';
import { View } from 'react-native';
import MainMap from './MainMap';
import CameraView from './CameraView';

export default class RootView extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        cameraData: [],
        selectedCamera: null
      }
    }
    render() {
      return <View style={styles.container}>
                <View style={styles.mapView}>
                  <MainMap
                      cameraData={this.state.cameraData}
                      onCameraSelected={(selectedCamera) => 
                        this.setState({
                          selectedCamera
                        })
                      }
                      />
                </View>
                {
                  (this.state.selectedCamera !== null)
                  ? <View style={styles.cameraView}>
                      <CameraView cameraData={this.state.selectedCamera} />
                    </View>
                  : ""
                }
              </View>;
    }
    componentDidMount() {
      return fetch("https://tie.digitraffic.fi/api/v1/metadata/camera-stations?lastUpdated=false")
              .then((r) => r.json())
              .then(mapCameraData)
              .then((cameraData) => {
                this.setState({
                  cameraData,
                  selectedCamera: cameraData[1]
                })
              })
    }
  }
  
  const styles = {
    container: {
      flex: 1
    },
    mapView: {
      flex: 2
    },
    cameraView: {
      flex: 1,
      backgroundColor: 'steelblue'
    }
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
      presets: featureInfo.properties.presets
    }
  }