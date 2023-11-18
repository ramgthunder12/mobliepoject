import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Header, Icon, Card, Button, Dialog } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Rating } from "react-native-ratings";

let TasteId = 0; //느낌 버튼 id

export default function WriteDownNote({ navigation }) {
  const [buttonText, setButtonText] = useState(""); //버튼 이름

  const [showTextInput, setshowTextInput] = useState([]); //textinput 생성 및 삭제

  const [Tastes, setTastes] = useState([]); //느낌 버튼 배열
  const [pressedButtonIds, setPressedButtonIds] = useState([]); //느낌 버튼을 누른 버튼id

  const [DeleteTaste, setDeleteTaste] = useState(false); //느낌 버튼 삭제 Dialog on/off
  const [DeleteTasteId, setDeleteTasteId] = useState({ bId: 0 }); //삭제 시 느낌 버튼 id

  const [ratingValue, setRatingValue] = useState(3); //별점 구하기

  const [memoExpanded, setMemoExpanded] = useState(false); //메모 기능 활성화
  const memoHeightValue = useRef(new Animated.Value(0)).current; //메모 기능 확장 애니메이션
  const [memoText, setMemoText] = useState("");//메모 내용

  const SaveNote = () => {
    //노트저장
    console.log("노트저장");
  };
  const NoteExit = () => {
    //노트메뉴
    console.log("노트메뉴");
  };

  const addTaste = () => {
    //느낌추가
    const newTaste = {
      //새로운 버튼 추가
      id: TasteId,
      text: buttonText,
    };

    if (buttonText.length === 0) {
      //이름 입력 안하면 종료
      setshowTextInput(showTextInput.slice(1)); //textinput 제거
      return;
    }

    setTastes((prevTastes) => [...prevTastes, newTaste]); //느낌 버튼 추가
    TasteId++; //버튼 id 증가

    setshowTextInput(showTextInput.slice(1)); //textinput 제거
    setButtonText(""); //버튼 이름 초기화
  };

  const writeTaste = () => {
    //버튼(느낌) 추가 전 textinput
    if (showTextInput.length === 0) {
      setshowTextInput([...showTextInput, { id: 1 }]);
    }
  };

  const handlePress = (buttonId) => {
    //느낌 버튼을 누른 버튼id
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

  const DeleteTasteDialog = (bId) => {
    //느낌 버튼 삭제 Dialog on/off
    setDeleteTasteId({ bId });
    setDeleteTaste(!DeleteTaste);
  };

  const DeleteTasteBtn = () => {
    //느낌 버튼 삭제하기
    const updatedTastes = Tastes.filter(
      (taste) => taste.id !== DeleteTasteId.bId
    );
    setTastes(updatedTastes);
    setDeleteTaste(!DeleteTaste);
  };

  const ratingCompleted = (rating) => {
    //별점
    if (ratingValue !== rating) {
      setRatingValue(rating);
    }
  };

  const handleMemoAnimate = () => {
    //메모 창 내려가는 Animated
    Animated.timing(memoHeightValue, {
      toValue: memoExpanded ? 0 : 160, // Adjust the desired expanded height
      duration: 500, // Adjust the animation duration
      useNativeDriver: false,
    }).start();

    setMemoExpanded((prev) => !prev);
  };

  useEffect(() => {
    //console.log('start');

    const TasteData = [
      { id: 0, text: "아몬드" },
      { id: 1, text: "딸기" },
      { id: 2, text: "귤" },
      { id: 3, text: "레몬" },
      { id: 4, text: "사과" },
    ];

    TasteData.forEach((taste) => {
      setTastes((prevTastes) => [...prevTastes, taste]); //느낌 버튼 추가
      TasteId++; //버튼 id 증가
    });

    return () => {
      setDeleteTaste(false);
      //저장 후 종료 물어보기
      //console.log('end');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={NoteExit}>
              <Icon name="chevron-left" color="black" size={30} />
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
        centerComponent={{ text: "테이스팅 노트", style: styles.heading }}
        backgroundColor="rgb(255,255,255)"
      />

      <ScrollView style={styles.scrollView}>
        {/*느낌*/}
        <Card.Divider style={{marginTop: 20, }}/>
        <View style={styles.noteTitleView}>
          <Text style={styles.noteTitleText}>어떤 느낌이었나요?</Text>
        </View>
        <Card containerStyle={{ marginTop: 10 }}>
          <View style={styles.tasteButtonView}>
            {Tastes.map((button) => (
              <View key={button.id} style={{ marginRight: 5, marginBottom: 5 }}>
                <TouchableOpacity
                  onPress={() => handlePress(button.id)}
                  onLongPress={() => DeleteTasteDialog(button.id)}
                  style={[
                    styles.tasteTouchableOpacity,
                    {
                      backgroundColor: pressedButtonIds.includes(button.id)
                        ? "rgb(230,230,230)"
                        : "rgb(104,201,170)", // 배경색 설정
                      borderColor: pressedButtonIds.includes(button.id)
                        ? "rgb(230,230,230)"
                        : "rgb(104,201,170)", // 테두리 색상 설정
                    },
                  ]}
                >
                  <Text style={{ fontSize: 20, color: "rgb(80,80,80)" }}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {showTextInput.map((textinput) => (
              <TextInput
                key={textinput.id}
                autoFocus={true}
                multiline
                maxLength={10}
                onChangeText={(text) => setButtonText(text)}
                onEndEditing={() => addTaste()}
                style={styles.tasteTextInput}
              />
            ))}
            <TouchableOpacity onPress={writeTaste}>
              <Icon name="add-circle-outline" color="rgb(150,150,150)" size={30} />
            </TouchableOpacity>
          </View>
        </Card>

        {/*별점 선택*/}
        <Card.Divider style={{marginTop: 20, }}/>
        <View style={styles.noteTitleView}>
          <Text style={styles.noteTitleText}>별점을 선택해주세요</Text>
        </View>
        <Rating
          startingValue={3}
          onFinishRating={(rating) => ratingCompleted(rating)}
          style={{ paddingVertical: 10 }}
        />

        {/*메모*/}
        <Card.Divider style={{marginTop: 10, }}/>
        <View style={styles.noteExpandView}>
          <View style={styles.noteExpandTitle}>
            <Text style={[styles.noteTitleText, {marginLeft: 20, marginTop: -2, }]}>메모 작성하기</Text>
            <TouchableOpacity onPress={handleMemoAnimate} style={{marginRight: 10, marginTop: -5, }}>
              <Icon name="chevron-right" color="black" size={30} />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{ height: memoHeightValue, width: '100%', overflow: "hidden", /*borderWidth: 1,*/ }}
          >
            <Card containerStyle={{ marginTop: 10, }}>
              <View style={{flexDirection: "row",
    justifyContent: "flex-start", }}>
              <TextInput
                editable
                multiline
                numberOfLines={5}
                maxLength={1000}
                onEndEditing={(event) => setMemoText(event.nativeEvent.text)}
                defaultValue={memoText}
                style={{ fontSize: 20, textAlignVertical: 'top', textAlign: 'left', width: '100%', }}
              />
              </View>
            </Card>
          </Animated.View>
        </View>

        {/*첫 향 */}
        <Card.Divider style={{marginTop: 10, }}/>
      </ScrollView>

      {/* 버튼 삭제 Dialog */}
      <Dialog
        isVisible={DeleteTaste}
        onBackdropPress={() => DeleteTasteDialog(0)}
      >
        <Dialog.Title
          title={`${Tastes[DeleteTasteId.bId]?.text}를 삭제하시겠습니까?`}
        />

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
                DeleteTasteBtn();
              }}
            />
            <Dialog.Button title="취소" onPress={() => DeleteTasteDialog(0)} />
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
  scrollView: {
    backgroundColor: "white",
  },
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
  noteTitleView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  noteTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tasteButtonView: {
    flexDirection: "row",
    flexWrap: "wrap", //자동확장
    justifyContent: "flex-start",
  },
  tasteTouchableOpacity: {
    marginRight: 4,
    borderWidth: 1, // 테두리 두께 설정
    borderRadius: 5, // 테두리의 둥근 정도 설정
    padding: 2,
    paddingLeft: 7,
    paddingRight: 7,
  },
  tasteTextInput: {
    fontSize: 20,
    backgroundColor: "rgb(104,201,170)",
    borderWidth: 1,
    borderColor: "rgb(104,201,170)",
    color: "rgb(80,80,80)",
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    marginRight: 4,
  },
  noteExpandView: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  noteExpandTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
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
