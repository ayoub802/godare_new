import { View, Text,TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { HeaderEarth } from '../../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import PhoneInput from 'react-native-phone-number-input'
import Button from '../../components/Button'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const EditProfile = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1}}>
          <ScrollView style={{paddingBottom: 50}} showsVerticalScrollIndicator={false}>
             <View style={{flex: 1}}>
                 <HeaderEarth />
    
                 <View style={{ marginTop: 30, marginBottom: 12,paddingHorizontal: 28 ,flexDirection: "row" ,alignItems: "center", justifyContent: "space-between"}}>
                     <View style={{marginLeft: "auto"}}>
                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#000", textAlign: "center"}}>Mon profil</Text>
                     </View>
                     <View style={{ marginLeft: 'auto'}}>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="pencil-outline" size={18} color="#000"/>
                            </TouchableOpacity>
                     </View>
                 </View>
    
                 <View style={{paddingHorizontal: 28}}>

                    <View style={{marginTop: 12}}>
                        <TextInput 
                          placeholder="Civilité"
                          style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                        />
                    </View>
                    <View style={{marginTop: 12}}>
                        <TextInput 
                          placeholder="Ehouman"
                          placeholderTextColor="#000"
                          style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                        />
                    </View>
                    <View style={{marginTop: 12}}>
                        <TextInput 
                          placeholder="Kouadja"
                          placeholderTextColor="#000"
                          style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                        />
                    </View>
                    <View style={{}}>
                        <PhoneInput 
                          placeholder="06 45 12 17 08"
                          placeholderTextColor="#000"
                          defaultCode='FR'
                          containerStyle={{flexDirection: "row", alignItems: "center", gap: 5,color: "#000", backgroundColor: "transparent", width: wp(90) }}
                          codeTextStyle={{ display: "none"}}
                          textContainerStyle={{backgroundColor: "transparent" , padding: 0, color: "#000",fontFamily: "Poppins-Regular", fontSize: 14 }}
                          textInputStyle={{borderWidth: 1, height: 60,paddingLeft: 16 ,borderColor: "#AAB0B7",color: "#000" ,borderRadius: 8, backgroundColor: "#fff"}}
                          flagButtonStyle={{borderWidth: 1, height: 60 ,borderColor: "#AAB0B7" ,borderRadius: 8, backgroundColor: "#fff"}}
                        />
                    </View>
                    <View style={{marginTop: 2}}>
                        <TextInput 
                          placeholder="e2kouadja@gmail.com"
                          placeholderTextColor="#000"
                          style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                        />
                    </View>
                    <View style={{marginTop: 12}}>
                        <TextInput 
                          placeholder="*********"
                          placeholderTextColor="#000"
                          style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                        />
                    </View>
                    <View style={{marginTop: 12}}>
                        <TextInput 
                          placeholder="04/10/1981"
                          placeholderTextColor="#000"
                          style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                        />
                    </View>
    
                    <View style={{marginTop: 50}}>
                       <View style={{ justifyContent: "flex-end", alignItems: 'center', paddingBottom: 72}}>
                         <Button title="valider" navigation={navigation}/>
                       </View>
                    </View>
                 </View>

                 
             </View>
          </ScrollView>
        </SafeAreaView>
      )
}

export default EditProfile