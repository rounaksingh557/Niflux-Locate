/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import React from "react";
import { ActivityIndicator, View, Image, Text, StyleSheet } from "react-native";

/**
 * @returns The Loading Screen
 * @description This is a loading screen which has a activity indicator and a image.
 */
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Niflux-Logo.png")}
        style={styles.nifluxImage}
      />
      <Text style={styles.mainTitle}>Niflux Locate</Text>
      <ActivityIndicator size={100} style={styles.activityBar} color={"red"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  nifluxImage: {
    top: 150,
    position: "absolute",
    height: "30%",
    width: "100%",
  },
  mainTitle: {
    fontWeight: "bold",
    fontSize: 30,
    paddingTop: 80,
  },
  activityBar: {
    position: "absolute",
    bottom: 100,
  },
});
