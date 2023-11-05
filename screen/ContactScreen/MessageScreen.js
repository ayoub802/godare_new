import { View, Text, TextInput, Alert, ToastAndroid, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import Button from '../../components/Button'
import DropDownPicker from 'react-native-dropdown-picker'
import Textarea from 'react-native-textarea';
import { getAuthUserEmail, getConversationMessagesObject, getPlatformLanguage, saveConversationMessagesObject } from '../../modules/GestionStorage'
import axiosInstance from '../../axiosInstance'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-native-phone-number-input'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../modules/FirebaseConfig'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MessageScreen = (props) => {
    const [isOpen2, setIsOpen2] = useState(false);
    const [current2, setCurrent2] = useState();
    const {t, i18n} = useTranslation();
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(null);
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Message, setMessage] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [ConversationMessageObjects, setConversationMessageObjects] = useState([]);
    const [MessageObjectsLoader, setMessageObjectsLoader] = useState(true);
    const [IsClient, setIsClient] = useState(false);
    const [ClientEmail, setClientEmail] = useState(null);
    const [Language, setLanguage] = useState('fr');
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);

    const navigateToConversationScreen = () => {
      // console.log('done');
      props.navigation.navigate("Conversation");
    };
  
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        console.log('user', user);
        setUser(user)
      })
    }, [])
  
    useEffect(() => {
  
      async function fetchData()
      {
        setMessageObjectsLoader(true);
  
        const email = await getAuthUserEmail();
        // setClientEmail(user);
  
  
      // Language 
      const currentLanguage = await getPlatformLanguage();
      setLanguage(currentLanguage);


        setIsClient(null === user ? false : true);
  
        let conversationMessagesObject = await getConversationMessagesObject();
        
  
        if (conversationMessagesObject.length < 1)
        {
          axiosInstance.get('/conversations/parametrages/objets')
          .then((response) => {
  
            if (response.data)
            {
              let objectNonClient = [];
              let objectClient = [];
  
              response.data.forEach(function (item){
                if (item.type == 'NON_CLIENT')
                {
                  objectNonClient.push(item);
                }
                else 
                {
                  objectClient.push(item);
                }
              });
  
              let messageObjects = [];
              if (null === user)
              {
                messageObjects = objectNonClient;
              }
              else 
              {
                messageObjects = objectClient;
              }
  
              let formatted = messageObjects.map( ls => {
                return {id: ls.id, label: ls.libelle, value: ls.libelle}
              })
  
              setConversationMessageObjects(formatted);
  
              saveConversationMessagesObject(response.data);
  
              setMessageObjectsLoader(false);
            }
          })
          .catch(function (error) {
            console.log('error', error);
            setMessageObjectsLoader(false);
          });
        }
        else 
        {
  
          let objectNonClient = [];
          let objectClient = [];
  
          conversationMessagesObject.forEach(function (item){
            if (item.type == 'NON_CLIENT')
            {
              objectNonClient.push(item);
            }
            else 
            {
              objectClient.push(item);
            }
          });
  
          let messageObjects = [];
          if (null === user)
          {
            messageObjects = objectNonClient;
          }
          else 
          {
            messageObjects = objectClient;
          }
  
          let formatted = messageObjects.map( ls => {
            return {id: ls.id, label: ls.libelle, value: ls.libelle}
          })
  
          setConversationMessageObjects(formatted);
  
          setMessageObjectsLoader(false);
        }
      }
  
      fetchData();

      fetchConversations();
  
    }, []);
  
    const fetchConversations = async () => {
      try {
        const email = await getAuthUserEmail();
  
  
        const response = await axiosInstance.get('conversations/clients/' + email);
        setConversations(response.data);
        console.log('response.data', response.data)
      } catch (error) {
        console.error('Erreur lors du chargement des conversations :', error);
      }
    };
  
    const navigateToCofirmSentScreen = () => {
  
      let conversation = {};
      let url = '/conversations/clients/create';
  
      if (null === user)
      {
        if (Email === '')
        {
          ToastAndroid.show("L'email est obligatoire", ToastAndroid.SHORT)
          return;
        }
  
        if (Name === '')
        {
          ToastAndroid.show("Le nom est obligatoire", ToastAndroid.SHORT)

          return;
        }
  
        url = '/conversations/non/clients/create';
  
        conversation.nom = Name;
        conversation.email = Email;
        conversation.telephone = phoneNumber;
      }
      else 
      {
        conversation.email = user.email;
      }
  
  
      if (value === '')
      {
        ToastAndroid.show("L'objet est obligatoire", ToastAndroid.SHORT)

        return;
      }
  
      if (Message === '')
      {
        ToastAndroid.show("Le message est obligatoire", ToastAndroid.SHORT)

        return;
      }
  
      conversation.subject = value;
      conversation.message = Message;
  
      console.log('message url', url)
      console.log('conversation', conversation)
  
      axiosInstance.post(url, conversation)
      .then(function (response) {
        setEmail('');
        setName('');
        setMessage('');
        setValue(null);
  
        return Alert.alert(
          'Succès',
          'Votre message a été envoyé',
          [
            {
              text: 'OK',
            },
          ],
        );
      })
      .catch(error =>
        {
          console.log('error contact', error.response)
          ToastAndroid.show("error contact sending", ToastAndroid.SHORT)
        }
      );
    };
  
   
    if (true === MessageObjectsLoader )
    {
      return (
        <View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>
      );
    }
  
  return (
    <SafeAreaView style={{ flex: 1}}>
      <ScrollView style={{marginBottom: 20, flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <HeaderEarth />

            <View style={{paddingHorizontal: 28}}>  
 
                  {null != user ?
                    (
                      <>
                      <View style={{marginTop: 24, marginBottom: 12}}>
                        <Text
                            style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 16,
                            color: '#000',
                            textAlign: 'center',
                            }}>
                            {t('Mes échanges précédents')}
                        </Text>
                    </View>
                    <View style={{backgroundColor: "#fff",borderRadius: 10,width: windowWidth * 0.85, alignSelf: "center"}}>
                          {conversations.map((conversation) => (
                              <View key={conversation.id} style={{paddingHorizontal: 15, paddingVertical: 20,borderBottomWidth: 1,borderBottomColor: "#E9E9E9" ,justifyContent: "space-between", flexDirection: "row"}}>
                                      <Text style={{fontSize: 12,color: "#000", fontFamily: "Poppins-Regular", letterSpacing: 1}}>{conversation.subject}</Text> 
                                      <Text style={{fontSize: 12,color: "#000", fontFamily: "Poppins-Regular", letterSpacing: 1}}>{conversation.createdAt}</Text>
                              </View>
                          ))}
                      </View>
                        <TouchableOpacity onPress={() => {navigateToConversationScreen()}} style={{justifyContent: "flex-end", width: "100%", alignItems: "flex-end", paddingTop: 5}}>
                          <Text style={{fontSize: 14,fontFamily:'Roboto-Regular', color: "#2BA6E9"}}>{t('Voir tous les échanges')}</Text>
                        </TouchableOpacity>
                       </>
                    )
                    :
                    <></>
                 }
                 <View style={{marginTop: 24, marginBottom: 12}}>
                    <Text
                        style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        color: '#000',
                        textAlign: 'center',
                        }}>
                        {t('Envoyez un nouveau message')}
                    </Text>
                </View>
                 {null === user 
                 ? 
                 <>
                  <View style={{marginTop: 12}}>
                      <TextInput
                      value={Name}
                      onChangeText={newText => setName(newText)} 
                      placeholder="Ehouman"
                      keyboardType="ascii-capable"
                      style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                      />
                  </View>
                  <View style={{marginTop: 12}}>
                      <TextInput
                      value={Email}
                      onChangeText={newText => setEmail(newText)} 
                      placeholder="Email*"
                      style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                      />
                  </View>
                  <View style={{marginTop: 12}}>
                      <PhoneInput
                      defaultValue={phoneNumber}
                      defaultCode="FR"
                      layout="first"
                      containerStyle={styles.phoneContainer}
                      textContainerStyle={styles.textInput}
                      codeTextStyle={styles.codeTextStyle}
                      countryPickerButtonStyle={styles.countryPickerButtonStyle}
                      textInputProps={{placeholderTextColor: '#BCB8B1'}}
                      textInputStyle={styles.textInputStyle}
                      onChangeFormattedText={text => {
                        setphoneNumber(text);
                      }}
                      value={phoneNumber}
                      placeholder={t("Téléphone")}
                      style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                      />
                  </View>
                
                 </>
                 :
                 <></>
                }

            <View style={{marginTop: 12}}>
                 <DropDownPicker
                        items={ConversationMessageObjects}
                        open={isOpen2}
                        setOpen={() => setIsOpen2(!isOpen2)}
                        value={value}
                        setValue={(val) => setValue(val)}
                        dropDownContainerStyle={{backgroundColor: '#fff', borderColor: "#AAB0B7", fontSize: 54}}
                        style={{ backgroundColor: "#fff", borderColor: "#000", fontSize: 54,}}
                        listItemContainerStyle={{ borderBottomColor: "#000"}}
                        placeholder='Objet*'
                        onChangeValue={(value) => setValue(value)}
                        placeholderStyle={{ fontFamily: "Poppins-Regular", fontSize: 16, color: "#000"}}
                        textStyle={{fontFamily: "Poppins-Regular", fontSize: 14, color: "#000"}}
                    />
            </View>

             <View style={{ marginTop: 12}}>
                <Textarea
                containerStyle={{height: 180 ,backgroundColor: "#fff", borderWidth: 1, borderColor: "#AAB0B7", borderRadius: 8, paddingLeft: 10}}
                style={{backgroundColor: "#fff",fontSize: 14 ,fontFamily: "Poppins-Regular", color: "#000"}}
                    maxLength={120}
                    value={Message}
                    placeholder={'Message'}
                    placeholderTextColor={'#AAB0B7'}
                    underlineColorAndroid={'transparent'}
                    onChangeText={newText => setMessage(newText)}
                />
             </View>
            <View style={{marginTop: 50}}>
                <View style={{ justifyContent: "flex-end", alignItems: 'center', paddingBottom: 72}}>
                <TouchableOpacity
                  style={styles.ButtonContainer}
                  onPress={() => {
                    navigateToCofirmSentScreen();
                  }}>
                  <Text style={styles.ButtonText}>{t('Envoyer')}</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MessageScreen