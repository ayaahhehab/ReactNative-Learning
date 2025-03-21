import React, { useState, useEffect } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from 'react-query';
import List from './List';
import ImagePicker from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';


const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

interface ProfileProps {
    route: RouteProp<{
       Profile: {
          username?: string
          language?: string


      }
  }, 'Profile'>;
  }
  
  function ProfileContent({ route }: ProfileProps) {
    const {t, i18n} = useTranslation();
    const [username, setUsername] = useState<string>('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState<string>(''); 
    const [language, setLanguage] = useState<string>('EN');
    const { username: routeUsername, language: routeLanguage } = route.params;
    const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

    useEffect(() => {
      const getEmail = async () => {
        const storedEmail = await AsyncStorage.getItem('username');
        if (storedEmail) {
          setUsername(storedEmail);
        }
      };
      getEmail();
    }, []);
    
    useEffect(() => {
      if (routeLanguage) {
          setLanguage(routeLanguage);
          i18n.changeLanguage(routeLanguage);
          AsyncStorage.setItem('language', routeLanguage);
      }
  }, [routeLanguage]);



    // useEffect(() => {
    //   const { username: routeUsername } = route.params || {};
    //   if (routeUsername) {
    //     setUsername(routeUsername);
  
    //   }
    // }, [route.params]);

    const posts = [
        {id: '1', image: require('../assets/post1.jpg')}, 
        {id: '2', image: require('../assets/post2.jpg')},
        {id: '3', image: require('../assets/post3.jpg')},
        {id: '4', image: require('../assets/post2.jpg')},
        {id: '5', image: require('../assets/post3.jpg')},
        {id: '6', image: require('../assets/post1.jpg')},

    ];

    const handleEditProfilePic = () => {
      setModalVisible(true);
    };

    const handleCloseModal = () => {
      setModalVisible(false);
    };

    const handleCameraOption = () => {
      console.log('Camera option selected');
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      }).then(image => {
        console.log(image);
        setImage(image.path);

      });
    };

    const handleGalleryOption = () => {
      console.log('Gallery option selected');
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).then(image => {
        console.log(image);
        setImage(image.path);
      });
    };

    const handleLanguageButtonPress = () => {
        setLanguageModalVisible(true);
    };

    const handleCloseLanguageModal = () => {
        setLanguageModalVisible(false);
    };

    const changeLanguage = async (selectedLanguage: string) => {
        await AsyncStorage.setItem('language', selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
        setLanguage(selectedLanguage);
        handleCloseLanguageModal();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.languageButton} onPress={handleLanguageButtonPress}>
                <Text style={styles.languageButtonText}>{t('language')}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isLanguageModalVisible}
                onRequestClose={handleCloseLanguageModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => changeLanguage('EN')} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>{t('English')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage('AR')} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>{t('Arabic')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseLanguageModal}>
                            <Text style={styles.closeButtonText}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.profileInfo}>
                <Image 
                    source={image ? { uri: image } : require('../assets/profile.jpg')} 
                    style={styles.profileImage} 
                />
                <Text style={styles.name}>{username}</Text>
                <TouchableOpacity style={styles.editProfilePicButton} onPress={handleEditProfilePic}>
                    <Text style={styles.editProfilePicButtonText}>{t('edit-profile')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>80</Text>
                  <Text style={styles.statLabel}>{t('posts')}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>80</Text>
                  <Text style={styles.statLabel}>{t('followers')}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>80</Text>
                  <Text style={styles.statLabel}>{t('following')}</Text>
                </View>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{t('follow')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{t('message')}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.postsTitle}>{t('posts')}</Text>
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                  <Image source={item.image} style={styles.postImage} />
                )}
                keyExtractor={item => item.id}
                numColumns={3} 
                columnWrapperStyle={{ justifyContent: 'space-between' }}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.modalButton} onPress={handleCameraOption}>
                      <Text style={styles.modalButtonText}>{t('camera')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={handleGalleryOption}>
                      <Text style={styles.modalButtonText}>{t('gallery')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={(handleCloseModal)}>
                      <Text style={styles.closeButtonText}>{t('close')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </Modal>
        </View>
    );
}

export default function Profile({ route }: ProfileProps) {
  const {t} = useTranslation();
    return (
        <QueryClientProvider client={queryClient}>
        <Tab.Navigator screenOptions={{headerShown: false}}>
          <Tab.Screen 
            name="User" component={ProfileContent as React.ComponentType<any> } // Renamed here
            initialParams={route.params}
            options={{
              tabBarLabel:t('profile'),
              tabBarIcon: ({ color, size }) => (
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/profilee.png")}
                />
              ),
            }}
          />
          <Tab.Screen name="List" component={List} 
            options={{
              tabBarLabel:t('list'),
              tabBarIcon: ({ color, size }) => (
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/list.png")}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </QueryClientProvider>
      
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F8',
    paddingHorizontal: 20,
    paddingTop:20
  },
  header: {
    marginBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 40,

  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
  },
  statLabel: {
    fontSize: 15,
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#FF9900',
    paddingVertical: 10,
    borderRadius: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    justifyContent:'center',
    textAlign:'center',
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  postImage: {
    width: Dimensions.get('window').width / 3 - 30, // Ensures 3 images per row
    height: Dimensions.get('window').width / 3 ,
    borderRadius: 10,
    margin: 5,
  },
  editProfilePicButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  editProfilePicButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FF9900',
    fontSize: 16,
  },
  languageButton: {
    position: 'absolute',
    top: 20, // Adjust as needed
    right: 20, // Adjust as needed
    backgroundColor: '#FF9900',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  languageButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
