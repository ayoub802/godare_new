import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import Truck from "../../assets/images/truck.png"
import SmallEarth from "../../assets/images/small_earth.png"
import Feather from "react-native-vector-icons/Feather"

const ColiSuivi = () => {
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

                <View style={{marginTop: 24, paddingHorizontal: 16}}>
                     <Text style={{fontSize: 14, color: "#C3BCBC", fontFamily: "Poppins-Regular", letterSpacing: 1}}>Order ID</Text>
                     <View>
                       <Text style={{color: "#292625", fontSize: 24, letterSpacing: 1, fontFamily: "Poppins-Medium"}}>865 536 435 W</Text>
                     </View>
                </View>
                <View style={{marginTop: 14, paddingHorizontal: 16}}>
                     <Text style={{fontSize: 16, color: "#292625", fontFamily: "Poppins-Medium", letterSpacing: 1}}>History</Text>
                    <View style={{backgroundColor: "#fff",padding: 14,borderRadius: 10}}>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>Commande validée</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>20 juil.</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>Produits réceptionnés</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>21 juil.</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>Préparée</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>21 juil.</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>Expédiée</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>21 juil.</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#498BF0"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>Commande livrée</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>Colis N° 865 536 435 W</Text>
                           </View>
                      </View>
                    </View>
                </View>
                <View style={{marginTop: 24, paddingHorizontal: 16}}>
                  <View style={{backgroundColor: "#fff", paddingTop: 24, paddingBottom: 13, paddingLeft: 13, paddingRight: 10, borderRadius: 10}}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                       <View style={{width: 46, height: 46, backgroundColor: "#498bf04d", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                         <Image source={Truck}/>
                       </View>
                       <View>
                          <Text style={{color: "#292625", fontSize: 14, fontFamily: "Poppins-Medium", letterSpacing: 1}}>Colis livré</Text>
                          <Text style={{color: "#C3BCBC", fontSize: 13, fontFamily: "Poppins-Regular", letterSpacing: 1}}>
                             Colis N° 865 536 435 W
                          </Text>
                       </View>
                       <View>
                         <TouchableOpacity>
                           <Text style={{fontSize: 12, color: "#498BF0", textDecorationLine: "underline", fontFamily: "Poppins-Medium", textAlign: "center"}}>Suivre le colis</Text>
                         </TouchableOpacity>
                         <TouchableOpacity>
                           <Text style={{fontSize: 12, color: "#498BF0", textDecorationLine: "underline", fontFamily: "Poppins-Medium", textAlign: "center"}}>Voir le contenu</Text>
                         </TouchableOpacity>
                         <TouchableOpacity>
                           <Text style={{fontSize: 12, color: "#498BF0", textDecorationLine: "underline", fontFamily: "Poppins-Medium",textAlign: "center"}}>Éditer la facture</Text>
                         </TouchableOpacity>
                       </View>
                    </View>
                  </View>
                </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ColiSuivi