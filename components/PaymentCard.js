import { View, Text, TextInput, TouchableOpacity,ActivityIndicator,ToastAndroid, Alert ,Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import Checkbox from 'expo-checkbox';

import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { useIsFocused } from '@react-navigation/native'
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native'
import { useTranslation } from 'react-i18next'
import { doPaymentWithSavedCard, fetchPaymentIntentClientSecret, getClientCards } from '../modules/GestionStripe';
import { getAuthUserEmail, getCartPrices, removePanier } from '../modules/GestionStorage';
import { buildCommande } from '../modules/GestionFinalisationPanier';
import { getImageType } from '../modules/TraitementImage';
import axiosInstance from '../axiosInstance';
import MasterCard from "../assets/images/masterCard.png"
import { cardData } from '../constant/data';
import CartViolet from "../assets/images/card_violet.png"
import CartGreen from "../assets/images/card_green.png"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PaymentCard = (props) => {

  const customCardFieldStyles = {
    base: {
      fontSize: 16, // Adjust font size as needed
      placeholderColor: '#000000', // Change this to the color you want
      color: 'black', // Text color
    },
  };
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
    const [isSelected, setIsSelected] = useState(false);

  
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
          
          console.log(email);
          // Fetch cards
          try
          {
            const userCards = await getClientCards(email);
    
            console.log(userCards.created);
            setCards(userCards.data);
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
  
    console.log("Cards:", Cards);

  
    //validatePayment
    const validatePayment = async () => {
  
      let responseError = null;
  
      try 
      {
        if (SelectedCard)
        {
            if (!SelectedCardCVC)
            {

              ToastAndroid.show('Le CVC est obligatoire !',ToastAndroid.SHORT);
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

            ToastAndroid.show("La carte n'est pas valide !",ToastAndroid.SHORT);
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

            ToastAndroid.show("Payment confirmation error",ToastAndroid.SHORT);
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
          
          ToastAndroid.show("Erreur lors de la sauvegarde de la commande !",ToastAndroid.SHORT);
          console.log("Erreur lors de la sauvegarde de la commande !");
        }
    
      }
      catch(error)
      {
        console.log('error', error);
        ToastAndroid.show("Erreur lors du paiement !",ToastAndroid.SHORT);
        console.log("Erreur lors du paiement !");
      }
      
      
    };
  
    if(!Cards){
      return (
        <View style={{justifyContent: 'flex-start', flex: 1}}>
            {/* <ActivityIndicator size="large" color="#3292E0" style={{}} /> */}
              
          {!SelectedCard && (
            <>
              <View style={[styles.PaymentInputsContainer, {marginTop: windowWidth * 0.12}]}>
  
                <View style={{width: "100%"}}>
                <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 5}}>Nom du titulaire</Text>

                    <TextInput 
                        value={name}
                        onChangeText={text => setName(text)}
                        placeholder="Samuel Witwicky"
                        placeholderTextColor="#626262"
                        style={{borderWidth: 1,width: "100%", height: 54 ,borderColor: "#AAB0B7", paddingLeft: 20 ,borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                        />
                </View>
  


                <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 5, marginTop: 15}}>Cart Bancaire</Text>                 
                    <CardField
                        postalCodeEnabled={false}
                        placeholder={{
                          number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                          backgroundColor: '#FFFFFF',
                          placeholderColor: "#999999",
                          textColor: '#000000',
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor: "#AAB0B7",
                          borderWidth: 1,
                          borderRadius: 8
                        }}
                        style={{
                          width: '100%',
                          height: 54,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 0,
                          marginBottom: 20,
                        }}
                        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
                      />

  
  
                <View style={{flexDirection: "row-reverse",alignItems: "center" ,gap: 5}}>
                    <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000"}}>{t('Enregistrer les détails de la carte')}</Text>
                      {/* <Checkbox
                        value={enregistrerCarte}
                        onValueChange={value => console.log(value)}
                        style={{borderRadius: 5, padding: 5, borderColor: "#2BA6E9",}}
                      /> */}
                      <TouchableOpacity onPress={() => {setIsSelected(!isSelected), setEnregistrerCarte(!enregistrerCarte)}}>
                                <View style={{width: wp(5.8), height: hp(3), borderColor: "#2BA6E9", borderWidth: 2, borderRadius: 7, padding: 4,justifyContent: "center",alignItems: "center" , backgroundColor: "transparent"}}>
                                    {isSelected ? <View style={{ backgroundColor: "#2BA6E9", width: 12, height: 12, borderRadius: 3}}></View> : null}
                                </View>
                        </TouchableOpacity>
                    </View>

                    
              </View>
                <View style={{marginTop: wp(12), width: windowWidth * 0.85,alignSelf: "center"}}>
                    <View style={{flexDirection: "row",justifyContent: "space-between", alignItems: "center"}}>
                      <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular", color: "#000"}}>{t('Montant à payer')}</Text>
                      <Text style={{ fontSize: 18, fontFamily: "Poppins-Bold", color: "#262A2B"}}>{ TotalPrice.toFixed(2) } €</Text>
                    </View>
                </View>
            </>
          )
  
          }
  
          
  
          
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity
                style={{marginTop: 10, backgroundColor: '#3292E0',paddingVertical: 12 ,paddingHorizontal: 32,flexDirection: "row", alignItems: "center",justifyContent: "center", backgroundColor: "#4E8FDA", borderRadius: 25}}
                //onPress={handleConfirmation}// stripe Payment Button
                onPress={validatePayment}// stripe Payment Button
                disabled={LoadingPayment}
            >
                <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#fff"}}>{t('Payer maintenant')}</Text>
            </TouchableOpacity>
          </View>
  
  
          {LoadingPayment && <ActivityIndicator />}
        </View>
      );
    }
  
    return (
        <View style={styles.container}>  

              {Cards.length > 0 
              ? 
                (
                  <></>
                )
              :
              <Text style={{textAlign: "center"}}>
                
              </Text>
            }
            {/* {Cards.map((card, index) => (
              <View style={styles.CardMainContainer} key={index}>
                
                <TouchableOpacity onPress={() => setSelectedCard(card)}>
                  <View style={styles.CardField}>
                    <Image
                      source={'visa' == card.card.brand ? MasterCard : MasterCard}
                      resizeMode="contain"
                      style={styles.CardFieldImage}
                    />
                    
                    <Text style={styles.CardFieldText}>*****{card.card.last4}</Text>
          
                  </View>
                </TouchableOpacity>
              </View>
            ))}  */}
             <ScrollView horizontal style={{paddingLeft: 10}} showsHorizontalScrollIndicator={false}>
                        {
                            Cards.map((item, index) => (
                            <TouchableOpacity onPress={() => setSelectedCard(item)} style={{position: "relative", marginRight: 22}} key={index}>
                                <Image source={CartViolet} style={{width: wp(75), height: hp(22), objectFit: 'cover', borderRadius: 25}}/>
                                <View style={{ position: "absolute", top: 38, left: 30}}>
                                    <Text style={{color: "#fff", fontSize: 12, fontFamily: 'Poppins-Medium', textTransform: "capitalize"}}>{item.billing_details.name}</Text>
                                    <Text style={{color: "#fff", fontSize: 16, fontFamily: 'Poppins-Bold'}}>{TotalPrice.toFixed(2)} €</Text>
                                </View>
            
                                <View style={{ position: "absolute", bottom: 18, left: 30}}>
                                    <Text style={{color: "#fff", fontSize: 14, fontFamily: 'Poppins-Medium'}}>**** **** **** {item.card.last4}</Text>
                                </View>
                                <View style={{ position: "absolute", top: 68, right: 40}}>
                                  <Image source={MasterCard}/>
                                </View>
                            </TouchableOpacity>
                            ))
                        }
                </ScrollView>
          {SelectedCard && (
            <View style={{paddingHorizontal: 25, marginTop: 25}}>
              <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 5}}>CSV</Text>
              <TextInput
                placeholder={t('Saisir le CSV')}
                placeholderTextColor="#626262"
                style={{borderWidth: 1,width: "100%" ,borderColor: "#AAB0B7", paddingLeft: 20 ,borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                value={SelectedCardCVC}
                onChangeText={text => setSelectedCardCVC(text)}
              />
            </View>
          )
          }
  
          {!SelectedCard && (
            <>
              <View style={styles.PaymentInputsContainer}>
  
                <View style={{width: "100%"}}>
                <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 5}}>Nom du titulaire</Text>

                    <TextInput 
                        value={name}
                        onChangeText={text => setName(text)}
                        placeholder="Samuel Witwicky"
                        placeholderTextColor="#626262"
                        style={{borderWidth: 1,width: "100%", height: 54 ,borderColor: "#AAB0B7", paddingLeft: 20 ,borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                        />
                </View>
  


                <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 5, marginTop: 15}}>Cart Bancaire</Text>                 
                    <CardField
                        postalCodeEnabled={false}
                        placeholder={{
                          number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                          backgroundColor: '#FFFFFF',
                          placeholderColor: "#999999",
                          textColor: '#000000',
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor: "#AAB0B7",
                          borderWidth: 1,
                          borderRadius: 8
                        }}
                        style={{
                          width: '100%',
                          height: 54,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 0,
                          marginBottom: 20,
                        }}
                        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
                      />

  
  
                <View style={{flexDirection: "row-reverse",alignItems: "center" ,gap: 5}}>
                    <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000"}}>{t('Enregistrer les détails de la carte')}</Text>
                      {/* <Checkbox
                        value={enregistrerCarte}
                        onValueChange={value => console.log(value)}
                        style={{borderRadius: 5, padding: 5, borderColor: "#2BA6E9",}}
                      /> */}
                      <TouchableOpacity onPress={() => {setIsSelected(!isSelected), setEnregistrerCarte(!enregistrerCarte)}}>
                                <View style={{width: wp(5.8), height: hp(3), borderColor: "#2BA6E9", borderWidth: 2, borderRadius: 7, padding: 4,justifyContent: "center",alignItems: "center" , backgroundColor: "transparent"}}>
                                    {isSelected ? <View style={{ backgroundColor: "#2BA6E9", width: 12, height: 12, borderRadius: 3}}></View> : null}
                                </View>
                        </TouchableOpacity>
                    </View>

                    
              </View>
                <View style={{marginTop: wp(12), width: windowWidth * 0.85,alignSelf: "center"}}>
                    <View style={{flexDirection: "row",justifyContent: "space-between", alignItems: "center"}}>
                      <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular", color: "#000"}}>{t('Montant à payer')}</Text>
                      <Text style={{ fontSize: 18, fontFamily: "Poppins-Bold", color: "#262A2B"}}>{ TotalPrice.toFixed(2) } €</Text>
                    </View>
                </View>
            </>
          )
  
          }
  
          
  
          
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity
                style={{marginTop: 10, backgroundColor: '#3292E0',paddingVertical: 12 ,paddingHorizontal: 32,flexDirection: "row", alignItems: "center",justifyContent: "center", backgroundColor: "#4E8FDA", borderRadius: 25}}
                //onPress={handleConfirmation}// stripe Payment Button
                onPress={validatePayment}// stripe Payment Button
                disabled={LoadingPayment}
            >
                <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#fff"}}>{t('Payer maintenant')}</Text>
            </TouchableOpacity>
          </View>
  
  
          {LoadingPayment && <ActivityIndicator />}
      
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
      width: "100%",
      marginBottom: 80
    },
    PaymentInputsContainer: {
      // backgroundColor: 'tomato',
      height: windowHeight * 0.22,
      width: windowWidth * 0.93,
      alignSelf: "center",
      marginHorizontal:"auto",
      alignItems: 'flex-start',
      justifyContent: "center",
      marginTop: windowWidth * 0.2,
      paddingLeft: wp(4)
    },
    inputContainer: {
      // backgroundColor: 'green',
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
    checkStyle:{
      position: "absolute", 
      bottom: 12, 
      right: 20,
      zIndex: 1000, 
      backgroundColor: "#fff", 
      padding: 8, 
      borderRadius: 50,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 7,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5.16,
      elevation: 12,
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