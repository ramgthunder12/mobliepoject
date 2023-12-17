import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button, Text } from "@rneui/themed";

export default function BarcodeScanMenu({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const requestCameraPermission = async () => {
    //카메라 권한 요청
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {//바코드 스캔 시  data = 바코드값
    setScanned(true);

    Alert.alert(
      `바코드 : ${data} 가 맞습니까?`,
      undefined,
      [
        {
          text: '취소',
          onPress: () => {
            setScanned(false);
          },
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            navigation.navigate("BarcodeDetail", { code: data });
          },
        },
      ]
    );
};

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
        <Button title={"다시 찍으시겠습니까?"} onPress={() => setScanned(false)} />
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
