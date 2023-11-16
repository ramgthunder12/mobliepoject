import { StyleSheet, Text, View } from 'react-native';
import Home from '../screens/Home'

export default function HomeMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <Home navigation={navigation}/>
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
