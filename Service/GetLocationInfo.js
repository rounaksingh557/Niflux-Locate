import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function GetLocationInfo() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const LocationValue = {
    coords: {
      accuracy: 20.899999618530273,
      altitude: 580,
      altitudeAccuracy: 26.625600814819336,
      heading: 0,
      latitude: 23.2947586,
      longitude: 85.3237117,
      speed: 0,
    },
    mocked: false,
    timestamp: 1655520772594,
  };

  const fineLocation = {
    city: "Ranchi",
    country: "India",
    district: "Hesag",
    isoCountryCode: "IN",
    name: "78VF+WG9",
    postalCode: "834003",
    region: "Jharkhand",
    street: null,
    streetNumber: null,
    subregion: "Ranchi",
    timezone: null,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let fineLocation = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
