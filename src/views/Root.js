import React from 'react'
import { View } from 'react-native'
import MainMap from './MainMap'
import CameraView from './CameraView'
import ActionContext from '../ActionContext'

export default class RootView extends React.Component {
    render() {
      return <ActionContext.Consumer>
              { ({ SelectedCamera }) => (
                <View style={styles.container}>
                  <View style={styles.mapView}>
                    <MainMap
                        cameraData={this.props.appState.cameraData}
                        region={this.props.appState.mapRegion}
                        onCameraSelected={(selectedCamera) => {
                          SelectedCamera.next(selectedCamera);
                        }}
                        onCameraDeselected={() => {
                          SelectedCamera.next(null)
                        }}
                        />
                  </View>
                  {
                    (this.props.appState.selectedCamera !== null)
                    ? <View style={styles.cameraView}>
                        <CameraView cameraData={this.props.appState.selectedCamera} />
                      </View>
                    : ""
                  }
                </View>
              )}
            </ActionContext.Consumer>
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