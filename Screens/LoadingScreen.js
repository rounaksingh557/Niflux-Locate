/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import React from "react";
import { ActivityIndicator, View, Image, StyleSheet } from "react-native";

/**
 * @returns The Loading Screen
 */
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Niflux-Logo.png")}
        style={styles.nifluxImage}
      />
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
    height: "50%",
    width: "100%",
  },
  activityBar: {
    position: "absolute",
    bottom: 100,
  },
});
