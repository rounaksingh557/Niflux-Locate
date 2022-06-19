/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import MapView, { Marker } from "react-native-maps";
import { BlurView } from "expo-blur";

// Files Import
import LoadingScreen from "./LoadingScreen";
import CameraButton from "../Component/CameraButton";
import Button from "../Component/Button";

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

  // States declaration
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [photo, setPhoto] = useState();

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
    if (photo) {
      if (hasMediaLibraryPermission) {
        try {
          await MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
            setPhoto(undefined);
          });
        } catch (error) {
          console.warn(error);
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
  const sharePhoto = () => {
    shareAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  };

  // Used by MapView and MapMarker
  const mapRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (hasCameraPermission === undefined) {
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
            <Image source={{ uri: photo.uri }} style={styles.cameraContainer} />
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
        <MapView region={mapRegion} style={styles.map}>
          <Marker coordinate={mapRegion} title="Marker" />
        </MapView>
        <BlurView intensity={100} tint="dark" style={styles.dataContainer}>
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
        </BlurView>
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
    width: 110,
    height: 130,
    borderRadius: 20,
    bottom: 5,
    left: 5,
  },
  dataContainer: {
    position: "absolute",
    width: 235,
    height: 130,
    borderRadius: 20,
    bottom: 5,
    right: 5,
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
