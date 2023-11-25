import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ onPress, percentFilled }) => {
  const containerStyle = {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0', // 전체 배경 색상
    borderRadius: 8,
    overflow: 'hidden',
  };

  const filledAreaStyle = {
    flex: percentFilled / 100,
    backgroundColor: '#3498db', // 채워진 영역의 배경 색상
  };

  const emptyAreaStyle = {
    flex: (100 - percentFilled) / 100,
    backgroundColor: 'transparent', // 비어있는 영역의 배경 색상
  };

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <View style={filledAreaStyle}></View>
      <View style={emptyAreaStyle}></View>
      <Text style={{ padding: 10, color: 'white' }}>버튼</Text>
    </TouchableOpacity>
  );
};

// 사용 예시
const App = () => {
  const handlePress = () => {
    // 버튼이 눌렸을 때 실행되는 함수
    console.log('Button Pressed!');
  };

  return (
    <CustomButton onPress={handlePress} percentFilled={70} />
  );
};

export default App;
