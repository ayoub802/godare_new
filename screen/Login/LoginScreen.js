import {
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { saveAuthentificationData } from '../../modules/GestionStorage';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import styles from './style';
import auth from '@react-native-firebase/auth';
import Lock from 'react-native-vector-icons/Fontisto';
import Eye from 'react-native-vector-icons/Entypo';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const LoginScreen = (props) => {

  const [showPass, setshowPass] = useState('eye-with-line');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState();
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {Email: '', Password: ''},
  });

  const changeIcon = () => {
    setshowPass(showPass === 'eye' ? 'eye-with-line' : 'eye');
  };

  // Page d'inscription
  const navigateToSignup = () => {
    props.navigation.navigate("SignUpScreen");
  };

  // Retourner la page d'accueil ou le panier
  const NavigateToMain = () => {

    if (props.route && props.route.params && props.route.params.fromCart)
    {
      props.navigation.navigate('CartScreen', {screen: 'WeightCal'});
      return;
    }
    
    props.navigation.push('Tab');
  };


  // Authentification
  const handleSignin = async () => {
  
    try {
      auth()
        .signInWithEmailAndPassword(Email, Password)
        .then(() => {
          
          // Sauvegarder l'email
          saveAuthentificationData(Email);

          console.log("Connexion réussie");
          setTimeout(() => 
          {
            // Aller sur la page d'accueil
            NavigateToMain();
          }, 3000);

        })
        .catch(error => {

          if (error.code === 'auth/wrong-password') {
            
            console.log("Le mot de passe que vous saisissez est erroné !");

          }

          if (error.code === 'auth/user-not-found') {
           
            console.log("Il n'y a pas d'utilisateur existant correspondant aux informations d'identification !");
          }

          if (error.code === 'auth/invalid-email') {
            
            console.log("L'e-mail fourni n'est pas valide !");

          }

          if (error.code === 'auth/invalid-password') {

            console.log("Le mot de passe fourni n'est pas valide !");

          }
     
        });
    } catch (err) {
    }
  };
  return (
    <LinearGradient
    colors={['#3885DA', '#29A9EA', '#3A7FD8']}
    style={styles.container}>

    <View style={styles.INContainer}>

      <StatusBar backgroundColor="#3885DA" barStyle="auto" />

      {/* <Image style={styles.imageStyler} source={sd} resizeMode="center" /> */}

      <Text style={styles.mainTextStyle}>GS</Text>
    </View>

    <View style={styles.inputContainer}>

      <Controller
        name="Email"
        control={control}
        rules={{required: t("L'e-mail est requis"), pattern: EMAIL_REGEX}}
        render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
          return (
            <>
              <View
                style={[
                  styles.inputNumbCustom,
                  {
                    borderColor: error ? 'red' : '#fff',
                    borderWidth: error ? 1 : 0,
                  },
                ]}>
                {/* <Image style={styles.profileLogo} source={profileLogo} /> */}
                <TextInput
                  placeholder={t('E-mail')}
                  style={styles.inputNumbStyled}
                  placeholderTextColor="#B0B0C3"
                  keyboardType="ascii-capable"
                  keyboardAppearance="default"
                  autoCapitalize="none"
                  focusable={true}
                  value={value}
                  onChange={valueInput => {
                    setEmail(valueInput.nativeEvent.text.toString());
                  }}
                  onChangeText={onChange}
                />
              </View>
              {error && (
                <Text style={styles.errorMessageTextStyle}>
                  {error.message || t("L'email n'est pas valide")}
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
                style={[
                  styles.inputCustom,
                  {
                    borderColor: error ? 'red' : '#fff',
                    borderWidth: error ? 1 : 0,
                  },
                ]}>

                <Lock name="locked" color={'#042C5C'} size={20} />
                <TextInput
                  placeholder={t('Mot de passe')}
                  style={styles.inputStyled}
                  placeholderTextColor="#B0B0C3"
                  keyboardType="ascii-capable"
                  secureTextEntry={showPass === 'eye' ? false : true}
                  keyboardAppearance={'default'}
                  value={value}
                  onChange={valueInput => {
                    setPassword(valueInput.nativeEvent.text.toString());
                  }}
                  onChangeText={onChange}
                />
                <Eye
                  name={showPass}
                  color={'#042C5C'}
                  size={20}
                  onPress={() => {
                    changeIcon();
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
    </View>

    <TouchableOpacity style={styles.forgotPassContainer} activeOpacity={0.7}>
      <Text style={styles.forgotText}>{t('Mot de passe oublié ?')}</Text>
    </TouchableOpacity>

    <View style={styles.mainAuthBContain}>
      <TouchableOpacity
        style={styles.Auth1}
        activeOpacity={0.7}
        onPress={handleSubmit(handleSignin)}>
        <Text style={styles.AuthButtonText}>{t('Se connecter')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Auth1}
        activeOpacity={0.7}
        onPress={navigateToSignup}>
        <Text style={styles.AuthButtonText}>
          {t('Pas de compte ? S’inscrire')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Auth1}
        activeOpacity={0.7}
        onPress={()=>props.navigation.push('Tab')}>
        <Text style={styles.AuthButtonText}>
          {t('Passer l identification')}
        </Text>
      </TouchableOpacity>
      
    </View>
  </LinearGradient>
  )
}

export default LoginScreen