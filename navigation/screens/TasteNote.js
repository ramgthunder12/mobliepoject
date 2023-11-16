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