import React from "react";
import { View, Text, StyleSheet } from "react-native";

import GoogleMapView, { PROVIDER_GOOGLE, Marker as RNMarker } from "react-native-maps";

import { Station } from "@/types";
import { useStation } from "@/context/station";
import { TextButton } from "@/design/ui/Button";
import { hasPlayServices } from "@/services/auth";
import { getAllStations } from "@/services/stations";


const MapView = (): JSX.Element => {
  const mapRef = React.useRef<GoogleMapView>(null);
  const [stations, setStations] = React.useState<Station[]>([]);

  const { setCurrentStation } = useStation();

  React.useEffect(() => {
    (async () => {
      const stations = await getAllStations();
      setStations(stations);
    })();
  }, []);

  const onPressStation = (station: Station) => {
    setCurrentStation(station);

    if (!mapRef.current) return;

    mapRef.current?.animateCamera({
      center: {
        latitude: station.coordinates.latitude,
        longitude: station.coordinates.longitude
      },
      zoom: 16,
    });
  }

  if (!hasPlayServices()) {
    return (
      <View style={[
        styles.map,
        {
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }
      ]}>

        <Text>
          Google Play Services are not available
        </Text>

        <TextButton
          onPress={() => {
            const index = Math.floor(Math.random() * stations.length);
            onPressStation(stations[index]);
          }}>
          <Text>Click on Station</Text>
        </TextButton>
      </View>
    );
  } else {
    return (
      <GoogleMapView
        ref={mapRef}
        style={styles.map}
        showsCompass={false}
        toolbarEnabled={false}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        // customMapStyle={mapStyling}
        showsMyLocationButton={false}
        // googleMapId="b50315943f641580"
        initialRegion={{
          latitude: 6.5244,
          longitude: 3.3792,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {stations && stations.map((station, index) => (
          <RNMarker
            key={index}
            onPress={() => onPressStation(station)}
            coordinate={{
              latitude: station.coordinates.latitude,
              longitude: station.coordinates.longitude
            }}
          />
        ))}
      </GoogleMapView>
    );
  }
};


const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  }
});



export default MapView;
