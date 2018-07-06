import React from 'react'
import { View } from 'react-native'
import MainMap from './MainMap'
import CameraView from './CameraView'
import RootState, { SelectedCamera } from '../model/RootState'

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
                      onCameraSelected={(selectedCamera) => {
                        SelectedCamera.next(selectedCamera);
                          this.setState({
                            selectedCamera
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
      RootState.subscribe((state) => this.setState(state))
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