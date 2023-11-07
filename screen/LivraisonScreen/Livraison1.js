import { View, Text, Image, TextInput,Modal, Pressable, TouchableOpacity, ToastAndroid ,KeyboardAvoidingView, Platform, ActivityIndicator,ScrollView ,StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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
import { useIsFocused } from '@react-navigation/native';
import { getAuthUserEmail, getLivraisonValues, getNewAddedAddress, getPanier, getPlatformLanguage, getSelectedCountry, getSelectedService, getServices, saveLivraisonAdresseId, saveLivraisonDomicileData, saveLivraisonMagasinData, saveLivraisonMode, saveLivraisonRelaisId, saveSelectedCountry, saveSelectedService } from '../../modules/GestionStorage';
import axiosInstance from '../../axiosInstance';
import { useTranslation } from 'react-i18next';
import ServiceHeader from '../../components/ServiceHeader';
import { calculFraisLivraison } from '../../modules/CalculPrix';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




const Livraison1 = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [current, setCurrent] = useState();
  const [current2, setCurrent2] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef(null);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  var isFocused = useIsFocused();

  const {t, i18n} = useTranslation();
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocusModeLivraison, setIsFocusModeLivraison] = useState(false);

  const [Activity, setActivity] = useState(true);
  const [ActivityMagasin, setActivityMagasin] = useState(true);
  const [MagasinsLivraison, setMagasinsLivraison] = useState([]);
  const [adresses, setAdresses] = useState([]);
  const [NomContact, setNomContact] = useState('');
  const [TelContact, setTelContact] = useState('');
  const [UserMagasinChoix, setUserMagasinChoix] = useState('');
  const [UserDomicileChoix, setUserDomicileChoix] = useState('');
  const [UserEmail, setUserEmail] = useState('');
  const [Products, setProducts] = useState([]);
  const [PrixTotalLivraison, setPrixTotalLivraison] = useState(0);
  const [actionTriggered, setActionTriggered] = useState({}); // to make modal dynamic
  const [modalVisible, setModalVisible] = useState(false);
  const [showRelais, setShowRelais] = useState(false);
  const [showLivraisonDomicile, setShowLivraisonDomicile] = useState(false);
  const [modeLivraisonChoice, setModeLivraisonChoice] = useState('');
  const [MagasinsLivraisonRawValues, setMagasinsLivraisonRawValues] = useState([]);
  const [magasinLivraisonUserChoix, setMagasinLivraisonUserChoix] = useState(null);
  const [UserLivraisonDomicileChoix, setUserLivraisonDomicileChoix] = useState('');
  const [Service, setService] = useState(null);
  const [paysLivraisonObject, setPaysLivraisonObject] = useState(null);
  const [Language, setLanguage] = useState('fr');

  let isNewAddressAdded = props.route.params;
  isNewAddressAdded = isNewAddressAdded ? isNewAddressAdded.newAddressAdded : false;
  
  
  const items = [
    {label: t('Retrait en point relais'), value: 'relais'},
    {label: t('Livraison à domicile'), value: 'domicile'}
  ];
  

  
  useEffect(() => {

    async function fetchData()
    {
      setActivity(true);



      // Get pays de livraison
      let paysLivraisonObject = await getSelectedCountry();
      setPaysLivraisonObject(paysLivraisonObject);

      // Language
      const currentLanguage = await getPlatformLanguage();
      setLanguage(currentLanguage);
      
      // Get service
      let service = await getSelectedService();


      // Recuperer le panier
      let basketData = await getPanier();
     
      if (basketData.length > 0)
      {
        // Prend tjr le service du panier
        let cartService = basketData[0].service;
        if (cartService != service.code)
        {
          let services = await getServices();

          var newData = services.filter(ls => {
  
            if (ls.code == cartService) {
              return ls;
            }
          });

          service = newData[0];
          
          await saveSelectedService(service);
        }  

        // prendre tjr le pays de livraison du panier
        let cartPaysLivraison = basketData[0].paysLivraison;
        if (paysLivraisonObject.id != cartPaysLivraison.id)
        {
          paysLivraisonObject = cartPaysLivraison;

          setPaysLivraisonObject(paysLivraisonObject);

          await saveSelectedCountry(paysLivraisonObject);
        }
      }

      setService(service);

      // Calculer le prix de livraison
      let prixLivraison = calculFraisLivraison(basketData);
      setPrixTotalLivraison(prixLivraison);
      

      // Get user email
      const userEmail = await getAuthUserEmail();
      setUserEmail(userEmail);


      // get magasins
      setActivityMagasin(true);

      let fournisseurs = [];

      await axiosInstance.get('/magasins/' + service.code + '/' + paysLivraisonObject.depart + '/' + paysLivraisonObject.destination)
        .then((response) => {

          if (response.data)
          {
            fournisseurs = response.data;
          }
        })
        .catch(function (error) {
        });

      let data = [];
      let rawData = [];
      fournisseurs.forEach(function (fournisseur)
      {
        let addFournisseur = false;
        fournisseur.magasins.forEach(function (magasin)
        {
          let found = false;
          magasin.types.forEach(function (type)
          {
              if (!found && 'Livraison' == type && paysLivraisonObject.destination.toLowerCase() == magasin.pays.toLowerCase())
              {
                data.push(magasin);
                found = true;
                addFournisseur = true;
              }
          });
        });

        if (addFournisseur)
        {
          rawData.push(fournisseur);
        }
      });

      let formatted = data.map( ls => {
        return {id:ls.id, label:(ls.pays + ', ' + (ls.codePostal ? (ls.codePostal + ', ') : '' ) + ls.ville + ', ' + ls.adresse), value:ls.id}
      });

      setMagasinsLivraison(formatted);
      setMagasinsLivraisonRawValues(rawData);

      setActivityMagasin(false);


      // get user address
      let formattedUserAdresses = [];
      try 
      {
        let response = await axiosInstance.get('/adresses/user/destination/' + userEmail + '/' + paysLivraisonObject.id);

        formattedUserAdresses = response.data.map(ls=>{
          return {id:ls.id, label:(ls.adresse + ' ' + ls.codePostal + ' ' + ls.ville + ' ' + ls.pays), value:ls.id, nom: ls.nom, telephone: ls.telephone}
        });

        console.log(userEmail);
        setAdresses(formattedUserAdresses);
      }
      catch (error)
      {
        console.error('get user address', error);
      }


      // Get livraison mode
      let livraisonValues = await getLivraisonValues();
      let choice = livraisonValues.livraisonMode;
     
      if (choice)
      {
        setModeLivraisonChoice(choice);

        let nomContact = livraisonValues.livraisonNom;

        if (nomContact)
        {
          setNomContact(nomContact)
        }


        let telephoneContact = livraisonValues.livraisonTelephone;
  
        if (telephoneContact)
        {
          setTelContact(telephoneContact)
        }

        if('relais' == choice)
        {
          setShowRelais(true);
          setShowLivraisonDomicile(false);

          let magasinId = livraisonValues.livraisonRelaisId;

          if (magasinId)
          {
            setMagasinLivraisonUserChoix(magasinId)

            var newData = formatted.filter(ls => {
              if (ls.id == magasinId) {
                return ls
              }
            });

            setUserMagasinChoix(newData[0]);
          }
        }
        else 
        {
          setShowLivraisonDomicile(true);
          setShowRelais(false);

          let adresseId = livraisonValues.livraisonAdresseId;
     
          if (adresseId)
          {
            var newData = formattedUserAdresses.filter(ls => {
              if (ls.id == adresseId) {
                return ls
              }
            });

            setUserDomicileChoix(newData[0]);
            setUserLivraisonDomicileChoix(adresseId);
            setNomContact(newData[0].nom);
            setTelContact(newData[0].telephone);
          }
        }
      }

       // Added new address or previous address choice
       if (isNewAddressAdded)
       {
         let adresse = await getNewAddedAddress();
  
         if (adresse)
         {
            var newData = adresses.filter(ls => {
              if (ls.id == adresse.id) {
                return ls
              }
            });

            setUserDomicileChoix(newData[0]);
            setUserLivraisonDomicileChoix(adresse.id);
            setStorageLIvraisonChoiceAdresse(adresse);
            setNomContact(adresse.nom);
            setTelContact(adresse.telephone);
         }
       }

       setActivity(false);

    }


    fetchData();


  }, [isFocused]);


  // Sauvegarder l'adresse
  async function setStorageLIvraisonChoiceAdresse(item)
  {
    await saveLivraisonAdresseId(item.id);
  }

  // Sauvegarder le choix
  async function setStorageLivraisonChoiceMode(item)
  {
    await saveLivraisonMode(item);
  }


  const NavigateToUserAddress = () => {
    props.navigation.navigate("AddAdresse", {pageFrom: 'livraison', email: UserEmail, paysDepartLivraison: paysLivraisonObject.destination});
  }


  // Sauvegarder les choix magasin
  async function NavigateToMagasin(){

    if (NomContact === '')
    {
      ToastAndroid.show("Le nom de la personne qui récupère la commande est obligatoire",ToastAndroid.SHORT)
      return;
    }

    if (TelContact === '')
    {
      ToastAndroid.show("Le téléphone de la personne qui récupère la commande est obligatoire",ToastAndroid.SHORT)

      return;
    }

    if (UserMagasinChoix === '' || !UserMagasinChoix)
    {
      ToastAndroid.show("Le magasin est obligatoire",ToastAndroid.SHORT)

      return;
    }

    await saveLivraisonMagasinData(UserMagasinChoix.label, UserMagasinChoix.id, NomContact, TelContact);

    props.navigation.navigate("CheckoutScreen");
  };


  // Sauvegarder les choix domicile
  async function NavigateToDomicile(){

    if (NomContact === '')
    {
      ToastAndroid.show("Le nom de la personne qui récupère la commande est obligatoire",ToastAndroid.SHORT)
      return;
    }

    if (TelContact === '')
    {

      ToastAndroid.show("Le téléphone de la personne qui récupère la commande est obligatoire",ToastAndroid.SHORT)

      return;
    }

    if (UserDomicileChoix === '')
    {
      ToastAndroid.show("L'adresse est obligatoire",ToastAndroid.SHORT)

      return;
    }

    await saveLivraisonDomicileData(UserDomicileChoix.label, UserDomicileChoix.id, NomContact, TelContact);
    props.navigation.navigate("CheckoutScreen");
  };


  // si le magasin change
  const OnChangeMagasinValue = (magasinChoice) => {

    let newArr = null;
    let magasinFound = false;
    MagasinsLivraisonRawValues.forEach(function (fournisseur)
    {
      fournisseur.magasins.forEach(function (magasin)
      {
        if (!magasinFound && magasin.id == magasinChoice.id)
        {
          newArr = magasin;
          magasinFound = true;
        }
      });
    });
  
    setActionTriggered(newArr);
    setModalVisible(true);
  };


  // Confirmation du magasin
  async function ConfirmationChoixMagasin(magasin){
    var newData = MagasinsLivraison.filter(ls => {
      if (ls.id == magasin.id) {
        return ls
      }
    });


    setMagasinLivraisonUserChoix(magasin.id);
    setUserMagasinChoix(newData[0]);
    setModalVisible(!modalVisible);

    await saveLivraisonRelaisId(magasin.id);
  };


  // Deselectionner le magasin
  async function unSetChoixRelais(){
    setModalVisible(!modalVisible);
    setMagasinLivraisonUserChoix(null);
  }


  // setter le numero de telephone
  function setNomTelephone(adresse){
    setNomContact(adresse.nom);
    setTelContact(adresse.telephone);
  }


  if (!Service)
  {
    return (
      <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
      </View>
    );
  }
  return (
    <View style={{flex: 1,position: "relative",}}>
      

        <ServiceHeader 
          navigation={props.navigation}
          service={Service}
          paysLivraison={paysLivraisonObject}
          language={Language}
        />

      
      {(Activity === true || ActivityMagasin === true) ? (
        <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, marginBottom: 70}}>
              <View>
                <Stepper position={2}/>
              </View>

              <View style={{marginTop: 28, paddingHorizontal: 16}}>
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={{color: "#000"}}
                  autoScroll
                  iconStyle={styles.iconStyle}
                  containerStyle={styles.containerrrrStyle}
                  data={items}
                  maxHeight={220}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocusModeLivraison ? t('Mode de livraison') : '...'}
                  value={modeLivraisonChoice}
                  showsVerticalScrollIndicator={false}
                  onFocus={() => setIsFocusModeLivraison(true)}
                  onBlur={() => setIsFocusModeLivraison(false)}
                  onChange={item => {

                    if('relais' == item.value)
                    {
                      setShowRelais(true);
                      setShowLivraisonDomicile(false);
                    }
                    else 
                    {
                      setShowLivraisonDomicile(true);
                      setShowRelais(false);
                    }

                    setModeLivraisonChoice(item.value)
                    setStorageLivraisonChoiceMode(item.value);
                    setIsFocusModeLivraison(false);
                  }}
              
                />
                <View style={{marginTop: 10, paddingLeft: 30}}>
                  <Text style={{ fontFamily: "Poppins-Regular", fontSize: 10, color: "#000"}}>*{t('Livraison 72h aprés la prise en charge')}</Text>
                </View>
              </View>

 
          {
            showLivraisonDomicile &&
            <>

            <View style={{ marginTop: 10, paddingHorizontal: 16}}>
            <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
            <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000"}}>
               {t('Liste des adresse existane')}
            </Text>
            
             
              <View style={styles.dropContainerStyle}>
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={[styles.placeholderStyle, {color: "#AFAFAF"}]}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={{color: "#000"}}
                  autoScroll
                  iconStyle={styles.iconStyle}
                  containerStyle={styles.containerrrrStyle}
                  data={adresses}
                  maxHeight={120}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus1 ? t('Choisir une adresse existante') : '...'}
                  value={UserLivraisonDomicileChoix}
                  showsVerticalScrollIndicator={false}
                  onFocus={() => setIsFocus1(true)}
                  onBlur={() => setIsFocus1(false)}
                  onChange={item => {
                    setUserDomicileChoix(item);
                    setUserLivraisonDomicileChoix(item.id)
                    setIsFocus1(false);
                    setNomTelephone(item);
                  }}
                />
              </View>
              <TouchableOpacity style={styles.ButtonContainer} onPress={() => {
                NavigateToUserAddress();
              }}>
                <Text style={styles.ButtonText}>{t('Ajouter une nouvelle adresse')}</Text>
              </TouchableOpacity>

            </View>
            </View>


            </>
          }

          {
            showRelais &&
            <>
            <View style={{ marginTop: 10, paddingHorizontal: 16}}>
              <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
              <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000"}}>
              {t('Liste des points relais')}
                  </Text>
                
                <View style={styles.dropContainerStyle}>
                  <Dropdown
                    style={[styles.dropdown]}
                    placeholderStyle={[styles.placeholderStyle, {color: "#AFAFAF"}]}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={{color: "#000"}}
                    autoScroll
                    iconStyle={styles.iconStyle}
                    containerStyle={styles.containerrrrStyle}
                    data={MagasinsLivraison}
                    value={magasinLivraisonUserChoix}
                    maxHeight={220}
                    labelField="label"
                    valueField="value"
                    placeholder={MagasinsLivraison.length > 0 ? t('Choisir le point relais') : t('Pas de points relais disponible')}
                    showsVerticalScrollIndicator={false}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      OnChangeMagasinValue(item);
                      setIsFocus(false);
                    }}
                
                  />
                </View>
              </View>
            </View>
            </>
          }

          {
            (showRelais || showLivraisonDomicile) &&
            <>
            <View style={{ marginTop: 10, paddingHorizontal: 16}}>
              <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
                 <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000", marginBottom: 5}}>
                 {t('Contact details of the person to contact')}
                  </Text>
               
                <View style={styles.inputCountryCustomContainer}>
                  <TextInput
                    layout="first"
                    placeholder={t('Nom de la personne qui récupère la commande')}
                    placeholderTextColor="#AFAFAF"
                    style={{color: "#000", fontFamily: "Poppins-Regular",fontSize: 14,width: "100%"}}
                    value={NomContact}
                    onChangeText={text => {
                      setNomContact(text);
                    }}
                  />
                </View>

                <View style={styles.inputCountryCustomContainer}>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={TelContact}
                    defaultCode="FR"
                    layout="first"
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.textInput}
                    codeTextStyle={styles.codeTextStyle}
                    countryPickerButtonStyle={styles.countryPickerButtonStyle}
                    placeholder={t('Téléphone')}
                    textInputProps={{placeholderTextColor: '#BCB8B1'}}
                    textInputStyle={styles.textInputStyle}
                    value={TelContact}
                    onChangeFormattedText={text => {
                      setTelContact(text);
                    }}
                  />
                </View>
              </View>
            </View>
            </>
          }

          {
            showLivraisonDomicile &&
            <>

              {'demandes-d-achat' == Service.code ?
                (
                  <View style={styles.TotalContainer}>
                    <Text >{t('Frais livraison à prévoir')}</Text>
                  </View>
                )
                :
                (
                  <View style={{ marginTop: 28,marginBottom: 16 ,paddingHorizontal: 16, position: "relative", zIndex: -1000, width: windowWidth * 0.95, alignSelf: "center"}}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={{fontFamily: "Poppins-SemiBold", color: "#000", fontSize: 15}}>{t('Frais livraison')}</Text>
                    <Text style={{fontFamily: "Poppins-SemiBold", color: "#000", fontSize: 15}}>
                      {PrixTotalLivraison > 0 ? (PrixTotalLivraison + '€') : t('Offert')}
                    </Text>

                  </View>
                  </View>
                )

              }
              <View style={{flex: 1,justifyContent: "center", alignItems: "center", marginTop: 18}}>

              <TouchableOpacity
                  style={{ paddingVertical: 8,width: windowWidth * 0.5 ,paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center", backgroundColor: "#4E8FDA", borderRadius: 25}}
                  onPress={() => {
                  NavigateToDomicile();
                }}>
                  <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#fff"}}>
                  {t('valider')}
                </Text>
              </TouchableOpacity>
              </View>

            </>
          }

          {
            showRelais && (
              <View style={{flex: 1,justifyContent: "center", alignItems: "center", marginTop: 28}}>
                <TouchableOpacity
                  style={{ paddingVertical: 8,width: windowWidth * 0.65 ,paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center", backgroundColor: "#4E8FDA", borderRadius: 25}}
                  onPress={() => {
                    NavigateToMagasin();
                  }}>
                  <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#fff"}}>
                    {t('Valider livraison au point relais')}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.Heading}>{t("Horaires d'ouverture")}</Text>
                <Text style={styles.modalText}>{actionTriggered.horaireOuverture}</Text>
                <Text style={styles.modalText}>
                {actionTriggered.adresse + ', ' + (actionTriggered.codePostal ? (actionTriggered.codePostal + ' ') : '' ) + actionTriggered.ville + ' ' + actionTriggered.pays  }
                </Text>
                <View style={{flexDirection: "row", justifyContent: "space-between", gap: 15}}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => unSetChoixRelais()}>
                    <Text style={{ color: '#fff' , fontFamily:"Poppins-Medium", fontSize: 12, }}>{t("Fermer")}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => ConfirmationChoixMagasin(actionTriggered) }>
                    <Text style={{ color: '#4E8FDA' , fontFamily:"Poppins-Medium", fontSize: 12, }}>{t("Selectionner le magasin")}</Text>
                  </Pressable>
                </View>
              </View>
                <View style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "#000", opacity: 0.5, zIndex: -100}}></View>
            </View>
          </Modal>

          </View>


          


          
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerSafee: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  containerStyle: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: windowHeight * 0.05,
  },
  spacerStyle: {},
  safeContainerStyle: {
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    // backgroundColor: 'tomato',
    marginBottom: windowHeight * 0.1,
  },
  inputCustomDropdownContainer: {
    width: windowWidth * 0.8,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  ButtonContainer: {
    width: '93%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#000",
    marginTop: windowHeight * 0.015,
    alignSelf: 'center',
    alignItems: "center",
    marginBottom: 10,
    flexDirection: 'row',
  },
  ButtonText: {
    marginLeft: '6%',
    width: '78%',
    color: "#AFAFAF",
    fontSize: 15,
    fontFamily: "Poppins-Regular"
  },
  CountrySelect: {
    width: '80%',
    alignSelf: 'center',
    height: 48,
    borderColor: '#DADAED',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 7,
    flexDirection: 'row',
    marginBottom: 30,
  },
  InputNam: {
    marginLeft: '3%',
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    width: windowWidth * 0.65,
    // backgroundColor: 'gold',
    flex: 1,
    color: '#000',
  },
  ButtonStyle: {
    width: '80%',
    height: 45,
    borderRadius: 60,
    justifyContent: 'center',
    backgroundColor: '#3292E0',
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  ButtonStyleText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  TotalContainer: {
    flexDirection: 'row',
    width: windowWidth * 0.8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'tomato',
    marginBottom: windowHeight * 0.02,
  },
  TotalText: {
    width: '30%',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#1C1939',
  },
  PriceText: {
    width: '68%',
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    textAlign: 'right',
    color: '#1C1939',
  },
  domicileStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: '#1C1939',
  },
  Heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    color: '#1C1939',
  },
  SecondHeading: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#1C1939',
  },
  Heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    color: '#1C1939',
  },
  inputCountryCustomContainer: {
    backgroundColor: '#fff',
    width: windowWidth * 0.8,
    height: 48,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 7,
  },
  phoneContainer: {
    // width: '75%',
    width: windowWidth * 0.7,
    height: 45,
    backgroundColor: '#fff',
    elevation: 0,
    // backgroundColor: 'tomato',
  },
  textInput: {
    paddingVertical: 0,
    // backgroundColor: 'gold',
    width: windowWidth * 0.6,
    backgroundColor: '#fff',
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  codeTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    // backgroundColor: 'green',
    width: 'auto',
  },
  countryPickerButtonStyle: {
    // backgroundColor: 'gold',
    width: 50,
  },
  textInputStyle: {
    fontFamily: 'Roboto-Regular',
    color: '#000',
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

  dropdown: {
    height: 54,
    borderRadius: 8,
    paddingHorizontal: 17,
    backgroundColor: "transparent",
    borderWidth: 1, 
    borderColor: "#000", 
    fontSize: 54,
    // elevation: 1,
    width: windowWidth * 0.8,
    // borderWidth: 1,
    // borderColor: '#DADAED',
    alignSelf: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#14213D',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#14213D',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerrrrStyle: {
    marginTop: -2,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 150,
    elevation: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width:windowWidth * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    paddingVertical: 8, 
    paddingHorizontal: 22,
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center" ,
    gap: 10, 
    backgroundColor: "#fff",
    borderWidth: 1,borderColor: "#4E8FDA",
    color: "#4E8FDA" ,
    borderRadius: 25,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "#000"
  },
});
export default Livraison1