import React from 'react';
import { MapView } from 'expo';

export default class MainMap extends React.Component {
  render() {
    const cameraSelectionHandler = this.props.onCameraSelected || noop
    const cameraDeselectionHandler = this.props.onCameraDeselected || noop
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={this.props.region}
        region={this.props.region}
        onPress={() => cameraDeselectionHandler()}
        >
        {this.props.cameraData.map((d) =>
          <MapView.Marker
            key={d.id}
            onPress={(evt) => {
              evt.stopPropagation()
              cameraSelectionHandler(d.id)
            }}
            coordinate={{
              latitude: d.coordinates[1],
              longitude: d.coordinates[0]
            }} />
        )}
      </MapView>
    );
  }
}

function noop() {}