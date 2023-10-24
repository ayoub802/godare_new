import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import France from '../../assets/images/france.png';
import Feather from 'react-native-vector-icons/Feather';
import CoteIvoire from '../../assets/images/cote_ivoire.png';
import SmallEarth from '../../assets/images/small_earth.png';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserList} from '../../constant/data';
import {getAuthentificationData, removeAuthentificationData} from '../../modules/GestionStorage';
import {signOut} from 'firebase/auth';
import { auth } from '../../modules/FirebaseConfig';
import { HeaderEarth } from '../../components/Header';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Header } from 'react-native/Libraries/NewAppScreen';
import axiosInstance from '../../axiosInstance';
const ProfileScreen = ({navigation}) => {
  const [LocalStorage, setLocalStorage] = useState(null);

  useEffect(() => {

    async function fetchValue() {

      const authStatus = await getAuthentificationData();

      const response = await axiosInstance.get('/clients');

      console.log("clients : ", response.data);
      setLocalStorage(authStatus)

        console.log('Your authStatus in local storage is : ', authStatus);

    }

    fetchValue();

  }, []);
  const logout = async () => {
    await removeAuthentificationData();

    await signOut(auth)
      .then(() =>
        ToastAndroid.show(
          "L'utilisateur a été déconnecté!",
          ToastAndroid.SHORT,
        ),
      )
      .catch(() => {
        ToastAndroid.show(
          "L'utilisateur ne peut pas se déconnecter!",
          ToastAndroid.SHORT,
        )});

        navigation.navigate('Login')
  };

  if ( LocalStorage === null)
  {
    return(
      <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={{marginBottom: 60, paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          
          <HeaderEarth />
          <ScrollView
            style={{marginTop: 32, paddingHorizontal: 12}}
            showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 18,
                  backgroundColor: '#FFFFFF',
                  marginBottom: 16,
                  borderRadius: 12,
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                  <View><MaterialIcons name="language"  size={24} color="#2BA6E9"/></View>
                  <Text
                    style={{
                      color: '#292625',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      letterSpacing: 1,
                    }}>
                    Langue 
                  </Text>
                </View>
              </TouchableOpacity>
          </ScrollView>

          <View style={{marginTop: 16, paddingHorizontal: 16}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                onPress={() => navigation.navigate('Login')}  
              >
                <AntDesign name="logout" size={20} color="#EB4335" />
                <Text
                  style={{
                    color: '#EB4335',
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Connextion
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity onPress={() => navigation.navigate("TermsAndConditionsScreen")}>
                  <Text
                    style={{
                      color: '#0282C8',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      letterSpacing: 1,
                      textAlign: 'center',
                      textDecorationLine: 'underline',
                    }}>
                    Conditions générales
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("LegalNotice")}>
                  <Text
                    style={{
                      color: '#0282C8',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      letterSpacing: 1,
                      textAlign: 'center',
                      textDecorationLine: 'underline',
                    }}>
                    Mentions légales
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={{marginBottom: 60, paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>

         <HeaderEarth />

          <ScrollView
            style={{marginTop: 32, paddingHorizontal: 12}}
            showsVerticalScrollIndicator={false}>
            {UserList.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(item.path)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 18,
                  backgroundColor: '#FFFFFF',
                  marginBottom: 16,
                  borderRadius: 12,
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                  <View>{item.icon}</View>
                  <Text
                    style={{
                      color: '#292625',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      letterSpacing: 1,
                    }}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{marginTop: 16, paddingHorizontal: 16}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                onPress={logout}  
              >
                <AntDesign name="logout" size={20} color="#EB4335" />
                <Text
                  style={{
                    color: '#EB4335',
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Deconnexion
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity onPress={() => navigation.navigate("TermsAndConditionsScreen")}>
                  <Text
                    style={{
                      color: '#0282C8',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      letterSpacing: 1,
                      textAlign: 'center',
                      textDecorationLine: 'underline',
                    }}>
                    Conditions générales
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("LegalNotice")}>
                  <Text
                    style={{
                      color: '#0282C8',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      letterSpacing: 1,
                      textAlign: 'center',
                      textDecorationLine: 'underline',
                    }}>
                    Mentions légales
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
