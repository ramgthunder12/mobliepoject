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
import { Rating } from "react-native-ratings";

export default function ViewTasteNote({ navigation }) {
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
        </View>
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
