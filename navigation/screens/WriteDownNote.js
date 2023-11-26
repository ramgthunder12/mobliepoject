import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
  Animated,
  FlatList,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from "react";
import { Header, Icon, Card, Button, Dialog, Slider, Switch } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Rating } from "react-native-ratings";
import DateTimePickerModal from "react-native-modal-datetime-picker";//https://github.com/mmazzarolo/react-native-modal-datetime-picker

let TasteId = 0; //느낌 버튼 id
let ScentId = 0; //첫향 버튼 id
let GlassId = 0; //글라스 버튼 id

export default function WriteDownNote({ navigation }) {
  const [buttonText, setButtonText] = useState(""); //버튼 이름

  /*전체공개*/
  const [FullOpen, setFullOpen] = useState(false);

  /*느낌 */
  const [showTasteTextInput, setshowTasteTextInput] = useState([]); //textinput 생성 및 삭제
  const [Tastes, setTastes] = useState([]); //느낌 버튼 배열
  const [pressedTasteIds, setPressedTasteIds] = useState([]); //느낌 버튼을 누른 버튼id
  const [DeleteTaste, setDeleteTaste] = useState(false); //느낌 버튼 삭제 Dialog on/off
  const [DeleteTasteId, setDeleteTasteId] = useState({ bId: 0 }); //삭제 시 느낌 버튼 id

  /*별점 */
  const [ratingValue, setRatingValue] = useState(3); //별점 구하기

  /*메모 */
  const [memoText, setMemoText] = useState(""); //메모 내용

  /*첫향*/
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);//날짜 및 시간 선택 모달
  const [DateText, setDateText] = useState("00.00.00 00:00:00");
  const [showScentTextInput, setshowScentTextInput] = useState([]); //textinput 생성 및 삭제
  const [Scents, setScents] = useState([]); //첫향 버튼 배열
  const [pressedScentIds, setPressedScentIds] = useState([]); //첫향 버튼을 누른 버튼id
  const [DeleteScent, setDeleteScent] = useState(false); //첫향 버튼 삭제 Dialog on/off
  const [DeleteScentId, setDeleteScentId] = useState({ bId: 0 }); //삭제 시 첫향 버튼 id

  /*글라스*/
  const [GlassExpanded, setGlassExpanded] = useState(false); //글라스 기능 활성화
  const GlassHeightValue = useRef(new Animated.Value(0)).current; //글라스 기능 확장 애니메이션
  const [showGlassTextInput, setshowGlassTextInput] = useState([]); //textinput 생성 및 삭제
  const [Glasss, setGlasss] = useState([]); //글라스 버튼 배열
  const [pressedGlassIds, setPressedGlassIds] = useState([]); //글라스 버튼을 누른 버튼id
  const [DeleteGlass, setDeleteGlass] = useState(false); //글라스 버튼 삭제 Dialog on/off
  const [DeleteGlassId, setDeleteGlassId] = useState({ bId: 0 }); //삭제 시 글라스 버튼 id

  /*색상*/
  const [ColorExpanded, setColorExpanded] = useState(false); //색상 기능 활성화
  const ColorHeightValue = useRef(new Animated.Value(0)).current; //색상 기능 확장 애니메이션
  const ColorArray = [
    "#FF0000",
    "#ff4000",
    "#ff8000",
    "#ffbf00",
    "#ffff00",
    "#bfff00",
    "#80ff00",
    "#00ff00",
    "#00ff80",
    "#00ffbf",
    "#00ffff",
    "#00bfff",
    "#0080ff",
    "#0000ff",
    "#4000ff",
    "#8000ff",
    "#bf00ff",
    "#ff00ff",
    "#ff00bf",
    "#ff0080",
  ];
  const [ColorSelected, setColorSelected] = useState(-1);

  /*점도*/
  const [ViscosityExpanded, setViscosityExpanded] = useState(false); //점도 기능 활성화
  const ViscosityHeightValue = useRef(new Animated.Value(0)).current; //점도 기능 확장 애니메이션
  const [ViscosityValue, setViscosityValue] = useState(0); //점도 값

  /*당도*/
  const [SugarExpanded, setSugarExpanded] = useState(false); //당도 기능 활성화
  const SugarHeightValue = useRef(new Animated.Value(0)).current; //당도 기능 확장 애니메이션
  const [SugarValue, setSugarValue] = useState(0); //당도 값

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

  /********************첫향********************/
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

  const showDatePicker = () => {//날짜 및 시간 선택 모달
    setDatePickerVisibility(true);
  };

  const DatePickerConfirm = (date) => {//날짜 및 시간 선택한 값
    // 날짜 객체에서 연도, 월, 일, 시간, 분, 초 추출
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    //const seconds = date.getSeconds();//초는 선택불가

    setDateText(`${year}.${month}.${day} ${hours}:${minutes}`);

    setDatePickerVisibility(false);
  };
  /********************첫향********************/

  /********************글라스********************/
  const handleGlassAnimate = () => {
    //글라스 창 내려가는 Animated
    Animated.parallel([
      //여러 애니메이션 동시 적용
      Animated.timing(GlassHeightValue, {
        toValue: GlassExpanded ? 1 : 150, // Adjust the desired expanded height
        duration: 500, // Adjust the animation duration
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 모든 애니메이션이 완료된 후 실행되는 콜백
    });

    setGlassExpanded((prev) => !prev);
  };

  const addGlass = () => {
    //느낌추가
    const newGlass = {
      //새로운 버튼 추가
      id: GlassId,
      text: buttonText,
    };

    if (buttonText.length === 0) {
      //이름 입력 안하면 종료
      setshowGlassTextInput(showGlassTextInput.slice(1)); //textinput 제거
      return;
    }

    setGlasss((prevGlasss) => [...prevGlasss, newGlass]); //느낌 버튼 추가
    GlassId++; //버튼 id 증가

    setshowGlassTextInput(showGlassTextInput.slice(1)); //textinput 제거
    setButtonText(""); //버튼 이름 초기화
  };

  const writeGlass = () => {
    //버튼(느낌) 추가 전 textinput
    if (showGlassTextInput.length === 0) {
      setshowGlassTextInput([...showGlassTextInput, { id: 1 }]);
    }
  };

  const handlePressGlass = (buttonId) => {
    //느낌 버튼을 누른 버튼id
    // 토글 상태 변경
    setPressedGlassIds((prevPressedButtonIds) => {
      if (prevPressedButtonIds.includes(buttonId)) {
        // 이미 눌린 경우, 제거
        return prevPressedButtonIds.filter((id) => id !== buttonId);
      } else {
        // 눌리지 않은 경우, 추가
        return [...prevPressedButtonIds, buttonId];
      }
    });
  };

  const DeleteGlassDialog = (bId) => {
    //느낌 버튼 삭제 Dialog on/off
    setDeleteGlassId({ bId });
    setDeleteGlass(!DeleteGlass);
  };

  const DeleteGlassBtn = () => {
    //느낌 버튼 삭제하기
    const updatedGlasss = Glasss.filter(
      (Glass) => Glass.id !== DeleteGlassId.bId
    );
    setGlasss(updatedGlasss);
    setDeleteGlass(!DeleteGlass);
  };
  /********************글라스********************/

  /********************색상********************/
  const handleColorAnimate = () => {
    //글라스 창 내려가는 Animated
    Animated.parallel([
      //여러 애니메이션 동시 적용
      Animated.timing(ColorHeightValue, {
        toValue: ColorExpanded ? 1 : 70, // Adjust the desired expanded height
        duration: 500, // Adjust the animation duration
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 모든 애니메이션이 완료된 후 실행되는 콜백
    });

    setColorExpanded((prev) => !prev);
  };
  /********************색상********************/

  /********************점도********************/
  const handleViscosityAnimate = () => {
    //글라스 창 내려가는 Animated
    Animated.parallel([
      //여러 애니메이션 동시 적용
      Animated.timing(ViscosityHeightValue, {
        toValue: ViscosityExpanded ? 1 : 90, // Adjust the desired expanded height
        duration: 500, // Adjust the animation duration
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 모든 애니메이션이 완료된 후 실행되는 콜백
    });

    setViscosityExpanded((prev) => !prev);
  };

  const interpolateViscosity = (start, end) => {
    //색깔코드 계산
    let k = (ViscosityValue - 0) / 5; // 0 =>min  && 5 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const colorViscosity = () => {
    let r = interpolateViscosity(230, 0);
    let g = interpolateViscosity(230, 0);
    let b = interpolateViscosity(230, 0);
    return `rgb(${r},${g},${b})`;
  };
  /********************점도********************/

  /********************당도********************/
  const handleSugarAnimate = () => {
    //글라스 창 내려가는 Animated
    Animated.parallel([
      //여러 애니메이션 동시 적용
      Animated.timing(SugarHeightValue, {
        toValue: SugarExpanded ? 1 : 90, // Adjust the desired expanded height
        duration: 500, // Adjust the animation duration
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 모든 애니메이션이 완료된 후 실행되는 콜백
    });

    setSugarExpanded((prev) => !prev);
  };

  const interpolateSugar = (start, end) => {
    //색깔코드 계산
    let k = (SugarValue - 0) / 5; // 0 =>min  && 5 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const colorSugar = () => {
    let b = interpolateSugar(200, 0);
    //let g = interpolateSugar(255, 255);
    //let r = interpolateSugar(255, 255);
    //return `rgb(${r},${g},${b})`;
    return `rgb(255,255,${b})`;
  };
  /********************당도********************/

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
      setScents((prevScents) => [...prevScents, Scent]); //첫향 버튼 추가
      ScentId++; //버튼 id 증가
    });

    /*글라스 초기화 */
    const GlassData = [
      { id: 0, text: "온더락" },
      { id: 1, text: "위스키 테이스팅 용" },
      { id: 2, text: "레드와인잔" },
      { id: 3, text: "화이트와인잔" },
    ];

    GlassData.forEach((Glass) => {
      setGlasss((prevGlasss) => [...prevGlasss, Glass]); //첫향 버튼 추가
      GlassId++; //버튼 id 증가
    });

    return () => {
      setDeleteTaste(false);
      //저장 후 종료 물어보기
      //console.log('end');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark"/>
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
        centerComponent={
          <View style={styles.heading}>
            <Text style={styles.headerSideText}>테이스팅 노트</Text>
            <TouchableOpacity onPress={NoteExit} style={{ marginLeft: 5 }}>
              <Icon
                name="question-circle-o"
                type="font-awesome"
                color="black"
                size={20}
              />
            </TouchableOpacity>
          </View>
        }
        backgroundColor="rgb(255,255,255)"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/********************전체공개********************/}
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={{flexDirection: "row",
    justifyContent: "flex-start",}}>
          <Text
            style={[styles.noteTitleText, { marginLeft: 20, }]}
          >
            전체공개
          </Text>
          <Switch
            color="#000000"
            value={FullOpen}
            onValueChange={(value) => setFullOpen(value)}
            style={{marginLeft: 10, marginTop: -10,}}
          />
        </View>

        {/********************느낌********************/}
        <Card.Divider style={{ marginTop: 3 }} />
        <View style={styles.noteTitleView}>
          <Text style={styles.noteTitleText}>어떤 느낌이었나요?</Text>
        </View>
        <Card containerStyle={{ marginTop: 10 }}>
          <View style={styles.addButtonView}>
            {Tastes.map((button) => (
              <View key={button.id} style={{ marginRight: 5, marginBottom: 5 }}>
                <TouchableOpacity
                  onPress={() => handlePressTaste(button.id)}
                  onLongPress={() => DeleteTasteDialog(button.id)}
                  style={[
                    styles.tasteTouchableOpacity,
                    {
                      backgroundColor: pressedTasteIds.includes(button.id)
                        ? "#C3CF53"
                        : "rgb(230,230,230)", // 배경색 설정
                      borderColor: pressedTasteIds.includes(button.id)
                        ? "#C3CF53"
                        : "rgb(230,230,230)", // 테두리 색상 설정
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

        <View style={styles.noteTitleView}>
          <Text style={styles.noteTitleText}>메모를 작성해주세요</Text>
        </View>

        <Card containerStyle={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <TextInput
              editable
              multiline
              numberOfLines={5}
              maxLength={1000}
              onEndEditing={(event) => setMemoText(event.nativeEvent.text)}
              style={{
                fontSize: 20,
                textAlignVertical: "top",
                textAlign: "left",
                width: "100%",
              }}
            />
          </View>
        </Card>

        {/********************첫향:노즈********************/}
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={{flexDirection: "row", justifyContent: "center", marginTop: -10, }}>
        <Text style={{color: "rgb(150,150,150)",}}>
          - 여기서부터는 필수 선택이 아닙니다 -
        </Text>
        </View>
        <Card.Divider style={{ marginTop: 6 }} />
          <View style={styles.noteExpandTitle}>
            <Text
              style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
            >
              첫향 : 노즈
            </Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={{ flexDirection: "row", marginRight: 15, marginTop: -5 }}
            >
              <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                textDecorationLine: "underline",
                color: "rgb(150,150,150)",
                marginRight: 7,
                paddingTop: 3,
              }}>
                {DateText}
              </Text>
              <Icon name="calendar"  type="feather" color="rgb(150,150,150)" size={25} />
            </TouchableOpacity>
          </View>

            <Card containerStyle={{ marginTop: 10 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}//중첩 스크롤뷰 인식
                style={{ height: 100 }}
              >
                <View style={styles.addButtonView}>
                  {Scents.map((button) => (
                    <View
                      key={button.id}
                      style={{ marginRight: 5, marginBottom: 5 }}
                    >
                      <TouchableOpacity
                        onPress={() => handlePressScent(button.id)}
                        onLongPress={() => DeleteScentDialog(button.id)}
                        style={[
                          styles.ScentTouchableOpacity,
                          {
                            backgroundColor: pressedScentIds.includes(button.id)
                              ? "rgb(104,201,170)"
                              : "rgb(230,230,230)", // 배경색 설정
                            borderColor: pressedScentIds.includes(button.id)
                              ? "rgb(104,201,170)"
                              : "rgb(230,230,230)", // 테두리 색상 설정
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
                      style={styles.ScentTextInput}
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

        {/********************글라스********************/}
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={styles.noteExpandView}>
          <View style={styles.noteExpandTitle}>
            <Text
              style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
            >
              글라스
            </Text>
            <TouchableOpacity
              onPress={handleGlassAnimate}
              style={{ marginRight: 10, marginTop: -5 }}
            >
              <Icon name="chevron-right" color="black" size={30} />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              height: GlassHeightValue,
              width: "100%",
              overflow: "hidden",
              /*borderWidth: 1,*/
            }}
          >
            <Card containerStyle={{ marginTop: 10 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}//중첩 스크롤뷰 인식
                style={{ height: "100%" }}
              >
                <View style={styles.addButtonView}>
                  {Glasss.map((button) => (
                    <View
                      key={button.id}
                      style={{ marginRight: 5, marginBottom: 5 }}
                    >
                      <TouchableOpacity
                        onPress={() => handlePressGlass(button.id)}
                        onLongPress={() => DeleteGlassDialog(button.id)}
                        style={[
                          styles.GlassTouchableOpacity,
                          {
                            backgroundColor: pressedGlassIds.includes(button.id)
                              ? "rgb(104,201,170)"
                              : "rgb(230,230,230)", // 배경색 설정
                            borderColor: pressedGlassIds.includes(button.id)
                              ? "rgb(104,201,170)"
                              : "rgb(230,230,230)", // 테두리 색상 설정
                          },
                        ]}
                      >
                        <Text style={{ fontSize: 20, color: "rgb(80,80,80)" }}>
                          {button.text}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  {showGlassTextInput.map((textinput) => (
                    <TextInput
                      key={textinput.id}
                      autoFocus={true}
                      multiline
                      maxLength={10}
                      onChangeText={(text) => setButtonText(text)}
                      onEndEditing={() => addGlass()}
                      style={styles.GlassTextInput}
                    />
                  ))}
                  <TouchableOpacity onPress={writeGlass}>
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

        {/********************색상********************/}
        <Card.Divider style={{ marginTop: 9 }} />
        <View style={styles.noteExpandView}>
          <View style={styles.noteExpandTitle}>
            <Text
              style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
            >
              색상
            </Text>
            <TouchableOpacity
              onPress={handleColorAnimate}
              style={{ marginRight: 10, marginTop: -5 }}
            >
              <Icon name="chevron-right" color="black" size={30} />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              height: ColorHeightValue,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10, }}>
              {ColorArray.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: color,
                    padding: 15,
                    margin: 5,
                    borderColor: ColorSelected === index ? "rgb(0,0,0)" : "transparent",
                    borderWidth: 3,
                  }}
                  onPress={() => setColorSelected(index)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </View>

        {/********************점도********************/}
        <Card.Divider style={{ marginTop: 9 }} />
        <View style={styles.noteExpandView}>
          <View style={styles.noteExpandTitle}>
            <Text
              style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
            >
              점도
            </Text>
            <TouchableOpacity
              onPress={handleViscosityAnimate}
              style={{ marginRight: 10, marginTop: -5 }}
            >
              <Icon name="chevron-right" color="black" size={30} />
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View
          style={{
            height: ViscosityHeightValue,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              paddingTop: 10,
              paddingLeft: 40,
              paddingRight: 40,
              width: "100%",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <Slider
              value={ViscosityValue}
              onValueChange={setViscosityValue}
              maximumValue={5}
              minimumValue={0}
              step={1}
              allowTouchTrack
              trackStyle={{ height: 5, backgroundColor: "transparent" }}
              thumbStyle={{
                height: 20,
                width: 20,
                backgroundColor: "transparent",
              }}
              thumbProps={{
                children: (
                  <View
                    style={{
                      bottom: 15,
                      right: 16,
                      width: 50,
                      height: 50,
                    }}
                  >
                    <Icon
                      name="water"
                      type="material-community"
                      size={50}
                      color={colorViscosity()}
                    />
                  </View>
                ),
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Icon name="numeric-0" type="material-community" size={47} />
            <Icon name="numeric-1" type="material-community" size={47} />
            <Icon name="numeric-2" type="material-community" size={47} />
            <Icon name="numeric-3" type="material-community" size={47} />
            <Icon name="numeric-4" type="material-community" size={47} />
            <Icon name="numeric-5" type="material-community" size={47} />
          </View>
        </Animated.View>

        {/********************당도********************/}
        <Card.Divider style={{ marginTop: 9 }} />
        <View style={styles.noteExpandView}>
          <View style={styles.noteExpandTitle}>
            <Text
              style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
            >
              당도
            </Text>
            <TouchableOpacity
              onPress={handleSugarAnimate}
              style={{ marginRight: 10, marginTop: -5 }}
            >
              <Icon name="chevron-right" color="black" size={30} />
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View
          style={{
            height: SugarHeightValue,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              paddingTop: 10,
              paddingLeft: 40,
              paddingRight: 40,
              width: "100%",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <Slider
              value={SugarValue}
              onValueChange={setSugarValue}
              maximumValue={5}
              minimumValue={0}
              step={1}
              allowTouchTrack
              trackStyle={{ height: 5, backgroundColor: "transparent" }}
              thumbStyle={{
                height: 20,
                width: 20,
                backgroundColor: "transparent",
              }}
              thumbProps={{
                children: (
                  <View
                    style={{
                      bottom: 15,
                      right: 16,
                      width: 50,
                      height: 50,
                    }}
                  >
                    <Icon
                      name="water"
                      type="material-community"
                      size={50}
                      color={colorSugar()}
                    />
                  </View>
                ),
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Icon name="numeric-0" type="material-community" size={47} />
            <Icon name="numeric-1" type="material-community" size={47} />
            <Icon name="numeric-2" type="material-community" size={47} />
            <Icon name="numeric-3" type="material-community" size={47} />
            <Icon name="numeric-4" type="material-community" size={47} />
            <Icon name="numeric-5" type="material-community" size={47} />
          </View>
        </Animated.View>
        <Card.Divider style={{ marginTop: 9 }} />
      </ScrollView>

      {/********************날짜 및 시간 모달********************/}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={DatePickerConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

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

      {/********************첫향 버튼 삭제 Dialog********************/}
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

      {/********************글라스 버튼 삭제 Dialog********************/}
      <Dialog
        isVisible={DeleteGlass}
        onBackdropPress={() => DeleteGlassDialog(0)}
      >
        <Dialog.Title
          title={`${Glasss[DeleteGlassId.bId]?.text}를 삭제하시겠습니까?`}
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
                DeleteGlassBtn();
              }}
            />
            <Dialog.Button title="취소" onPress={() => DeleteGlassDialog(0)} />
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
    flexDirection: "row",
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
  addButtonView: {
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
  ScentTouchableOpacity: {
    marginRight: 4,
    borderWidth: 1, // 테두리 두께 설정
    borderRadius: 5, // 테두리의 둥근 정도 설정
    padding: 2,
    paddingLeft: 7,
    paddingRight: 7,
  },
  GlassTouchableOpacity: {
    marginRight: 4,
    borderWidth: 1, // 테두리 두께 설정
    borderRadius: 5, // 테두리의 둥근 정도 설정
    padding: 2,
    paddingLeft: 7,
    paddingRight: 7,
  },
  GlassTextInput: {
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
