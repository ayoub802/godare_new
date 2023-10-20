import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React from 'react';
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
import {removeAuthentificationData} from '../../modules/GestionStorage';
import {signOut} from 'firebase/auth';
import { auth } from '../../modules/FirebaseConfig';

const ProfileScreen = ({navigation}) => {
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
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={{marginBottom: 60, paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <View
            style={{
              position: 'relative',
              alignItems: 'center',
              backgroundColor: '#2BA6E9',
              justifyContent: 'center',
              height: hp(12),
            }}>
            <Text
              style={{fontSize: 14, color: '#fff', fontFamily: 'Roboto-Bold'}}>
              Fret par avoin
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: 10,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Image source={France} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#fff',
                    fontFamily: 'Roboto-Regular',
                  }}>
                  France
                </Text>
                <Feather name="arrow-up-right" color="#fff" size={22} />
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Image source={CoteIvoire} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#fff',
                    fontFamily: 'Roboto-Regular',
                  }}>
                  Côte d'ivoire
                </Text>
                <Feather name="arrow-down-right" color="#fff" size={22} />
              </View>
            </View>

            <View style={{position: 'absolute', top: 15, right: 10}}>
              <Image source={SmallEarth} />
              <Text
                style={{
                  fontSize: 14,
                  color: '#fff',
                  fontFamily: 'Roboto-Bold',
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                GS
              </Text>
            </View>
          </View>

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
                <TouchableOpacity>
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
                <TouchableOpacity>
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
