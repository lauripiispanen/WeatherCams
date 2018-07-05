import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';

export default class MainMap extends React.Component {
    render() {
        return <View style={{ flexDirection: "column", flex: 1 }}>
                 <Text>{this.props.cameraData.names.fi}</Text>
                 <ScrollView horizontal={true}>
                    {this.props.cameraData.presets.map((preset) =>
                        <View style={{ flexShrink: 0, flexGrow: 1 }} key={preset.presetId}>
                            <Text>{preset.presentationName}</Text>
                            <Image source={{ uri: preset.imageUrl.replace("http:", "https:") }} style={{ flex: 1, aspectRatio: 1 }} resizeMode="contain" />
                        </View>
                    )}
                </ScrollView>
            </View>
        
    }
}