/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

/**
 * @requires onPress
 * @returns a touchable opacity with custom styling
 * @description this is the button for taking pictures
 */
export default function CameraButton({ onPress }) {
  return <TouchableOpacity style={styles.mainButton} onPress={onPress} />;
}

const styles = StyleSheet.create({
  mainButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
});
