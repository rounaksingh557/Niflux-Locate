/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as Font from "expo-font";

// Files Import
import GetLocationInfoService from "./Service/GetLocationInfoService";

/**
 * @returns The Main App
 */
export default function App() {
  // States Declaration
  const [loaded, setLoaded] = useState(false);

  /**
   *@description A function to load font and make it globally accessible
   * */
  async function LoadFonts() {
    await Font.loadAsync({
      TaiHeritageRegular: require("./assets/Fonts/TaiHeritagePro-Regular.ttf"),
      TaiHeritageBold: require("./assets/Fonts/TaiHeritagePro-Bold.ttf"),
    });
    setLoaded(true);
  }

  useEffect(() => {
    LoadFonts();
  }, []);

  if (loaded === false) {
    return (
      <>
        <StatusBar style="auto" />
        <ActivityIndicator
          size={150}
          color={"red"}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      </>
    );
  } else {
    return (
      <>
        <StatusBar style="auto" />
        {/* Service mounted first */}
        <GetLocationInfoService />
      </>
    );
  }
}
