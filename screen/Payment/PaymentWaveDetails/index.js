//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
  ScrollView
} from 'react-native';

import Checkbox from 'expo-checkbox';
import styles from './styles';
import { useIsFocused } from '@react-navigation/native';
import axiosInstance from '../../../axiosInstance';
import {useTranslation} from 'react-i18next';
import { buildCommande } from '../../../modules/GestionFinalisationPanier';
import { getAuthUserEmail, getCartPrices } from '../../../modules/GestionStorage';
import { getImageType } from '../../../modules/TraitementImage';
import { removePanier } from '../../../modules/GestionStorage';
import {  useConfirmPayment, CardField } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import { HeaderEarth } from '../../../components/Header';



const PaymentWaveDetails = props => {
  
  var isFocused = useIsFocused();

  const {confirmPayment} = useConfirmPayment();


  const {t} = useTranslation();

  const [name, setName] = useState('');
  const [TotalPrice, setTotalPrice] = useState(0);
  const [Commande, setCommande] = useState({});
  const [UserEmail, setUserEmail] = useState(null);
  const [enregistrerCarte, setEnregistrerCarte] = useState(false);
  const [LoadingPayment, setLoadingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [SelectedCard, setSelectedCard] = useState(null);
  const [SelectedCardCVC, setSelectedCardCVC] = useState('');
  const [PaymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {

    async function fetchValue() {

      try
      {
        // get prices
        const cartPrices = await getCartPrices();

        let price = cartPrices.finalPrice;
        price = price ? parseFloat(price) : 0;
        price = isNaN(price) ? 0 : price;

        setTotalPrice(price);

        // email
        const email = await getAuthUserEmail();
        setUserEmail(email);


        // avoir
        let AvoirValue = cartPrices.avoirValue;

        let avoir = AvoirValue ? AvoirValue : 0;

        // Remise total
        let remiseTotal = cartPrices.remiseTotal;
        remiseTotal = remiseTotal ? remiseTotal : 0;

        // Commande
        let data = await buildCommande();

        data.commande.totalPaye = price;
        data.commande.modePaiement = 'Wave';
        data.commande.montantPayeParCarte = price;
        data.avoir = avoir;

        if (avoir)
        {
          data.commande.montantPayeEnAvoir = avoir;
        }

        if (remiseTotal)
        {
          data.commande.montantPayeEnRemise = remiseTotal;
        }

        console.log('commande final', data)

        setCommande(data);
      }
      catch(error)
      {
        console.log('error', error)
      }
    }


    fetchValue();

    return (mounted) => mounted = false;

  }, [isFocused]);



  //validatePayment
  const validatePayment = async () => {

    let responseError = null;

    try 
    {
      

      await openPaymentLink(); // Ouvre le lien de paiement dans le navigateur
  
  
      if (PaymentFailed)
      {
        return Alert.alert(
          t('Erreur'),
          t('Commande non finalisée car le paiement a échoué'),
          [
            {
              text: 'OK'
            },
          ],
        );
      }

      Commande.commande.statut = 'Payée';
        
      console.log('final save Commande', Commande);


      const formData = new FormData();

      formData.append('livraison', JSON.stringify(Commande.livraison));
      formData.append('depot', JSON.stringify(Commande.depot));
      formData.append('remise', JSON.stringify(Commande.remise));
      formData.append('avoir', Commande.avoir);
      formData.append('client', UserEmail);
      formData.append('commande', JSON.stringify(Commande.commande));
      formData.append('products', JSON.stringify(Commande.products));
      formData.append('adresseFacturation', Commande.adresseFacturation);
      formData.append('adresseFacturationType', Commande.adresseFacturationType);
      formData.append('facturationNom', Commande.facturationNom);

      Commande.productImages.forEach((productImage) => {
        let productId = productImage.productId;
        let image = productImage.image;

        if (image)
        {
          formData.append('image_' + productId, {
            uri: image,
            type: getImageType(image)
          });
        }
      });

      try 
      {
        const response = await axiosInstance.post('/commandes/new', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });

        removePanier();

        return Alert.alert(
          t('Succès'),
          t('Votre commande a été validée'),
          [
            {
              text: 'OK',
              onPress: () => {
                  props.navigation.navigate(Navigationstrings.WeightCal);
              },
            },
          ],
        );
      } 
      catch (error) 
      {
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
        console.log(error.config);
        
        Toast.show({
          type: 'error',
          text1: t('Commande'),
          text2: t("Erreur lors de la sauvegarde de la commande !"),
        });
      }
  
    }
    catch(error)
    {
      console.log('error', error);

      Toast.show({
        type: 'error',
        text1: t('Paiement'),
        text2: t("Erreur lors du paiement !"),
      });
    }
    
    
  };


  async function createPaymentSession() {
    try {
      const response = await fetch('https://godaregroup.com/api/wave/create/payment_sessions', {
        method: 'POST',
        body: JSON.stringify({ amount: TotalPrice }), // Envoyer les données au format JSON
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
    
      

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement : ', error);
      setPaymentFailed(true);
      throw error;
    }
  }

  async function openPaymentLink() {
    try {
      setLoadingPayment(true);

      const lienDePaiement = await createPaymentSession();

      console.log('lienDePaiement', lienDePaiement);

      await Linking.openURL(lienDePaiement.wave_launch_url);

      const timeoutInMilliseconds = Date.parse(lienDePaiement.when_expires) // date d'expiration en Milliseconds
      console.log('timeoutInMilliseconds', timeoutInMilliseconds)
      await waitForPaymentConfirmationWithTimeout(lienDePaiement.id, timeoutInMilliseconds);

      setLoadingPayment(false);

    } catch (error) {
      console.error('Erreur lors de l\'ouverture du lien : ', error);
      setPaymentFailed(true);
      Toast.show({
        type: 'error',
        text1: t('Wave'),
        text2: t('Erreur lors de l\'ouverture du lien.!'),
      });
    }
  }

// Fonction pour vérifier périodiquement l'état de la transaction avec une limite de temps
async function waitForPaymentConfirmationWithTimeout(paymentSessionId, timeoutInMilliseconds) {
  try {
    const pollingInterval = 5000; // Intervalle de vérification en millisecondes (20 secondes ici)
    const startTime = Date.now();

    setLoadingPayment(true);

    while (true) {

      const currentTime = Date.now();
      if (currentTime - startTime > timeoutInMilliseconds) {
        console.log('Délai limite atteint. Aucune confirmation de paiement.');
        setLoadingPayment(false);
        setPaymentFailed(true);
        Toast.show({
          type: 'error',
          text1: t('Wave'),
          text2: t('Délai limite atteint. Aucune confirmation de paiement.!'),
        });
        break;
      }

      console.log('waitForPaymentConfirmationWithTimeout paymentSessionId', paymentSessionId);

      if (!paymentSessionId)
      {
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      }


      const response = await fetch(`https://godaregroup.com/api/wave/events/${paymentSessionId}`, {
        method: 'GET'
      });

      console.log('waitForPaymentConfirmationWithTimeout response', response);
      if (response.status === 200) {
        const data = await response.json();

        console.log('waitForPaymentConfirmationWithTimeout data', data);

        const statutPaiement = data.paymentStatus; // Exemple : 'confirmed' ou 'failed'

        if (statutPaiement === 'succeeded') {
          console.log('Paiement confirmé !');
          setPaymentFailed(false);
          Toast.show({
            type: 'success',
            text1: t('Wave'),
            text2: t('Paiement confirmé !'),
          });
          break;
        } else {
          // Attendez l'intervalle de temps spécifié avant la prochaine vérification.
          await new Promise((resolve) => setTimeout(resolve, pollingInterval));
        }
      } else {
        console.error('Erreur lors de la vérification de l\'état de la transaction.');
        // Gérez l'erreur, par exemple, en affichant un message d'erreur à l'utilisateur.
        setPaymentFailed(true);
        Toast.show({
          type: 'error',
          text1: t('Wave'),
          text2: t('Erreur lors de la vérification de l\'état de la transaction !'),
        });
        break;
      }
    }

    setLoadingPayment(false);
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'état de la transaction : ', error);

    setLoadingPayment(false);
    setPaymentFailed(true);
    Toast.show({
      type: 'error',
      text1: t('Wave'),
      text2: t('Erreur lors de la vérification de l\'état de la transaction !'),
    });
  }
}


  return (
    <ScrollView>
      <View style={styles.container}>
        <HeaderEarth />

        <Text style={styles.headingText}>
          {t('Montant à payer : ')} €{ TotalPrice }
        </Text>

        <TouchableOpacity
          style={[
            styles.btnContainer,
            {marginTop: 10, backgroundColor: '#3292E0'},
          ]}
          onPress={validatePayment}// stripe Payment Button
          disabled={LoadingPayment}
        >
          <Text style={styles.btnText}>{t('Valider le paiement (Wave)')}</Text>
        </TouchableOpacity>

        {LoadingPayment && <ActivityIndicator />}
    
      </View>
    </ScrollView>
  );
};

//make this component available to the app
export default PaymentWaveDetails;