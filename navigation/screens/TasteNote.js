import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from "react-native";
import { Button, Text, Card, Icon } from "@rneui/themed";
import { AppContext } from "../../AppContext";
import axios from "axios";

export default function Category({ navigation }) {
  const [TasteNotes, setTasteNotes] = useState([]); //테이스팅노트
  const { apiUrl, id } = useContext(AppContext); //전역변수
  const screenWidth = Dimensions.get("window").width; //화면 가로길이
  const [alcoholImage, setAlcoholImage] = useState({});//alcoholId : url
  const [drinkName, setDrinkName] = useState([]);


  const getTastingNote = async () => {//자신의 노트 가져오기
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
          if (drinkName[num] === undefined) {
            const name = await getDrinkName(num);
            setDrinkName((prevNames) => ({
              ...prevNames,
              [num]: name,
            }));
          }
        });

        await Promise.all(promises);
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log('error : ' + error);
    }
  };

  const imagePrint = async (num) => {//노트 주류 사진 가져오기
    const url = apiUrl + "alcohols/" + num;

    try {
      const response = await axios.get(url);

      if (response.data && response.data.picture !== null) {
        return response.data.picture;
      }
      else {
        return null;
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log('error : ' + error);
    }
  };

  useEffect(() => {
    getTastingNote();
  }, []);

  const getDrinkName = async (num) => {
    const url = apiUrl + "alcohols/" + num;

    try {
      const response = await axios.get(url);

      if (response.data && response.data.name !== null) {
        return response.data.name;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error fetching drink name:', error);
    }
  };


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
          <View style={{ flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", width: screenWidth }}>
            {/*자신의 테이스팅 노트*/}
            {TasteNotes.map((note) => (
              <View key={note.tastenote_number} style={{ borderRadius: 15, width: screenWidth / 2 - 20, marginBottom: 10, marginLeft: 10, height: 250, backgroundColor: "rgb(240,240,240)" }}>
                <TouchableOpacity onPress={() => navigation.navigate('ViewTasteNote', { note: note })}>
                  <ImageBackground
                    source={{ uri: alcoholImage[note.alcohol_number] }}
                    style={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      height: 248,
                      width: 190
                    }}
                  >
                    {/* 여기서 테이스팅 노트의 정보를 표시할 수 있음 */}
                    <Text> 주류명 : {drinkName[note.alcohol_number]} </Text>
                    <Text> 기록날짜 : {note.tastingDay}</Text>
                    <Text> 주류번호 : {note.alcohol_number}</Text>
                    <Text> 조회수 : 0</Text>
                    {/* 추가 필요한 정보를 표시할 수 있음 */}
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            ))}

            {/*테이스팅 노트 작성하기*/}
            <View style={{ height: 200 }}>
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
    backgroundColor: "rgb(230,230,230)",
    height: "100%",
    width: Dimensions.get("window").width / 2 - 20,
    borderRadius: 15,
    marginLeft: 10,
  },
});