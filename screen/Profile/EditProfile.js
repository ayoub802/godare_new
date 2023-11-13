import { View, Text,TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { HeaderEarth } from '../../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import PhoneInput from 'react-native-phone-number-input'
import Button from '../../components/Button'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getAuthentificationData } from '../../modules/GestionStorage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../axiosInstance'
import { getAuth } from 'firebase/auth'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { firebase_db } from '../../modules/FirebaseConfig'
import { useIsFocused } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EditProfile = ({ navigation }) => {

  var isFocused = useIsFocused()
  const [name, setName] = useState(undefined);
  const [id, setId] = useState(0);
  const [getData, setGetData] = useState([]);
  const [prename, setPrename] = useState([]);
  const [Email, setEmail] = useState(undefined);
  const [birthday, setBirthday] = useState(undefined);
  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [Activity, setActivity] = useState(true);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const phoneInput = useRef(null);
  const [civilite, setCivilite] = useState('') 
  const {t, i18n} = useTranslation();

  const [RefValue, setRefValue] = useState('');


  const onChange = (event, selectedDate) => {

    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = `${tempDate.getDate()}/${
      tempDate.getMonth() + 1
    }/${tempDate.getFullYear()}`;

    setText(fDate);
    console.log(fDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = `${tempDate.getDate()}/${
      tempDate.getMonth() + 1
    }/${tempDate.getFullYear()}`;

    settext(fDate);
    console.log(fDate);
  };

  useEffect(() => {
    fetchValue();
  }, [isFocused]);
  
  async function fetchValue() {
    setInitializing(true)
    try{
      const userEmail = getAuth().currentUser;
      console.log(userEmail);
      const q = query(collection(firebase_db, "users"), where('email', '==', userEmail.email))
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setGetData(doc.data())
        setId(doc.id)
      });
      if(getData){
        setInitializing(false)
      }
    setEmail(getData.email);
    setName(getData.name);
    setPrename(getData.prenom);
    setBirthday(getData.birthday);
    setPhoneNumber(getData.phone);
    }
    catch(error){
      console.log("Error", error);
    }
    setInitializing(false);
}

const formatDate = (inputDate) => {
  // Parse the input date string
  const parsedDate = new Date(inputDate);

  // Format the date as per your desired output (MM/DD/YYYY)
  const formattedDate = format(parsedDate, 'MM/dd/yyyy');

  return formattedDate;
};
const inputDate = 'Wed Nov 08 2023 18:19:12 GMT+0100';
const formattedDate = formatDate(inputDate);

console.log("Date : is", formattedDate);

async function updateUser(){
  try{
    const docRef = doc(firebase_db, 'users', id);
    await updateDoc(docRef, {
      name: name,
      prenom: prename,
      email: Email,
      phone: phoneNumber
    })
    console.log("Success");
  }
  catch(error){
    console.log("Error:",error);
  }
}

if(true == initializing){
  return(
    <View style={{justifyContent: 'center', height: '80%'}}>
      <ActivityIndicator size="large" color="#3292E0" style={{}} />
  </View>
  )
}
const items = [
  {
    label: "Mr",
    value: "Mr"
  },
  {
    label: "Mme",
    value: "Mme"
  },
  {
    label: "Autre",
    value: "Autre"
  },
]

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
                              <MaterialCommunityIcons name="pencil-outline" size={23} color="#000"/>
                          </TouchableOpacity>
                    </View>
                </View>
    
                <View style={{paddingHorizontal: 28}}>
    
                  <View style={{marginTop: 12}}>
                      {/* <TextInput 
                        placeholder="Civilité"
                        style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                      /> */}
                      <DropDownPicker 
                        items={items}
                        open={open}
                        setOpen={() => setOpen(!open)}
                        value={civilite}
                        setValue={val => setCivilite(val)}
                        placeholder={getData.civilite}
                        style={{position: "relative", zIndex: 100}}
                        onSelectItem={item => {
                          setCivilite(item.value)
                        }}
                      />
                  </View>
                  <View style={{marginTop: 12}}>
                      <TextInput
                        value={name} 
                        placeholder={getData.name}
                        onChangeText={(name) => setName(name)}
                        placeholderTextColor="#000"
                        style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                      />
                  </View>
                  <View style={{marginTop: 12}}>
                      <TextInput 
                        value={prename}
                        placeholder={getData.prenom}
                        placeholderTextColor="#000"
                        onChangeText={(prename) => setPrename(prename)}
                        style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                      />
                  </View>
                  <View style={{}}>
                      <PhoneInput 
                        value={phoneNumber}
                        placeholder={getData.phone}
                        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
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
                        placeholderTextColor="#000"
                        value={Email}
                        placeholder={getData.email}
                        onChangeText={(Email) => setEmail(Email)}
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
                      {/* <TextInput 
                        placeholder="04/10/1981"
                        placeholderTextColor="#000"
                        style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                      /> */}
                      <TouchableOpacity
                                style={styles.inputCustomLogoContainer}
                                activeOpacity={0.7}
                                onPress={() => {
                                    showMode('date');
                                }}>
                                <TextInput
                                    placeholder={formatDate(getData.birthday)}
                                    placeholderTextColor={'#000'}
                                    keyboardType={'ascii-capable'}
                                    style={styles.inputCustom}
                                    value={text}
                                    onChange={e => {
                                    setText(e.nativeEvent.text.toString());
                                    }}
                                    onChangeText={onChange}
                                    editable={false}
                                />
                                {show && (
                                    <DateTimePicker
                                    testID="DateTimePicker"
                                    value={date}
                                    mode={mode}
                                    display={'default'}
                                    onChange={onDateChange}
                                    />
                                )}
                                </TouchableOpacity>
                  </View>
    
                  <View style={{marginTop: 50}}>
                      <View style={{ justifyContent: "flex-end", alignItems: 'center', paddingBottom: 72}}>
                        <Button title="valider" navigation={() => updateUser()}/>
                      </View>
                  </View>
                </View>

                 
             </View>
          </ScrollView>
        </SafeAreaView>
      )
}


const styles = StyleSheet.create({
  inputCustomLogoContainer: {
    // backgroundColor: 'tomato',
    width: windowWidth * 0.8,
    height: windowHeight * 0.07,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputCustom: {
    // backgroundColor: 'tomato',
    borderWidth: 1,
    borderColor: '#AAB0B7',
    paddingLeft: 15,
    borderRadius: 8,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    height: 54,
    width: windowWidth * 0.85,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
})
export default EditProfile