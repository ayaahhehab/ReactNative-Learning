import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { HomeStackNavigationProp } from '../type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

interface APIresponse {
    success: boolean;
    token: string; 
    result?: {
        name: string;
    };
}
export default function Login() {
    const {t, i18n} = useTranslation();
    const navigation = useNavigation<HomeStackNavigationProp>()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [language, setLanguage] = useState<string>('');

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

    const mutation = useMutation<APIresponse,Error,{ username: string; password: string }>({
        mutationFn: async (LoginCredentials)=> {const response = await axios.post('http://demo5037325.mockable.io/login', LoginCredentials);
            return response.data;
        },
        onSuccess: async (data) => {
            console.log('API response: ', data);
            // await AsyncStorage.setItem('username', username);
            // navigation.navigate('Profile');
            if (data.result && data.result.name) {
                await AsyncStorage.setItem('username', data.result.name);
                navigation.navigate('Profile', { username: data.result.name});
            } 
        },
        onError: (error) => {
            console.error('Error message:', error);
        },
    });

    const handleLogin = async () => {
        mutation.mutate({ username, password });
        await AsyncStorage.setItem('language', language);

    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {t ('login')}
                    </Text>
                    <Image source={require('../assets/account.png')} alt="logo" style={styles.headerImg} />
                </View>
                <View style={styles.form}>
                    <View style={styles.input}>
                    <Text style={styles.inputLable}>{t('enter-email')}</Text>
                    <TextInput
                            style={styles.placeholder} 
                            placeholder='abc@gmail.com'
                            keyboardType="email-address"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>
                    <View style={styles.input}>
                    <Text style={styles.inputLable}>{t('enter-password')}</Text>
                    <TextInput
                            secureTextEntry={true}
                            style={styles.placeholder} 
                            placeholder='************'
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                    <View style={styles.button}>
                        <Text style={styles.loginButtonText}>{t('login')}</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.orText}>{t('or')}</Text>
                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity>
                        <Image source={require('../assets/facebook.png')} alt="facebook" style={styles.socialButton} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../assets/google.png')} alt="google" style={styles.socialButton} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../assets/linkedin.png')} alt="linkedin" style={styles.socialButton} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.end}>{t('new-user')}<Text style={styles.link}>{t('create-account')}</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:{
        backgroundColor:'#F5F7F8',
        flex:1
    },
    container: {
        padding: 40,
    },
    header: {
        marginVertical: '20%',
    },
    headerImg: {
        width: 80,
        height: 80,
        alignSelf: 'center'
    },
    title: {
        fontSize: 30,
        color: '#AC87C5',
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 10,
    },
    form: {
        marginTop: 25,
    },
    input: {
        marginBottom: 20,
    },
    inputLable: {
        fontSize: 15,
        color: '#AC87C5',
        marginBottom: 2,
    },
    placeholder: {
        borderRadius: 3,
        height: 40,
        backgroundColor:'white',
        borderColor: '#AC87C5',
        borderStyle: 'solid',
        borderWidth: 0.5,
        paddingHorizontal: 10,
    },
    loginButton: {
        width: 150,
        marginVertical: 30,
        margin: 'auto',
    },
    button: {
        backgroundColor: '#756AB6',
        paddingVertical: 15,
        borderRadius: 50,
        alignItems: 'center',
        width: '100%',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
    },
    orText: {
        fontSize: 17,
        color: '#756AB6',
        marginVertical: 40,
        textAlign: 'center',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '50%',
        marginBottom: 20,
        alignSelf: 'center',
    },
    socialButton: {
        width: 40,
        height: 40,
    },
    end: {
        textAlign: 'center',
        paddingTop: 20,
        margin:'auto',
        fontSize:18,
        color:'#756AB6'
    },
    link: {
        color: '#CB6040'
    }
});
