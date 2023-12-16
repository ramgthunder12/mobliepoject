import { StyleSheet, Text, View } from 'react-native';
import Search from '../screens/Search';

export default function SearchMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <Search navigation={navigation} />
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
