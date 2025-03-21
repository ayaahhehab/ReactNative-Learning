import React, { useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from "./screens/Login";
import { HomeStackNavigatorParamList } from './type';
import ProfileContent from './screens/Profile';
import Splash from './screens/Splash';
import {useTranslation, I18nextProvider} from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';


const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();
const queryClient = new QueryClient();

export default function App() {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  async function requestUserPermission() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  const getToken = async() => {
    const token = await messaging().getToken()
    console.log("Token= ",token)
  }
  useEffect(()=> {
    requestUserPermission();
    getToken();
  },[])

  useEffect(() => {
    setTimeout(() => { setIsLoading(false); }, 2000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash'>
          {isLoading ? (
            <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='Profile' component={ProfileContent as React.ComponentType<any>} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
