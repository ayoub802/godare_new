import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';

import MasterCard from "../../assets/images/masterCard.png"
import {useTranslation} from 'react-i18next';
import { getAuthentificationData } from '../../modules/GestionStorage';
import { useNavigation } from '@react-navigation/native';
import { getClientCards, removeCard } from '../../modules/GestionStripe';
import Toast from 'react-native-toast-message';
import { HeaderEarth } from '../../components/Header';
import styles from './style';


function CreditCard() {

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

        const userCards = await getClientCards(userEmail);

        setCards(userCards.data);

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
    }
    catch (error )
    {
      Toast.show({
        type: 'error',
        text1: t('Carte'),
        text2: t("Erreur lors de la suppression de la carte !"),
      });

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
 
  console.log(Cards);

  return (
    <View style={styles.container}>
      <HeaderEarth />

      <TouchableOpacity style={styles.ButtonContainer} onPress={() => { navigateToAddCard() }}>
        <Text style={styles.ButtonText}>{t('Ajouter une nouvelle carte')}</Text>
      </TouchableOpacity>
      
      <Text style={styles.HeadingText}>{t('Mes cartes enregistrées')}</Text>

      {Cards.map((card, index) => (
        <View style={styles.CardMainContainer} key={index}>
          <View style={styles.CardFeild}>
            <Image
              source={'visa' == card.card.brand ? MasterCard : MasterCard}
              resizeMode="contain"
              style={styles.CardFeildImage}
            />
            <Text style={styles.CardFeildText}>*****{card.card.last4}</Text>

            <TouchableOpacity  onPress={() => updateCard(card)}>
              <Text style={styles.CardFeildText}>{t('Modifier')}</Text>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => deleteCard(card)}>
              <Text style={styles.CardFeildText}>{t('Supprimer')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))} 
    </View>
  );
}

export default CreditCard;
