import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import Ionicons from "react-native-vector-icons/Ionicons"
import { adress } from '../../constant/data'
const AdresseScreen = () => {

  return (
    <SafeAreaView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{paddingBottom: 500}}>
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
                    Mon carnet d’adresses
                </Text>
            </View>

             <View style={{paddingHorizontal: 12}}>
                <TouchableOpacity style={{backgroundColor: "#fff", paddingVertical: 14, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1.2, borderStyle: "dashed" , borderColor: "#CDD6D7"}}>
                   <View style={{ backgroundColor: "#34CAA5", padding: 12, borderRadius: 50, marginBottom: 10}}>
                       <Ionicons name="add" size={20} color="#fff"/>
                   </View>
                   <Text style={{color: "#747681", fontSize: 13, fontFamily: "Poppins-Medium"}}>Ajouter une nouvelle adresse</Text>
                </TouchableOpacity>
             </View>

             <View style={{paddingHorizontal: 12, marginTop: 25, paddingBottom: 50}}>
                {
                    adress.map((item, index) => (
                        <View key={index} style={{backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 16}}>
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{ color: "#000", fontSize: 16, fontFamily: "Poppins-Medium"}}>{item.title}</Text>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                  <TouchableOpacity>
                                    {item.iconPen}
                                  </TouchableOpacity>
                                  <TouchableOpacity>
                                    {item.iconTrash}
                                  </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{paddingTop: 16, flexDirection: "row", alignItems: "flex-start", gap: 10}}>
                                <View>
                                  {item.iconMap}
                                </View>
                                <View style={{maxWidth: "70%"}}>
                                   <Text style={{fontFamily: "Poppins-Regular", fontSize: 16, color: "#718096"}}>{item.address}</Text>
                                   <Text style={{fontFamily: "Poppins-Regular", fontSize: 16, color: "#718096"}}>Tél: {item.phone}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                }
             </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default AdresseScreen