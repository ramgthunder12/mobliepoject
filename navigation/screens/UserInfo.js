import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Button, Text, Card, Icon } from "@rneui/themed";
import { useRoute } from "@react-navigation/native";
import { AppContext } from "../../AppContext";
import axios from "axios";

export default function UserInfo({navigation}) {
  const route = useRoute();
  const { id } = route.params;
  /*프로필 이미지*/
  const [SelectedImage, setSelectedImage] = useState(null);
  const [TasteNotes, setTasteNotes] = useState([]); //테이스팅노트
  const { apiUrl } = useContext(AppContext); //전역변수
  const screenWidth = Dimensions.get("window").width; //화면 가로길이

  const [alcoholImage, setAlcoholImage] = useState({}); //alcoholId : url
  const [alcoholName, setAlcoholName] = useState({}); //alcoholId : name
  const [alcoholStar, setAlcoholStar] = useState({}); //alcoholId : name

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

  const getTastingNote = async () => {
    //자신의 노트 가져오기
    const url = apiUrl + "tastenote/" + id;//여기에 사용자 id 넣기

    try {
      const response = await axios.get(url);

      if (response.data) {
        const filteredNotes = response.data.filter((note) => note.open === "Y");
      setTasteNotes(filteredNotes);

        const promises = response.data.map(async (item) => {
          const num = parseInt(item.alcohol_number, 10);
          if (alcoholImage[num] === undefined) {
            const image = await imagePrint(num);
            setAlcoholImage((prevImage) => ({
              ...prevImage,
              [num]: image,
            }));
          }
        });
        await Promise.all(promises);
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log("error : " + error);
    }
  };

  const imagePrint = async (num) => {
    //노트 주류 사진 가져오기
    const url = apiUrl + "alcohols/" + num;

    try {
      const response = await axios.get(url);

      if (response.data && response.data.picture !== null) {
        setAlcoholName((prevImage) => ({
          ...prevImage,
          [num]: response.data.name,
        }));

        setAlcoholStar((prevImage) => ({
          ...prevImage,
          [num]: response.data.avgStar,
        }));

        return response.data.picture;
      } else {
        return null;
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log("error : " + error);
    }
  };

  useEffect(() => {
    //화면 돌아왔을 때
    getTastingNote();
  }, []);

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

        {/*테이스팅 노트 보여주기*/}
        <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              width: screenWidth,
            }}
          >
            {TasteNotes.map((note) => (
              <View
                key={note.tastenote_number}
                style={{
                  borderRadius: 15,
                  width: screenWidth / 2 - 20,
                  marginBottom: 10,
                  marginLeft: 10,
                  height: 250,
                  backgroundColor: "rgb(240,240,240)",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ViewTasteNote", {
                      note: note,
                      image: alcoholImage[note.alcohol_number],
                      name: alcoholName[note.alcohol_number],
                      avgStar: alcoholStar[note.alcohol_number],
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      position: "relative",
                    }}
                  >
                    <Image
                      source={{ uri: alcoholImage[note.alcohol_number] }}
                      style={{ height: 250, width: "100%" }}
                    />
                    {/* 여기서 테이스팅 노트의 정보를 표시할 수 있음 */}
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        padding: 10,
                      }}
                    >
                      {note.open === "N" ? (
                        <Icon
                          name="lock"
                          type="font-awesome"
                          size={30}
                          color="black"
                          style={{ right: 20 }}
                        />
                      ) : (
                        <Icon
                          name="unlock"
                          type="font-awesome"
                          size={30}
                          color="black"
                          style={{ right: 20 }}
                        />
                      )}
                      <View style={{backgroundColor: "rgba(230,230,230, 0.8)", borderRadius: 5, padding: 5}}>
                      <Text style={{ fontSize: 18 }}>
                        {alcoholName[note.alcohol_number]}{" "}
                      </Text>
                      <Text style={{ fontSize: 18 }}>{note.tastingDay}</Text>
                      </View>
                    </View>
                    {/* 추가 필요한 정보를 표시할 수 있음 */}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
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
