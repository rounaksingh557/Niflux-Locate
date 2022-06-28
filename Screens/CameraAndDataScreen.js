/**
 * @author Rounak Singh
 * @license MIT
 */

// React Native View Shot Help Video: "https://www.youtube.com/watch?v=CEB0QepurQY"

// Modules Import
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Alert, PixelRatio } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import MapView, { Marker } from "react-native-maps";
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";

// Files Import
import LoadingScreen from "./LoadingScreen";
import CameraButton from "../Components/CameraButton";
import Button from "../Components/Button";

/**
 * @returns a camera screen
 * @requires latitude, longitude, city, country, district, isoCountryCode, name, postalCode, region, Date, Time
 * @description This screen takes a photo and then save and share it.
 */
export default function CameraAndDataScreen({
  latitude,
  longitude,
  city,
  country,
  district,
  isoCountryCode,
  name,
  postalCode,
  region,
  Date,
  Time,
}) {
  // Reference declaration
  let cameraRef = useRef(null);
  let finalImage = useRef(null);

  // variable for mapView

  // States declaration
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const askForPermission = async () => {
      // Permission request
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      // Accepting permission
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    };
    askForPermission();
  }, []);

  /**
   * @description function to the take the pictures
   */
  const takePhoto = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  /**
   * @description It saves the picture in the directory of the device
   */
  const savePhoto = async () => {
    if (photo != null) {
      if (hasMediaLibraryPermission != null) {
        try {
          if (finalImage !== null) {
            // Taking the snapshot of preview Image
            const result = await captureRef(finalImage, {
              result: "tmpfile",
              quality: 1,
              format: "jpg",
            });

            // Storing result
            if (result !== null) {
              await MediaLibrary.saveToLibraryAsync(result).then(() => {
                setPhoto(null);
              });
            }
          }
        } catch (error) {
          setError(error);
        }
      }
    } else {
      Alert.alert(
        "Don't have the required permission",
        "please allow media access. Give permission in settings",
        [{ text: "Cancel", style: "cancel" }, { text: "OK" }]
      );
    }
  };

  /**
   * @description Share the image
   */
  const sharePhoto = async () => {
    if (finalImage !== null) {
      // Taking the snapshot of preview Image
      const result = await captureRef(finalImage, {
        result: "tmpfile",
        quality: 1,
        format: "jpg",
      });

      // Sharing result
      if (result !== null) {
        shareAsync(result);
        setPhoto(null);
      }
    }
  };

  // Used by MapView and MapMarker
  const mapRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (hasCameraPermission === null) {
    return <LoadingScreen />;
  } else if (!hasCameraPermission) {
    return (
      <Text>Please allow camera permission. Change in app settings...</Text>
    );
  } else {
    return (
      <>
        <View style={styles.container}>
          {!photo ? (
            <Camera
              style={styles.cameraContainer}
              ref={cameraRef}
              type={type}
              flashMode={flash}
            >
              <View style={styles.upperOptionsContainer}>
                <Button
                  icon={"retweet"}
                  onPress={() => {
                    setType(
                      type === CameraType.back
                        ? CameraType.front
                        : CameraType.back
                    );
                  }}
                />
                <Button
                  icon={"flash"}
                  color={
                    flash === Camera.Constants.FlashMode.off
                      ? "gray"
                      : "#f1f1f1"
                  }
                  onPress={() => {
                    setFlash(
                      flash === Camera.Constants.FlashMode.off
                        ? Camera.Constants.FlashMode.torch
                        : Camera.Constants.FlashMode.off
                    );
                  }}
                />
              </View>
            </Camera>
          ) : (
            <ViewShot
              style={{ flex: 1, height: "100%", width: "100%" }}
              ref={finalImage}
            >
              <Image
                source={{ uri: photo.uri }}
                style={styles.cameraContainer}
              />

              <MapView region={mapRegion} style={styles.map}>
                <Marker coordinate={mapRegion} title="Marker" />
              </MapView>

              <View style={styles.dataContainer}>
                <Text style={styles.capitalInfo}>
                  {city}, {district}, {region}
                </Text>
                <View style={styles.discreetHolder}>
                  <Text style={styles.discreetInfo}>
                    {name}, {district}, {city}, {region}
                  </Text>
                </View>
                <View style={styles.discreetHolderTwo}>
                  <Text style={styles.discreetInfo}>
                    {postalCode}, {country}
                  </Text>
                </View>
                <View style={styles.coordinateHolder}>
                  <Text style={styles.coordinate}>Lat {latitude}</Text>
                </View>
                <View style={styles.coordinateHolderTwo}>
                  <Text style={styles.coordinate}>Long {longitude}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateAndTimeInfo}>
                    {Date} {Time} {isoCountryCode}
                  </Text>
                </View>
              </View>
            </ViewShot>
          )}

          {!photo ? (
            <View style={styles.buttonContainer}>
              <CameraButton onPress={() => takePhoto()} />
            </View>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <Button
                title={"Re-take"}
                icon="retweet"
                onPress={() => setPhoto(null)}
              />
              <Button title={"Save"} icon="check" onPress={() => savePhoto()} />
              <Button
                title={"Share"}
                icon="share"
                onPress={() => sharePhoto()}
              />
            </View>
          )}
        </View>
        {!photo ? (
          <>
            <MapView region={mapRegion} style={styles.map}>
              <Marker coordinate={mapRegion} title="Marker" />
            </MapView>

            <View style={styles.dataContainer}>
              <Text style={styles.capitalInfo}>
                {city}, {district}, {region}
              </Text>
              <View style={styles.discreetHolder}>
                <Text style={styles.discreetInfo}>
                  {name}, {district}, {city}, {region}
                </Text>
              </View>
              <View style={styles.discreetHolderTwo}>
                <Text style={styles.discreetInfo}>
                  {postalCode}, {country}
                </Text>
              </View>
              <View style={styles.coordinateHolder}>
                <Text style={styles.coordinate}>Lat {latitude}</Text>
              </View>
              <View style={styles.coordinateHolderTwo}>
                <Text style={styles.coordinate}>Long {longitude}</Text>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.dateAndTimeInfo}>
                  {Date} {Time} {isoCountryCode}
                </Text>
              </View>
            </View>
          </>
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    height: "80%",
  },
  upperOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    padding: 20,
    justifyContent: "center",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  map: {
    position: "absolute",
    width: "28%",
    height: 130,
    borderRadius: 20,
    bottom: 5,
    left: 5,
  },
  dataContainer: {
    position: "absolute",
    width: "68%",
    height: 130,
    borderRadius: 20,
    bottom: 5,
    right: 5,
    opacity: 0.7,
    backgroundColor: "black",
  },
  capitalInfo: {
    fontFamily: "TaiHeritageBold",
    color: "white",
    alignSelf: "center",
    fontSize: 17,
  },
  discreetHolder: {
    bottom: 12,
  },
  discreetHolderTwo: {
    bottom: 25,
    right: 71,
  },
  discreetInfo: {
    fontFamily: "TaiHeritageRegular",
    color: "white",
    alignSelf: "center",
    fontSize: 13,
  },
  coordinateHolder: {
    bottom: 35,
    left: 10,
  },
  coordinateHolderTwo: {
    bottom: 45,
    left: 10,
  },
  coordinate: {
    fontFamily: "TaiHeritageRegular",
    color: "white",
    fontSize: 13,
  },
  dateContainer: {
    bottom: 55,
    left: 10,
  },
  dateAndTimeInfo: {
    fontFamily: "TaiHeritageRegular",
    color: "white",
    fontSize: 13,
  },
});
