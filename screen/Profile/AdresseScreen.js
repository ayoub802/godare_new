import { 
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from 'react-native'
import React, {useState, useEffect} from 'react';
import { HeaderEarth } from '../../components/Header'
import Ionicons from "react-native-vector-icons/Ionicons"
import { adress } from '../../constant/data'
import Icon from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useNavigation } from '@react-navigation/native';
import { getAuthUserEmail } from '../../modules/GestionStorage';
import axiosInstance from '../../axiosInstance';

const AdresseScreen = () => {
  const {t, i18n} = useTranslation();
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [RefValue, setRefValue] = useState('');
  const [NewAddress, setNewAddress] = useState('');
  const [Pays, setPays] = useState('');
  const [Ville, setVille] = useState('');
  const [CodePostal, setCodePostal] = useState('');
  const [data, setdata] = useState([]);
  const [Arraydata, setArraydata] = useState([]);
  const [Addressdata, setAddressdata] = useState([]);
  const [Adresses, setAdresses] = useState([]);
  const [Loader, setLoader] = useState(true);
  const [UserEmail, setUserEmail] = useState(null);

  const navigation = useNavigation();
  useEffect(() => {

    async function fetchValue()
    {
        setLoader(true);

        const email = await getAuthUserEmail();
        setUserEmail(email);

        try 
        {
          const response = await axiosInstance.get('adresses/user/' + email);

   
          setAdresses(response.data);


          setLoader(false);
        }
        catch (erreur)
        {
          console.log('adresse fetch error', erreur);

        }
    }

    fetchValue();
  
  }, []);
  const GetUser = async () => {

  };

  const AddAddress = () => {
  
    navigation.navigate('AddAdresseScreen', {pageFrom: 'carnetAdresse', email: UserEmail});
    
  };

  const Item = ({item}) => (
    <View style={styles.orderDetailsContainer}>
      <View style={styles.AllTextContainer}>
        
        <View style={styles.TextContainer}>
          
          <View style={styles.textRow}> 
            <Text style={styles.NameTxt}>
              { item.libelle }
            </Text>
          </View>
          
          <Text style={styles.NameTxt}>
             { item.nom }
          </Text>

          <Text style={styles.NameTxt}>
           {t(item.adresse)}
          </Text>

          <Text style={styles.NameTxt}>
           { item.codePostal } { item.ville } { item.pays }
          </Text>

          <Text style={styles.NameTxt}>
           Tél: { item.telephone }
          </Text>
  
          <View>
            <View>
              <TouchableOpacity style={styles.textPrice}>
                <Text >{t('Modifier')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>

      </View>

     

    </View>
  );

  const renderItem = ({item}) => (
    <Item item={item} key={item.id} />
  );

  if (true === Loader)
  {
    return (<View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>);
  }
  return (
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
                <TouchableOpacity onPress={AddAddress} style={{backgroundColor: "#fff", paddingVertical: 14, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1.2, borderStyle: "dashed" , borderColor: "#CDD6D7"}}>
                   <View style={{ backgroundColor: "#34CAA5", padding: 12, borderRadius: 50, marginBottom: 10}}>
                       <Ionicons name="add" size={20} color="#fff"/>
                   </View>
                   <Text style={{color: "#747681", fontSize: 13, fontFamily: "Poppins-Medium"}}>Ajouter une nouvelle adresse</Text>
                </TouchableOpacity>
             </View>

       {
        Adresses.length > 0 
        
        ?
        <>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled
          data={Adresses}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.containerFlatelist}
        />
        </>
        :
        <>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>Pas Des Address</Text>
          </View>
        </> 
       }


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  orderDetailsContainer: {
    backgroundColor: '#fff',
    width: windowWidth * 0.9,
    height: 'auto',
    alignSelf: 'center',
    elevation: 3,
    borderRadius: 10,
    justifyContent: 'space-around',
    marginTop: windowHeight * 0.03,
  },
  AllTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 'auto',
  },
  TextContainer: {
    height: 'auto',
    alignItems: 'flex-start',
    marginTop:10
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ProviderStyle: {},
  containerStyle: {
    flex: 1,
  },
  spacerStyle: {
    marginBottom: 15,
  },
  safeContainerStyle: {
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ButtonContainer: {
    width: '80%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
    marginTop: windowHeight * 0.02,
    alignSelf: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ButtonText: {
    // marginLeft: '5%',
    width: '78%',
    color: '#042C5C',
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  dropContainerStyle: {
    justifyContent: 'center',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.9,
    // borderRadius:0
    alignSelf: 'center',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.01,
  },
  titleText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  titleContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: windowHeight * 0.03,
  },

  dropdown: {
    height: 50,
    borderRadius: 7,
    paddingHorizontal: 17,
    backgroundColor: 'rgba(173, 173, 173, 0.2)',
    // elevation: 1,
    width: windowWidth * 0.8,
    alignSelf: 'center',
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#14213D',
  },
  NameTxt: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#000',
    marginTop:5,
    alignContent: 'flex-start'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#14213D',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerrrrStyle: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 100,
    elevation: 10,
  },
  inputContainer: {
    width: windowWidth * 0.8,
    backgroundColor: 'rgba(173, 173, 173, 0.2)',
    alignSelf: 'center',
    borderRadius: 6,
    marginTop: '3%',
  },
  inputStyled: {
    width: windowWidth * 0.75,
    marginLeft: windowWidth * 0.03,
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
});

export default AdresseScreen