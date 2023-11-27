// screens/DetailScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet,Button } from 'react-native';

const Detail  = ({ navigation }) => {
  const itemDetail = {
    id: 1,
    image: require('../../images/alcholicons/sd.jpg'),
    name: '가상의 술', // 이미지 파일의 경로에 맞게 수정
    price: 10000,
    description: '가상의 술에 대한 설명이 들어갑니다.',
  };

  return (
    
    <View style={styles.container}>

      <Text style={styles.title}>술 상세 정보</Text>
      <Image source={itemDetail.image} style={styles.image} />
      <Text style={styles.detailText}>
        <Text style={styles.labelText}>술 이름:</Text> {itemDetail.name}
      </Text>
      <Text style={styles.detailText}>
        <Text style={styles.labelText}>가격:</Text> ₩{itemDetail.price}
      </Text>
      <Text style={styles.detailText}>
        <Text style={styles.labelText}>설명:</Text> {itemDetail.description}
      </Text>
      <Button
        title="테이스팅노트 작성"
        onPress={() => navigation.navigate('WriteDownNote')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  detailText: {
    marginBottom: 8,
    textAlign: 'left',
  },
  labelText: {
    fontWeight: 'bold',
  },
});

export default Detail;
