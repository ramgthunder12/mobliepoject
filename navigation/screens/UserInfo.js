import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, Icon } from "@rneui/themed";

export default function UserInfo() {
  const navigation = useNavigation();
  /*프로필 이미지*/
  const [SelectedImage, setSelectedImage] = useState(null);

  const showImage = () => {
    //이미지 출력
    if (SelectedImage) {
      return (
        <Image
          source={{ uri: SelectedImage }}
          style={{ width: "100%", height: "100%", borderRadius: 50 }}
        />
      );
    } else {
      return (
        <Image
          source={require("../../images/profile/defaultProfile.png")}
          style={{ width: "100%", height: "100%" }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/*프로필 상단*/}
        <View style={styles.titleView}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              margin: 10,
            }}>
              <Icon name="chevron-back" type="ionicon" size={30}/>
            </TouchableOpacity>
        </View>

        {/*프로필*/}
        <View style={styles.profileView}>
            <View
              style={{
                width: 70,
                height: 70,
                position: "relative",
                marginLeft: 15
              }}
            >
              {showImage()}
            </View>
          <View style={{flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: 70, marginLeft: 15,}}>
            <Text style={{fontSize: 27, fontWeight: "500"}}>닉네임</Text>
            <View style={{flexDirection: "row"}}>
              <Text style={{fontSize: 20, color: '#33cc33'}}>LV.1 </Text>
              <Text style={{fontSize: 20, }}>알콜프리 근데 취해</Text>
            </View>
          </View>
        </View>

        {/*테이스팅 노트*/}
          <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", margin: 20,}}>
            <Text style={{fontSize: 22,}}>테이스팅노트</Text>
            <Text style={{fontSize: 22,}}>0</Text>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 20, // 상단 여백 추가
  },
  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileView: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  penIconView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: -4,
    right: -4,
    margin: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
  },
});
