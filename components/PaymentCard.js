import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import Checkbox from 'expo-checkbox';

import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { useIsFocused } from '@react-navigation/native'
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native'
import { useTranslation } from 'react-i18next'
import { doPaymentWithSavedCard, fetchPaymentIntentClientSecret, getClientCards } from '../modules/GestionStripe';
import { getAuthUserEmail, getCartPrices } from '../modules/GestionStorage';
import { buildCommande } from '../modules/GestionFinalisationPanier';
import { getImageType } from '../modules/TraitementImage';
import axiosInstance from '../axiosInstance';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PaymentCard = (props) => {

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
    const [Cards, setCards] = useState([]);
    const [SelectedCard, setSelectedCard] = useState(null);
    const [SelectedCardCVC, setSelectedCardCVC] = useState('');
  
  
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
  
          // Fetch cards
          try
          {
            const userCards = await getClientCards(email);
    
            setCards(userCards.data);
            console.log(userCards.data);
          }
          catch (error)
          {
            console.log("Error:", error);
          }
  
  
          // avoir
          let AvoirValue = cartPrices.avoirValue;
  
          let avoir = AvoirValue ? AvoirValue : 0;
  
          // Remise total
          let remiseTotal = cartPrices.remiseTotal;
          remiseTotal = remiseTotal ? remiseTotal : 0;
  
  
          // Commande
          let data = await buildCommande();
  
          data.commande.totalPaye = price;
          data.commande.modePaiement = 'Carte bancaire';
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
        if (SelectedCard)
        {
            if (!SelectedCardCVC)
            {
              Toast.show({
                type: 'error',
                text1: t('Carte'),
                text2: t("Le CVC est obligatoire !"),
              });
    
              return;
            }
    
          // TODO: verifier le CVC
    
          // Faire le paiement
          setLoadingPayment(true);
  
          await doPaymentWithSavedCard(UserEmail, SelectedCard.id, TotalPrice);
  
          setLoadingPayment(false);
        }
        else 
        {
          if (!cardDetails.complete) {
            Toast.show({
              type: 'error',
              text1: t('Carte'),
              text2: t("La carte n'est pas valide !"),
            });
      
            console.log("La carte n'est pas valide !");
            return;
          }
    
          const billingDetails = {
            email: UserEmail
          };
      
          setLoadingPayment(true);
      
      
          // Fetch the intent client secret from the backend.
          const clientSecret = await fetchPaymentIntentClientSecret(TotalPrice, UserEmail, name, enregistrerCarte);
      
      
          // Confirm the payment with the card details
          
          if (enregistrerCarte)
          {
            const {paymentIntent, error} = await confirmPayment(clientSecret, 
              {
                paymentMethodType: 'Card',
                paymentMethodData: {
                  billingDetails,
                }
              },
              {
                setupFutureUsage: 'OffSession',
              }
            );
      
            responseError = error;
          }
          else 
          {
            const {paymentIntent, error} = await confirmPayment(clientSecret, {
              paymentMethodType: 'Card',
              paymentMethodData: {
                billingDetails
              },
            });
      
            responseError = error;
          }
    
          if (responseError) 
          {
            Toast.show({
              type: 'error',
              text1: t('Erreur confirmation'),
              text2: t("Erreur lors de la confirmation de paiement !"),
            });
    
            console.log('Payment confirmation error', responseError);
    
            return;
          } 
      
          setLoadingPayment(false);
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
                    props.navigation.navigate("CartScreen");
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
          console.log("Erreur lors de la sauvegarde de la commande !");
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
        console.log("Erreur lors du paiement !");
      }
      
      
    };
  
  
    return (
        <View style={styles.container}>  
          <Text style={styles.headingText}>
            {t('Montant à payer : ')} €{ TotalPrice }
          </Text>
  
          {SelectedCard && (
            <View>
              <TextInput
                placeholder={t('Saisir le CSV')}
                placeholderTextColor="#CED2F5"
                style={styles.inputStyle}
                value={SelectedCardCVC}
                onChangeText={text => setSelectedCardCVC(text)}
              />
            </View>
          )
          }
  
          {!SelectedCard && (
            <>
              <View style={styles.PaymentInputsContainer}>
  
                <Text style={{ marginBottom: 20, marginTop: 20 }}>
                  {t('Ou saisir les informations de la nouvelle carte')}
                </Text>
  
                <View style={styles.inputContainer}>
                  
                  <View>

                    <TextInput 
                        value={name}
                        onChangeText={text => setName(text)}
                        placeholder="Samuel Witwicky"
                        placeholderTextColor="#626262"
                        style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 20 ,borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                        />
                  </View>
  
                
                </View>
  
                <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                      number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                      backgroundColor: '#FFFFFF',
                      textColor: '#000000',
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "#000000",
                      borderWidth: 1,
                      borderRadius: 20
                    }}
                    style={{
                      width: '100%',
                      height: 80,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 30,
                    }}
                    onCardChange={(cardDetails) => setCardDetails(cardDetails)}
                    
                  />
  
                {/* <CardForm
                            placeholder={{
                              number: "4242 4242 4242 4242",
                            }}
                            onFormComplete={(cardDetails) => {
                              console.log("card details", cardDetails)
                              setCardDetails(cardDetails)
                            }}
                            style={{
                              height: 200,
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                            cardStyle={{
                              backgroundColor: "#efefefef",
                              textAlign: "center",
                              textColor: "pink",
                            }}
                /> */}
  
                <View style={{flexDirection: "row", gap: 2}}>
                <Text>{t('Enregistrer la carte')}</Text>
                  <Checkbox
                    value={enregistrerCarte}
                    onValueChange={value => setEnregistrerCarte(value)}
                  />
                </View>
              </View>
            </>
          )
  
          }
  
          
  
          
          <View style={{flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 80}}>
            <TouchableOpacity
                style={[
                styles.btnContainer,
                {marginTop: 10, backgroundColor: '#3292E0'},
                ]}
                //onPress={handleConfirmation}// stripe Payment Button
                onPress={validatePayment}// stripe Payment Button
                disabled={LoadingPayment}
            >
                <Text style={styles.btnText}>{t('Valider le paiement')}</Text>
            </TouchableOpacity>
          </View>
  
  
          {LoadingPayment && <ActivityIndicator />}
      
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
      height: "70%",
      alignItems: "center"
    },
    PaymentInputsContainer: {
      // backgroundColor: 'tomato',
      height: windowHeight * 0.22,
      width: windowWidth * 0.9,
      marginTop: windowHeight * 0.03,
      alignItems: 'center',
    },
    inputContainer: {
      // backgroundColor: 'green',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#E4EBF9',
    },
    inputStyle: {
      backgroundColor: '#fff',
      width: windowWidth * 0.6,
      color: '#000',
      fontFamily: 'Roboto-Regular',
    },
    typesCardContainer: {
      // backgroundColor: 'tomato',
      width: 245,
      height: 37,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: windowHeight * 0.05,
    },
    cardTypeImageStyle: {
      width: 245,
      height: 37,
      alignSelf: 'center',
    },
    btnContainer: {
      backgroundColor: '#3292E0',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: windowHeight * 0.2,
      width: windowWidth * 0.7,
      height: windowHeight * 0.07,
      borderRadius: 40,
    },
    btnText: {
      fontFamily: 'Roboto-Regular',
      color: '#fff',
    },
    headingText: {
      marginTop:20,
      marginBottom: 20,
      color: '#000',
      fontFamily: 'Roboto-Regular',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    CardMainContainer: {
      flexDirection: 'row',
      width: '81%',
      alignSelf: 'center',
      marginTop: 15,
    },
    CardField: {
      flexDirection: 'row',
      height: 30,
      width: '88%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
    },
    CardFieldImage: {
      width: '15%',
      height: 25,
      marginLeft: '2%',
    },
    CardFieldText: {
      fontSize: 10,
      color: '#34B3E8',
      marginLeft: '4%',
      marginTop: 7,
    },
    CardCircle: {
      marginLeft: '5%',
      marginTop: 3,
    },
    centeredView:{
      // backgroundColor:'red',
      width:"90%",
      height:'90%',
      alignSelf:'center',
      marginTop:'auto',
      marginBottom:'auto'
    },
    cross:{
      backgroundColor:'red',
      marginRight:20,
      marginTop:10,
      marginLeft:'auto',
      width:30,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:100
    },
    image:{
      width:50,
      height:50
  
    }
  });
export default PaymentCard