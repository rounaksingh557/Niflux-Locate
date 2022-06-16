/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

/**
 * @requires tile, icon, color?, onPress
 * @returns a TouchableOpacity with a icon
 * @description This button is used in preview page.
 */
export default function Button({ title, icon, color, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Entypo name={icon} size={28} color={color ? color : "#f1f1f1"} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#f1f1f1",
    marginLeft: 10,
  },
});
