import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import Textarea from 'react-native-textarea';
import Button from '../../components/Button';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-virtualized-view';

const CommandScreen = ({ navigation }) => {
    const [isOpen2, setIsOpen2] = useState(false);
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
    const CommandData = [
        {
            id: 1,
            title: "Suivi commande…",
            date: "13/06/23 – 15h06"
        },
        {
            id: 2,
            title: "Réclamation…",
            date: "13/06/23 – 15h06"
        },
        {
            id: 3,
            title: "Information produit…",
            date: "13/06/23 – 15h06"
        },
    ]
  return (
    <SafeAreaView style={{flex: 1}}>
       <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            <HeaderEarth />

            <View style={{marginTop: 24, marginBottom: 12}}>
                <Text
                    style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: '#000',
                    textAlign: 'center',
                    }}>
                    Mes échanges précédents
                </Text>
            </View>

            <View style={{paddingHorizontal: 12}}>
                <View style={{backgroundColor: "#fff", borderRadius: 10}}>
                      {
                    CommandData.map((item, index) => (
                            <View style={{paddingHorizontal: 14, paddingTop: 17}} key={index}>
                                <TouchableOpacity style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center", paddingBottom: 17}}>
                                    <Text style={{fontSize: 14, fontFamily: "Poppins-Regular", color: "#000"}}>{item.title}</Text>
                                    <Text style={{fontSize: 14, fontFamily: "Poppins-Regular", color: "#000"}}>{item.date}</Text>
                                </TouchableOpacity>
                                <View style={{width: "100%", height: 1, backgroundColor: "#E9E9E9"}}></View>
                            </View>
                        ))
                    }
                </View>

                <TouchableOpacity style={{marginTop: 12, marginLeft: 'auto'}}>
                    <Text style={{color: "#2BA6E9", fontSize: 14}}>Voir tous les échanges</Text>
                </TouchableOpacity>
            </View>

            <View style={{marginTop: 30, marginBottom: 12}}>
                <Text
                    style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: '#000',
                    textAlign: 'center',
                    }}>
                    Envoyez un nouveau message
                </Text>
            </View>
            <View style={{ paddingHorizontal: 28}}>
                <View style={{ marginTop: 12}}>
                <DropDownPicker
                        items={items}
                        open={isOpen2}
                        setOpen={() => setIsOpen2(!isOpen2)}
                        value={current2}
                        setValue={(val) => setCurrent2(val)}
                        dropDownContainerStyle={{backgroundColor: '#fff', borderColor: "#AAB0B7", fontSize: 54}}
                        style={{ backgroundColor: "#fff", borderColor: "#000", fontSize: 54,}}
                        listItemContainerStyle={{ borderBottomColor: "#000"}}
                        placeholder='Objet*'
                        placeholderStyle={{ fontFamily: "Poppins-Regular", fontSize: 16, color: "#000"}}
                        textStyle={{fontFamily: "Poppins-Regular", fontSize: 14, color: "#000"}}
                      />
                </View>
                <View style={{ marginTop: 12}}>
                    <Textarea
                    containerStyle={{height: 180, backgroundColor: "#fff", borderWidth: 1, borderColor: "#AAB0B7", borderRadius: 8, paddingLeft: 10}}
                    style={{backgroundColor: "#fff",fontSize: 14,fontFamily: "Poppins-Regular"}}
                        maxLength={120}
                        placeholder={'Message'}
                        placeholderTextColor={'#AAB0B7'}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    <View style={{ justifyContent: "flex-end", alignItems: 'center', paddingBottom: 72}}>
                        <Button title="Envoyer" navigation={navigation}/>
                    </View>
                </View>
            </View>
          </View>
       </ScrollView>
    </SafeAreaView>
  )
}

export default CommandScreen