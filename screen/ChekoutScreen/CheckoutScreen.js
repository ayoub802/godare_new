import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import Feather from "react-native-vector-icons/Feather"
import Entypo from "react-native-vector-icons/Entypo"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import Stepper from '../Stepper'
import { productCart } from '../../constant/data'
import Button, { ButtonPrix } from '../../components/Button'

const CheckoutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1}}>
      <ScrollView style={{ flex: 1, paddingBottom: 15}} showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, paddingBottom: 80}}>


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

              <View>
                <Stepper position={5}/>
              </View>

              <View style={{marginTop: 16}}>
                  <View style={{backgroundColor: "#fff", paddingLeft: 28 ,paddingVertical: 12, marginBottom: 16, borderRadius: 18}}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 20}}>
                            <View style={{position: "relative"}}>
                                <Image source={productCart[0].image}/>
                                
                                <View style={{position: "absolute", bottom: 0}}>
                                    <ButtonPrix title={productCart[0].price}/>
                                </View>
                            </View>
                            <View>
                                <View style={{flexDirection: "row",justifyContent: "space-between" ,alignItems: "flex-start", gap: wp(20)}}>
                                    <View>
                                            <Text style={{ fontSize: 16, fontFamily: "Poppins-Regular", color: "#000"}}>{productCart[0].title}</Text>
                                            <Text>{productCart[0].color} - {productCart[0].stokage} GB</Text>
                                            <Text>Etat: {productCart[0].etat}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
              </View>

              <View style={{marginTop: 13, paddingHorizontal: 12}}>
                <Text style={{fontSize: 10, color: "#000"}}>*Livrasion 72h aprés  la prise en charge</Text>
              </View>
              <View style={{marginTop: 13, paddingHorizontal: 12}}>
                <View style={{backgroundColor: "#fff", paddingTop: 22, paddingHorizontal: 13, paddingBottom: 30,borderRadius: 8}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                            Sous Total
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                             34,00€
                          </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#ACB2B2", letterSpacing: .8}}>
                            Avez-vous un code remise ?
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                            -10%
                          </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                          Sous-Total aprés remise
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                           30,50€
                          </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingTop: 19}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#ACB2B2", letterSpacing: .8}}>
                          Frais de douane
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                          15€
                          </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#ACB2B2", letterSpacing: .8}}>
                          Sous-Total aprés remise
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                            5€
                          </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                          Montant à payer
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                          50,60€
                          </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                          Montant à payer
                          </Text>
                          <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                             <Entypo name="check" color="#01962A" size={15}/>
                             <Feather name="x" color="#E10303" size={15}/>
                          </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",  paddingTop: 19,}}>
                          <Text style={{fontFamily: "Poppins-SemiBold", fontSize: 12, color: "#000", letterSpacing: .8}}>
                          Reste à payer
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                          32,10 €
                          </Text>
                    </View>
                </View>
              </View>

              <View style={{marginTop: 20, flex: 1, justifyContent: "flex-end", alignItems: 'center'}}>
                     <Button title="Valider la commande" navigation={() => navigation.navigate('AddCardChckoutScreen')}/>
                </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CheckoutScreen