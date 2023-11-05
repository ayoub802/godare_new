import { View, Text,ScrollView, Image, ActivityIndicator, Pressable, Modal, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import DropDownPicker from 'react-native-dropdown-picker';
import Button, { ButtonIcon } from '../../components/Button';
import Stepper from '../Stepper';
import { HeaderActions } from '../../components/Header';
import { getAuthUserEmail, getDepotModeChoice, getDepotValues, getNewAddedAddress, getPanier, getPlatformLanguage, getSelectedCountry, getSelectedService, getServices, saveCreneaux, saveDepotAdresseId, saveDepotAdresseValues, saveDepotMagasinId, saveDepotMagasinValues, saveDepotModeChoice, saveDepotValidation, saveSelectedService } from '../../modules/GestionStorage';
import axiosInstance from '../../axiosInstance';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import ServiceHeader from '../../components/ServiceHeader';
import PhoneInput from 'react-native-phone-number-input';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './styles';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DepotScreen1 = (props) => {

  var isFocused = useIsFocused();
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [current, setCurrent] = useState();
  const [current2, setCurrent2] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [Activity, setActivity] = useState(true);
  const [ActivityMagasins, setActivityMagasins] = useState(true);
  const [MagasinsDepot, setMagasinsDepot] = useState([]);
  const [MagasinsDepotRawValues, setMagasinsDepotRawValues] = useState([]);
  const [adresses, setAdresses] = useState([]);
  const [UserEmail, setUserEmail] = useState('');
  const [UserDomicileChoix, setUserDomicileChoix] = useState('');
  const [UserMagasinChoix, setUserMagasinChoix] = useState('');
  const [NomContact, setNomContact] = useState('');
  const [TelContact, setTelContact] = useState('');
  const phoneInput = useRef(null);
  const [actionTriggered, setActionTriggered] = useState({}); // to make modal dynamic
  const [modalVisible, setModalVisible] = useState(false);
  const [showMagasin, setShowMagasin] = useState(false);
  const [showAdresseEnlevement, setShowAdresseEnlevement] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [isDepotChoice, setIsDepotChoice] = useState(false);
  const [depotChoiceMode, setDepotChoiceMode] = useState('');
  const [userAdresseChoice, setUserAdresseChoice] = useState(null);
  const [userMagasinChoice, setUserMagasinChoice] = useState(null);
  const [Service, setService] = useState(null);
  const [paysLivraisonObject, setPaysLivraisonObject] = useState(null);
  const [Creneaux, setCreneaux] = useState([]);
  const [Language, setLanguage] = useState('fr');
  const [getAdrees, setGetAdrees] = useState([]);
  let isNewAddressAdded = props.route.params;
  isNewAddressAdded = isNewAddressAdded ? isNewAddressAdded.newAddressAdded : false;

  const items = [
    {label: t('Dépôt au magasin'), value: 'magasin'},
    {label: t('Enlèvement à domicile'), value: 'enlevement'}
  ];

  useEffect(() => {


    async function fetchData()
    {
      setActivity(true);
      setActivityMagasins(true);


      // Get pays de livraison
      let paysLivraisonObject = await getSelectedCountry();
      setPaysLivraisonObject(paysLivraisonObject);

      // Language
      const currentLanguage = await getPlatformLanguage();
      setLanguage(currentLanguage);

      // Get service
      let service = await getSelectedService();

      let getAdrees = await AsyncStorage.getItem('newAddedAdresse');
      if (getAdrees) {
         console.log(getAdrees);
      }

      // Get panier
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

          saveSelectedService(newData[0]);
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


      // Get user email
      const userEmail = await getAuthUserEmail();
      setUserEmail(userEmail);


      // Recuperer les creneaux
      axiosInstance.get('/creneau/actif/' + service.code + '/' + paysLivraisonObject.id)
      .then((response) => {

        if (response.data)
        {
          setCreneaux(response.data)
        }
      })
      .catch(function (error, status) {
      });



      // Get user address
      let formattedAdresse = [];
      axiosInstance.get('/adresses/user/depart/' + userEmail + '/' + paysLivraisonObject.id)
      .then((response) => {
        if (response.data)
        {
          let data = response.data;

          formattedAdresse = data.map(ls=>{
            return {id:ls.id, label:(ls.adresse + ' ' + ls.codePostal + ' ' + ls.ville + ' ' + ls.pays), value:ls.id, codePostal: ls.codePostal, ville: ls.ville, nom: ls.nom, telephone: ls.telephone}
          })

          setAdresses(formattedAdresse);
        }
      })
      .catch(function (error) {
        console.log('adresse fetch error', error)
      });



      // get magasins
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
              if (!found && 'Dépôt' == type && paysLivraisonObject.depart.toLowerCase() == magasin.pays.toLowerCase())
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

      setMagasinsDepot(formatted);
      setMagasinsDepotRawValues(rawData);

      setActivityMagasins(false);


      // Previous depot choice
      let choice = await getDepotModeChoice();

      let depotAdresseValues = await getDepotValues();

      if (choice)
      {
        setDepotChoiceMode(choice);

        if('magasin' == choice)
        {
          setShowMagasin(true);
          setShowAdresseEnlevement(false);

          if (depotAdresseValues.depotMagasin)
          {
            var newData = formatted.filter(ls => {
              if (ls.id == depotAdresseValues.depotMagasin) {
                return ls
              }
            });

            setUserMagasinChoix(newData[0]);
            setUserMagasinChoice(depotAdresseValues.depotMagasin)
          }
        }
        else 
        {
          setShowAdresseEnlevement(true);
          setShowMagasin(false);

          if (depotAdresseValues.depotAdresseId)
          {
            setUserAdresseChoice(depotAdresseValues.depotAdresseId);

            var newData = formattedAdresse.filter(ls => {
              if (ls.id == depotAdresseValues.depotAdresseId) {
                return ls
              }
            });
 
            setUserDomicileChoix(newData[0]);
          }

          if (depotAdresseValues.depotNom)
          {
            setNomContact(depotAdresseValues.depotNom)
          }

          if (depotAdresseValues.depotTelephone)
          {
            setTelContact(depotAdresseValues.depotTelephone)
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

          setUserDomicileChoix(newData[0])
          setUserAdresseChoice(adresse.id);
          setStorageDepotChoiceAdresse(adresse);
          setNomContact(adresse.nom);
          setTelContact(adresse.telephone);
        }
      }

      setActivity(false);
    }


    fetchData();

  }, [isFocused]);


  // Garder le mode de depot
  async function setStorageDepotChoiceMode(itemValue)
  {
    await saveDepotModeChoice(itemValue);
  }

  // Garder l'adresse
  async function setStorageDepotChoiceAdresse(item)
  {
    await saveDepotAdresseId(item.id);
  }


  // Sauvegarder les choix
  async function NavigateToDepotMagasin(){
    if (UserMagasinChoix === '' || !UserMagasinChoix)
    {
      ToastAndroid.show("Le magasin est obligatoire", ToastAndroid.SHORT);
      return;
    }

    await saveDepotMagasinValues(UserMagasinChoix.label, UserMagasinChoix.id);
    await saveDepotValidation();
    
    props.navigation.navigate('Livraison1');
  };
 
  // Retrait à domicile
  async function NavigateToRetraitDomicile(){
    console.log("Test");
    if (NomContact === '')
    {
        ToastAndroid.show("Le nom de la personne à contacter est obligatoire", ToastAndroid.SHORT);
        console.log("Le nom de la personne à contacter est obligatoire");
      return;
    }

    if (TelContact === '')
    {

      ToastAndroid.show("Le téléphone de la personne à contacter est obligatoire", ToastAndroid.SHORT);
      console.log("Le téléphone de la personne à contacter est obligatoire");
      return;
    }

    if (UserDomicileChoix === '')
    {
      ToastAndroid.show("L'adresse est obligatoire", ToastAndroid.SHORT);
      console.log("L'adresse est obligatoire");
      return;
    }

    let found = false;
    let departement = UserDomicileChoix ? UserDomicileChoix.codePostal : null;
    departement = departement ? departement.substring(0, 2) : -1;
    
    let ville = UserDomicileChoix ? UserDomicileChoix.ville : null;
    ville = ville ? ville.toLowerCase() : null;

    Creneaux.forEach((creneau) => {
      if (creneau.departement == departement || creneau.ville.toLowerCase() == ville)
      {
        found = true;
      }
    });

    if (!found)
    {
      ToastAndroid.show("Nous n'avons pas de créneaux disponibles", ToastAndroid.SHORT);
      console.log("Nous n'avons pas de créneaux disponibles");
      return;
    }


    await saveDepotValidation();
    await saveDepotAdresseValues(NomContact, TelContact, UserDomicileChoix.label, UserDomicileChoix.id, departement, ville);
    await saveCreneaux(Creneaux);

    props.navigation.navigate("DepotScreen3");
  };


  // Ajouter une nouvelle adresse
  const NavigateToUserAddress = () => {
    props.navigation.navigate("AddAdresse", {pageFrom: 'depot', email: UserEmail, paysDepartLivraison: paysLivraisonObject.depart});
  }

  // Si le magasin change
  const OnChangeMagasinValue = (magasinChoice) => {

    let newArr = null;
    let magasinFound = false;
    MagasinsDepotRawValues.forEach(function (fournisseur)
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


  // Confirmation choix magasin
  async function ConfirmationChoixMagasin(magasin){
    var newData = MagasinsDepot.filter(ls => {
      if (ls.id == magasin.id) {
        return ls
      }
    });

    setUserMagasinChoix(newData[0]);
    setModalVisible(!modalVisible);
    setUserMagasinChoice(magasin.id);

    await saveDepotMagasinId(magasin.id);
  };

  // Reset du choix
  async function ResetChoixMagasin(){
    setUserMagasinChoice(null);
    setModalVisible(!modalVisible);
  }

  // Setter le numero de telephone
  function setNomNumeroTelephone(adresse)
  {
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
    <SafeAreaView style={{flex: 1}}>
      <View style={{ flex: 1, position: "relative", marginBottom: 50}}>
      <ServiceHeader 
          navigation={props.navigation}
          service={Service}
          paysLivraison={paysLivraisonObject}
          language={Language}
        />
          <View>
            <Stepper position={1}/>
          </View>

          {(Activity === true  || ActivityMagasins === true ) ? (
        <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
        </View>
      ) : (
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
         
            <View style={{marginTop: 28}}>
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                autoScroll
                iconStyle={styles.iconStyle}
                containerStyle={styles.containerDepotStyle}
                itemTextStyle={{color: "#000"}}
                data={items}
                maxHeight={450}
                labelField="label"
                valueField="value"
                placeholder={!isDepotChoice ? t('Mode de prise du colis' ) : '...'}
                value={depotChoiceMode}
                showsVerticalScrollIndicator={false}
                onFocus={() => setIsDepotChoice(true)}
                onBlur={() => setIsDepotChoice(false)}
                onChange={item => {
                  if('magasin' == item.value)
                  {
                    setShowMagasin(true);
                    setShowAdresseEnlevement(false);
                  }
                  else 
                  {
                    setShowAdresseEnlevement(true);
                    setShowMagasin(false);
                  }

                  setStorageDepotChoiceMode(item.value);
                  setDepotChoiceMode(item.value);
                  setIsDepotChoice(false)
                }}
              />
            </View>

      
          {
            showAdresseEnlevement &&
            <>
          
           <View style={{ marginTop: 30, paddingHorizontal: 16}}>
            <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
                <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000", marginBottom: 10}}>
                {t("Adresse d'enlèvement")}
                </Text>
              
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                autoScroll
                iconStyle={styles.iconStyle}
                containerStyle={styles.containerrrrStyle}
                data={adresses}
                value={userAdresseChoice}
                itemTextStyle={{color: "#000"}}
                maxHeight={120}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? t('Choisir une adresse existante') : '...'}
                showsVerticalScrollIndicator={false}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={item => {
                  setUserDomicileChoix(item);
                  setUserAdresseChoice(item.value);
                  setIsFocus1(false);
                  setStorageDepotChoiceAdresse(item);
                  setNomNumeroTelephone(item);
                }}
              />
            <TouchableOpacity style={styles.ButtonContainer}
              onPress={() => {
                NavigateToUserAddress();
              }}>
              <Text style={styles.ButtonText}>{t('(ou) Ajouter une nouvelle adresse')}</Text>
              <Icon name="plus" size={23} color="#000" />
            </TouchableOpacity>
            </View>

           </View>


           <View style={{ marginTop: 12, paddingHorizontal: 16}}>
              <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
                  <Text style={{fontFamily: "Poppins-Medium", fontSize: 12, color: "#000"}}>
                   {t('Les coordonnées de destinataire de la commande')}
                  </Text>
                
                <View style={styles.inputCountryCustomContainer}>
                  <TextInput
                    layout="first"
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.textInput}
                    codeTextStyle={styles.codeTextStyle}
                    countryPickerButtonStyle={styles.countryPickerButtonStyle}
                    placeholder={t('Nom de la personne à contacter')}
                    textInputProps={{placeholderTextColor: '#BCB8B1'}}
                    textInputStyle={styles.textInputStyle}
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

            <TouchableOpacity
              style={[styles.ButtonStyle, {width: '60%', marginTop: 50}]}
              onPress={() => {
                NavigateToRetraitDomicile();
              }}>
                <Text style={styles.ButtonStyleText}>
                      {t('Valider enlèvement à domicile')}
                </Text>
            </TouchableOpacity>
            </>
          }

          {
            showMagasin &&
            <>

             <View style={{ marginTop: 32, paddingHorizontal: 16}}>
             <View style={{ backgroundColor: '#fff', paddingVertical: 22, paddingHorizontal: 14, borderRadius: 10}}>
                  <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#000"}}>
                    {t('Liste des magasins de dépot')}
                  </Text>
                  <View style={{marginTop: 10}}>
                      <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        autoScroll
                        iconStyle={styles.iconStyle}
                        containerStyle={styles.containerrrrStyle}
                        itemTextStyle={{color: "#000"}}
                        data={MagasinsDepot}
                        value={userMagasinChoice}
                        maxHeight={220}
                        labelField="label"
                        valueField="value"
                        placeholder={MagasinsDepot.length > 0 ? t('Choisir le magasin de dépôt') : 'Pas de magasins disponibles'}
                        showsVerticalScrollIndicator={false}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setIsFocus(false);
                          OnChangeMagasinValue(item);
                        }}
                      />
                  </View>
                  <View style={{marginTop: 8}}>
                     <Text style={{fontFamily: "Poppins-Regular",color: "#000", fontSize: 10}}>*{t('Livraison 72h aprés la prise en charge')}</Text>
                  </View>
                  </View>
              </View>

              <View style={{ flex: 1, justifyContent: "flex-end", alignItems: 'center', paddingBottom: 82}}>
                <TouchableOpacity
                  style={[styles.ButtonStyle, {width: '60%', marginTop: 50}]}
                  onPress={() => {
                    NavigateToDepotMagasin();
                  }}>
                    <Text style={styles.ButtonStyleText}>
                      {t('Valider dépot au magasin')}
                    </Text>
                </TouchableOpacity>
              </View>
            </>
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
                    onPress={() => ResetChoixMagasin()}>
                    <Text style={{ color: '#fff' , fontFamily:"Poppins-Medium", fontSize: 12, }}>{t("Fermer")}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => ConfirmationChoixMagasin(actionTriggered) }>
                    <Text style={{ color: '#4E8FDA' , fontFamily:"Poppins-Medium", fontSize: 12, }}>{t("Selectionner le magasin")}</Text>
                  </Pressable>
                </View>
              </View>
              <View style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "#000", opacity: 0.5, zIndex: -100}}>

              </View>
            </View>
          </Modal>
          

          
        </ScrollView>
      )}
      </View>
    </SafeAreaView>
  )
}

export default DepotScreen1