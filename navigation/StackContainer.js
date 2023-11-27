import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import TabContainer from './TabContainer';
import Home from './screens/Home';
import Search from './screens/Search';
import TasteNote from './screens/TasteNote';
import WriteDownNote from './screens/WriteDownNote';
import Detail from './screens/Detail';

const Stack = createStackNavigator();

export default function StackContainer() {
  return (
    <Stack.Navigator initialRouteName='TabContainer' screenOptions={{ headerShown: false }}>
        <Stack.Screen name={'TabContainer'} component={TabContainer}/>
        <Stack.Screen name={'Home'} component={Home}/>
        <Stack.Screen name={'Search'} component={Search}/>
        <Stack.Screen name={'TasteNote'} component={TasteNote}/>
        <Stack.Screen name={'WriteDownNote'} component={WriteDownNote}/>
        <Stack.Screen name={'Detail'} component={Detail}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  
});
 <Stack.Screen name={'WriteDownNote'} component={WriteDownNote}/>