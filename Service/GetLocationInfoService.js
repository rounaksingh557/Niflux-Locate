/**
 * @author Rounak Singh
 * @license MIT
 */

// Modules Import
import { useState, useEffect } from "react";
import * as Location from "expo-location";

// Files Import
import CameraAndDataScreen from "../Screens/CameraAndDataScreen";
import LoadingScreen from "../Screens/LoadingScreen";

/**
 * @returns React Component with GeoLocation Service.
 * @description Provides user a service of geolocation using reverse geocoding.
 */
export default function GetLocationInfoService() {
  // States Declaration
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [district, setDistrict] = useState(null);
  const [isoCountryCode, setIsoCountryCode] = useState(null);
  const [name, setName] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [region, setRegion] = useState(null);
  const [today, setToday] = useState(null);
  const [time, setTime] = useState(null);

  // Example of location fetched
  const LocationValue = {
    coords: {
      accuracy: 20.899999618530273,
      altitude: 580,
      altitudeAccuracy: 26.625600814819336,
      heading: 0,
      latitude: 23.2947586,
      longitude: 85.3237117,
      speed: 0,
    },
    mocked: false,
    timestamp: 1655520772594,
  };

  // Example of reverse geocoding output
  const fineLocation = {
    city: "Ranchi",
    country: "India",
    district: "Hesag",
    isoCountryCode: "IN",
    name: "78VF+WG9",
    postalCode: "834003",
    region: "Jharkhand",
    street: null,
    streetNumber: null,
    subregion: "Ranchi",
    timezone: null,
  };

  /**
   *
   * @param {*} arr the array to extract value from
   * @param {*} prop the value to be extracted
   * @returns the extracted value
   * @description take a array an then fetch value from the object inside the array
   */
  const extractValue = (arr, prop) => {
    let extractedValue = arr.map((item) => item[prop]);
    return extractedValue;
  }

  /**
   *
   * @param {*} time the time to be converted
   * @returns the converted time
   * @description converts the 24 hour format to 12 hour format
   */
  const tConvert = (time) => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };

  useEffect(() => {
    (async () => {
      // Permission Request
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Location Fetching
      let location = await Location.getCurrentPositionAsync({});

      let fixedLocation = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Extracting Values from fixed location
      const city = extractValue(fixedLocation, "city");
      const country = extractValue(fixedLocation, "country");
      const district = extractValue(fixedLocation, "district");
      const isoCountryCode = extractValue(fixedLocation, "isoCountryCode");
      const name = extractValue(fixedLocation, "name");
      const postalCode = extractValue(fixedLocation, "postalCode");
      const region = extractValue(fixedLocation, "region");

      // Fetching today's date and time
      let today = new Date().toLocaleDateString();
      let time = new Date().toLocaleTimeString();

      // Converting time format
      let convertedTo12HourFormatTime = tConvert(time);

      // Settings Values
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setCity(city);
      setCountry(country);
      setDistrict(district);
      setIsoCountryCode(isoCountryCode);
      setName(name);
      setPostalCode(postalCode);
      setRegion(region);
      setToday(today);
      setTime(convertedTo12HourFormatTime);
    })();
  }, []);

  if (latitude && longitude != null) {
    return (
      <CameraAndDataScreen
        latitude={latitude}
        longitude={longitude}
        city={city}
        country={country}
        district={district}
        isoCountryCode={isoCountryCode}
        name={name}
        region={region}
        postalCode={postalCode}
        Date={today}
        Time={time}
      />
    );
  } else {
    return <LoadingScreen />;
  }
}
