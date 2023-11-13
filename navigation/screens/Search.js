import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Button } from "@rneui/themed";

export default function App() {
  const [searchText, setSearchText] = useState("");
  // const handleSearchPress = () => {
  //   // 검색 버튼을 누를 때 키패드를 나타냅니다.
  //   Keyboard.dismiss();  // 기존에 열려있는 키패드가 있다면 닫습니다.
  //   Keyboard.show();     // 새로운 키패드를 엽니다.
  // };

  return (
    <View style={styles.container}>
      <Button>Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="warning">Warning</Button>
      <Button color="error">Error</Button>

      <TextInput
        style={styles.searchInput}
        placeholder="검색어를 입력하세요"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingLeft: 20,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    width: "100%",
  },
});
