import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Header, Icon, Card, Button, Dialog } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Rating } from "react-native-ratings";

let buttonTitleLen; //느낌 버튼 길이
let TasteId = 0; //느낌 버튼 id

export default function WriteDownNote({ navigation }) {
  const [buttonText, setButtonText] = useState(""); //버튼 이름

  const [textInputSize, setTextInputSize] = useState({ width: 0 });//textinput 크기 (느낌 버튼이 들어가는지 구하기)
  const [showTextInput, setshowTextInput] = useState([]); //textinput 생성 및 삭제

  const [Tastes, setTastes] = useState([]); //느낌 버튼 배열
  const [TasteViews, setTasteViews] = useState([]); //느낌 버튼을 감싼 View

  const [pressedButtonIds, setPressedButtonIds] = useState([]);//느낌 버튼을 누른 버튼id

  const [DeleteTaste, setDeleteTaste] = useState(false); //느낌 버튼 삭제 Dialog

  const SaveNote = () => {
    //노트저장
    console.log("노트저장");
  };
  const NoteMenu = () => {
    //노트메뉴
    console.log("노트메뉴");
  };

  const addTaste = () => {
    //느낌추가
    const newTaste = {
      //새로운 버튼 추가
      id: TasteId,
      text: buttonText,
    }; //key겹침 해결해야됨

    const newTasteView = {
      //새로운 뷰 추가
      id: TasteViews.length,
    };

    if (buttonText.length === 0) {
      //이름 입력 안하면 종료
      //버튼이름길이 = 0
      setshowTextInput(showTextInput.slice(1)); //textinput 제거
      return;
    }

    buttonTitleLen += Math.floor(textInputSize.width);
    /*
    한글자 : 37 * 7 = 256
    두글자 : 43 * 5 = 215
    세글자 : 57 * 4
    네글자 : 70 * 3
    다섯글자 : 83 * 3 = 249
    여섯글자 : 96 * 3
    */
    if (
      buttonTitleLen > 264 ||
      TasteViews.length === 0
    ) {
      setTasteViews((prevViews) => [...prevViews, newTasteView]); //다음줄로 넘어가기
      setTastes((prevButtons) => {
        const newArray = [...prevButtons];
        let len;

        // 두 번째 차원 배열이 존재하지 않으면 초기화
        if (!newArray[TasteViews.length]) {
          newArray[TasteViews.length] = [];
          len = 0;
        } else len = Tastes[TasteViews.length].length;

        // 세 번째 차원 배열에 newTaste 추가
        newArray[TasteViews.length][len] = newTaste;

        return newArray;
      });

      setshowTextInput(showTextInput.slice(1)); //textinput 제거
      buttonTitleLen = Math.floor(textInputSize.width); //초기화
    } else {
      //버튼만 추가
      setTastes((prevButtons) => {
        const newArray = [...prevButtons];
        let len = Tastes[TasteViews.length - 1].length;

        // 세 번째 차원 배열에 newTaste 추가
        newArray[TasteViews.length - 1][len] = newTaste;

        return newArray;
      });
      setshowTextInput(showTextInput.slice(1)); //textinput 제거
    }

    setButtonText(""); //버튼 이름 초기화
    TasteId++; //버튼 id 증가
  };

  const writeTaste = () => {
    //버튼(느낌) 추가 전 textinput
    if (showTextInput.length === 0) {
      setshowTextInput([...showTextInput, { id: 1 }]);
    }
  };

  const handleTextInputLayout = (event) => {//textinput 크기 구하기
    const { width } = event.nativeEvent.layout;
    setTextInputSize({ width });
  };

  const handlePress = (buttonId) => {//느낌 버튼을 누른 버튼id
    // 토글 상태 변경
    setPressedButtonIds((prevPressedButtonIds) => {
      if (prevPressedButtonIds.includes(buttonId)) {
        // 이미 눌린 경우, 제거
        return prevPressedButtonIds.filter((id) => id !== buttonId);
      } else {
        // 눌리지 않은 경우, 추가
        return [...prevPressedButtonIds, buttonId];
      }
    });
  };

  const DeleteTasteDialogDown = () => {
    //느낌 버튼 삭제 Dialog 없애기
    setDeleteTaste(!DeleteTaste);
  };

  const ratingCompleted = (rating) => {
    //별점
    // console.log('Rating is: ' + rating);
  };

  useEffect(() => {
    // 페이지가 반환될 때 호출되는 로직을 여기에 작성
    buttonTitleLen = 0;
    //console.log('start');
    return () => {
      // Clean-up 함수 (Optional): 페이지가 반환될 때 호출되는 추가 작업
      buttonTitleLen = 0;
      //저장 후 종료 물어보기
      //console.log('end');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={NoteMenu}>
              <Icon name="menu" color="black" />
            </TouchableOpacity>
          </View>
        }
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={SaveNote}>
              <Text style={styles.headerSideText}>완료</Text>
            </TouchableOpacity>
          </View>
        }
        centerComponent={{ text: "주류이름", style: styles.heading }}
        backgroundColor="rgb(255,255,255)"
      />

      <ScrollView style={styles.scrollView}>
        <Card containerStyle={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={styles.cardTitleText}>느낌</Text>
            <TouchableOpacity onPress={writeTaste} style={{ marginTop: -5 }}>
              <Icon name="add-circle-outline" size={30} />
            </TouchableOpacity>
          </View>

          <Card.Divider />

          <View style={styles.tasteButtonView}>
            <View
              style={{ flexDirection: "column", justifyContent: "flex-start" }}
            >
              {TasteViews.map(
                (
                  views //느낌 버튼 추가
                ) => (
                  <View
                    key={views.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginBottom: 5,
                    }}
                  >
                    {Tastes[views.id].map((button) => (
                      <View key={button.id} style={{ marginRight: 5 }}>
                        <TouchableOpacity
                          onPress={() => handlePress(button.id)}
                          onLongPress={DeleteTasteDialogDown}
                          style={{
                            marginRight: 4,
                            backgroundColor: pressedButtonIds.includes(button.id) ? "rgb(230,230,230)" : "rgb(104,201,170)", // 배경색 설정
                            borderWidth: 1, // 테두리 두께 설정
                            borderColor: pressedButtonIds.includes(button.id) ? "rgb(230,230,230)" : "rgb(104,201,170)", // 테두리 색상 설정
                            borderRadius: 5, // 테두리의 둥근 정도 설정
                            padding: 2,
                            paddingLeft: 7,
                            paddingRight: 7,
                          }}
                        >
                          <Text style={{ fontSize: 20, color: "rgb(80,80,80)" }}>
                            {button.text}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )
              )}
            </View>
            <View style={{ flexDirection: 'row', }}>
            {showTextInput.map((textinput) => (
              <TextInput
                key={textinput.id}
                autoFocus={true}
                onLayout={handleTextInputLayout}
                onChangeText={(text) => setButtonText(text)}
                onEndEditing={() => addTaste()}
                style={{
                fontSize: 20, 
                backgroundColor: "rgb(104,201,170)",
                borderWidth: 1, 
                borderColor: "rgb(104,201,170)",
                borderRadius: 5,
                paddingLeft: 8,
                paddingRight: 8,}}
              />
            ))}
            </View>
          </View>
        </Card>

        <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
          <Text>별점</Text>
          <Rating
            showRating={true}
            minValue={1}
            fractions={2}
            jumpValue={0.1}
            onFinishRating={ratingCompleted}
            style={{ paddingVertical: 10 }}
          />
        </View>
      </ScrollView>

      {/* 버튼 삭제 Dialog */}
      <Dialog isVisible={DeleteTaste} onBackdropPress={DeleteTasteDialogDown}>
        <Dialog.Title title="를 삭제하시겠습니까?" />

        <Dialog.Actions>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Dialog.Button
              title="삭제"
              onPress={() => {
                DeleteTasteDialogDown();
              }}
            />
            <Dialog.Button title="취소" onPress={DeleteTasteDialogDown} />
          </View>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {},
  heading: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginRight: 5,
  },
  headerSideText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tasteButtonView: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});

/*
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function App() {
  const route = useRoute();
  const { id, otherParam } = route.params;

  return (
    <View style={styles.container}>
      <Text>{id}</Text>
      <Text>{otherParam}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
