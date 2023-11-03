import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState,  } from 'react'
import { getAuthUserEmail } from '../../modules/GestionStorage';
import axiosInstance from '../../axiosInstance';
import { HeaderEarth } from '../../components/Header';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ConversationList = ({ navigation }) => {

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [activeBackground, setActiveBackground] = useState(0);
    const [activeMessage, setActiveMessage]=useState(false)
    const [conversationId, setConversationId] = useState([])
    useEffect(() => {
      fetchConversations();
      fetchMessages();
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

    const [conversation, setConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [Loader, setLoader] = useState(true);
    const [ClientEmail, setClientEmail] = useState(null);

    const handleConversationClick = (conversationId) => {
    //   navigation.navigate('ConversationDetails', { conversationId });
    };

    const fetchMessages = async () => 
    {
        setLoader(true);

        try 
        {

          const response = await axiosInstance.get('/conversations/' + conversationId + '/messages');
  
  
          setConversation(response.data);

          console.log("Conversation :",conversation);
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
          const response = await axiosInstance.post('/conversations/' + conversationId + '/messages/reply/' + ClientEmail, {message: newMessage});

          setConversation(response.data);

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
        setConversationId(conversation.id)
    }

    
  return (
    <View style={{flex: 1}}>
        <HeaderEarth />

        <View style={{marginVertical: 29}}>
            <Text style={{textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color:"#000"}}>Mes échanges précédents</Text>
        </View>
        <View style={{backgroundColor: "#fff", width: windowWidth * 0.8, alignSelf: "center"}}>
            {conversations.map((conversation) => (
                <TouchableOpacity key={conversation.id} style={[activeBackground === conversation.id ? {backgroundColor: "#2BA6E9"} : {backgroundColor: "#fff"} ,{paddingHorizontal: 15, paddingVertical: 20,borderBottomWidth: 1,borderBottomColor: "#E9E9E9" ,justifyContent: "space-between", flexDirection: "row"}]} onPress={() => {handleConversationClick(conversation.id), handletab(conversation)}}>
                        <Text style={[activeBackground === conversation.id ? {color: "#fff"} : {color: "#000"} ,{fontSize: 12, fontFamily: "Poppins-Regular", letterSpacing: 1}]}>{conversation.subject}</Text> 
                        <Text style={[activeBackground === conversation.id ? {color: "#fff"} : {color: "#000"} ,{fontSize: 12, fontFamily: "Poppins-Regular", letterSpacing: 1}]}>{conversation.createdAt}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {
            activeMessage && (
                <>
                    <View style={{marginVertical: 29}}>
                        <Text style={{textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color:"#000"}}> Information produit</Text>
                    </View>
                    <View style={{backgroundColor: "#fff", borderTopRightRadius: 8, borderTopLeftRadius: 8, justifyContent: "flex-end", alignItems: "center"}}>
                    {/* <ScrollView>
                        {conversation.messages.map(message => (
                            <View key={message.id} style={{ margin: 10 }}>
                                <Text>{message.createdAt}</Text>
                                <Text> De {message.sender ? (message.sender.nom + ' ' + message.sender.prenom) : 'GS' }</Text>
                                <Text>{message.message}</Text>
                            </View>
                        
                        ))}
                    </ScrollView> */}
                    </View>
                </>
            )
        }
    </View>
  )
}

export default ConversationList