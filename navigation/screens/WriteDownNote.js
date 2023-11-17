import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Header, Icon, Card, Button, Rating } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";

let buttonTitleLen; //느낌 버튼 길이
let TasteId = 0; //느낌 버튼 id

export default function WriteDownNote({ navigation }) {
  const [buttonText, setButtonText] = useState(""); //버튼 이름
  const [showTextInput, setshowTextInput] = useState([]); //textinput 생성 및 삭제

  const [Tastes, setTastes] = useState([]); //느낌 버튼 배열
  const [TasteViews, setTasteViews] = useState([]); //느낌 버튼을 감싼 View

  const SaveNote = () => {
    //노트저장
    console.log("노트저장");
  };
  const NoteMenu = () => {
    //노트메뉴
    console.log("노트메뉴");
  };

  const addTaste = () => { //느낌추가
    const newTaste = {//새로운 버튼 추가
      id: TasteId,
      text: buttonText,
    };//key겹침 해결해야됨

    const newTasteView ={//새로운 뷰 추가
      id: TasteViews.length,
    };

    if (buttonText.length === 0) {//이름 입력 안하면 종료
      //버튼이름길이 = 0
      setshowTextInput(showTextInput.slice(1)); //textinput 제거
      return;
    }


    buttonTitleLen += buttonText.length * 13 + 30;
    if (buttonTitleLen > Math.floor(Dimensions.get("window").width) - 40 || TasteViews.length === 0) {
      setTasteViews((prevViews) => [...prevViews, newTasteView]);//다음줄로 넘어가기
      // setTastes((prevButtons) => [...prevButtons, [newTaste]]);//버튼 추가

      setTastes((prevButtons) => {
        const newArray = [...prevButtons];
        let len;
        
        // 두 번째 차원 배열이 존재하지 않으면 초기화
        if (!newArray[TasteViews.length]) {
          newArray[TasteViews.length] = [];
          len = 0;
        }
        else len = Tastes[TasteViews.length].length;
      
        // 세 번째 차원 배열에 newTaste 추가
        newArray[TasteViews.length][len] = newTaste;
      
        return newArray;
      });
      
      setshowTextInput(showTextInput.slice(1)); //textinput 제거
      buttonTitleLen=0; //초기화
    }
    else{//버튼만 추가
      // setTastes((prevButtons) => [...prevButtons, [newTaste]]);//버튼 추가
      setTastes((prevButtons) => {
        const newArray = [...prevButtons];
        let len = Tastes[TasteViews.length-1].length;
      
        // 세 번째 차원 배열에 newTaste 추가
        newArray[TasteViews.length-1][len] = newTaste;
      
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

  const ratingCompleted = (rating) => {//별점
    console.log('Rating is: ' + rating);
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
              {TasteViews.map((views) => (//느낌 버튼 추가
                <View key={views.id} style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 5, }}>
                  {Tastes[views.id].map((button) => (
                    <View key={button.id} style={{marginRight: 5,}}>
                      <Button
                      title={button.text}
                      color="rgb(102,204,102)"
                      onPress={() =>
                        console.log(views.id)
                      }
                      style={{ fontSize: 20,  marginRight: 5,}}
                    />
                    </View>
                  ))}
                </View>
              ))}
            </View>
            {showTextInput.map((textinput) => (
              <TextInput
                key={textinput.id}
                autoFocus={true}
                placeholder="버튼 이름"
                onChangeText={(text) => setButtonText(text)}
                onEndEditing={() => addTaste()}
              />
            ))}
          </View>
        </Card>

        <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
          <Text>별점</Text>
          <Rating
          showRating
          ratingCount={10}
          fractions={2}
          onFinishRating={ratingCompleted}
          style={{ paddingVertical: 10 }}
        />
        </View>
      </ScrollView>
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
