/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import { StatusBar } from "expo-status-bar";

// Files Import
import CameraScreen from "./Screens/CameraScreen";
import GetLocationInfo from "./Service/GetLocationInfo";

/**
 * @returns The Main App
 */
export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <GetLocationInfo />
    </>
  );
}
