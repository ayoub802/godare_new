import { View, Text, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../../components/Button';
import Stepper from '../Stepper';
import { CallingCodePicker } from '@digieggs/rn-country-code-picker';
import PhoneInput from 'react-native-phone-number-input';

const Livraison1 = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [current, setCurrent] = useState();
  const [current2, setCurrent2] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef(null);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  const items = [
    {
      label: 'France',
      value: 'france',
    },
    {
      label: 'France',
      value: 'germany',
    },
    {
      label: 'France',
      value: 'italy',
    },

  ];
  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={{ flex: 1}}>
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
                        <Feather name="arrow-up-right" color="#fff" size={22}/>
                    </View>
                </View>

                <View style={{ position: "absolute", top: 15, right: 10}}>
                  <Image source={SmallEarth}/>
                  <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Bold", textAlign: "center", marginTop: 4}}>GS</Text>
                </View>
            </View>

            <View>
              <Stepper position={2}/>
            </View>

            <View style={{marginTop: 28, paddingHorizontal: 16}}>
              <DropDownPicker
                items={items}
                open={isOpen}
                setOpen={() => setIsOpen(!isOpen)}
                value={current}
                setValue={(val) => setCurrent(val)}
                dropDownContainerStyle={{backgroundColor: '#fff', borderColor: "#000", fontSize: 54}}
                style={{ backgroundColor: "transparent", borderColor: "#000", fontSize: 54,}}
                listItemContainerStyle={{ borderBottomColor: "#000"}}
                placeholder='Choisir le mode de pris en charge'
                placeholderStyle={{ fontFamily: "Poppins-Regular", fontSize: 16, color: "#000"}}
                textStyle={{fontFamily: "Poppins-Regular", fontSize: 14, color: "#000"}}
              />
              <View style={{marginTop: 10}}>
                  <Text style={{ fontFamily: "Poppins-Regular", fontSize: 10, color: "#000"}}>*Livrasion 72h aprés la prise en charge</Text>
              </View>
            </View>

            <View style={{ marginTop: 10, paddingHorizontal: 16}}>
                <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
                    <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000"}}>
                    Liste des points relais
                    </Text>
                    <View style={{marginTop: 10, position: "relative", zIndex: 1000}}>
                        <DropDownPicker
                          items={items}
                          open={isOpen2}
                          setOpen={() => setIsOpen2(!isOpen2)}
                          value={current2}
                          setValue={(val) => setCurrent2(val)}
                          dropDownContainerStyle={{backgroundColor: '#fff', borderColor: "#000", fontSize: 54}}
                          style={{ backgroundColor: "transparent", borderColor: "#000", fontSize: 54,}}
                          listItemContainerStyle={{ borderBottomColor: "#000"}}
                          placeholder='Choisir un point relais'
                          placeholderStyle={{ fontFamily: "Poppins-Regular", fontSize: 16, color: "#AFAFAF"}}
                          textStyle={{fontFamily: "Poppins-Regular", fontSize: 14, color: "#000"}}
                        />
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 10, paddingHorizontal: 16, position: "relative", zIndex: -1000}}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : "height"} style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
                  <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000"}}>
                      Les coordonnées de la personne à contacter
                    </Text>
                    
                  <View style={{marginTop: 8}}>
                        <TextInput 
                          style={{ borderWidth: 1, borderColor: "#000",fontSize: 15 ,fontFamily: "Poppins-Medium" ,borderRadius: 8, paddingVertical: 14, paddingLeft: 20}}
                          placeholder="Nom de la personne à contacter"
                          placeholderTextColor={{ color: "#000"}}
                        />
                    </View>
                  
                  <View style={{ marginTop: 15}}>
                      <PhoneInput 
                          ref={phoneInput}
                          defaultValue={value}
                          defaultCode="FR"
                          layout="first"
                          onChangeText={(text) => {
                          setValue(text);
                          }}
                          onChangeFormattedText={(text) => {
                              setFormattedValue(text);
                          }}
                          placeholder='Téléphone'
                          withShadow
                          containerStyle={{width: "100%" ,shadowColor: "transparent",height: 48 ,backgroundColor: "#fff", borderWidth: 1, borderColor: "#000", borderRadius: 10}}
                          textInputStyle={{ backgroundColor: "transparent", top: 7,left: 40 ,  position: "absolute", color: "#000"}}
                          textContainerStyle={{backgroundColor: "transparent" ,marginTop: -10, paddingTop: 20, paddingLeft: -20, color: "#000"}}

                      />
                  </View>
              </KeyboardAvoidingView>
            </View>

            <View style={{ flex: 1, justifyContent: "flex-end", alignItems: 'center', paddingBottom: 72}}>
              <Button title="Valider dépot au magasin" navigation={() => navigation.navigate('Livraison2')}/>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default Livraison1