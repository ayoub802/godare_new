import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import Feather from "react-native-vector-icons/Feather"


const Search = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1, paddingBottom: 50}} showsVerticalScrollIndicator={false}>
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
                    Recherches des Produits
                </Text>
            </View>

            <View style={{ paddingHorizontal: 25}}>
               <View style={{flexDirection: "row",alignItems: "center", gap: 5 ,backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#626262", paddingHorizontal: 16}}>
                   <TouchableOpacity>
                    <Feather
                      name="search"
                      size={24}
                      color={'#626262'}
                    />
                   </TouchableOpacity>

                   <TextInput 
                     placeholder='Recherche...'
                     style={{fontFamily: "Poppins-Medium", fontSize: 14, width: "100%", backgroundColor: "transparent", textDecorationLine: "none"}}
                   />
               </View>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Search