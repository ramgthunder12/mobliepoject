import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import TabContainer from './TabContainer';
import Home from './screens/Home';
import Search from './screens/Search';
import TasteNote from './screens/TasteNote';
import WriteDownNote from './screens/WriteDownNote';
import Detail from './screens/Detail';
import MyPage from './screens/MyPage';
import UserInfo from './screens/UserInfo';
import ViewTasteNote from './screens/ViewTasteNote';
import Login from './screens/Login';
import Signup from './screens/Signup';
import BarcodeDetail from './screens/BarcodeDetail';

const Stack = createStackNavigator();

export default function StackContainer() {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name={'TabContainer'} component={TabContainer}/>
        <Stack.Screen name={'Home'} component={Home}/>
        <Stack.Screen name={'Search'} component={Search}/>
        <Stack.Screen name={'TasteNote'} component={TasteNote}/>
        <Stack.Screen name={'WriteDownNote'} component={WriteDownNote}/>
        <Stack.Screen name={'Detail'} component={Detail}/>
        <Stack.Screen name={'BarcodeDetail'} component={BarcodeDetail}/>
        <Stack.Screen name={'MyPage'} component={MyPage}/>
        <Stack.Screen name={'UserInfo'} component={UserInfo}/>
        <Stack.Screen name={'ViewTasteNote'} component={ViewTasteNote}/>
        <Stack.Screen name={'Login'} component={Login}/>
        <Stack.Screen name={'Signup'} component={Signup}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  
});