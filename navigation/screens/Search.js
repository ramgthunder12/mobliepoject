import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  View,
} from "react-native";
import { SearchBar, Text } from "@rneui/themed";

export default function App() {
  const [search, setSearch] = useState("");
  // const handleSearchPress = () => {
  //   // 검색 버튼을 누를 때 키패드를 나타냅니다.
  //   Keyboard.dismiss();  // 기존에 열려있는 키패드가 있다면 닫습니다.
  //   Keyboard.show();     // 새로운 키패드를 엽니다.
  // };

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <View style={styles.container}>
    <SearchBar
      platform="android"
      onChangeText={updateSearch}
      onClearText={() => console.log('onClearText()')}
      containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5, width: '80%'}}
      inputContainerStyle={{backgroundColor: 'white'}}
      placeholder="검색어를 입력하세요..."
      placeholderTextColor="#888"
      cancelButtonTitle="Cancel"
      onCancel={() => console.log('onCancel()')}
      value={search}
      
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
});