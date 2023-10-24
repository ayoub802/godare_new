import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { useConfirmPayment } from '@stripe/stripe-react-native';
import { getAuthUserEmail, getCartPrices, removePanier } from '../modules/GestionStorage';
import { buildCommande } from '../modules/GestionFinalisationPanier';
import { getImageType } from '../modules/TraitementImage';
import axiosInstance from '../axiosInstance';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const WavePaymen = (props) => {

    const {t} = useTranslation();
    var isFocused = useIsFocused();

    const {confirmPayment} = useConfirmPayment();
  
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

        }
    
      }
      catch(error)
      {
        console.log('error', error);
  
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

            break;
          } else {
            // Attendez l'intervalle de temps spécifié avant la prochaine vérification.
            await new Promise((resolve) => setTimeout(resolve, pollingInterval));
          }
        } else {
          console.error('Erreur lors de la vérification de l\'état de la transaction.');
          // Gérez l'erreur, par exemple, en affichant un message d'erreur à l'utilisateur.
          setPaymentFailed(true);
          break;
        }
      }
  
      setLoadingPayment(false);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'état de la transaction : ', error);
  
      setLoadingPayment(false);
      setPaymentFailed(true);
    }
  }

  return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>

        <Text style={{fontFamily:"Poppins-Medium", fontSize: 18, color:"#000", textAlign: "center"}}>
          {t('Montant à payer : ')} € { TotalPrice }
        </Text>

            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>

                    <TouchableOpacity
                    style={{marginTop: 10, backgroundColor: '#3292E0',paddingVertical: 12 ,paddingHorizontal: 32,flexDirection: "row", alignItems: "center",justifyContent: "center", backgroundColor: "#4E8FDA", borderRadius: 25}}
                      onPress={validatePayment}// stripe Payment Button
                      disabled={LoadingPayment}
                    >
                    <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#fff"}}>{t('Valider le paiement (Wave)')}</Text>
                    </TouchableOpacity>
            </View>

        {LoadingPayment && <ActivityIndicator />}
    
      </View>
  )
}

export default WavePaymen