import 'react-native-gesture-handler';
import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, Card, Icon } from "@rneui/themed";


export default function Category({ navigation }) {
  const [TasteNotes, setTasteNotes] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../images/menuicons/note_focus.png')} style={{ width: 25, height: 25, marginRight: 10, margin: 10,}} />
        <Text style={styles.headerText}>테이스팅 노트</Text>
      </View>
      <Card.Divider/>
      <View style={{height: 200,}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          
          {/*테이스팅 노트 작성하기*/}
          <TouchableOpacity onPress={() => navigation.navigate('WriteDownNote')}>
          <View style={styles.addTasteNoteView}>
            <Icon name="pluscircleo" type="antdesign" size={30} color="rgb(255,255,255)"/>
          </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Card.Divider style={{marginTop: 15,}}/>
    </SafeAreaView>
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
    width: 130,
    borderRadius: 10,
    marginLeft: 15, 
  }
});


/*
import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { Button } from "@rneui/themed";


export default function Category({ navigation }) {
  return (
    <View style={styles.container}>
      <Button onPress={
        () => navigation.navigate('WriteDownNote', 
          {
            id: 80,
            otherParam: '애플맛',
          })}>노트작성</Button>
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