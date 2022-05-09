import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
const axios = require("axios").default;

export default function App() {
  const [location, setLocation] = useState(null);
  const [responseApi, setResponseApi] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const API_KEY = "8ba77e856b1563aa404795602d6c9abb";
  const API_URL = (lat, lon) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=fr`;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    location &&
      axios
        .get(API_URL(location.coords.latitude, location.coords.longitude))
        .then((response) => setResponseApi(response.data))
        .then(setLoading(!isLoading))
        .catch((err) => console.log("err :", err));
  }, [location]);

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#00ff00" />}
      {responseApi && (
        <>
          {console.log("responseApi icon :", responseApi)}
          <Text>Aujourd'hui!</Text>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {" "}
            {responseApi.name}{" "}
          </Text>
          <Text style={{ fontSize: 40 }}>
            {" "}
            {(responseApi.main.temp - 273.15).toFixed(1)} ° C
          </Text>
          <Text style={{ fontSize: 20 }}>
            {" "}
            {responseApi.weather[0].description}{" "}
          </Text>
          <Image
            source={{
              uri: `http://openweathermap.org/img/w/${responseApi.weather[0].icon}.png`,
            }}
            style={{ width: 150, height: 100 }}
          ></Image>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
