import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import Stepper from '../Stepper'
import { productCart } from '../../constant/data'
import CartItem from '../../components/CartItem'
import Button from '../../components/Button'
const CartScreen = ({ navigation }) => {

  const [couponShow, setCouponShow] = useState(false)
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
                <Stepper position={0}/>
              </View>

              <View style={{marginTop: 40}}>
                  {
                    productCart.map((item, index) => (
                      <CartItem item={item} key={index}/>
                    ))
                  }
              </View>

              <View style={{marginTop: 60, paddingHorizontal: 40}}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                   <Text style={{color: "#000", fontSize: 15,fontFamily: "Poppins-SemiBold", letterSpacing: 0.3}}>Sub Total:</Text>
                   <Text style={{color: "#000", fontSize: 16,fontFamily: "Poppins-SemiBold", letterSpacing: 0.3}}>420€</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 13}}>
                    <Text style={{color: "#000", fontSize: 15,fontFamily: "Poppins-Medium", letterSpacing: 0.3}}>Frais de douane:</Text>
                    <Text style={{color: "#000", fontSize: 16,fontFamily: "Poppins-Regular", letterSpacing: 0.3}}>20€</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 13, backgroundColor: "#fff", borderRadius: 15}}>
                   <TextInput 
                     placeholder='FD248AK268'
                     style={{padding: 0, paddingLeft: 19, width: 200, color: "#000"}}
                   />
                   <Button title="Appliquer Coupon" navigation={() => setCouponShow(!couponShow)}/>
                </View>
                 
                 <View style={!couponShow ? style.HideCoupon : style.displayCoupon}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingHorizontal: 10, paddingVertical: 4 ,marginTop: 13, backgroundColor: "#fff", borderRadius: 15}}>
                      <View style={{flexDirection: "row", alignItems: "center", gap: 13}}>
                          <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.3}}>
                            FD248AK268
                          </Text>
                          <TouchableOpacity>
                            <Feather name="edit" color='#000' size={15}/>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Feather name="trash-2" color='#E10303' size={15}/>
                          </TouchableOpacity>
                      </View>

                      <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#01962A", letterSpacing: 0.3}}>
                        coupon appliqué
                      </Text>
                    </View>
                    
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: 13}}>
                          <Text style={{fontSize: 18, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.4}}>
                            Montant total :
                          </Text>

                      <Text style={{fontSize: 16, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.3}}>
                          420€
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: 5}}>
                          <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.4}}>
                            coupon appliqué
                          </Text>

                      <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.3}}>
                          20€
                      </Text>
                    </View>
                 </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: 15}}>
                      <Text style={{fontSize: 20, fontFamily: "Poppins-Medium", color: "#000", letterSpacing: 0.4}}>
                        Total:
                      </Text>

                   <Text style={{fontSize: 16, fontFamily: "Poppins-SemiBold", color: "#000", letterSpacing: 0.3}}>
                    {
                      !couponShow ? 420+"€" : 400+"€"
                    }
                      
                   </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",marginTop: 15}}>
                   <Button title="checkout" navigation={() => navigation.navigate('CheckoutScreen')} width={150}/>
                </View> 

              </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  displayCoupon: {
    display: "flex"
  },
  HideCoupon: {
    display: "none"
  },
})

export default CartScreen