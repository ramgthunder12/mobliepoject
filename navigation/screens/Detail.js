// screens/DetailScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet,Button, useState } from 'react-native';

const Detail  = ({ navigation }) => {
  const [itemDetail, setItemDetail] = useState({
    id: 1,
    name: '',
    image: require('../../images/alcholicons/sd.jpg'),
    price: 0,
    description: '',
  });

  useEffect(() => {
    // 가상의 데이터를 가져와서 상태 변수에 설정합니다.
    const fetchData = async () => {
      // 실제 데이터베이스에서 데이터를 가져온다고 가정하고, 해당 데이터를 설정합니다.
      const fetchedData = {
        id: 1,
        name: '가상의 술',
        image: require('../../images/alcholicons/sd.jpg'),
        price: 10000,
        description: '가상의 술에 대한 설명이 들어갑니다.',
      };
      setItemDetail(fetchedData);
    };
      fetchData();
    }, []); 
  

  return (
    
    <View style={styles.container}>

      <Text style={styles.title}>술 상세 정보</Text>
      <Image source={itemDetail.image} style={styles.image} />
      <Text style={styles.detailText}>
        <Text style={styles.labelText}>술 이름:</Text> {itemDetail.name}
      </Text>
      <Text style={styles.detailText}>
{itemDetail.price}
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
    fontSize: 25,
    marginBottom: 8,
    textAlign: 'left',
  },
  labelText: {
    fontWeight: 'bold',
  },
});

export default Detail;
