import React, { useEffect, useState} from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import { getAuthentificationData } from '../../modules/GestionStorage';
import { useNavigation } from '@react-navigation/native';
import {  CardField, createPaymentMethod } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import { saveCard } from '../../modules/GestionStripe';
import {useTranslation} from 'react-i18next';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const AddStripeUserCard = () => {

  const {t} = useTranslation();



  const navigation = useNavigation();

    const [nom, setNom] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({});
 
    useEffect(() => {

      // Récuperer les cartes
      async function fetchUser() 
      {
        const email = await getAuthentificationData();
        setUserEmail(email);
      }
  
      fetchUser();
  
    }, []);
    

  //enregistrerCarte
  const enregistrerCarte = async () => {

    if (!cardDetails.complete) {
      Toast.show({
        type: 'error',
        text1: t('Carte'),
        text2: t("La carte n'est pas valide !"),
      });
      ToastAndroid.show("La carte n'est pas valide !", ToastAndroid.SHORT)

      return;
    }

    setLoading(true);

    try 
    {

      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: nom,
          }
        },
      });

      if (error) 
      {
        Toast.show({
          type: 'error',
          text1: t('Carte'),
          text2: t("Erreur lors de la sauvegarde de la carte !"),
        });
        ToastAndroid.show("Erreur lors de la sauvegarde de la carte !", ToastAndroid.SHORT)
        console.log('Error paiement', error);

        return;
      } 
      

      // saved card
      await saveCard(userEmail, nom, paymentMethod.id);

      Toast.show({
        type: 'success',
        text1: t('Succès'),
        text2: t('Carte enregistrée'),
      });
      ToastAndroid.show("Carte enregistrée", ToastAndroid.SHORT)
      setTimeout(() => 
      {
        navigation.navigate("CreditCard");
      }, 3000);
    }
    catch (error)
    {
      Toast.show({
        type: 'error',
        text1: t('Carte'),
        text2: t("Erreur lors de la sauvegarde de la carte !"),
      });
      ToastAndroid.show("Erreur lors de la sauvegarde de la carte !", ToastAndroid.SHORT)
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
        console.log('Error paiement', error.message);
      }
    }

    setLoading(false);
  };



  return (
    <View>

        <View>

        <View>
          <TextInput
            placeholder='Nom Prénom'
            placeholderTextColor="#CED2F5"
            value={nom}
            onChangeText={text => setNom(text)}
          />
        </View>

        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={(cardDetails) => setCardDetails(cardDetails)}
        />

 
     
        <TouchableOpacity
              style={[
                {marginTop: 10, 
                backgroundColor: '#3292E0',
                alignItems: 'center',
                justifyContent: 'center',
                width: windowWidth * 0.7,
                height: windowHeight * 0.07,
                borderRadius: 40,},
              ]}

              onPress={ enregistrerCarte }

              disabled={loading}
            >
          <Text>Enregistrer la carte</Text>
        </TouchableOpacity>
        </View>
    

        {loading && <ActivityIndicator />}

    </View>
  );
};

export default AddStripeUserCard;
