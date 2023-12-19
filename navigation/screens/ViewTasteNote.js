import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
  Animated,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  Header,
  Icon,
  Card,
  Button,
  Dialog,
  Slider,
  Switch,
} from "@rneui/themed";
import { useRoute } from '@react-navigation/native';
import RadarChart from "../components/SpiderGraph";

export default function ViewTasteNote({ navigation }) {
  const route = useRoute();
  const { note, image, name, avgStar } = route.params;
  const screenWidth = Dimensions.get("window").width; //화면 가로길이

  const [tasteVisible, setTasteVisible] = useState(false);//느낌 보여주기
  const [memoVisible, setMemoVisible] = useState(false);//메모 보여주기
  const [scentVisible, setScentVisible] = useState(false);//첫향 보여주기
  const [ScentChartData, setScentChartData] = useState([]);//첫향 그래프값
  const [MTasteVisible, setMTasteVisible] = useState(false);//중간맛 보여주기
  const [MTasteChartData, setMTasteChartData] = useState([]);//중간맛 그래프값
  const [FScentVisible, setFScentVisible] = useState(false);//끝향 보여주기
  const [FScentChartData, setFScentChartData] = useState([]);//끝향 그래프값
  const [GlassVisible, setGlassVisible] = useState(false);//글라스 보여주기
  const [ColorVisible, setColorVisible] = useState(false);//색상 보여주기
  const [viscosityVisible, setViscosityVisible] = useState(false);//점도 보여주기
  const [SugarVisible, setSugarVisible] = useState(false);//당도 보여주기

  const parseChartData = (scent, values) => {//,를 기준으로 나눠서 배열로 만들어주는 함수
    const scentArray = scent.split(",");
    const valuesArray = values.split(",");
  
    const result = [];
    for (let i = 0; i < scentArray.length; i++) {
      result.push({ [scentArray[i]]: parseFloat(valuesArray[i]/10) });
    }
    if(result.length < 3){
      result.push({"=": 0});
    }
    if(result.length < 3){
      result.push({"-": 0});
    }

    console.log([Object.assign({}, ...result)]);
  
    return [Object.assign({}, ...result)];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);
    return formattedDate;
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedTime = new Date(dateString).toLocaleTimeString('en-US', options);
    return formattedTime;
  };

  useEffect(() => {
    console.log(note);
    if(note.tastenote_info !== "") setTasteVisible(true);
    if(note.memo !== "") setMemoVisible(true);
    if(note.firstscent !== "") {//첫향
      setScentVisible(true);
      setScentChartData(parseChartData(note.firstscent, note.firstscent_value));
    }
    if(note.middlescent !== "") {//중간맛
      setMTasteVisible(true);
      setMTasteChartData(parseChartData(note.middlescent, note.middlescent_value));
    }
    if(note.finalscent !== "") {//끝향
      setFScentVisible(true);
      setFScentChartData(parseChartData(note.finalscent, note.finalscent_value));
    }
    if(note.glass !== "") {//글라스
      setGlassVisible(true);
    }
    if(note.color !== "" && note.color !== null) {//색상
      setColorVisible(true);
    }
    if(note.viscosity !== 0) {//점도
      setViscosityVisible(true);
    }
    if(note.sugar !== 0) {//당도
      setSugarVisible(true);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header
        leftComponent={
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="chevron-left" color="black" size={30} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
            <Text style={{fontSize: 25}}>{name}</Text>
        }
        backgroundColor="rgb(255,255,255)"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "white", width: screenWidth }}
      >
        {/*맨 위쪽 주류사진, 날짜, 별점, 느낌, 글라스*/}
        <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
          <Image source={{uri: image}} style={{marginLeft: 15, height: 200, width: 150, }} />
          <View style={{flexDirection: "column", justifyContent: "flex-start"}}>
            <Text style={{fontSize: 25}}>{note.tasting_day}</Text>
            <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
            <Icon name="star" type="font-awesome" color="#FFCC00" size={30} style={{marginTop: 10, marginRight: 10}}/>
            <Text style={{fontSize: 40}}>{`${note.tastenote_starpoint}/${avgStar}`}</Text>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", marginTop: 10}}>
              {tasteVisible&&note.tastenote_info.split(",").map((taste, index) => (
                <View key={index} style={{borderRadius: 10, backgroundColor: "#33FF33", marginRight: 10}}>
                  <Text style={{fontSize: 20, padding: 5, paddingRight: 10, paddingLeft: 10}}>{taste}</Text>
                </View>
              ))}
            </View>
            {GlassVisible&&<Text style={{fontSize: 20, marginTop: 10}}>{`Glass : ${note.glass}`}</Text>}
            {ColorVisible&&
            <View style={{flexDirection: "row", justifyContent: "flex-start", marginTop: 10}}>
              <Text style={{fontSize: 20,}}>색상 : </Text>
              <View style={{backgroundColor: note.color, width: 30, height: 30}}></View>
              </View>
              }
          </View>
        </View>

        {/*메모*/}
        {memoVisible&&<Card containerStyle={{ marginTop: 10 }}>
          <Text style={{fontSize: 20}}>{note.memo}</Text>
        </Card>}

        {/*첫향*/}
        {scentVisible&&
        <View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: screenWidth}}>
        <Card.Divider style={{ marginTop: 15, marginBottom: 40, width: screenWidth }} />
          <Text style={{fontSize: 25}}>{`첫향 : 노즈 (${formatDate(note.creationDate)})`}</Text>
          <RadarChart
        graphSize={350}
        scaleCount={10}
        numberInterval={5}
        data={ScentChartData}
        options={{
          graphShape: 1,
          showAxis: true,
          showIndicator: true,
          colorList: ["red"],
          dotList: [false],
        }}
      />
      </View>}

      {/*중간맛*/}
      {MTasteVisible&&<View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginTop: 15, width: screenWidth}}>
      <Card.Divider style={{ width: screenWidth, marginBottom: 40, }} />
          <Text style={{fontSize: 25}}>{`중간맛 : 팔레트 (${formatTime(note.middleScentDate)})`}</Text>
          <RadarChart
        graphSize={350}
        scaleCount={10}
        numberInterval={5}
        data={MTasteChartData}
        options={{
          graphShape: 1,
          showAxis: true,
          showIndicator: true,
          colorList: ["red"],
          dotList: [false],
        }}
      />
      </View>}
      
      {/*끝향*/}
      {FScentVisible&&<View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginTop: 15, width: screenWidth}}>
      <Card.Divider style={{ width: screenWidth, marginBottom: 40, }} />
          <Text style={{fontSize: 25}}>{`끝향 : 피니쉬 (${formatTime(note.firstScentDate)})`}</Text>
          <RadarChart
        graphSize={350}
        scaleCount={10}
        numberInterval={5}
        data={FScentChartData}
        options={{
          graphShape: 1,
          showAxis: true,
          showIndicator: true,
          colorList: ["red"],
          dotList: [false],
        }}
      />
      </View>}

      {viscosityVisible&&
      <View style={{flexDirection: "column", justifyContent: "flex-start"}}>
        <Card.Divider style={{ width: screenWidth, marginBottom: 40, }} />
          <Text style={{fontSize: 25, marginLeft: 35}}>점도</Text>
          <View style={{ marginRight: 35, marginLeft: 35}}>
        <Slider
              value={note.viscosity}
              onValueChange={() => {}}
              maximumValue={5}
              minimumValue={0}
              step={1}
              allowTouchTrack={false}
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
                      color={"black"}
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
            </View>}

        {SugarVisible&&
          <View style={{flexDirection: "column", justifyContent: "flex-start", marginBottom: 20}}>
          <Card.Divider style={{ width: screenWidth, marginBottom: 40, }} />
            <Text style={{fontSize: 25, marginLeft: 35}}>당도</Text>
            <View style={{ marginRight: 35, marginLeft: 35}}>
            <Slider
              value={note.sugar}
              onValueChange={() => {}}
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
                      color={"black"}
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
              </View>
        }
        
      </ScrollView>

    </SafeAreaView>
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