import { View, Text, ScrollView, Image, TextInput,TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
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


const AddCardScreen = ({ navigation }) => {
    const {t, i18n} = useTranslation();

    const [isSelected, setIsSelected] = useState(false);
    const [activeCard, setActiveCard] = useState(0);
    const [numCard, setNumCard] = useState(0);
    const [year, setYear] = useState(0);
    const [cvv, setCvv] = useState(0);
    const [name, setName] = useState('');

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


  return (
    <SafeAreaView style={{flex: 1}}>

           <View style={{flex: 1}}>
                <View style={{ position: "relative" ,alignItems: "center", backgroundColor: "#2BA6E9", justifyContent: "center", height: hp(12)}}>
                    <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Bold"}}>Fret par avoin</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10}}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                            <Image source={France}/>
                            <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Regular"}}>France</Text>
                            <Feather name="arrow-up-right" color="#fff" size={22}/>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                            <Image source={CoteIvoire}/>
                            <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Regular"}}>Côte d'ivoire</Text>
                            <Feather name="arrow-down-right" color="#fff" size={22}/>
                        </View>
                    </View>

                    <View style={{ position: "absolute", top: 15, right: 10}}>
                        <Image source={SmallEarth}/>
                        <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Bold", textAlign: "center", marginTop: 4}}>GS</Text>
                    </View>
                </View>
            

                <View style={{marginTop: 24, marginBottom: 12}}>
                    <Text
                        style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        color: '#000',
                        textAlign: 'center',
                        }}>
                        Mode de paiment
                    </Text>
                </View>
                
                <ScrollView  horizontal style={{paddingLeft: 10}} showsHorizontalScrollIndicator={false}>
                            {
                                card_category.map((item, index) => (
                                    <View key={index} style={{ marginRight: 15, marginBottom: 25}}>
                                        <TouchableOpacity onPress={() => setActiveCard(index)} style={[activeCard === index ?  styles.backgroundColorActive : styles.backgroundColor, { justifyContent: "center",borderRadius: 20,alignItems: "center" ,paddingHorizontal: 41, paddingVertical: 16, height: 56, borderWidth: 1.2, borderColor: "#2196F3"}]}>
                                            <View style={{display: item.imgDisplay}}>{activeCard === index ? item.imgActive : item.img}</View>
                                            <Text style={[activeCard === index ? styles.textActive : styles.textColor, {display: item.titledisplay, fontFamily: "Poppins-Medium", fontSize: 16}]}>{item.title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                </ScrollView>

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