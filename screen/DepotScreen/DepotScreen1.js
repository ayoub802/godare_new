import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../../components/Button';
import Stepper from '../Stepper';
import { HeaderActions } from '../../components/Header';

const DepotScreen1 = ({ navigation, route, data }) => {
  const id = route.params;
  const [paysData, setPaysData] = useState(id);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [current, setCurrent] = useState();
  const [current2, setCurrent2] = useState();
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
          {/* <View style={{ position: "relative" ,alignItems: "center", backgroundColor: "#2BA6E9", justifyContent: "center", height: hp(12)}}>
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
          </View> */}

          <HeaderActions destination={id}/>

          <View>
            <Stepper position={1}/>
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
          </View>

          <View style={{ marginTop: 32, paddingHorizontal: 16}}>
              <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
                  <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000"}}>
                    Liste des magasins de dépot
                  </Text>
                  <View style={{marginTop: 10}}>
                      <DropDownPicker
                        items={items}
                        open={isOpen2}
                        setOpen={() => setIsOpen2(!isOpen2)}
                        value={current2}
                        setValue={(val) => setCurrent2(val)}
                        dropDownContainerStyle={{backgroundColor: '#fff', borderColor: "#000", fontSize: 54}}
                        style={{ backgroundColor: "transparent", borderColor: "#000", fontSize: 54,}}
                        listItemContainerStyle={{ borderBottomColor: "#000"}}
                        placeholder='Choisir le mode de pris en charge'
                        placeholderStyle={{ fontFamily: "Poppins-Regular", fontSize: 16, color: "#AFAFAF"}}
                        textStyle={{fontFamily: "Poppins-Regular", fontSize: 14, color: "#000"}}
                      />
                  </View>
                  <View style={{marginTop: 8}}>
                     <Text style={{fontFamily: "Poppins-Regular",color: "#000", fontSize: 10}}>*Livrasion 72h aprés la prise en charge</Text>
                  </View>
              </View>
          </View>

          <View style={{ flex: 1, justifyContent: "flex-end", alignItems: 'center', paddingBottom: 82}}>
             <Button title="Valider dépot au magasin" navigation={() => navigation.navigate('DepotScreen2')}/>
          </View>
      </View>
    </SafeAreaView>
  )
}

export default DepotScreen1