import { View, Text,ScrollView, Image,TouchableOpacity  } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import CartViolet from "../../assets/images/card_violet.png"
import CartGreen from "../../assets/images/card_green.png"
import MasterCard from "../../assets/images/masterCard.png"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Feather from "react-native-vector-icons/Feather"
import Button from '../../components/Button'
const CartBancair = ({ navigation }) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={{flex: 1}}>
           <HeaderEarth />

           <View style={{marginTop: 27}}>
               <Text style={{fontSize: 16, fontFamily:'Poppins-SemiBold', color: '#000', textAlign: "center"}}>Mes cartes enregistrées</Text>
           </View>

           <View style={{paddingHorizontal: 55, marginTop: 30}}>
               <View style={{position: "relative"}}>
                   <Image source={CartViolet} style={{width: wp(75), height: hp(20), objectFit: 'cover', borderRadius: 25}}/>
                   <View style={{ position: "absolute", top: 38, left: 30}}>
                        <Text style={{color: "#fff", fontSize: 12, fontFamily: 'Poppins-Medium'}}>Visa</Text>
                   </View>
                   <View style={{ position: "absolute", top: 15, right: 15}}>
                        <View style={{alignItems: "center", gap: 8}}>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="pencil-outline" size={18} color="#fff"/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Feather name="trash-2" size={18} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                   </View>

                   <View style={{ position: "absolute", bottom: 18, left: 30}}>
                        <Text style={{color: "#fff", fontSize: 14, fontFamily: 'Poppins-Medium'}}>**** **** **** 1234</Text>
                   </View>
                   <View style={{ position: "absolute", top: 68, right: 40}}>
                      <Image source={MasterCard}/>
                   </View>
               </View>
           </View>

           <View style={{paddingHorizontal: 55, marginTop: 20}}>
               <View style={{position: "relative"}}>
                   <Image source={CartGreen} style={{width: wp(75), height: hp(20), objectFit: 'cover', borderRadius: 25}}/>
                   <View style={{ position: "absolute", top: 38, left: 30}}>
                        <Text style={{color: "#fff", fontSize: 12, fontFamily: 'Poppins-Medium'}}>Credit Card</Text>
                   </View>
                   <View style={{ position: "absolute", top: 15, right: 15}}>
                        <View style={{alignItems: "center", gap: 8}}>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="pencil-outline" size={18} color="#fff"/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Feather name="trash-2" size={18} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                   </View>

                   <View style={{ position: "absolute", bottom: 18, left: 30}}>
                        <Text style={{color: "#fff", fontSize: 14, fontFamily: 'Poppins-Medium'}}>**** **** **** 1234</Text>
                   </View>
                   <View style={{ position: "absolute", top: 68, right: 40}}>
                      <Image source={MasterCard}/>
                   </View>
               </View>
           </View>

           <View style={{ marginTop: 22, justifyContent: "center", alignItems: 'center'}}>
             <Button title="Ajouter une nouvelle carte" navigation={() => navigation.navigate('Login')}/>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CartBancair