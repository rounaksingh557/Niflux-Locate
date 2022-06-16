/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

// Files Import
import LoadingScreen from "./LoadingScreen";
import CameraButton from "../Component/CameraButton";
import Button from "../Component/Button";

/**
 * @returns a camera screen
 * @description This screen takes a photo and then save and share it.
 */
export default function CameraScreen() {
  // Reference declaration
  let cameraRef = useRef();

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
    console.log(newPhoto);
  };

  /**
   * @description It saves the picture in the directory of the device
   */
  const savePhoto = async () => {
    if (photo) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
          setPhoto(undefined);
        });
      } catch (error) {
        console.warn(error);
      }
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

  if (hasCameraPermission === undefined) {
    return <LoadingScreen />;
  } else if (!hasCameraPermission) {
    return (
      <Text>Please allow camera permission. Change in app settings...</Text>
    );
  } else {
    return (
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
                  flash === Camera.Constants.FlashMode.off ? "gray" : "#f1f1f1"
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
            <Button title={"Share"} icon="share" onPress={() => sharePhoto()} />
          </View>
        )}
      </View>
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
});

// Main - https://www.youtube.com/watch?v=4WPjWK0MYMI
// Second - https://www.youtube.com/watch?v=9EoKurp6V0I
