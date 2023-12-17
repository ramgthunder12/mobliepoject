import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../../AppContext";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text, Icon } from "@rneui/themed";
import ProgressBar from 'react-native-progress/Bar';
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

/*로그아웃, 뒤로가기*/

export default function MyPage({navigation}) {

  const [TasteNotes, setTasteNotes] = useState([]); //테이스팅노트
  const [alcoholImage, setAlcoholImage] = useState({}); //alcoholId : url
  const [alcoholName, setAlcoholName] = useState({}); //alcoholId : name
  const [alcoholStar, setAlcoholStar] = useState({}); //alcoholId : name

  /*프로필 이미지*/
  const [ImageHasPermission, setImageHasPermission] = useState(false);

  /*포인트 바*/
  const [pointProgress, setPointProgress] = useState(1);
  const minValue = 0;
  const maxValue = 15;
  const currentValue = 7; // 현재 값, 원하는 값으로 변경
  const progress = currentValue / maxValue;

  // 화면의 너비 가져오기
  const screenWidth = Dimensions.get('window').width;

  // ProgressBar의 원하는 너비 계산
  const progressBarWidth = screenWidth * 0.9;

  const { id, apiUrl, profileImage , setProfileImage, point, tastenote_num } = useContext(AppContext);//전역변수

  /*프로필 이미지*/
  const requestImagePermission = async () => {
    //이미지 접근 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setImageHasPermission(status === "granted");
    //alert('이미지 피커 권한이 필요합니다.');
  };

  const pickImage = async () => {
    //선택한 이미지 불러오기
    if (!ImageHasPermission) {
      requestImagePermission();
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImage = () => {
    //이미지 출력
    if (profileImage) {
      return (
        <Image
          source={{ uri: profileImage }}
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/*프로필 상단*/}
        <View style={styles.titleView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              marginTop: 5,
              marginLeft: 10,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 8,}}>
              <Icon name="chevron-back" type="ionicon" size={30}/>
            </TouchableOpacity>
            <Text style={{ fontSize: 30, fontWeight: "100", marginTop: 5, marginLeft: 5, }}>
              마이페이지
            </Text>
          </View>
          <TouchableOpacity style={{ margin: 15, marginRight: 15 }}>
            <Icon name="settings" type="feather" size={30} />
          </TouchableOpacity>
        </View>
        {/*프로필*/}
        <View style={styles.profileView}>
          <TouchableOpacity
            onPress={() => pickImage()}
            style={{ marginLeft: 15 }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                position: "relative",
              }}
            >
              {showImage()}
              <View style={styles.penIconView}>
                <Icon
                  name="pen"
                  type="font-awesome-5"
                  size={18}
                  color="#000000"
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: 70, marginLeft: 15,}}>
            <Text style={{fontSize: 27, fontWeight: "500"}}>닉네임</Text>
            <View style={{flexDirection: "row"}}>
              <Text style={{fontSize: 20, color: '#33cc33'}}>LV.1 </Text>
              <Text style={{fontSize: 20, }}>알콜프리 근데 취해</Text>
            </View>
          </View>
        </View>
        
        {/*포인트 바*/}
        <View style={{flexDirection: "row", justifyContent: "center", marginTop: 20,}}>
      <ProgressBar
        progress={progress}
        width={progressBarWidth} // 바의 너비
        height={10} // 바의 높이
        color="#00FF00" // 바의 색상
        unfilledColor="#fff" // 바의 비어있는 부분의 색상
        borderWidth={1} // 바의 테두리 두께
        borderColor="#000000" // 바의 테두리 색상
        borderRadius={10} // 바의 모서리 반경
      />
        </View>

        {/*나의 리뷰, 포인트, 테이스팅 노트 수*/}
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20}}>
            <Text style={{fontSize: 22,}}>{`포인트 : ${point}`}</Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10}}>
            <Text style={{fontSize: 22,}}>{`테이스팅노트 : ${tastenote_num} 개`}</Text>
          </View>

          {/*테이스팅노트*/}
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
    width: 130,
    borderRadius: 10,
    marginLeft: 15, 
  }
});