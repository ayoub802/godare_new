import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import { commandeCours, commandePrecendent } from '../../constant/data'
import Button from '../../components/Button'
import SteperCounter from '../SteperCounter'

const CommandCours = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
       <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={{paddingBottom: 150}}>
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
                        Vos commandes en cours
                    </Text>
                </View>

                <View style={{paddingHorizontal: 8}}>
                  <View style={{flexDirection: "column", gap: 20}}>
                     {
                        commandeCours.map((item, index) => (
                            <View style={{ backgroundColor: "#fff", borderRadius: 10, paddingTop: 14, paddingBottom: 25, paddingRight: 8, paddingLeft: 14}} key={index}>
                               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                   <View style={{ flexDirection: "row", alignItems: "center", gap: 12}}>
                                       <View style={{ padding: 15, backgroundColor: "#FFF3F3", borderRadius: 10}}>
                                         {item.img}
                                        </View>
                                        <View>
                                          <Text style={{fontSize: 13, color: "#000", fontFamily: "Poppins-SemiBold", letterSpacing: 1}}>{item.title}</Text>
                                          <Text style={{fontSize: 14, color: "#292625", fontFamily: "Poppins-Medium", letterSpacing: 1}}>{item.date}</Text>
                                        </View>
                                   </View>

                                   <View style={{ paddingRight: 22}}> 
                                      <Text style={{fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#498BF0"}}>{item.parice}€</Text>
                                    </View>
                                </View>
                                <View style={{marginTop: 17}}>
                                    {item.step}
                                </View>
                                <View style={{marginTop: 27}}>
                                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                      <TouchableOpacity>
                                        <Text style={{ fontSize: 14, color: "#292625", fontFamily: "Poppins-Medium"}}>{item.status}</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity>
                                        <Button title="commander à nouveau"/>
                                      </TouchableOpacity>
                                      <TouchableOpacity>
                                        <Text style={{ fontSize: 14, color: "#292625", fontFamily: "Poppins-Regular", textDecorationLine: "underline"}}>Suivis colis</Text>
                                      </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                     }
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
                        Vos commandes précédentes
                    </Text>
                </View>

                <View style={{paddingHorizontal: 8, paddingBottom: 70}}>
                <View style={{flexDirection: "column", gap: 20}}>
                     {
                        commandePrecendent.map((item, index) => (
                            <View style={{ backgroundColor: "#fff", borderRadius: 10, paddingTop: 14, paddingBottom: 25, paddingRight: 8, paddingLeft: 14}} key={index}>
                               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                   <View style={{ flexDirection: "row", alignItems: "center", gap: 12}}>
                                       <View style={{ padding: 15, backgroundColor: "#FFF3F3", borderRadius: 10}}>
                                         {item.img}
                                        </View>
                                        <View>
                                          <Text style={{fontSize: 13, color: "#000", fontFamily: "Poppins-SemiBold", letterSpacing: 1}}>{item.title}</Text>
                                          <Text style={{fontSize: 14, color: "#292625", fontFamily: "Poppins-Medium", letterSpacing: 1}}>{item.date}</Text>
                                        </View>
                                   </View>

                                   <View style={{ paddingRight: 22}}> 
                                      <Text style={{fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#498BF0"}}>{item.parice}€</Text>
                                    </View>
                                </View>
                                <View style={{marginTop: 17}}>
                                    {item.step}
                                </View>
                                <View style={{marginTop: 27}}>
                                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                      <TouchableOpacity>
                                        <Text style={{ fontSize: 14, color: "#292625", fontFamily: "Poppins-Medium"}}>{item.status}</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity>
                                        <Button title="commander à nouveau"/>
                                      </TouchableOpacity>
                                      <TouchableOpacity>
                                        <Text style={{ fontSize: 14, color: "#292625", fontFamily: "Poppins-Regular", textDecorationLine: "underline"}}>Suivis colis</Text>
                                      </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                     }
                  </View>
                </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default CommandCours