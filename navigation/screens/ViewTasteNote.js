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

export default function ViewTasteNote({ navigation }) {
  const route = useRoute();
  const { note } = route.params;

  useEffect(() => {
    console.log(note);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header
        leftComponent={
          <View style={styles.headerLeft}>
            <TouchableOpacity>
              <Icon name="chevron-left" color="black" size={30} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={styles.heading}>
            <Text style={styles.headerSideText}>테이스팅 노트</Text>
            <TouchableOpacity style={{ marginLeft: 5 }}>
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