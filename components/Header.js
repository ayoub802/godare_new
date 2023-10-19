import { View, Text, Image } from 'react-native'
import React from 'react'
import HeaderEarthImage from "../assets/images/earth.png"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../assets/images/cote_ivoire.png"
import SmallEarth from "../assets/images/small_earth.png"

export const HeaderEarth = () => {
  return (
    <View style={{ alignItems: "center", backgroundColor: "#2BA6E9", justifyContent: "center", height: hp(12)}}>
        <Image source={HeaderEarthImage} style={{width: wp(10), height: wp(10), objectFit: "cover"}}/>
        <Text style={{ fontSize: 18, color: "#fff", fontFamily: "Roboto-Bold"}}>GS</Text>
    </View>
  )
}

export const HeaderActions = ({ destination, nom_service }) => {
  return (
<View style={{ position: "relative" ,alignItems: "center", backgroundColor: "#2BA6E9", justifyContent: "center", height: hp(12)}}>
              <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Bold"}}>{nom_service}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10}}>
                  <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                      <Image source={France}/>
                      <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Regular"}}>France</Text>
                      <Feather name="arrow-up-right" color="#fff" size={22}/>
                  </View>
                  <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                      <Image source={CoteIvoire}/>
                      <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Regular"}}>{destination}</Text>
                      <Feather name="arrow-down-right" color="#fff" size={22}/>
                  </View>
              </View>

              <View style={{ position: "absolute", top: 15, right: 10}}>
                <Image source={SmallEarth}/>
                <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Bold", textAlign: "center", marginTop: 4}}>GS</Text>
              </View>
          </View>
  )
} 