import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Tab, TabView } from '@rneui/themed';

function MenuSeparator() {
  return <View style={styles.menuSeparator} />;
}

export default function HomeMenu() {
  const navigation = useNavigation();

  const [index, setIndex] = React.useState(0);

  const getMenuItems = () => {
    switch (index) {
      case 0:
        return [
          { id: 1, title: '메뉴 1', image: require('../../images/alcholicons/sd.jpg') },
          { id: 2, title: '메뉴 2', image: require('../../images/alcholicons/sd.jpg') },
          { id: 3, title: '메뉴 3', image: require('../../images/alcholicons/sd.jpg') },
          { id: 4, title: '메뉴 4', image: require('../../images/alcholicons/sd.jpg') },
          { id: 5, title: '메뉴 5', image: require('../../images/alcholicons/sd.jpg') },
          { id: 6, title: '메뉴 6', image: require('../../images/alcholicons/sd.jpg') },
          { id: 7, title: '메뉴 7', image: require('../../images/alcholicons/sd.jpg') },
        ];
      case 1:
        return [
          { id: 6, title: '메뉴 6unction MenuSepa', image: require('../../images/alcholicons/sd.jpg') },
          { id: 7, title: '메뉴 7', image: require('../../images/alcholicons/sd.jpg') },
          { id: 8, title: '메뉴 8', image: require('../../images/alcholicons/sd.jpg') },
          { id: 9, title: '메뉴 9', image: require('../../images/alcholicons/sd.jpg') },
          { id: 10, title: '메뉴 10', image: require('../../images/alcholicons/sd.jpg') },
          
        ];
      case 2:
        return [
          { id: 11, title: '메뉴 11', image: require('../../images/alcholicons/sd.jpg') },
          { id: 12, title: '메뉴 12', image: require('../../images/alcholicons/sd.jpg') },
          { id: 13, title: '메뉴 13', image: require('../../images/alcholicons/sd.jpg') },
          { id: 14, title: '메뉴 14', image: require('../../images/alcholicons/sd.jpg') },
          { id: 15, title: '메뉴 15', image: require('../../images/alcholicons/sd.jpg') },
        ];
      default:
        return [];
    }
  };

  const handleMenuItemPress = (itemId) => {
    navigation.navigate('Detail', { itemId });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
      <Text style={styles.headerText}>첫술</Text>

      <Tab
  value={index}
  onChange={(e) => setIndex(e)}
  variant="primary"
  style={{ backgroundColor: '#A0C843', height: 70 }}
  indicatorStyle={{ backgroundColor: 'transparent' }}
>
  <Tab.Item
    title="이름 순"
    containerStyle={(active) => ({
      backgroundColor: active ? "green" : undefined,
    })}
    icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
  />
  <Tab.Item
    title="별점 순"
    containerStyle={(active) => ({
      backgroundColor: active ? "green" : undefined,
    })}
    icon={{ name: 'star', type: 'ionicon', color: 'white' }}
  />
  <Tab.Item
    title="리뷰 많은 순위"
    containerStyle={(active) => ({
      backgroundColor: active ? "green" : undefined,
    })}
    icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
  />
</Tab>
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
<View style={styles.additionalMenu}>
<TouchableOpacity>
  <Text style={styles.additionalMenuText}>추가 메뉴 1</Text>
</TouchableOpacity>
<TouchableOpacity>
  <Text style={styles.additionalMenuText}>추가 메뉴 2</Text>
</TouchableOpacity>
<TouchableOpacity>
  <Text style={styles.additionalMenuText}>추가 메뉴 2</Text>
</TouchableOpacity>
<TouchableOpacity>
  <Text style={styles.additionalMenuText}>추가 메뉴 2</Text>
</TouchableOpacity>
<TouchableOpacity>
  <Text style={styles.additionalMenuText}>추가 메뉴 2</Text>
</TouchableOpacity>
<TouchableOpacity>
  <Text style={styles.additionalMenuText}>추가 메뉴 2</Text>
</TouchableOpacity>
</View>
</ScrollView>

        <ScrollView style={styles.scrollView}>

          <MenuSeparator />
        
          {getMenuItems().map((menuItem) => (
  <TouchableOpacity
    key={menuItem.id}
    style={[styles.menuItem, { height: 70 }]}
    onPress={() => handleMenuItemPress(menuItem.id)}
    
  >
    <View style={styles.menuItemContent}>
      <Image source={menuItem.image} style={styles.menuItemImage} />
      <Text style={styles.menuItemText}>{menuItem.title}</Text>
    </View>
  </TouchableOpacity>
))}
          <MenuSeparator />

        </ScrollView>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingTop: 10,
    
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 0,
    marginTop: 20, // 상단 여백 추가
  },
  headerText: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 10,
    alignItems: 'flex-start',
    marginTop: 0,
  },
  additionalText: {
    fontSize: 20,
    marginBottom: 20,
    color: 'gray',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30, // 상하 여백을 큰 값으로 조절
    paddingHorizontal: 120, // 좌우 여백을 큰 값으로 조절
    borderRadius: 20, // 큰 borderRadius 값으로 조절
    marginBottom: 20, // 큰 marginBottom 값으로 조절
    height: 80, 
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center', // 세로 중앙 정렬
  },
  menuItemImage: {
    width: 60, // 큰 이미지 크기로 조절
    height: 60, // 큰 이미지 크기로 조절
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 24, // 더 작은 글자 크기로 조절
    color: 'black',
  },
  tab: {
    backgroundColor: '#A0C843',
    height: 40,
    marginBottom: -70, // Tab의 높이를 작은 값으로 조절
  },

  menuSeparator: {
    height: 10,
  },
  additionalMenu: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    marginTop: 10, // Tab 바로 아래로 이동시키기 위한 marginTop 추가
  },
  additionalMenuText: {
    fontSize: 20,
    marginRight: 10,
  },
});