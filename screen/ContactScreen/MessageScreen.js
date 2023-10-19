import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import Button from '../../components/Button'
import DropDownPicker from 'react-native-dropdown-picker'
import Textarea from 'react-native-textarea';
import { ScrollView } from 'react-native-virtualized-view';

const MessageScreen = ({ navigation }) => {
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
  return (
    <SafeAreaView style={{ flex: 1}}>
      <ScrollView style={{marginBottom: 20, flex: 1}} showsVerticalScrollIndicator={false}>
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
                    Envoyez un nouveau message
                </Text>
            </View>

            <View style={{paddingHorizontal: 28}}>

            <View style={{marginTop: 12}}>
                <TextInput 
                placeholder="Ehouman"
                style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                />
            </View>
            <View style={{marginTop: 12}}>
                <TextInput 
                placeholder="Email*"
                style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                />
            </View>
            <View style={{marginTop: 12}}>
                <TextInput 
                placeholder="Téléphone"
                style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                />
            </View>

            <View style={{marginTop: 12}}>
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
            <View style={{marginTop: 50}}>
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

export default MessageScreen