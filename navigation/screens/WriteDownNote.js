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
import { Header, Icon, Card, Button } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";

let buttonTitleLen; //느낌 버튼 길이

export default function WriteDownNote({ navigation }) {
  const [buttonText, setButtonText] = useState(""); //버튼 이름
  const [showTextInput, setshowTextInput] = useState([]); //textinput 생성 및 삭제
  
  const [Tastes, setTastes] = useState([]); //느낌 버튼 배열
  const [TasteViews, setTasteViews] = useState([]);//느낌 버튼을 감싼 View

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
    const newTaste = //새로운 버튼 추가
      (
        <View key={Tastes.length} style={{marginRight: 5,}}>
          <Button
          color="rgb(102,204,102)"
          onPress={() => console.log(`Button ${Tastes.length + 1} pressed`)}
        >
          <Text style={{fontSize: 20,}}>{buttonText}</Text>
        </Button>
        </View>
      );

    if(buttonText.length === 0) {//버튼이름길이 = 0
      setshowTextInput(showTextInput.slice(1)); //textinput 제거
      return;
    }

    buttonTitleLen += buttonText.length*13 + 30;
    if(buttonTitleLen>Math.floor(Dimensions.get('window').width)-40){
      //다음줄로 넘어가기
      setshowTextInput(showTextInput.slice(1)); //textinput 제거
      return;
    }

    setshowTextInput(showTextInput.slice(1)); //textinput 제거
    setTastes((prevButtons) => [...prevButtons, newTaste]); //느낌 버튼 배열 추가

    setButtonText("");//버튼 이름 초기화
  };

  const writeTaste = () => {
    //버튼(느낌) 추가 전 textinput
    setshowTextInput([...showTextInput, { id: 1 }]);
  };

  useEffect(() => {
    // 페이지가 반환될 때 호출되는 로직을 여기에 작성
    buttonTitleLen = 0;
    //console.log('start');
    return () => {
      // Clean-up 함수 (Optional): 페이지가 반환될 때 호출되는 추가 작업
      buttonTitleLen = 0;
      //console.log('end');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={NoteMenu}>
              <Icon name="menu" color="white" />
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
        backgroundColor="rgb(102,204,102)"
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
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              {Tastes.map((button) => button)}
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
      </ScrollView>
    </SafeAreaView>
  );
}

/*
const DynamicButtons = () => {
  const [views, setViews] = useState([]);

  const addView = () => {
    // 현재 views 배열의 길이를 기반으로 고유한 key를 생성
    const key = views.length;

    // 새로운 View와 버튼을 추가
    setViews((prevViews) => [
      ...prevViews,
      (
        <View key={key} style={{ marginVertical: 10 }}>
          <TouchableOpacity onPress={() => console.log(`Button in View ${key} pressed`)}>
            <Text>Button {key + 1}</Text>
          </TouchableOpacity>
        </View>
      ),
    ]);
  };

  return (
    <View>
      {views}

      <TouchableOpacity onPress={addView}>
        <Text>Add View</Text>
      </TouchableOpacity>
    </View>
  );
};
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {},
  heading: {
    color: "white",
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
    color: "white",
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
