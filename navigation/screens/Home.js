import "react-native-gesture-handler";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Card,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Tab, TabView } from "@rneui/themed";
import { AppContext } from "../../AppContext";
import axios from "axios";


function MenuSeparator() {
  return <View style={styles.menuSeparator} />;
}

export default function Home({ navigation }) {
  const [index, setIndex] = useState(0);//이름순, 별점순, 리뷰 많은 순
  const [CategoryIndex, setCategoryIndex] = useState(0);//카테고리
  const [menuCategory, setMenuCategory] = useState([
    "전체",
    "맥주",
    "리큐르",
    "와인",
    "막걸리",
    "위스키",
  ]);

  const [beers, setBeers] = useState([]); //맥주
  const [liqueurs, setLiqueurs] = useState([]); //리큐르
  const [wines, setWines] = useState([]); //와인
  const [makgeollis, setMakgeollis] = useState([]); //막걸리
  const [whiskeys, setWhiskeys] = useState([]); //위스키
  const [alcohols, setAlcohols] = useState([]); //모든 주류
  /*
  데이터 형태
  {
        "alcoholNumber": 2,
        "name": "깔루아 리큐르",
        "barcode": "0010",
        "category": "리큐르",
        "volume": "700",
        "price": "28000",
        "content": 20,
        "avgStar": 4.6,
        "ibu": null,
        "tasteDetail": null,
        "taste": "다크 초콜릿, 바닐라, 커피",
        "aroma": "바닐라, 초콜릿, 커피",
        "detail": null
    },

  */

  const { profileImage, apiUrl } = useContext(AppContext); //전역변수

  const getAllAlcohols = async () => {
    const url = apiUrl + "alcohols/";

    try {
      const response = await axios.get(url);

      if (response.data) {
        const allAlcohols = response.data;

        setAlcohols(allAlcohols);//전체 입력

        // 카테고리에 따라 분류된 배열 생성
        const beers = allAlcohols.filter(
          (alcohol) => alcohol.category === "맥주"
        );
        const liqueurs = allAlcohols.filter(
          (alcohol) => alcohol.category === "리큐르"
        );
        const wines = allAlcohols.filter(
          (alcohol) => alcohol.category === "와인"
        );
        const makgeollis = allAlcohols.filter(
          (alcohol) => alcohol.category === "막걸리"
        );
        const whiskeys = allAlcohols.filter(
          (alcohol) => alcohol.category === "위스키"
        );

        // 상태 업데이트
        setBeers(beers);
        setLiqueurs(liqueurs);
        setWines(wines);
        setMakgeollis(makgeollis);
        setWhiskeys(whiskeys);
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log(error);
    }
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const handleMenuItemPress = (menuItem) => {
    navigation.navigate("Detail", { alcohol: menuItem });
  };

  const handleAdditionalMenuPress = (menuIndex) => {
    setCategoryIndex(menuIndex);
  };

  const handleItemsToSortName = (array) => {//이름순 정렬
    let itemsToSort = array;
    itemsToSort.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    return itemsToSort;
  };

  const handleItemsToSortStar = (array) => {//별점순 정렬
    let itemsToSort = array;
    itemsToSort.sort((a, b) => {
      return b.avgStar - a.avgStar;
    });
    return itemsToSort;
  };

  const getMenuItems = () => {
    switch (index) {
      case 0://이름순
        if (CategoryIndex === 0) {//전체
          return handleItemsToSortName(alcohols);
        } else if (CategoryIndex === 1) {//맥주
          return handleItemsToSortName(beers);
        } else if (CategoryIndex === 2) {//리큐르
          return handleItemsToSortName(liqueurs);
        } else if (CategoryIndex === 3) {//와인
          return handleItemsToSortName(wines);
        } else if (CategoryIndex === 4) {//막걸리
          return handleItemsToSortName(makgeollis);
        } else if (CategoryIndex === 5) {//위스키
          return handleItemsToSortName(whiskeys);
        }
      case 1://별점순
        if (CategoryIndex === 0) {//전체
          return handleItemsToSortStar(alcohols);
        } else if (CategoryIndex === 1) {//맥주
          return handleItemsToSortStar(beers);
        } else if (CategoryIndex === 2) {//리큐르
          return handleItemsToSortStar(liqueurs);
        } else if (CategoryIndex === 3) {//와인
          return handleItemsToSortStar(wines);
        } else if (CategoryIndex === 4) {//막걸리
          return handleItemsToSortStar(makgeollis);
        } else if (CategoryIndex === 5) {//위스키
          return handleItemsToSortStar(whiskeys);
        }
      case 2://리뷰순
        if (CategoryIndex === 0) {//전체
          return alcohols;
        } else if (CategoryIndex === 1) {//맥주
          return beers;
        } else if (CategoryIndex === 2) {//리큐르
          return liqueurs;
        } else if (CategoryIndex === 3) {//와인
          return wines;
        } else if (CategoryIndex === 4) {//막걸리
          return makgeollis;
        } else if (CategoryIndex === 5) {//위스키
          return whiskeys;
        }

      default:
        return [];
    }
  };

  const showImage = () => {
    //이미지 출력
    if (profileImage) {
      return (
        <Image
          source={{ uri: profileImage }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
            marginTop: 10,
            borderRadius: 50,
          }}
        />
      );
    } else {
      return (
        <Image
          source={require("../../images/profile/defaultProfile.png")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
            marginTop: 10,
          }}
        />
      );
    }
  };

  const imagePrint = (url) => {
    if (url === null) {
      return null;
    } else {
      return { uri: url };
    }
  };


  useEffect(() => {
    getAllAlcohols();

    return () => { };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.headerText}>첫술</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyPage")}
            style={{ margin: 5 }}
          >
            {showImage()}
          </TouchableOpacity>
        </View>

        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          variant="primary"
          style={{ backgroundColor: "#A0C843", height: 70 }}
          indicatorStyle={{ backgroundColor: "transparent" }}
        >
          <Tab.Item
            title="이름 순"
            containerStyle={(active) => ({
              backgroundColor: active ? "green" : undefined,
            })}
            icon={{ name: "timer", type: "ionicon", color: "white" }}
          />
          <Tab.Item
            title="별점 순"
            containerStyle={(active) => ({
              backgroundColor: active ? "green" : undefined,
            })}
            icon={{ name: "star", type: "ionicon", color: "white" }}
          />
          <Tab.Item
            title="리뷰 많은 순위"
            containerStyle={(active) => ({
              backgroundColor: active ? "green" : undefined,
            })}
            icon={{ name: "cart", type: "ionicon", color: "white" }}
          />
        </Tab>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.additionalMenu}>
            {menuCategory.map((menu, menuIndex) => (
              <TouchableOpacity
                key={menuIndex}
                onPress={() => handleAdditionalMenuPress(menuIndex)}
              >
                <Text
                  style={[
                    styles.additionalMenuText,
                    {
                      color:
                        menuIndex === CategoryIndex ? "green" : "black",
                    },
                  ]}
                >
                  {menu}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView style={styles.scrollView}>
          <MenuSeparator />

          {/*
  데이터 형태
  {
        "alcoholNumber": 2,
        "name": "깔루아 리큐르",
        "barcode": "0010",
        "category": "리큐르",
        "volume": "700",
        "price": "28000",
        "content": 20,
        "avgStar": 4.6,
        "ibu": null,
        "tasteDetail": null,
        "taste": "다크 초콜릿, 바닐라, 커피",
        "aroma": "바닐라, 초콜릿, 커피",
        "detail": null
    },

  */}


          {getMenuItems().map((menuItem) => (
            <View key={menuItem.alcoholNumber} style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 20, marginLeft: 20, }}>
              <TouchableOpacity
                onPress={() => {
                  handleMenuItemPress(menuItem)/*이부분 수정 필요*/;
                }}

              >
                <View style={styles.menuItemContent}>
                  <Image source={imagePrint(menuItem.picture)} style={styles.coverImage} />

                  <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 20, color: "black" }}>{menuItem.name}</Text>
                    <Text style={{ fontSize: 20, color: "rgb(255,100,100)" }}>{`${menuItem.price}원`}</Text>
                    <Text style={{ fontSize: 20, color: "black" }}>{`용량 : ${menuItem.volume}mL`}</Text>
                    <Text style={{ fontSize: 20, color: "black" }}>{`도수 : ${menuItem.content}`}</Text>
                    <Text style={{ fontSize: 20, color: "black" }}>{`별점 : ${menuItem.avgStar}`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}

          <MenuSeparator />
        </ScrollView>
      </ScrollView>
      <StatusBar style="auto" />
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
  headerText: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
    alignItems: "flex-start",
    marginTop: 0,
  },
  additionalText: {
    fontSize: 20,
    marginBottom: 20,
    color: "gray",
  },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  coverImage: {
    width: 100, // 큰 이미지 크기로 조절
    height: 170, // 큰 이미지 크기로 조절
    marginRight: 20,
  },
  tab: {
    backgroundColor: "#A0C843",
    height: 40,
    marginBottom: -70, // Tab의 높이를 작은 값으로 조절
  },

  menuSeparator: {
    height: 10,
  },
  additionalMenu: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    marginTop: 10, // Tab 바로 아래로 이동시키기 위한 marginTop 추가
  },
  additionalMenuText: {
    fontSize: 20,
    marginRight: 10,
  },
});