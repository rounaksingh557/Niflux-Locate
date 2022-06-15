/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import { StatusBar } from "expo-status-bar";

// Files Import
import LoadingScreen from "./Screens/LoadingScreen";

/**
 * @returns The Main App
 */
export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <LoadingScreen />
    </>
  );
}
