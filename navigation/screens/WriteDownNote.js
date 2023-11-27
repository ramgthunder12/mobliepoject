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
let ScentId = 0; //첫향 버튼 id

export default function WriteDownNote({ navigation }) {
  const [buttonText, setButtonText] = useState(""); //버튼 이름

  /*느낌 */
  const [showTasteTextInput, setshowTasteTextInput] = useState([]); //textinput 생성 및 삭제
  const [Tastes, setTastes] = useState([]); //느낌 버튼 배열
  const [pressedTasteIds, setPressedTasteIds] = useState([]); //느낌 버튼을 누른 버튼id
  const [DeleteTaste, setDeleteTaste] = useState(false); //느낌 버튼 삭제 Dialog on/off
  const [DeleteTasteId, setDeleteTasteId] = useState({ bId: 0 }); //삭제 시 느낌 버튼 id

  /*별점 */
  const [ratingValue, setRatingValue] = useState(3); //별점 구하기

  /*메모 */
  const [memoExpanded, setMemoExpanded] = useState(false); //메모 기능 활성화
  const memoHeightValue = useRef(new Animated.Value(0)).current; //메모 기능 확장 애니메이션
  const [memoText, setMemoText] = useState(""); //메모 내용

  /*첫향 : 노즈 */
  const [ScentExpanded, setScentExpanded] = useState(false); //첫향 기능 활성화
  const ScentHeightValue = useRef(new Animated.Value(0)).current; //첫향 기능 확장 애니메이션
  const [showScentTextInput, setshowScentTextInput] = useState([]); //textinput 생성 및 삭제
  const [Scents, setScents] = useState([]); //첫향 버튼 배열
  const [pressedScentIds, setPressedScentIds] = useState([]); //첫향 버튼을 누른 버튼id
  const [DeleteScent, setDeleteScent] = useState(false); //첫향 버튼 삭제 Dialog on/off
  const [DeleteScentId, setDeleteScentId] = useState({ bId: 0 }); //삭제 시 첫향 버튼 id

  const SaveNote = () => {
    //노트저장
    console.log("노트저장");
    navigation.goBack();
  };
  const NoteExit = () => {
    //노트 나가기
    navigation.goBack();
  };

  /********************느낌********************/
  const addTaste = () => {
    //느낌추가
    const newTaste = {
      //새로운 버튼 추가
      id: TasteId,
      text: buttonText,
    };

    if (buttonText.length === 0) {
      //이름 입력 안하면 종료
      setshowTasteTextInput(showTasteTextInput.slice(1)); //textinput 제거
      return;
    }

    setTastes((prevTastes) => [...prevTastes, newTaste]); //느낌 버튼 추가
    TasteId++; //버튼 id 증가

    setshowTasteTextInput(showTasteTextInput.slice(1)); //textinput 제거
    setButtonText(""); //버튼 이름 초기화
  };

  const writeTaste = () => {
    //버튼(느낌) 추가 전 textinput
    if (showTasteTextInput.length === 0) {
      setshowTasteTextInput([...showTasteTextInput, { id: 1 }]);
    }
  };

  const handlePressTaste = (buttonId) => {
    //느낌 버튼을 누른 버튼id
    // 토글 상태 변경
    setPressedTasteIds((prevPressedButtonIds) => {
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
  /********************느낌********************/

  /********************별점********************/
  const ratingCompleted = (rating) => {
    //별점
    if (ratingValue !== rating) {
      setRatingValue(rating);
    }
  };
  /********************별점********************/

  /********************메모********************/
  const handleMemoAnimate = () => {
    //메모 창 내려가는 Animated
    Animated.timing(memoHeightValue, {
      toValue: memoExpanded ? 0 : 160, // Adjust the desired expanded height
      duration: 500, // Adjust the animation duration
      useNativeDriver: false,
    }).start();

    setMemoExpanded((prev) => !prev);
  };
  /********************메모********************/

  /********************첫향********************/
  const handleScentAnimate = () => {
    //첫 향 창 내려가는 Animated
    Animated.parallel([//여러 애니메이션 동시 적용
      Animated.timing(ScentHeightValue, {
        toValue: ScentExpanded ? 10 : 150, // Adjust the desired expanded height
        duration: 500, // Adjust the animation duration
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 모든 애니메이션이 완료된 후 실행되는 콜백
    });

    setScentExpanded((prev) => !prev);
  };

  const addScent = () => {
    //느낌추가
    const newScent = {
      //새로운 버튼 추가
      id: ScentId,
      text: buttonText,
    };

    if (buttonText.length === 0) {
      //이름 입력 안하면 종료
      setshowScentTextInput(showScentTextInput.slice(1)); //textinput 제거
      return;
    }

    setScents((prevScents) => [...prevScents, newScent]); //느낌 버튼 추가
    ScentId++; //버튼 id 증가

    setshowScentTextInput(showScentTextInput.slice(1)); //textinput 제거
    setButtonText(""); //버튼 이름 초기화
  };

  const writeScent = () => {
    //버튼(느낌) 추가 전 textinput
    if (showScentTextInput.length === 0) {
      setshowScentTextInput([...showScentTextInput, { id: 1 }]);
    }
  };

  const handlePressScent = (buttonId) => {
    //느낌 버튼을 누른 버튼id
    // 토글 상태 변경
    setPressedScentIds((prevPressedButtonIds) => {
      if (prevPressedButtonIds.includes(buttonId)) {
        // 이미 눌린 경우, 제거
        return prevPressedButtonIds.filter((id) => id !== buttonId);
      } else {
        // 눌리지 않은 경우, 추가
        return [...prevPressedButtonIds, buttonId];
      }
    });
  };

  const DeleteScentDialog = (bId) => {
    //느낌 버튼 삭제 Dialog on/off
    setDeleteScentId({ bId });
    setDeleteScent(!DeleteScent);
  };

  const DeleteScentBtn = () => {
    //느낌 버튼 삭제하기
    const updatedScents = Scents.filter(
      (Scent) => Scent.id !== DeleteScentId.bId
    );
    setScents(updatedScents);
    setDeleteScent(!DeleteScent);
  };
  /********************첫향********************/

  useEffect(() => {
    /*느낌 초기화 */
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

    /*첫향 초기화 */
    const ScentData = [
      { id: 0, text: "아몬드" },
      { id: 1, text: "딸기" },
      { id: 2, text: "귤" },
      { id: 3, text: "레몬" },
      { id: 4, text: "사과" },
    ];

    ScentData.forEach((Scent) => {
      setScents((prevScents) => [...prevScents, Scent]); //느낌 버튼 추가
      ScentId++; //버튼 id 증가
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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/********************느낌********************/}
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={styles.noteTitleView}>
          <Text style={styles.noteTitleText}>어떤 느낌이었나요?</Text>
        </View>
        <Card containerStyle={{ marginTop: 10 }}>
          <View style={styles.tasteButtonView}>
            {Tastes.map((button) => (
              <View key={button.id} style={{ marginRight: 5, marginBottom: 5 }}>
                <TouchableOpacity
                  onPress={() => handlePressTaste(button.id)}
                  onLongPress={() => DeleteTasteDialog(button.id)}
                  style={[
                    styles.tasteTouchableOpacity,
                    {
                      backgroundColor: pressedTasteIds.includes(button.id)
                        ? "rgb(230,230,230)"
                        : "#C3CF53", // 배경색 설정
                      borderColor: pressedTasteIds.includes(button.id)
                        ? "rgb(230,230,230)"
                        : "#C3CF53", // 테두리 색상 설정
                    },
                  ]}
                >
                  <Text style={{ fontSize: 20, color: "rgb(80,80,80)" }}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {showTasteTextInput.map((textinput) => (
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
              <Icon
                name="add-circle-outline"
                color="rgb(150,150,150)"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/********************별점********************/}
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={styles.noteTitleView}>
          <Text style={styles.noteTitleText}>별점을 선택해주세요</Text>
        </View>
        <Rating
          startingValue={3}
          onFinishRating={(rating) => ratingCompleted(rating)}
          style={{ paddingVertical: 10 }}
        />

        {/********************메모********************/}
        <Card.Divider style={{ marginTop: 10 }} />
        <View style={styles.noteExpandView}>
          <View style={styles.noteExpandTitle}>
            <Text
              style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
            >
              메모 작성하기
            </Text>
            <TouchableOpacity
              onPress={handleMemoAnimate}
              style={{ marginRight: 10, marginTop: -5 }}
            >
              <Icon name="chevron-right" color="black" size={30} />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              height: memoHeightValue,
              width: "100%",
              overflow: "hidden" /*borderWidth: 1,*/,
            }}
          >
            <Card containerStyle={{ marginTop: 10 }}>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <TextInput
                  editable
                  multiline
                  numberOfLines={5}
                  maxLength={1000}
                  onEndEditing={(event) => setMemoText(event.nativeEvent.text)}
                  defaultValue={memoText}
                  style={{
                    fontSize: 20,
                    textAlignVertical: "top",
                    textAlign: "left",
                    width: "100%",
                  }}
                />
              </View>
            </Card>
          </Animated.View>
        </View>

        {/********************첫향********************/}
        <Card.Divider style={{ marginTop: 10 }} />
        <View style={styles.noteExpandView}>
          <View style={styles.noteExpandTitle}>
            <Text
              style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
            >
              첫 향 : 노즈
            </Text>
            <TouchableOpacity
              onPress={handleScentAnimate}
              style={{ marginRight: 10, marginTop: -5 }}
            >
              <Icon name="chevron-right" color="black" size={30} />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              height: ScentHeightValue,
              width: "100%",
              overflow: "hidden",
              /*borderWidth: 1,*/
            }}
          >
            <Card containerStyle={{ marginTop: 10 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{height: 100,}}>
              <View style={styles.scentButtonView}>
                {Scents.map((button) => (
                  <View
                    key={button.id}
                    style={{ marginRight: 5, marginBottom: 5 }}
                  >
                    <TouchableOpacity
                      onPress={() => handlePressScent(button.id)}
                      onLongPress={() => DeleteScentDialog(button.id)}
                      style={[
                        styles.scentTouchableOpacity,
                        {
                          backgroundColor: pressedScentIds.includes(button.id)
                            ? "rgb(230,230,230)"
                            : "rgb(104,201,170)", // 배경색 설정
                          borderColor: pressedScentIds.includes(button.id)
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

                {showScentTextInput.map((textinput) => (
                  <TextInput
                    key={textinput.id}
                    autoFocus={true}
                    multiline
                    maxLength={10}
                    onChangeText={(text) => setButtonText(text)}
                    onEndEditing={() => addScent()}
                    style={styles.scentTextInput}
                  />
                ))}
                <TouchableOpacity onPress={writeScent}>
                  <Icon
                    name="add-circle-outline"
                    color="rgb(150,150,150)"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              </ScrollView>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>

      {/********************느낌 버튼 삭제 Dialog********************/}
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

      {/********************첫 향 버튼 삭제 Dialog********************/}
      <Dialog
        isVisible={DeleteScent}
        onBackdropPress={() => DeleteScentDialog(0)}
      >
        <Dialog.Title
          title={`${Scents[DeleteScentId.bId]?.text}를 삭제하시겠습니까?`}
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
                DeleteScentBtn();
              }}
            />
            <Dialog.Button title="취소" onPress={() => DeleteScentDialog(0)} />
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
    backgroundColor: "#C3CF53",
    borderWidth: 1,
    borderColor: "#C3CF53",
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
  scentButtonView: {
    flexDirection: "row",
    flexWrap: "wrap", //자동확장
    justifyContent: "flex-start",
  },
  scentTouchableOpacity: {
    marginRight: 4,
    borderWidth: 1, // 테두리 두께 설정
    borderRadius: 5, // 테두리의 둥근 정도 설정
    padding: 2,
    paddingLeft: 7,
    paddingRight: 7,
  },
  scentTextInput: {
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