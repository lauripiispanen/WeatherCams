import React from 'react';
import { MapView } from 'expo';

export default class MainMap extends React.Component {
    render() {
      const cameraSelectionHandler = this.props.onCameraSelected || noop
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 65.32411,
            longitude: 25.748151,
            latitudeDelta: 10.42,
            longitudeDelta: 4.21,
          }}>
          {this.props.cameraData.map((d) =>
            <MapView.Marker
              key={d.id}
              onPress={() => cameraSelectionHandler(d)}
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