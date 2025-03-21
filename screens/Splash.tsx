import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image } from 'react-native';
import { HomeStackNavigationProp } from '../type';
import { useTranslation } from "react-i18next";
import remoteConfig, { firebase, getRemoteConfig } from '@react-native-firebase/remote-config';
import messaging from '@react-native-firebase/messaging';


export default function Splash({ navigation }: { navigation: any }){
    const {t, i18n} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<string>('');

    const firebaseConfig= {
        projectNumber: "979123176032",
        projectId: "test-9e811",
        storageBucket: "test-9e811.firebasestorage.app",
        appId: "1:979123176032:android:498c5694687b92df7e3905",
        apiKey: "AIzaSyDTjQd_1WKVVCedUXA5RNMVajVH4u9mMuo"
    }

    useEffect(()=>{
        if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig).then(()=> {
                console.log('firebase initialized');
                remoteConfig();
            })
        }else{
            firebase.app();
            remoteConfig();
        }
    },[]);

    useEffect(() => {
        const fetchRemoteConfig = async () => {
          try {
            await remoteConfig().setDefaults({
              welcome_message: 'Welcome to My App!',
            });
            await remoteConfig().fetchAndActivate();
            const welcomeMessage = remoteConfig().getValue('welcome_message').asString();
            console.log('Welcome Message:', welcomeMessage);
          } catch (error) {
            console.error('Failed to fetch remote config:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchRemoteConfig();
      }, []);


    useEffect(() => {
        const getLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem('language');
            if (storedLanguage) {
                setLanguage(storedLanguage);
                i18n.changeLanguage(storedLanguage);
            }
        };
        getLanguage();
    }, []);
    return(
        <View style={{flex: 1,
            backgroundColor:"#CB80AB",
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
         }}>
            <Image source={require("../assets/progress-bar.png")}
            style={{width:80, height:80}}
             />
             <Text style ={{marginTop:30, color: "#F5F5F5"}}>
                {t('loading')}
             </Text>
        </View>
    )
}

