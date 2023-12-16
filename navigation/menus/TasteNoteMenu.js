import { StyleSheet, Text, View } from 'react-native';
import TasteNote from '../screens/TasteNote'

export default function TasteNoteMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <TasteNote navigation={navigation} />
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
