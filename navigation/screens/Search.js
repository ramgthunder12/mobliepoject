import React, { useState, useContext } from "react";
import {
  Keyboard,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SearchBar, Text, Icon } from "@rneui/themed";
import { AppContext } from "../../AppContext";
import axios from "axios";

export default function Search({ navigation }) {
  const [search, setSearch] = useState("");
  const { apiUrl } = useContext(AppContext); //전역변수
  const [alcohols, setAlcohols] = useState([]); //검색해서 나온 주류

  /********************주류 이름********************/
  const searchAlcoholName = async () => {//주류 이름 검색
    const url = apiUrl+"alcohols/";

    const data = {
      name: search
    };

    try {
      const response = await axios.post(url, data);

      if (response.data) {
        const res = response.data;
        setAlcohols(res);
      }
      console.log(response.data);
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      Alert.alert("알림", "해당 주류명이 목록에 존재하지 않습니다");
    }
  };
  /********************주류 이름********************/

  const handleMenuItemPress = (menuItem) => {//주류 상세정보 이동
    navigation.navigate("Detail", { alcohol: menuItem});
  };

  const imagePrint = (url) => {
    if (url === null) {
      return null;
    } else {
      return { uri: url };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, marginBottom: 30 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", borderWidth: 1, borderRadius: 10, padding: 5 }}>
          <Icon name="search" type="font-awesome" size={30} style={{marginLeft: 5}}/>
          <TextInput
              autoFocus={false}
              onChangeText={(text) => setSearch(text)}
              value={search}
              placeholder="주류명을 입력하세요..."
              style={{
                backgroundColor: "white",
                fontSize: 25,
                marginLeft: 10,
                marginRight: 30
              }}
            />
            </View>
            <TouchableOpacity onPress={() => searchAlcoholName()} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderRadius: 10, padding: 5, marginTop: -3, marginLeft: 10}}>
                <Text style={{fontSize: 25, fontWeight: "bold"}}>검색</Text>
            </TouchableOpacity>
        </View>

        {alcohols.map((menuItem) => (
            <View key={menuItem.alcoholNumber} style={{flexDirection: "row", justifyContent: "flex-start", marginBottom: 20, marginLeft: 20,}}>
            <TouchableOpacity
              onPress={() => {
                handleMenuItemPress(menuItem)/*이부분 수정 필요*/;
            }}
            
            >
              <View style={styles.menuItemContent}>
              <Image source={imagePrint(menuItem.picture)} style={styles.coverImage} />

                <View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
                  <Text style={{fontSize: 20, color: "black"}}>{menuItem.name}</Text>
                  <Text style={{fontSize: 20, color: "rgb(255,100,100)"}}>{`${menuItem.price}원`}</Text>
                  <Text style={{fontSize: 20, color: "black"}}>{`용량 : ${menuItem.volume}mL`}</Text>
                  <Text style={{fontSize: 20, color: "black"}}>{`도수 : ${menuItem.content}`}</Text>
                  <Text style={{fontSize: 20, color: "black"}}>{`별점 : ${menuItem.avgStar}`}</Text>
                </View>
              </View>
            </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingTop: -10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 0,
    marginTop: 20, // 상단 여백 추가
  },
  coverImage: {
    width: 100, // 큰 이미지 크기로 조절
    height: 170, // 큰 이미지 크기로 조절
    marginRight: 20,
  },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});