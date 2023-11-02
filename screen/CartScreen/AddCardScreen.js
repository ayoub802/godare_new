import { View, Text, ScrollView, Image, TextInput,TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import { cardData, card_category } from '../../constant/data'
import PaymentCard from '../../components/PaymentCard'
import WavePaymen from '../../components/WavePaymen'
import { firebase } from '@react-native-firebase/firestore';
import { useTranslation } from 'react-i18next'
import { getAuthentificationData, getPlatformLanguage, getSelectedCountry, getSelectedService } from '../../modules/GestionStorage'
import { useIsFocused } from '@react-navigation/native'
import ServiceHeader from '../../components/ServiceHeader'
import { getClientCards } from '../../modules/GestionStripe'


const AddCardScreen = (props) => {
    const {t, i18n} = useTranslation();

    const [isSelected, setIsSelected] = useState(false);
    const [activeCard, setActiveCard] = useState(0);
    const [numCard, setNumCard] = useState(0);
    const [year, setYear] = useState(0);
    const [cvv, setCvv] = useState(0);
    const [name, setName] = useState('');
    var isFocused = useIsFocused();
    const [Service, setService] = useState(null);
    const [paysLivraisonObject, setPaysLivraisonObject] = useState(null);
    const [Language, setLanguage] = useState('fr');

    const [Activity, setActivity] = useState(true);
    const [ClientEmail, setClientEmail] = useState([]);
    const [Cards, setCards] = useState([]);

    const navigateToHomePickup = () => {
        const StoreAddress = firebase.firestore()
          .collection('Paydelivery')
          .add(documentSnapshot => {
            let datacome = documentSnapshot.docs.map(d => d.data())
            // setStoreAddress(datacome.map(ls=>ls.Address[0]));
            console.log('datacome', datacome[0].name);
            props.navigation.navigate("SuccessFully", {
              string: datacome[0].name,
            });
          });
      };

    useEffect(() => {

        async function fetchData()
        {
          setActivity(true);
    
    
    
          // Get pays de livraison
          let paysLivraisonObject = await getSelectedCountry();
          setPaysLivraisonObject(paysLivraisonObject);
    
          // Language
          const currentLanguage = await getPlatformLanguage();
          setLanguage(currentLanguage);
          
          // Get service
          let service = await getSelectedService();
    
          const userEmail = await getAuthentificationData();
          setClientEmail(userEmail);
  
          const userCards = await getClientCards(userEmail);
  
          setCards(userCards.data);
    
          setService(service);

    
           setActivity(false);
    
        }
    
    
        fetchData();
    }, [isFocused])
    
    if (!Service )
    {
      return (
        <View style={{justifyContent: 'center', height: '80%'}}>
            <ActivityIndicator size="large" color="#3292E0" style={{}} />
        </View>
      );
    }
  return (
    <SafeAreaView style={{flex: 1}}>

           <View style={{flex: 1}}>
             
             <ServiceHeader 
            navigation={props.navigation}
            service={Service}
            paysLivraison={paysLivraisonObject}
            language={Language}
            />


                <View style={{marginTop: 24, marginBottom: 12}}>
                    <Text
                        style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        color: '#000',
                        textAlign: 'center',
                        }}>
                        {t('Mode de paiement')}
                    </Text>
                </View>
                
                <ScrollView  horizontal style={{paddingLeft: 10}} showsHorizontalScrollIndicator={false}>
                            {
                                card_category.map((item, index) => (
                                    <View key={index} style={{ marginRight: 15, marginBottom: 15}}>
                                        <TouchableOpacity onPress={() => setActiveCard(index)} style={[activeCard === index ?  styles.backgroundColorActive : styles.backgroundColor, { justifyContent: "center",borderRadius: 20,alignItems: "center" ,paddingHorizontal: 41, paddingVertical: 16, height: 56, borderWidth: 1.2, borderColor: "#2196F3"}]}>
                                            <View style={{display: item.imgDisplay}}>{activeCard === index ? item.imgActive : item.img}</View>
                                            <Text style={[activeCard === index ? styles.textActive : styles.textColor, {display: item.titledisplay, fontFamily: "Poppins-Medium", fontSize: 16}]}>{item.title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                </ScrollView>
                <ScrollView>
                        {
                            activeCard == 0 ?
                            (
                                <PaymentCard />
                            )
                            :
                            null
                        }

                        {
                            activeCard == 1 ?
                            (
                                <WavePaymen />
                            )
                            :
                            null
                        }
                        {
                            activeCard == 2 ? 
                            (
                                <TouchableOpacity
                                onPress={() => {
                                    navigateToHomePickup();
                                }}>
                                    <Text>{t('Payer au dépôt au magasin')}</Text>
                                </TouchableOpacity>
                            )
                            :
                            null
                        }
                </ScrollView>


           </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    backgroundColorActive: {
        backgroundColor: "#2196F3"
    },
    backgroundColor: {
        backgroundColor: "#fff"
    },
    textActive: {
        color: "#fff"
    },
    textColor: {
       color: "#000"
    },
})

export default AddCardScreen