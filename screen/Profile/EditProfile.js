import { View, Text,TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
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
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firebase_db } from '../../modules/FirebaseConfig'


const EditProfile = ({ navigation }) => {
  const [name, setName] = useState(undefined);
  const [getData, setGetData] = useState([]);
  const [prename, setPrename] = useState(undefined);
  const [Email, setEmail] = useState(undefined);
  const [birthday, setBirthday] = useState(undefined);
  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [Activity, setActivity] = useState(true);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [initializing, setInitializing] = useState(true);

  const phoneInput = useRef(null);

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

  useEffect(() => {
    fetchValue();
  }, []);
  
  async function fetchValue() {
    setActivity(true);
    const userEmail = getAuth().currentUser;
    if(userEmail){
      setInitializing(true)
    }

    console.log(userEmail.email);
    const q = query(collection(firebase_db, "users"), where('email', '==', userEmail.email))
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setGetData(doc.data())
    });
  const authStatus = await getAuthentificationData();  
  if (authStatus)
  {
    setEmail(authStatus);
  }

  setName(getData.name);
  setPrename(getData.prenom);
  setBirthday(getData.birthday);
  setPhoneNumber(getData.phone)

  setActivity(false);
}

// async function getDate(){
//   const response = await axiosInstance.get('https://godaregroup.com/api/clients/46/' + Email);
//   let data = response.data;
//   if(response.data){
//     setName(data.nom);
//     setPrename(data.prenom);
//     setPhoneNumber(data.telephone);
//   }
// }
  if(initializing === true){
    return(
      <View style={{flex: 1, justifyContent: "center"}}>
         <ActivityIndicator size={'large'} color="#3292E0" />
      </View>
    )
  }
    return (
        <SafeAreaView style={{ flex: 1}}>
          <ScrollView style={{paddingBottom: 50}} showsVerticalScrollIndicator={false}>
             <View style={{flex: 1}}>
                 <HeaderEarth />
    
    {
      Activity === true ? (
        <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
        </View>
      ) : (
        <>
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
                    value={name} 
                    placeholder="Ehouman"
                    placeholderTextColor="#000"
                    style={{borderWidth: 1, borderColor: "#AAB0B7", paddingLeft: 15, borderRadius: 8,fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", backgroundColor: "#fff"}}
                  />
              </View>
              <View style={{marginTop: 12}}>
                  <TextInput 
                    value={prename}
                    placeholder="Kouadja"
                    placeholderTextColor="#000"
                    style={{borderWidth: 1, borderColor: "#AAB0B7",fontFamily: "Poppins-Regular", fontSize: 14, color: "#000", paddingLeft: 15, borderRadius: 8, backgroundColor: "#fff"}}
                  />
              </View>
              <View style={{}}>
                  <PhoneInput 
                    value={phoneNumber}
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
                    value={Email}
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
        </>

      )
    }

                 
             </View>
          </ScrollView>
        </SafeAreaView>
      )
}

export default EditProfile