import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackContainer from './navigation/StackContainer';



export default function App() {
  return (
    <NavigationContainer>
      <StackContainer/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
