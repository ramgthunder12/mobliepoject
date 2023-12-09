import { NavigationContainer } from '@react-navigation/native';
import StackContainer from './navigation/StackContainer';
import { AppProvider } from './AppContext';



export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StackContainer/>
      </NavigationContainer>
    </AppProvider>
  );
}