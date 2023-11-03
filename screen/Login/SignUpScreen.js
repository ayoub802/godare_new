//import liraries
import React, {Component, useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {useForm, Controller} from 'react-hook-form';
import axiosInstance from '../../axiosInstance';
import styles from "./SignUpStyle"
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderEarth } from '../../components/Header';
import Button from '../../components/Button';
import DropDownPicker from 'react-native-dropdown-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firebase_db } from '../../modules/FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { ScrollView } from 'react-native-virtualized-view';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const SignUpScreen = (props) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [confirm, setConfirm] = useState(null);
  useEffect(() => {
    reset(
      {Name: '', Phone: '', Password: '', Email: ''},
      {
        keepErrors: true,
        keepDirty: true,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      },
    );
  }, [reset]);

  const [Name, setName] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState();
  const [phoneNumber, setphoneNumber] = useState('');
  const [isOpen, setIsOpen] =useState(false);
  const [civilite, setCivilite] = useState('') 
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, settext] = useState('12/10/1997');
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const phoneInput = useRef(null);
  const buttonPress = () => {
    Alert.alert(phoneNumber);
  };
  /* Date functions */
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = `${tempDate.getDate()}/${
      tempDate.getMonth() + 1
    }/${tempDate.getFullYear()}`;

    settext(fDate);
    console.log(fDate);
  };




  const NavigateToMain = () => {
    props.navigation.navigate('Login');
    // navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: 'Tab',
    //       // params: {someParam: 'Param1'},
    //     },
    //   ],
    // });
  };

  /* when user click on register it will trigger below function */
  const handleSignup = async () => {
    let Array = {Name:Name,FirstName: FirstName, Email:Email,DateOfBirth:date,Password:Password}
    console.log('Done from Handle Signup',phoneNumber,"Array is",Array);
    console.log("handleSignup",)
   // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
   // console.log("confirmation",confirmation)
   // setConfirm(confirmation);
    //navigateToOtp(phoneNumber,confirmation,Array);

    

    try {
      await createUserWithEmailAndPassword(auth ,Email, Password).then(() => {
          try {
            AsyncStorage.setItem('authStatusChecker', 'login');
            console.log('Auth Add Successfully to Storage');
          } catch (error) {
            console.log('Storage Error from Login Button :', error);
          }
          console.log('User account create & Signed in!');
          Toast.show({
            type: 'success',
            text1: t('Connexion réussie'),
            text2: t('Compte utilisateur créé et connecté !'),
          });

          addDoc(collection(firebase_db, 'users'), {
            name: Name,
            prenom: FirstName,
            phone: phoneNumber,
            email: Email,
            birthday: date.toString(),
            civilite: civilite
          })
          axiosInstance.post('/clients/new', {
            nom: Name,
            prenom: FirstName,
            email: Email,
            telephone: phoneNumber,
            birthday: date.toString()
          })
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error);
          });

          


          setTimeout(() => {
            // alert('Register!'),
      NavigateToMain()
          }, 1500);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            Toast.show({
              type: 'error',
              text1: 'Obtenez déjà',
              text2: t('Cette adresse email est déjà utilisée!'),
            });
          }
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            Toast.show({
              type: 'error',
              text1: t('Email invalide!'),
              text2: t("L'e-mail fourni n'est pas valide !"),
            });
          }
          Toast.show({
            type: 'error',
            text1: 'Caught Error',
            text2: `Error: ${error}`,
          });
        });
    } catch (err) {
      console.log(err);
    }

  };

  async function confirmCode() {
    try {
      const con = await confirm.confirm('123456');
      console.log("concon",con)
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  const ButtonDate = () => {
    const timestamp = Date.parse(date)
    console.log("timestamptimestamp",timestamp)
    console.log("datedate",date.toString())
  }

  const items = [
    {
      label: "Mr",
      value: "Mr"
    },
    {
      label: "Mme",
      value: "Mme"
    },
    {
      label: "Autre",
      value: "Autre"
    },
  ]
  return (
    <SafeAreaView style={{flex: 1}}>
            <ScrollView
        style={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <HeaderEarth />

          <View style={{marginTop: 30, marginBottom: 12}}>
            <Text
              style={{ 
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: '#000',
                textAlign: 'center',
              }}>
              Veuillez créer un compte
            </Text>
          </View>
          <View style={{paddingHorizontal: 28}}>
          <Controller
              control={control}
              name="Name"
              rules={{
                required: t('Le nom est requis'),
                minLength: {
                  value: 3,
                  message: t('Le nom doit comporter 3 caractères'),
                },
              }}
              render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
                return (
                  <>
                    <View
                      style={
                        {
                          borderBottomColor: error ? 'red' : '#E6E6E6',
                          borderBottomWidth: 1,
                          marginBottom: 15
                        }}>
                      <DropDownPicker 
                        items={items}
                        open={isOpen}
                        setOpen={() => setIsOpen(!isOpen)}
                        value={civilite}
                        setValue={val => setCivilite(val)}
                        placeholder='Civilite'
                        style={{position: "relative", zIndex: 100}}
                        onSelectItem={item => {
                          setCivilite(item.value)
                        }}
                      />
                    </View>
                    {error && (
                      <Text style={styles.errorMessageTextStyle}>
                        {error.message || t('Erreur')}
                      </Text>
                    )}
                  </>
                );
              }}
            />
            <Controller
              control={control}
              name="Name"
              rules={{
                required: t('Le nom est requis'),
                minLength: {
                  value: 3,
                  message: t('Le nom doit comporter 3 caractères'),
                },
              }}
              render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
                return (
                  <>
                    <View
                      style={
                        {
                          borderBottomColor: error ? 'red' : '#E6E6E6',
                          borderBottomWidth: 1,
                          position: "relative", zIndex: -100
                        }}>
                      <TextInput
                        placeholder={t('Nom')}
                        placeholderTextColor={'#BCB8B1'}
                        keyboardType={'ascii-capable'}
                        onBlur={onBlur}
                        autoFocus={true}
                        focusable={true}
                        style={{
                              borderWidth: 1,
                              borderColor: '#AAB0B7',
                              paddingLeft: 15,
                              borderRadius: 8,
                              fontFamily: 'Poppins-Regular',
                              fontSize: 14,
                              color: '#000',
                              backgroundColor: '#fff',
                          }}
                        value={value}
                        onChange={valueInput => {
                          setName(valueInput.nativeEvent.text.toString());
                        }}
                        onChangeText={onChange}
                      />
                    </View>
                    {error && (
                      <Text style={styles.errorMessageTextStyle}>
                        {error.message || t('Erreur')}
                      </Text>
                    )}
                  </>
                );
              }}
            />
            <Controller
              control={control}
              name="Prénom"
              rules={{
                required: t('Le prénom est requis'),
                minLength: {
                  value: 3,
                  message: t('Le prénom doit comporter 3 caractères'),
                },
              }}
              render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
                return (
                  <>
                    <View
                      style={
                        {
                          borderBottomColor: error ? 'red' : '#E6E6E6',
                          borderBottomWidth: 1,
                          marginTop: 12,
                          position: "relative", zIndex: -100
                        }}>
                      <TextInput
                        placeholder={t('Prénom')}
                        placeholderTextColor={'#BCB8B1'}
                        keyboardType={'ascii-capable'}
                        onBlur={onBlur}
                        style={{
                            borderWidth: 1,
                            borderColor: '#AAB0B7',
                            paddingLeft: 15,
                            borderRadius: 8,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 14,
                            color: '#000',
                            backgroundColor: '#fff',}
                        }
                        value={value}
                        onChange={valueInput => {
                          setFirstName(valueInput.nativeEvent.text.toString());
                        }}
                        onChangeText={onChange}
                      />
                    </View>
                    {error && (
                      <Text style={styles.errorMessageTextStyle}>
                        {error.message || t('Erreur')}
                      </Text>
                    )}
                  </>
                );
              }}
            />
            <Controller
              control={control}
              name="Phone"
              rules={{
                required: t('Le téléphone est requis'),
                minLength: {
                  value: 6,
                  message: t('Le téléphone doit comporter 6 caractères'),
                },
              }}
              render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
                return (
                  <>
                    <View style={{marginTop: 1}}>
                      <PhoneInput
                        ref={phoneInput}
                        defaultValue={phoneNumber}
                        defaultCode="FR"
                        layout="first"
                        containerStyle={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          color: '#000',
                          backgroundColor: 'transparent',
                          width: 370,
                        }}
                        codeTextStyle={{display: 'none'}}
                        textContainerStyle={{
                          backgroundColor: 'transparent',
                          padding: 0,
                          color: '#000',
                          fontFamily: 'Poppins-Regular',
                          fontSize: 14,
                        }}
                        countryPickerButtonStyle={styles.countryPickerButtonStyle}
                        placeholder={t('Téléphone')}
                        textInputProps={{placeholderTextColor: '#BCB8B1'}}
                        textInputStyle={
                          {borderBottomColor: error ? 'red' : '#E6E6E6',
                          borderWidth: 1,
                          height: 60,
                          paddingLeft: 16,
                          borderColor: '#AAB0B7',
                          color: '#000',
                          borderRadius: 8,
                          backgroundColor: '#fff',
                        }}
                        flagButtonStyle={{
                          borderWidth: 1,
                          height: 60,
                          borderColor: '#AAB0B7',
                          borderRadius: 8,
                          backgroundColor: '#fff',
                        }}
                        value={phoneNumber}
                        onChangeFormattedText={text => {
                          setphoneNumber(text);
                        }}
                        onChangeText={onChange}
                      />
                    </View>
                    {error && (
                      <Text
                        style={[
                          styles.errorMessageTextStyle,
                          {textAlign: 'right'},
                        ]}>
                        {error.message || t('Erreur')}
                      </Text>
                    )}
                  </>
                );
              }}
            />
            <Controller
              control={control}
              name="Email"
              rules={{
                required: t('Email is required'),
                pattern: EMAIL_REGEX,
              }}
              render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
                return (
                  <>
                    <View
                      style={
                        {
                          borderBottomColor: error ? 'red' : '#E6E6E6',
                          borderBottomWidth: 1,
                          marginTop: 1
                        }}>
                      <TextInput
                        placeholder={t('E-mail')}
                        placeholderTextColor={'#BCB8B1'}
                        keyboardType={'email-address'}
                        style={{
                          borderWidth: 1,
                          borderColor: '#AAB0B7',
                          paddingLeft: 15,
                          borderRadius: 8,
                          fontFamily: 'Poppins-Regular',
                          fontSize: 14,
                          color: '#000',
                          backgroundColor: '#fff',}
                      }
                        value={value}
                        onChange={valueInput => {
                          setEmail(valueInput.nativeEvent.text.toString());
                          console.log(Email);
                        }}
                        onChangeText={onChange}
                      />
                    </View>
                    {error && (
                      <Text style={styles.errorMessageTextStyle}>
                        {error.message || t('Email is not Valid')}
                      </Text>
                    )}
                  </>
                );
              }}
            />

            <Controller
              control={control}
              name="Password"
              rules={{
                required: t('Mot de passe requis'),
                minLength: {
                  value: 6,
                  message: t('Le mot de passe doit comporter 6 caractères'),
                },
              }}
              render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
                return (
                  <>
                    <View
                      style={
                        {
                          borderBottomColor: error ? 'red' : '#E6E6E6',
                          borderBottomWidth: 1,
                          marginTop: 12
                        }}>
                      <TextInput
                        placeholder={t('Mot de passe')}
                        placeholderTextColor={'#BCB8B1'}
                        keyboardType={'ascii-capable'}
                        secureTextEntry={true}
                        style={{
                          borderWidth: 1,
                          borderColor: '#AAB0B7',
                          paddingLeft: 15,
                          borderRadius: 8,
                          fontFamily: 'Poppins-Regular',
                          fontSize: 14,
                          color: '#000',
                          backgroundColor: '#fff',}
                      }
                        value={Password}
                        onChange={valueInput => {
                          setPassword(valueInput.nativeEvent.text.toString());
                          console.log(Password);
                        }}
                        onChangeText={onChange}
                      />
                    </View>
                    {error && (
                      <Text style={styles.errorMessageTextStyle}>
                        {error.message || t('Erreur')}
                      </Text>
                    )}
                  </>
                );
              }}
            />

            <Controller
              name="Date"
              control={control}
              // rules={{required: 'Date is Required'}}
              render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{marginTop: 12}}
                      activeOpacity={0.7}
                      onPress={() => {
                        showMode('date');
                      }}>
                      <TextInput
                        placeholder={t('Date de naissance')}
                        placeholderTextColor={'#BCB8B1'}
                        keyboardType={'ascii-capable'}
                        style={{
                          borderWidth: 1,
                          borderColor: '#AAB0B7',
                          fontFamily: 'Poppins-Regular',
                          fontSize: 14,
                          color: '#000',
                          paddingLeft: 15,
                          borderRadius: 8,
                          backgroundColor: '#fff',
                        }}
                        value={text}
                        onChange={e => {
                          settext(e.nativeEvent.text.toString());
                        }}
                        onChangeText={onChange}
                        editable={false}
                      />
                      {show && (
                        <DateTimePicker
                          testID="DateTimePicker"
                          value={date}
                          mode={mode}
                          display={'default'}
                          onChange={onDateChange}
                        />
                      )}
                    </TouchableOpacity>
                    {error && (
                      <Text style={styles.errorMessageTextStyle}>
                        {error.message || 'error'}
                      </Text>
                    )}
                  </>
                );
              }}
            />
            <View style={{marginTop: 27}}>
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Button title="s'inscrire" navigation={handleSubmit(handleSignup)} />
              </View>
            </View>

            <View style={styles.agreeTermTextContainer}>
              <Text style={styles.agreeTermText}>{t('Vous acceptez nos')}</Text>
              
              <TouchableOpacity
                onPress={() => {
                  navigateToTermsOfUse();
                }}>
                <Text style={styles.agreeTermUSeText}>
                  {' '}
                  {t('conditions générales d’utilisation')}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}

export default SignUpScreen