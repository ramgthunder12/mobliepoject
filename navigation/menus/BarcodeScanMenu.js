import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button, Text } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native"; // useNavigation 추가

export default function BarcodeScanMenu() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation(); // useNavigation 호출

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    // 바코드 인식 후 해당 주류 화면 전환
    /*
    if (data === "8712000900045") {
      navigation.navigate("Detail", { alcohol_number: data });
    }

    if (data === "5140228234258") {
      navigation.navigate("Detail", { alcohol_number: data });
    }

    if (data === "5740700987502") {
      navigation.navigate("Detail", { alcohol_number: data });
    }

    if (data === "8801021213217") {
      navigation.navigate("Detail", { alcohol_number: data });
    }

    if (data === "786150000236") {
      navigation.navigate("Detail", { alcohol_number: data });
    }
  };
  */

    if (hasPermission === null) {
      return (
        <View style={styles.container}>
          <Text>카메라 권한을 설정해야 합니다</Text>
          <Button title="카메라 권한 요청" onPress={requestCameraPermission} />
        </View>
      );
    }
    if (hasPermission === false) {
      return (
        <View style={styles.container}>
          <Text>카메라 권한이 없습니다</Text>
          <Button title="카메라 권한 요청" onPress={requestCameraPermission} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={StyleSheet.absoluteFillObject}>
          <Text style={{
            fontSize: 30,
            fontWeight: "bold",
            position: "absolute",
            top: 70,
            right: (windowWidth - 150) / 2,
          }}
          >
            바코드를 찍어주세요
          </Text>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ flex: 1 }}
          />
          <Image
            source={require("../../images/barcodescan/barcodescan.png")}
            style={{
              width: 200,
              height: 200,
              position: "absolute",
              top: (windowHeight - 200) / 2,
              right: (windowWidth - 200) / 2,
            }}
          />
        </View>
        {scanned && (
          <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
    },
  });
}
