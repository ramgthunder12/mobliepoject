import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import TabContainer from './TabContainer';
import Home from './screens/Home';
import Search from './screens/Search';
import TasteNote from './screens/TasteNote';

const Stack = createStackNavigator();

export default function StackContainer() {
  return (
    <Stack.Navigator>
        <Stack.Screen name={'TabContainer'} component={TabContainer} options={{headerShown: false,}}/>
        <Stack.Screen name={'Home'} component={Home} options={{headerShown: false,}}/>
        <Stack.Screen name={'Search'} component={Search} options={{headerShown: false,}}/>
        <Stack.Screen name={'TasteNote'} component={TasteNote} options={{headerShown: false,}}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  
});
