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
import { useRoute, useIsFocused } from "@react-navigation/native";
import { AppContext } from "../../AppContext";
import axios from "axios";

export default function Category({ navigation }) {
  const [TasteNotes, setTasteNotes] = useState([]); //테이스팅노트
  const { apiUrl, id } = useContext(AppContext); //전역변수
  const route = useRoute();
  const isFocused = useIsFocused(); //navigation.goBack으로 화면 돌아왔을 때 호출
  const screenWidth = Dimensions.get("window").width; //화면 가로길이
  const [alcoholImage, setAlcoholImage] = useState({}); //alcoholId : url
  const [alcoholName, setAlcoholName] = useState({}); //alcoholId : name
  const [alcoholStar, setAlcoholStar] = useState({}); //alcoholId : name

  const getTastingNote = async () => {
    //자신의 노트 가져오기
    const url = apiUrl + "tastenote/" + id;

    try {
      const response = await axios.get(url);

      if (response.data) {
        setTasteNotes(response.data);

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
    console.log("새로고침");
  }, [isFocused]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../images/menuicons/note_focus.png")}
            style={{ width: 25, height: 25, marginRight: 10, margin: 10 }}
          />
          <Text style={styles.headerText}>테이스팅 노트</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "white" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              width: screenWidth,
            }}
          >
            {/*자신의 테이스팅 노트*/}
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

            {/*테이스팅 노트 작성하기*/}
            <View style={{ height: 250 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("WriteDownNote", { alcoholId: 1 })
                }
              >
                <View style={styles.addTasteNoteView}>
                  <Icon
                    name="pluscircleo"
                    type="antdesign"
                    size={30}
                    color="rgb(255,255,255)"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 10,
  },
  headerText: {
    fontSize: 30,
    marginTop: 5,
  },
  addTasteNoteView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(240,240,240)",
    height: "100%",
    width: Dimensions.get("window").width / 2 - 20,
    borderRadius: 15,
    marginLeft: 10,
  },
});
