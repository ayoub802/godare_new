import { View, Text, TouchableOpacity,Platform,TouchableWithoutFeedback ,Keyboard, Dimensions,KeyboardAvoidingView, ActivityIndicator, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState,  } from 'react'
import { getAuthUserEmail } from '../../modules/GestionStorage';
import axiosInstance from '../../axiosInstance';
import { HeaderEarth } from '../../components/Header';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Icon from "react-native-vector-icons/Octicons"
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../modules/FirebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ConversationList = ({ navigation }) => {

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [activeBackground, setActiveBackground] = useState(0);
    const [activeMessage, setActiveMessage]=useState(false)
    const [conversationId, setConversationId] = useState([])
    const [user, setUser] = useState(null);

    const {t, i18n} = useTranslation();
    useEffect(() => {
      fetchConversations();
    }, []);
  
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        console.log('user', user);
        setUser(user)
      })
    }, [])
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

    const [conversation, setConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [Loader, setLoader] = useState(true);
    const [ClientEmail, setClientEmail] = useState(null);

    const handleConversationClick = (conversationId) => {
    //   navigation.navigate('ConversationDetails', { conversationId });
    };

    const fetchMessages = async (conversation) => 
    {
        setLoader(true);

        try 
        {

          const response = await axiosInstance.get('/conversations/'+ conversation +'/messages');
  
  
          setConversation(response.data);

        }
        catch (erreur)
        {
          console.log('commande conversation error', erreur);
        }

        setLoader(false);
    };
  
    const handleSendMessage = async () => {

      setLoader(true);

        try 
        {
          const response = await axiosInstance.post('/conversations/' + conversationId + '/messages/reply/' + user.email, {message: newMessage});

          setConversation(response.data);
          console.log("Conversation Added:", conversation);

          setNewMessage('');
        }
        catch (erreur)
        {
          console.log('creation message  error', erreur);
        }

        setLoader(false);

    };

    const handletab = (conversation) => {
        setActiveBackground(conversation.id)
        setActiveMessage(true)
        // handleSendMessage(conversation.id)
        setConversationId(conversation.id)
        fetchMessages(conversation.id)
    }

    console.log(conversationId);

  // if(true === Loader){
  //   return (
  //     <View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>
  //     );
  // }
  return (
    <View style={{flex: 1}}>
        <HeaderEarth />
        <View style={{flex: 1}}>
            <View style={{marginVertical: 29}}>
                <Text style={{textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color:"#000"}}>{t('Mes échanges précédents')}</Text>
            </View>
            <View style={{backgroundColor: "#fff",borderRadius: 10, width: windowWidth * 0.8, alignSelf: "center"}}>
                {conversations.map((conversation) => (
                    <TouchableOpacity key={conversation.id} style={[activeBackground === conversation.id ? {backgroundColor: "#2BA6E9"} : {backgroundColor: "transparent"} ,{paddingHorizontal: 15, paddingVertical: 20,borderBottomWidth: 1,borderBottomColor: "#E9E9E9" ,justifyContent: "space-between", flexDirection: "row"}]} onPress={() => {handleConversationClick(conversation.id), handletab(conversation)}}>
                            <Text style={[activeBackground === conversation.id ? {color: "#fff"} : {color: "#000"} ,{fontSize: 12, fontFamily: "Poppins-Regular", letterSpacing: 1}]}>{conversation.subject}</Text> 
                            <Text style={[activeBackground === conversation.id ? {color: "#fff"} : {color: "#000"} ,{fontSize: 12, fontFamily: "Poppins-Regular", letterSpacing: 1}]}>{conversation.createdAt}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {
                activeMessage && (
                    <>
                      {
                        conversation === null || Loader === true 
                        ?
                        <View style={{justifyContent: 'center', height: '50%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>
                        :
                        <>
                          <View style={{marginVertical: 29}}>
                              <Text style={{textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color:"#000"}}> {t('Information produit')}</Text>
                          </View>
                          <View style={{backgroundColor: "#fff",height: "100%", flex: 1,paddingTop: 22,borderTopRightRadius: 12, borderTopLeftRadius: 12}}>
                              <ScrollView style={{height: "35%"}}>
                                  {conversation.messages.map(message => (
                                      <View key={message.id} style={{ margin: 10 }}>
                                          <Text style={{fontSize: 12,textAlign: "center" ,fontFamily: "Poppins-Medium", color: "#AAB0B7"}}>{message.createdAt}</Text>
                                          <View style={{alignSelf: "flex-end", paddingRight: 25, marginVertical: 10,backgroundColor: "#F7F7F9", paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12}}>
                                              <Text style={{color: "#243443", textAlign: "left", fontSize: 16,fontFamily: "Poppins-Medium"}}> De {message.sender ? (message.sender.nom + ' ' + message.sender.prenom) : 'GS' }</Text>
                                              <Text style={{color: "#243443", textAlign: "left", fontSize: 16,fontFamily: "Poppins-Medium"}}>{message.message}</Text>
                                          </View>
                                      </View>
                                  
                                  ))}
                              </ScrollView>
                                <View style={{flex: 1, justifyContent: "flex-start",alignSelf: "center"}}>
                              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                      <View style={{width: windowWidth * 0.9,flexDirection: "row",alignItems: "center",borderWidth: 1,borderRadius: 8,borderColor: "#AAB0B7", paddingHorizontal: 10}}>
                                            <TextInput 
                                              value={newMessage}
                                              onChangeText={setNewMessage}
                                              placeholder='Entrez votre message'
                                              style={{flex:1}}
                                            />
                                            <TouchableOpacity onPress={handleSendMessage}>
                                               <Icon name="paper-airplane" size={25}/>
                                            </TouchableOpacity>
                                      </View>
                                    </TouchableWithoutFeedback>
                              </KeyboardAvoidingView>
                                </View>
                              
                          </View>
                        </>
                      }
                    </>
                )
            }

        </View>

    </View>
  )
}

export default ConversationList