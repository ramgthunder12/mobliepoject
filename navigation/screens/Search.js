import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [searchText, setSearchText] = useState('');
  // const handleSearchPress = () => {
  //   // 검색 버튼을 누를 때 키패드를 나타냅니다.
  //   Keyboard.dismiss();  // 기존에 열려있는 키패드가 있다면 닫습니다.
  //   Keyboard.show();     // 새로운 키패드를 엽니다.
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>안녕하세요, Expo!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleButtonPress(1)}>
          <Text style={styles.buttonText}>home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleButtonPress(2)}>
          <Text style={styles.buttonText}>버튼 2</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleButtonPress(3)}>
          <Text style={styles.buttonText}>버튼 3</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleButtonPress(4)}>
          <Text style={styles.buttonText}>버튼 4</Text>
        </TouchableOpacity>
      </View>

      {/* 검색을 위한 TextInput 추가 */}
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 650,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderColor: 'blue',
  },
  searchInput: {
    marginTop: -600,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    width: '100%',
  },
});