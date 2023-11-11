import { View, Text,ScrollView, Image,TouchableOpacity, ToastAndroid, ActivityIndicator,Alert } from 'react-native'
import React,{ useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import CartViolet from "../../assets/images/card_violet.png"
import CartGreen from "../../assets/images/card_green.png"
import MasterCard from "../../assets/images/masterCard.png"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Feather from "react-native-vector-icons/Feather"
import Button from '../../components/Button' 
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { getAuthentificationData } from '../../modules/GestionStorage'
import { getClientCards, removeCard } from '../../modules/GestionStripe'
const CartBancair = () => {
    const navigation = useNavigation();

    const {t, i18n} = useTranslation();
  
    const [Cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const [ClientEmail, setClientEmail] = useState([]);
  
    useEffect(() => {
  
      // Récuperer les cartes
      async function fetchCards() 
      {
        try
        {
          setLoading(true);
  
          const userEmail = await getAuthentificationData();
          setClientEmail(userEmail);
          console.log(userEmail);
  
          const userCards = await getClientCards(userEmail);
  
          console.log(userCards);
          if(userCards){
            setCards(userCards.data);
          }
          else{
            setCards([])
          }
  
          setLoading(false);
        }
        catch (error)
        {
          setLoading(false);
        }
      }
  
      fetchCards();
  
    }, []);
  
    function navigateToAddCard() 
    {
      navigation.navigate("AddStripeUserCard");
    }
  
    function deleteCard(card) 
    {
      return  Alert.alert(
        t('Validation'),
        t('La suppression est irreversible. Etes-vous sur de vouloir continuer ?'),
        [
          {
            text: t('Annuler'),
            style: 'cancel',
          },
          {text: t('Oui'), onPress: () => removeStripeCard(card.id)},
        ],
      );
    }

    async function removeStripeCard(cardId) 
    {
      try 
      {
        await removeCard(ClientEmail, cardId);
        ToastAndroid.show("la suppression de la carte est succssé!", ToastAndroid.SHORT)
      }
      catch (error )
      {
        ToastAndroid.show("Erreur lors de la suppression de la carte !", ToastAndroid.SHORT)
  
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Error response', error.response.data);
          console.log('Error response', error.response.status);
          console.log('Error response', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      }
    }
  
    
  
    function updateCard(card) 
    {
      // show stripe to card input
    }
  
    if (true === loading)
    {
      return (<View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>);
    }

    if(!Cards){
      return(
        <View style={{flex: 1}}>
          <HeaderEarth />
          <View style={{marginTop: 27}}>
               <Text style={{fontSize: 16, fontFamily:'Poppins-SemiBold', color: '#000', textAlign: "center"}}>{t('Mes cartes enregistrées')}</Text>
           </View>
              <View style={{flex: 1 ,justifyContent: "center", alignItems:"center"}}>
                <Text>{t("il n'y a pas des cartes enregistrées")}</Text>
                  <View style={{ marginTop: 22, justifyContent: "center", alignItems: 'center', marginBottom: 30}}>
                    <Button title={t("Ajouter une nouvelle carte")} navigation={() => navigation.navigate('AddCardScreen')}/>
                </View>
              </View>
        </View>
      )
    }

  return (
    <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, marginBottom: 50,}}>
           <HeaderEarth />
  
           <View style={{marginTop: 27}}>
               <Text style={{fontSize: 16, fontFamily:'Poppins-SemiBold', color: '#000', textAlign: "center"}}>{t('Mes cartes enregistrées')}</Text>
           </View>

           {
            Cards.length == 0 && (
              <View style={{flex: 1 ,justifyContent: "center", alignItems:"center",marginTop: wp(50)}}>
                <Text>{t("il n'y a pas des cartes enregistrées")}</Text>
              </View>
            )
           } 
 
           {Cards.map((card, index) => (
                <View style={{paddingHorizontal: 55, marginTop: 30}} key={index}>
                    <View style={{position: "relative"}}>
                        <Image source={CartViolet} style={{width: wp(75), height: hp(22), objectFit: 'cover', borderRadius: 25}}/>
                        <View style={{ position: "absolute", top: 38, left: 30}}>
                                <Text style={{color: "#fff", fontSize: 12, fontFamily: 'Poppins-Medium'}}>{card.card.brand}</Text>
                        </View>
                        <View style={{ position: "absolute", top: 15, right: 15}}>
                                <View style={{alignItems: "center", gap: 8}}>
                                    <TouchableOpacity>
                                        <MaterialCommunityIcons name="pencil-outline" size={18} color="#fff"/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {deleteCard(card)}}>
                                        <Feather name="trash-2" size={18} color="#fff"/>
                                    </TouchableOpacity>
                                </View>
                        </View>

                        <View style={{ position: "absolute", bottom: 18, left: 30}}>
                                <Text style={{color: "#fff", fontSize: 14, fontFamily: 'Poppins-Medium'}}>**** **** **** {card.card.last4}</Text>
                        </View>
                        <View style={{ position: "absolute", top: 68, right: 40}}>
                            <Image source={MasterCard}/>
                        </View>
                    </View>
                </View>
           ))} 

           <View style={{ marginTop: 22, justifyContent: "center", alignItems: 'center', marginBottom: 30}}>
             <Button title={t("Ajouter une nouvelle carte")} navigation={() => navigation.navigate('AddCardScreen')}/>
           </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default CartBancair