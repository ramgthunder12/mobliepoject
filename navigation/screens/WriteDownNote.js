import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
  Animated,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  Header,
  Icon,
  Card,
  Dialog,
  Slider,
  Switch,
} from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Rating } from "react-native-ratings";
import DateTimePickerModal from "react-native-modal-datetime-picker"; //https://github.com/mmazzarolo/react-native-modal-datetime-picker
import { AppContext } from "../../AppContext";
import axios from "axios";

let TasteId = 0; //느낌 버튼 id
let ScentId = 0; //첫향 버튼 id
let MTasteId = 0; //중간맛 버튼 id
let FScentId = 0; //끝향 버튼 id
let GlassId = 0; //글라스 버튼 id
let btnName = "";//선택한 버튼 이름

export default function WriteDownNote({ navigation }) {
  const [buttonText, setButtonText] = useState(""); //버튼 이름
  const screenWidth = Dimensions.get("window").width; //화면 가로길이
  const { id, apiUrl } = useContext(AppContext);//전역변수
  const route = useRoute();
  const { alcoholId } = route.params;

  /*전체공개*/
  const [FullOpen, setFullOpen] = useState(false);

  /*주류 이미지*/
  const [SelectedImage, setSelectedImage] = useState(null);
  const [ImageHasPermission, setImageHasPermission] = useState(false);

  /*주류 이름*/
  const [Name, setName] = useState("");

  /*시음일*/
  const [isTastingDayVisible, setTastingDayVisible] = useState(false); //날짜 및 시간 선택 모달
  const [TastingDay, setTastingDay] = useState("");

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

  /*첫중끝 공통*/
  const [slideVisible, setSlideVisible] = useState({index: 0, id: 0, b: false});//첫중끝 구별, 버튼id, 슬라이더보이게
  const [slideValue, setSlideValue] = useState(1);//슬라이더로 받은 값

  /*첫향*/
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); //날짜 및 시간 선택 모달
  const [DateText, setDateText] = useState("");
  const [showScentTextInput, setshowScentTextInput] = useState([]); //textinput 생성 및 삭제
  const [Scents, setScents] = useState([]); //첫향 버튼 배열 { id, name }
  const [pressedScentIds, setPressedScentIds] = useState([]); //첫향 버튼을 누른 버튼id { btnId, name, value }
  const [DeleteScent, setDeleteScent] = useState(false); //첫향 버튼 삭제 Dialog on/off
  const [DeleteScentId, setDeleteScentId] = useState({ bId: 0 }); //삭제 시 첫향 버튼 id

  /*중간맛*/
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false); //시간 선택 모달
  const [TimeText, setTimeText] = useState("");
  const [showMTasteTextInput, setshowMTasteTextInput] = useState([]); //textinput 생성 및 삭제
  const [MTastes, setMTastes] = useState([]); //중간맛 버튼 배열 { id, name }
  const [pressedMTasteIds, setPressedMTasteIds] = useState([]); //중간맛 버튼을 누른 버튼id { btnId, name, value }
  const [DeleteMTaste, setDeleteMTaste] = useState(false); //중간맛 버튼 삭제 Dialog on/off
  const [DeleteMTasteId, setDeleteMTasteId] = useState({ bId: 0 }); //삭제 시 중간맛 버튼 id

  /*끝향*/
  const [isFTimePickerVisible, setFTimePickerVisibility] = useState(false); //날짜 및 시간 선택 모달
  const [FTimeText, setFTimeText] = useState("");
  const [showFScentTextInput, setshowFScentTextInput] = useState([]); //textinput 생성 및 삭제
  const [FScents, setFScents] = useState([]); //첫향 버튼 배열 { id, name }
  const [pressedFScentIds, setPressedFScentIds] = useState([]); //첫향 버튼을 누른 버튼id { btnId, name, value }
  const [DeleteFScent, setDeleteFScent] = useState(false); //첫향 버튼 삭제 Dialog on/off
  const [DeleteFScentId, setDeleteFScentId] = useState({ bId: 0 }); //삭제 시 첫향 버튼 id

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
    "#fffcdd",
    "#fded96",
    "#fbea78",
    "#fbe166",
    "#f9db55",
    "#fad64a",
    "#f9ce4b",
    "#f5c94c",
    "#f7c13b",
    "#f5bd32",
    "#eaad07",
    "#e59301",
    "#dc7317",
    "#e06529",
    "#cc4f2f",
    "#b02f29",
    "#9f241d",
    "#712c1d",
    "#421b0a"
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

  const NoteExit = () => {
    //노트 나가기
    navigation.goBack();
  };

  /********************주류 이미지********************/
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
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImage = () => {
    //이미지 출력
    if (SelectedImage) {
      return (
        <View style={{ width: 140 }}>
          <Image
            source={{ uri: SelectedImage }}
            style={{
              /*flex: 1, resizeMode: 'contain',*/ height: "100%",
              width: 140,
              borderRadius: 10,
              borderWidth: 1,
            }}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => pickImage()}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(230,230,230)",
              height: "100%",
              width: 140,
              borderRadius: 10,
            }}
          >
            <Icon
              name="pluscircleo"
              type="antdesign"
              size={30}
              color="rgb(255,255,255)"
            />
          </View>
        </TouchableOpacity>
      );
    }
  };
  /********************주류 이미지********************/

  /********************시음일********************/
  const TastingDayConfirm = (date) => {
    //날짜 선택한 값
    // 날짜 객체에서 연도, 월, 일 추출
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = date.getDate();

    setTastingDay(`${year}.${month}.${day}`);

    setTastingDayVisible(false);
  };
  /********************시음일********************/

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

  /********************반절 색칠하는 버튼 UI********************/
  const SeperateColorButton = ({ onPress, onLongPress, percentFilled, fillColor, borderColor, text}) => {//1~10
    const containerStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'rgb(230,230,230)', // 전체 배경 색상
      height: 27,
      width: 75,
      marginRight: 4,
      borderWidth: 1, // 테두리 두께 설정
      borderRadius: 5, // 테두리의 둥근 정도 설정
      overflow: 'hidden',
    };
  
    const filledAreaStyle = {
      flex: percentFilled / 10,
      backgroundColor: fillColor, // 채워진 영역의 배경 색상
      borderColor: borderColor,
    };
  
    const emptyAreaStyle = {
      flex: (10 - percentFilled) / 10,
      backgroundColor: 'transparent', // 비어있는 영역의 배경 색상
    };

    const textStyle={ fontSize: 20, color: "rgb(80,80,80)", backgroundColor: 'transparent', position: 'absolute'};
  
    return (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={containerStyle}>
        <View style={filledAreaStyle}></View>
        <Text style={textStyle}>{text}</Text>
        <View style={emptyAreaStyle}></View>
      </TouchableOpacity>
    );
  };
  /********************반절 색칠하는 버튼 UI********************/

  /********************첫향, 중간맛, 끝향 공통********************/

  const handlePressScent = () => {//value : 슬라이더로 받은 값
    //느낌 버튼을 누른 버튼id
    const buttonId = slideVisible.id;
    
    if(slideVisible.index === 0){//첫 향

      setPressedScentIds((prevPressedButtonIds) => {
        if (pressedScentIds.some(item => item.btnId === buttonId)) {
          // 이미 눌린 경우, 제거
          return prevPressedButtonIds.filter((item) => item.btnId !== buttonId);
        } else {
          // 눌리지 않은 경우, 추가
          return [...prevPressedButtonIds, { btnId: buttonId, name: btnName, value: slideValue }];
        }
      });

    } else if(slideVisible.index === 1){//중간맛

      setPressedMTasteIds((prevPressedButtonIds) => {
        if (pressedMTasteIds.some(item => item.btnId === buttonId)) {
          // 이미 눌린 경우, 제거
          return prevPressedButtonIds.filter((item) => item.btnId !== buttonId);
        } else {
          // 눌리지 않은 경우, 추가
          return [...prevPressedButtonIds, { btnId: buttonId, name: btnName, value: slideValue }];
        }
      });

    } else if(slideVisible.index === 2){//끝향

      setPressedFScentIds((prevPressedButtonIds) => {
        if (pressedFScentIds.some(item => item.btnId === buttonId)) {
          // 이미 눌린 경우, 제거
          return prevPressedButtonIds.filter((item) => item.btnId !== buttonId);
        } else {
          // 눌리지 않은 경우, 추가
          return [...prevPressedButtonIds, { btnId: buttonId, name: btnName, value: slideValue }];
        }
      });
    }

    setSlideVisible({index: 0, id: 0, b: false});//모두 초기화
    setSlideValue(1);
  };

  const handleScentButton = (index, id, name) => {
    btnName=name;

    if(index === 0){
      if(pressedScentIds.length === 8) Alert.alert('알림', '최대 8개만 선택 가능합니다');
      else setSlideVisible({index: 0, id: id, b: true});
    }else if(index === 1){
      if(pressedMTasteIds.length === 8) Alert.alert('알림', '최대 8개만 선택 가능합니다');
      else setSlideVisible({index: 1, id: id, b: true});
    }else if(index === 2){
      if(pressedFScentIds.length === 8) Alert.alert('알림', '최대 8개만 선택 가능합니다');
      else setSlideVisible({index: 2, id: id, b: true});
    }
  };

  /********************첫향, 중간맛, 끝향 공통********************/

  /********************첫향********************/
  const memoizedScents = useMemo(() => {
    return Scents.map((button) => (
      <View key={`${button.id}-${button.name}`} style={{ marginRight: 5 }}>
        {console.log('id: ' + button.id)}
        <SeperateColorButton
          onPress={() => handleScentButton(0, button.id, button.name)}
          onLongPress={() => DeleteScentDialog(button.id-1)}
          fillColor={pressedScentIds.some(item => item.btnId === button.id) ? "rgb(104,201,170)" : "rgb(230,230,230)"}
          borderColor={pressedScentIds.some(item => item.btnId === button.id) ? "rgb(104,201,170)" : "rgb(230,230,230)"}
          percentFilled={pressedScentIds.some(item => item.btnId === button.id) ? pressedScentIds.find(item => item.btnId === button.id).value : 0}
          text={button.name}
        />
      </View>
    ));
  }, [Scents, pressedScentIds]);

  const addScent = () => {
    //느낌추가
    const newScent = {
      //새로운 버튼 추가
      id: ScentId,
      name: buttonText
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

  const showDatePicker = () => {
    //날짜 및 시간 선택 모달
    setDatePickerVisibility(true);
  };

  const DatePickerConfirm = (date) => {
    //날짜 및 시간 선택한 값
    // 날짜 객체에서 연도, 월, 일, 시간, 분, 초 추출
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    //const seconds = date.getSeconds();//초는 선택불가

    setDateText(`${year}-${month}-${day} ${hours}:${minutes}`);

    setDatePickerVisibility(false);
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

  /********************중간맛********************/
  const memoizedMTastes = useMemo(() => {
    return MTastes.map((button) => (
      <View
      key={`${button.id}-${button.name}`}
        style={{ marginRight: 5 }}
      >
        <SeperateColorButton
          onPress={() => handleScentButton(1, button.id, button.name)}
          onLongPress={() => DeleteMTasteDialog(button.id-1)}
          fillColor={pressedMTasteIds.some(item => item.btnId === button.id)
            ? "rgb(104,201,170)"
            : "rgb(230,230,230)"}
          borderColor={pressedMTasteIds.some(item => item.btnId === button.id)
            ? "rgb(104,201,170)"
            : "rgb(230,230,230)"}
          percentFilled={pressedMTasteIds.some(item => item.btnId === button.id) ? pressedMTasteIds.find(item => item.btnId === button.id).value : 0}
          text={button.name}
        />
      </View>
        ));
  }, [MTastes, pressedMTasteIds]);

  const addMTaste = () => {
    //느낌추가
    const newMTaste = {
      //새로운 버튼 추가
      id: MTasteId,
      name: buttonText
    };

    if (buttonText.length === 0) {
      //이름 입력 안하면 종료
      setshowMTasteTextInput(showMTasteTextInput.slice(1)); //textinput 제거
      return;
    }

    setMTastes((prevMTastes) => [...prevMTastes, newMTaste]); //느낌 버튼 추가
    MTasteId++; //버튼 id 증가

    setshowMTasteTextInput(showMTasteTextInput.slice(1)); //textinput 제거
    setButtonText(""); //버튼 이름 초기화
  };

  const writeMTaste = () => {
    //버튼(느낌) 추가 전 textinput
    if (showMTasteTextInput.length === 0) {
      setshowMTasteTextInput([...showMTasteTextInput, { id: 1 }]);
    }
  };

  const DeleteMTasteDialog = (bId) => {
    //느낌 버튼 삭제 Dialog on/off
    setDeleteMTasteId({ bId });
    setDeleteMTaste(!DeleteMTaste);
  };

  const DeleteMTasteBtn = () => {
    //느낌 버튼 삭제하기
    const updatedMTastes = MTastes.filter(
      (MTaste) => MTaste.id !== DeleteMTasteId.bId
    );
    setMTastes(updatedMTastes);
    setDeleteMTaste(!DeleteMTaste);
  };

  const showTimePicker = () => {
    //날짜 및 시간 선택 모달
    setTimePickerVisibility(true);
  };

  const TimePickerConfirm = (time) => {
    //시간 선택한 값
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, "0");
    //const seconds = time.getSeconds();//초는 선택불가

    setTimeText(`${hours}:${minutes}`);

    setTimePickerVisibility(false);
  };
  /********************중간맛********************/

  /********************끝향********************/
  const memoizedFScents = useMemo(() => {
    return FScents.map((button) => (
      <View
      key={`${button.id}-${button.name}`}
        style={{ marginRight: 5 }}
      >
        <SeperateColorButton
          onPress={() => handleScentButton(2, button.id, button.name)}
          onLongPress={() => DeleteFScentDialog(button.id-1)}
          fillColor={pressedFScentIds.some(item => item.btnId === button.id)
            ? "rgb(104,201,170)"
            : "rgb(230,230,230)"}
          borderColor={pressedFScentIds.some(item => item.btnId === button.id)
            ? "rgb(104,201,170)"
            : "rgb(230,230,230)"}
          percentFilled={pressedFScentIds.some(item => item.btnId === button.id) ? pressedFScentIds.find(item => item.btnId === button.id).value : 0}
          text={button.name}
        />
      </View>
    ));
  }, [FScents, pressedFScentIds]);

  const addFScent = () => {
    //느낌추가
    const newFScent = {
      //새로운 버튼 추가
      id: FScentId,
      name: buttonText
    };

    if (buttonText.length === 0) {
      //이름 입력 안하면 종료
      setshowFScentTextInput(showFScentTextInput.slice(1)); //textinput 제거
      return;
    }

    setFScents((prevFScents) => [...prevFScents, newFScent]); //느낌 버튼 추가
    FScentId++; //버튼 id 증가

    setshowFScentTextInput(showFScentTextInput.slice(1)); //textinput 제거
    setButtonText(""); //버튼 이름 초기화
  };

  const writeFScent = () => {
    //버튼(느낌) 추가 전 textinput
    if (showFScentTextInput.length === 0) {
      setshowFScentTextInput([...showFScentTextInput, { id: 1 }]);
    }
  };

  const DeleteFScentDialog = (bId) => {
    //느낌 버튼 삭제 Dialog on/off
    setDeleteFScentId({ bId });
    setDeleteFScent(!DeleteFScent);
  };

  const DeleteFScentBtn = () => {
    //느낌 버튼 삭제하기
    const updatedFScents = FScents.filter(
      (FScent) => FScent.id !== DeleteFScentId.bId
    );
    setFScents(updatedFScents);
    setDeleteFScent(!DeleteFScent);
  };

  const showFTimePicker = () => {
    //시간 선택 모달
    setFTimePickerVisibility(true);
  };

  const FTimePickerConfirm = (FTime) => {
    //시간 선택한 값
    const hours = FTime.getHours();
    const minutes = FTime.getMinutes().toString().padStart(2, "0");
    //const seconds = FTime.getSeconds();//초는 선택불가

    setFTimeText(`${hours}:${minutes}`);

    setFTimePickerVisibility(false);
  };
  /********************끝향********************/

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

  /********************api********************/
  const SaveNote = async () => {//노트저장
    const url = apiUrl + "tastenote/";

    let alcoholNumber;
    if(alcoholId === 0) alcoholNumber = 1;
    else alcoholNumber = alcoholId;

    let open;
    if(FullOpen) open='Y';
    else open='N';

    const ScentNames = pressedScentIds.map(({ name }) => name);
    const ScentValues = pressedScentIds.map(({ value }) => value);

    const MTasteNames = pressedMTasteIds.map(({ name }) => name);
    const MTasteValues = pressedMTasteIds.map(({ value }) => value);

    const FScentNames = pressedFScentIds.map(({ name }) => name);
    const FScentValues = pressedFScentIds.map(({ value }) => value);

    const GlassList = pressedGlassIds.map((id) => {
      const glass = Glasss.find((val) => val.id === id);
      return glass ? glass.text : null;
    });

    const TasteList = pressedTasteIds.map((id) => {
      const taste = Tastes.find((val) => val.id === id);
      return taste ? taste.text : null;
    });

    const currentDateTime = new Date();//현재 시간
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

    const formattedCurrentDate = `${year}-${month}-${day}`;//현재 날짜

    const tastingDayForMariaDB = TastingDay.replace(/\./g, '-');//시음일

    const firstscentDate = `${DateText}:${seconds}`;//첫향시간

    const dayParts = DateText.split(" ");
    const middlescent = `${dayParts[0]} ${TimeText}:${seconds}`;//중간시간
    const finalscent = `${dayParts[0]} ${FTimeText}:${seconds}`;//끝향시간

    const data = {
      id: id,
      alcohol_number: alcoholNumber,//임시
      creationDate: formattedCurrentDate,
      taste_number: 4,
      scent_number: 4,
      open: open,
      tastingDay: tastingDayForMariaDB,
      firstscent: ScentNames,
    };
    // const data = {
    //   id: id,
    //   alcohol_number: alcoholNumber,//임시
    //   tastenote_starpoint: ratingValue,
    //   creationdate: formattedCurrentDate,
    //   tastenote_info: TasteList,//이게 느낌배열
    //   tastenote_format: "what the hell",
    //   taste_number: 4,
    //   scent_number: 4,
    //   open: open,
    //   tasting_day: tastingDayForMariaDB,
    //   memo: memoText,
    //   firstscent: ScentNames,
    //   firstscent_value: ScentValues,
    //   firstscent_date: firstscentDate,
    //   middlescent: MTasteNames,
    //   middlescent_value: MTasteValues,
    //   middlescent_date: middlescent,
    //   finalscent: FScentNames,
    //   finalscent_value: FScentValues,
    //   finalscent_date: finalscent,
    //   glass: GlassList,
    //   color: ColorArray[ColorSelected],
    //   viscosity: ViscosityValue,
    //   sugar: SugarValue
    // };

    const jsonString = JSON.stringify(data);

    console.log(jsonString);

    try {
      const response = await axios.post(url, jsonString);

      console.log(response.data);
      if (response.data) {
        console.log(response.data);
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log(error);
    }

    console.log("노트저장");
    navigation.goBack();
  };

  const getScents = async () => {//느낌 가져오기
    const url = apiUrl + "scent/";

    try {
      const response = await axios.get(url);

      if (response.data) {
        const limitedArray = response.data.slice(0, 30);
        const transformedData = limitedArray.map(item => ({
          id: item.scentNumber,
          name: item.scentInfo
        }));

        /*첫향 초기화 */
        setScents(transformedData);
        ScentId=transformedData.length;

        /*중간맛 초기화 */
        setMTastes(transformedData);
        MTasteId=transformedData.length;

        /*끝향 초기화 */
        setFScents(transformedData);
        FScentId=transformedData.length;
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log(error);
    }
  };
  /********************api********************/

  useEffect(() => {
    requestImagePermission(); //이미지 접근 권한 요청

    /*날짜 초기화*/
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    setDateText(`${year}-${month}-${day} ${hours}:${minutes}`);
    setTimeText(`${hours}:${minutes}`);
    setFTimeText(`${hours}:${minutes}`);
    setTastingDay(`${year}.${month}.${day}`);

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

    /*scent api*/
    getScents();

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
      <StatusBar style="dark" />
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
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Text style={[styles.noteTitleText, { marginLeft: 20 }]}>
            전체공개
          </Text>
          <Switch
            color="#000000"
            value={FullOpen}
            onValueChange={(value) => setFullOpen(value)}
            style={{ marginLeft: 10, marginTop: -10 }}
          />
        </View>

        {/********************주류 정보********************/}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            height: 200,
            width: screenWidth,
          }}
        >
          {/********************주류 이미지********************/}
          <View style={{ marginLeft: 18 }}>{showImage()}</View>

          {/********************주류 이름********************/}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              marginLeft: 15,
              marginRight: 18,
            }}
          >
            <Text style={styles.noteTitleText}>주류명</Text>
            <TextInput
              autoFocus={false}
              onChangeText={(text) => setName(text)}
              value={Name}
              placeholder="어떤 술인가요?"
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "rgb(230,230,230)",
                backgroundColor: "rgb(230,230,230)",
                fontSize: 20,
                width: "100%",
                height: 40,
                padding: 10,
                marginTop: 10,
              }}
            />

            {/********************시음일********************/}
            <Text style={[styles.noteTitleText, { marginTop: 30 }]}>
              시음일
            </Text>
            <TouchableOpacity
              onPress={() => setTastingDayVisible(true)}
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                marginTop: 10,
              }}
            >
              <Icon name="calendar" type="feather" size={25} />
              <Text
                style={{
                  fontSize: 25,
                  paddingTop: 1,
                  marginLeft: 10,
                }}
              >
                {TastingDay}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/********************느낌********************/}
        <Card.Divider style={{ marginTop: 10 }} />
        <View style={[styles.noteTitleView, {marginTop: -10,}]}>
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
        <Card.Divider style={{ marginTop: 10 }} />
        <View style={[styles.noteTitleView, {marginTop: -10,}]}>
          <Text style={styles.noteTitleText}>별점을 선택해주세요</Text>
        </View>
        <Rating
          startingValue={3}
          onFinishRating={(rating) => ratingCompleted(rating)}
          style={{ paddingVertical: 10 }}
        />

        {/********************메모********************/}
        <Card.Divider/>

        <View style={[styles.noteTitleView, {marginTop: -10,}]}>
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
        <Card.Divider style={{ marginTop: 10 }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: -10,
          }}
        >
          <Text style={{ color: "rgb(255,50,50)" }}>
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
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textDecorationLine: "underline",
                color: "rgb(150,150,150)",
                marginRight: 7,
                paddingTop: 3,
              }}
            >
              {DateText}
            </Text>
            <Icon
              name="calendar"
              type="feather"
              color="rgb(150,150,150)"
              size={25}
            />
          </TouchableOpacity>
        </View>

        <Card containerStyle={{ marginTop: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 100 }}
          >
            <View style={styles.addScentView}>
              {memoizedScents}
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

        {/********************중간맛 : 팔레트********************/}
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={styles.noteExpandTitle}>
          <Text
            style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
          >
            중간맛 : 팔레트
          </Text>
          <TouchableOpacity
            onPress={showTimePicker}
            style={{ flexDirection: "row", marginRight: 15, marginTop: -5 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textDecorationLine: "underline",
                color: "rgb(150,150,150)",
                marginRight: 7,
                paddingTop: 3,
              }}
            >
              {TimeText}
            </Text>
            <Icon
              name="calendar"
              type="feather"
              color="rgb(150,150,150)"
              size={25}
            />
          </TouchableOpacity>
        </View>

        <Card containerStyle={{ marginTop: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 100 }}
          >
            <View style={styles.addScentView}>
              {memoizedMTastes}
              {showMTasteTextInput.map((textinput) => (
                <TextInput
                  key={textinput.id}
                  autoFocus={true}
                  multiline
                  maxLength={10}
                  onChangeText={(text) => setButtonText(text)}
                  onEndEditing={() => addMTaste()}
                  style={styles.MTasteTextInput}
                />
              ))}
              <TouchableOpacity onPress={writeMTaste}>
                <Icon
                  name="add-circle-outline"
                  color="rgb(150,150,150)"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>

        {/********************끝향 : 피니쉬********************/}
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={styles.noteExpandTitle}>
          <Text
            style={[styles.noteTitleText, { marginLeft: 20, marginTop: -2 }]}
          >
            끝향 : 피니쉬
          </Text>
          <TouchableOpacity
            onPress={showFTimePicker}
            style={{ flexDirection: "row", marginRight: 15, marginTop: -5 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textDecorationLine: "underline",
                color: "rgb(150,150,150)",
                marginRight: 7,
                paddingTop: 3,
              }}
            >
              {FTimeText}
            </Text>
            <Icon
              name="calendar"
              type="feather"
              color="rgb(150,150,150)"
              size={25}
            />
          </TouchableOpacity>
        </View>

        <Card containerStyle={{ marginTop: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 100 }}
          >
            <View style={styles.addScentView}>
              {memoizedFScents}
              {showFScentTextInput.map((textinput) => (
                <TextInput
                  key={textinput.id}
                  autoFocus={true}
                  multiline
                  maxLength={10}
                  onChangeText={(text) => setButtonText(text)}
                  onEndEditing={() => addFScent()}
                  style={styles.FScentTextInput}
                />
              ))}
              <TouchableOpacity onPress={writeFScent}>
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
          <TouchableOpacity
            onPress={handleGlassAnimate}
          >
            <View style={[styles.noteExpandTitle, {width: screenWidth}]}>
              <Text
                style={[
                  styles.noteTitleText,
                  { marginLeft: 20, marginTop: -2 },
                ]}
              >
                글라스
              </Text>

              <Icon
                name="chevron-right"
                color="black"
                size={30}
                style={{ marginRight: 10, marginTop: -5 }}
              />
            </View>
          </TouchableOpacity>

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
                nestedScrollEnabled={true} //중첩 스크롤뷰 인식
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
          <TouchableOpacity onPress={handleColorAnimate}>
          <View style={[styles.noteExpandTitle, {width: screenWidth}]}>
              <Text
                style={[
                  styles.noteTitleText,
                  { marginLeft: 20, marginTop: -2 },
                ]}
              >
                색상
              </Text>
              <Icon
                name="chevron-right"
                color="black"
                size={30}
                style={{ marginRight: 10, marginTop: -5 }}
              />
            </View>
          </TouchableOpacity>

          <Animated.View
            style={{
              height: ColorHeightValue,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
            >
              {ColorArray.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: color,
                    padding: 15,
                    margin: 5,
                    borderColor:
                      ColorSelected === index ? "rgb(0,0,0)" : "transparent",
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
          <TouchableOpacity onPress={handleViscosityAnimate}>
            <View style={[styles.noteExpandTitle, {width: screenWidth}]}>
              <Text
                style={[
                  styles.noteTitleText,
                  { marginLeft: 20, marginTop: -2 },
                ]}
              >
                점도
              </Text>
              <Icon
                name="chevron-right"
                color="black"
                size={30}
                style={{ marginRight: 10, marginTop: -5 }}
              />
            </View>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={handleSugarAnimate}>
          <View style={[styles.noteExpandTitle, {width: screenWidth}]}>
              <Text
                style={[
                  styles.noteTitleText,
                  { marginLeft: 20, marginTop: -2 },
                ]}
              >
                당도
              </Text>
              <Icon
                name="chevron-right"
                color="black"
                size={30}
                style={{ marginRight: 10, marginTop: -5 }}
              />
            </View>
          </TouchableOpacity>
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

      {/********************시음일 날짜 모달********************/}
      <DateTimePickerModal
        isVisible={isTastingDayVisible}
        mode="date"
        onConfirm={TastingDayConfirm}
        onCancel={() => setTastingDayVisible(false)}
      />

      {/********************날짜 및 시간 모달********************/}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={DatePickerConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      {/********************시간 모달 - 중간맛********************/}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={TimePickerConfirm}
        onCancel={() => setTimePickerVisibility(false)}
      />

      {/********************시간 모달 - 끝향********************/}
      <DateTimePickerModal
        isVisible={isFTimePickerVisible}
        mode="time"
        onConfirm={FTimePickerConfirm}
        onCancel={() => setFTimePickerVisibility(false)}
      />

      {/********************첫향, 중간맛, 끝향 바 조절 Dialog********************/}
      <Dialog isVisible={slideVisible.b} onBackdropPress={() => setSlideVisible({ index: 0, id: 0, b: false })}>
      <Dialog.Title title={`슬라이더바 삭제하시겠습니까?`} />

        {/* Slider를 다이얼로그 안에 포함 */}
        <Slider
          value={slideValue}
          onValueChange={setSlideValue}
          maximumValue={10}
          minimumValue={1}
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
                  color="black"
                />
              </View>
            ),
          }}
        />

      <Dialog.Actions>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Dialog.Button
            title="확인"
            onPress={() => {
              handlePressScent();
            }}
          />
          <Dialog.Button title="취소" onPress={() => setSlideVisible({ index: 0, id: 0, b: false })} />
        </View>
      </Dialog.Actions>
    </Dialog>

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
          title={`${Scents[DeleteScentId.bId]?.name}를 삭제하시겠습니까?`}
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

      {/********************중간맛 버튼 삭제 Dialog********************/}
      <Dialog
        isVisible={DeleteMTaste}
        onBackdropPress={() => DeleteMTasteDialog(0)}
      >
        <Dialog.Title
          title={`${MTastes[DeleteMTasteId.bId]?.name}를 삭제하시겠습니까?`}
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
                DeleteMTasteBtn();
              }}
            />
            <Dialog.Button title="취소" onPress={() => DeleteMTasteDialog(0)} />
          </View>
        </Dialog.Actions>
      </Dialog>

      {/********************끝향 버튼 삭제 Dialog********************/}
      <Dialog
        isVisible={DeleteFScent}
        onBackdropPress={() => DeleteFScentDialog(0)}
      >
        <Dialog.Title
          title={`${FScents[DeleteFScentId.bId]?.name}를 삭제하시겠습니까?`}
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
                DeleteFScentBtn();
              }}
            />
            <Dialog.Button title="취소" onPress={() => DeleteFScentDialog(0)} />
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
  addScentView: {
    flexDirection: "column",
    flexWrap: "wrap", //자동확장
    justifyContent: "space-between",
    height: 100,
  },
  ScentView: {
    flexDirection: "row",
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
  ScentTextInput: {
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
  MTasteTextInput: {
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
  FScentTextInput: {
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