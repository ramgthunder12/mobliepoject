import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeMenu from './menus/HomeMenu';
import SearchMenu from './menus/SearchMenu';
import BarcodeScanMenu from './menus/BarcodeScanMenu';
import TasteNoteMenu from './menus/TasteNoteMenu';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
        initialRouteName={'홈'}
        screenOptions={
            ({ route }) =>({
                tabBarIcon: ({ focused, }) => {
                    let imgSource;
                    let rn = route.name;

                    if(rn === '홈'){
                        imgSource = focused ? require('../images/menuicons/home_focus.png') : require('../images/menuicons/home.png');
                    }
                    else if(rn === '바코드'){
                        imgSource = focused ? require('../images/menuicons/barcode_focus.png') : require('../images/menuicons/barcode.png');
                    }
                    else if(rn === '검색'){
                        imgSource = focused ? require('../images/menuicons/search_focus.png') : require('../images/menuicons/search.png');
                    }
                    else if(rn === '테이스팅'){
                        imgSource = focused ? require('../images/menuicons/note_focus.png') : require('../images/menuicons/note.png');
                    }

                    return <Image source={imgSource} style={{ width: focused? 30 : 25, height: focused? 30 : 25 }} />
                },
                tabBarActiveTintColor: 'green',
                tabBarInactiveTintColor: 'black'
            })
        }
    >
        <Tab.Screen name={'검색'} component={SearchMenu} options={{headerShown: false,}} />
        <Tab.Screen name={'홈'} component={HomeMenu} options={{headerShown: false,}} />
        <Tab.Screen name={'바코드'} component={BarcodeScanMenu} options={{headerShown: false,}} />
        <Tab.Screen name={'테이스팅'} component={TasteNoteMenu} options={{headerShown: false,}} />
    </Tab.Navigator>
  );
}
