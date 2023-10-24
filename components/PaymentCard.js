import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, {useState} from 'react'
import MasterCard from "../assets/images/masterCard.png"
import { doc, setDoc } from 'firebase/firestore'
import { db_firesotre } from '../../modules/FirebaseConfig'
import { firebase } from '@react-native-firebase/firestore'
import { cardData } from '../constant/data';
import Button from './Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const PaymentCard = ({ navigation }) => {
    
    const [isSelected, setIsSelected] = useState(false);
    const [activeCard, setActiveCard] = useState(0);
    const [numCard, setNumCard] = useState(0);
    const [year, setYear] = useState(0);
    const [cvv, setCvv] = useState(0);
    const [name, setName] = useState('');

    const SubmitEvent = async () => {
        try{
          firebase.firestore().collection('card').add({
              name: name,
              numCard: numCard,
              year: year,
              cvv: cvv,
            });
            console.log("Success");
        }
        catch(error){
          console.log("Error");
        }
      };
  return (
    <View>
       <ScrollView horizontal style={{paddingLeft: 10}} showsHorizontalScrollIndicator={false}>
                        {
                            cardData.map((item, index) => (
                            <View style={{position: "relative", marginRight: 22}} key={index}>
                                <Image source={item.image} style={{width: wp(75), height: hp(19), objectFit: 'cover', borderRadius: 25}}/>
                                <View style={{ position: "absolute", top: 38, left: 30}}>
                                    <Text style={{color: "#fff", fontSize: 12, fontFamily: 'Poppins-Medium'}}>{item.name}</Text>
                                    <Text style={{color: "#fff", fontSize: 16, fontFamily: 'Poppins-Bold'}}>{item.price} €</Text>
                                </View>
            
                                <View style={{ position: "absolute", bottom: 18, left: 30}}>
                                    <Text style={{color: "#fff", fontSize: 14, fontFamily: 'Poppins-Medium'}}>{numCard}</Text>
                                </View>
                                <View style={{ position: "absolute", top: 68, right: 40}}>
                                <Image source={MasterCard}/>
                                </View>
                            </View>
                            ))
                        }
        </ScrollView>

        <View style={{paddingHorizontal: 25, marginTop: 41}}>
            <View style={{}}>
                <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 10}}>Nom du titulaire</Text>
                <TextInput 
                value={name}
                onChangeText={(name) => setName(name)}
                placeholder="Samuel Witwicky"
                placeholderTextColor="#626262"
                style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 20 ,borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                />
            </View>
            <View style={{marginTop: 20}}>
                <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 10}}>Numéro de carte</Text>
                <TextInput 
                value={numCard}
                onChangeText={(numCard) => setNumCard(numCard)}
                placeholder="6775 2235 5567 1234"
                placeholderTextColor="#626262"
                style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 20 ,borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                />
            </View>
            <View style={{marginTop: 20}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10}}>
                    <View>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 10}}>Mois /année</Text>
                        <TextInput 
                        value={year}
                        onChangeText={(year) => setYear(year)}
                        placeholder="Enter here"
                        placeholderTextColor="#626262"
                        style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 20,width: wp(42), borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#000", marginBottom: 10}}>CVV</Text>
                        <TextInput 
                        value={cvv}
                        onChangeText={(cvv) => setCvv(cvv)}
                        placeholder="Enter here"
                        placeholderTextColor="#626262"
                        style={{borderWidth: 1, borderColor: "#AAB0B7",width: wp(42) ,paddingLeft: 20 ,borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                        />
                    </View>
                </View>
            </View>

            <View style={{marginTop: 24}}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10}}>
                    <TouchableOpacity onPress={() => setIsSelected(!isSelected)}>
                            <View style={{width: 24, height: 24, borderColor: "#2BA6E9", borderWidth: 2, borderRadius: 7, padding: 4,justifyContent: "center",alignItems: "center" , backgroundColor: "transparent"}}>
                                {isSelected ? <View style={{ backgroundColor: "#2BA6E9", width: 12, height: 12, borderRadius: 3}}></View> : null}
                            </View>
                    </TouchableOpacity>

                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: "#000"}}>Enregistrer les détails de la carte </Text>
                </View>
            </View>

            <View style={{marginTop: 20}}>
                <View style={{flexDirection: "row",justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular", color: "#000"}}>Montant à payer</Text>
                    <Text style={{ fontSize: 18, fontFamily: "Poppins-Bold", color: "#262A2B"}}>90,85 €</Text>
                </View>
            </View>

            <View style={{marginTop: 20, flex: 1, justifyContent: "flex-end", alignItems: 'center', paddingBottom: 72}}>
                <Button title="Payez maintenant" navigation={SubmitEvent}/>
            </View>
        </View>

    </View>
  )
}

export default PaymentCard