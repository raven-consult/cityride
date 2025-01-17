import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import GoogleMapView, { PROVIDER_GOOGLE, Marker as RNMarker } from "react-native-maps";

import { Station } from "@/types";
import { TextButton } from "@/design/ui/Button";
import { hasPlayServices } from "@/services/auth";
import { getAllStations } from "@/services/stations";
import { useAppContext } from "@/context/AppContext";


const MapView = (): JSX.Element => {
  const mapRef = React.useRef<GoogleMapView>(null);
  const [stations, setStations] = React.useState<Station[]>([]);

  const { setCurrentStation } = useAppContext();
  const { createRideMode, selectedRoute, setSelectedRoute } = useAppContext();

  const formatStations = React.useMemo(() => {
    return stations.map(station => ({
      label: station.name,
      value: station.id,
    }));
  }, [stations]);

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

        {createRideMode && (
          <View style={{
            gap: 16,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 12,
          }}>
            <Select
              placeholder="Start Position"
              data={formatStations}
              value={"Lagos"}
              style={{
                flex: 1,
              }}
              onChange={(val) => {
                const station = stations.filter(station => station.id === val.value)[0];
                setSelectedRoute({
                  ...selectedRoute,
                  start: station,
                });
              }}
            />
            <Text>To</Text>
            <Select
              placeholder="End Position"
              data={formatStations}
              value={"Lagos"}
              style={{
                flex: 1,
              }}
              onChange={(val) => {
                const station = stations.filter(station => station.id === val.value)[0];

                setSelectedRoute({
                  ...selectedRoute,
                  end: station,
                });
              }}
            />
          </View>
        )}

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
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderColor: "hsl(0, 0%, 85%)",
  },
  inputSearchStyle: {
    height: 40,
    width: 100,
    fontSize: 16,
  },
  selectedTextStyle: {
    width: 100,
    paddingLeft: 4,
  },
});



export default MapView;



interface SelectData {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  error?: boolean;
  disabled?: boolean;
  placeholder: string;
  data: Array<SelectData>;

  style?: StyleProp<ViewStyle>;
  onChange?: (value: SelectData) => void;
}

const Select = ({ disabled = false, placeholder, error = false, value, data, style, onChange }: SelectProps): JSX.Element => {
  const [isFocus, setIsFocus] = React.useState(false);

  return (
    <Dropdown
      data={data}
      value={value}
      disable={disabled}
      maxHeight={300}
      labelField="label"
      valueField="value"
      onChange={item => {
        onChange ? onChange(item) : null;
        setIsFocus(false);
      }}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      style={[
        style,
        styles.dropdown,
        error && { borderColor: "red" },
      ]}
      itemTextStyle={[]}
      placeholder={!isFocus ? placeholder : "..."}
      placeholderStyle={[{ color: "blue", width: 100 }]}
      inputSearchStyle={[styles.inputSearchStyle]}
      selectedTextStyle={[styles.selectedTextStyle]}
    />
  );
}