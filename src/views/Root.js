import React from 'react'
import { View } from 'react-native'
import MainMap from './MainMap'
import CameraView from './CameraView'
import RootState, { SelectedCamera, INITIAL_STATE } from '../model/RootState'

export default class RootView extends React.Component {
    constructor(props) {
      super(props)
      this.state = INITIAL_STATE
    }
    render() {
      return <View style={styles.container}>
                <View style={styles.mapView}>
                  <MainMap
                      cameraData={this.state.cameraData}
                      region={this.state.mapRegion}
                      onCameraSelected={(selectedCamera) => {
                        SelectedCamera.next(selectedCamera);
                      }}
                      onCameraDeselected={() => {
                        this.setState({
                          selectedCamera: null
                        })
                      }}
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
      RootState.subscribe(this.setState.bind(this))
    }
}

const styles = {
  container: {
    flex: 1
  },
  mapView: {
    flex: 1
  },
  cameraView: {
    flex: 3,
    backgroundColor: 'steelblue'
  }
}