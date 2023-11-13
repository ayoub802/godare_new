import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import France from "../../assets/images/france.png"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import Feather from "react-native-vector-icons/Feather"
import SmallEarth from "../../assets/images/small_earth.png"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Stepper from '../Stepper';
import { TimeDatePicker } from "react-native-time-date-picker";
import moment from 'moment';
import Button from '../../components/Button';
import { ScrollView } from 'react-native-virtualized-view';
import { getCreneaux, getDepotValues, getPlatformLanguage, getSelectedCountry, getSelectedService, saveDepotCreneau } from '../../modules/GestionStorage';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ServiceHeader from '../../components/ServiceHeader';

const DepotScreen3 = (props) => {
  const now = moment().valueOf();
  var isFocused = useIsFocused();
  const {t} = useTranslation();
  const [activeHour, setActiveHour] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [Horaires, setHoraires] = useState([]);
  const [Creneaux, setCreneaux] = useState([]);
  const [Activity, setActivity] = useState(true);
  const [availableDates, setAvailableDates] = useState({});
  const [Service, setService] = useState(null);
  const [paysLivraisonObject, setPaysLivraisonObject] = useState(null);
  const [Language, setLanguage] = useState('fr');
  const [Loading, setLoading] = useState(false)
   
  async function navigateToDelivery()
  {
    if (dateCreneau === '')
    {
      ToastAndroid.show('Vous devez choisir un créneau', ToastAndroid.SHORT)

      return;
    }

    props.navigation.navigate("Livraison1");
  }

  useEffect(() => {

    async function getCreneauxValues()
    {
      const depotValues = await getDepotValues();


      let departement = depotValues.depotDepartement;
   
      let ville = depotValues.depotVille;
  
      let creneaux = await getCreneaux();
      creneaux = creneaux ? creneaux : [];

      let service = await getSelectedService();
      setService(service);

      
      // Language
      const currentLanguage = await getPlatformLanguage();
      setLanguage(currentLanguage);

      // Get pays de livraison
      let paysLivraisonObject = await getSelectedCountry();
      setPaysLivraisonObject(paysLivraisonObject);

      let data = [];
      creneaux.forEach((creneau) => {
        if (creneau.departement == departement || creneau.ville.toLowerCase() == ville)
        {
          data.push(creneau);
        }
      });

      let formatted = [];
      let dates = {};
      data.forEach((creneau) => {
        let plages = creneau.creneauEnlevementPlages;
        
        plages.forEach((plage) => {

          let date = moment(plage.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          
          formatted.push({
            id: plage.id,
            value: plage.id,
            place: plage.quantite,
            date: date,
            horaireDebut: plage.horaireDebut,
            horaireFin: plage.horaireFin,
            label: t("Horaire d'ouverture") + " : " + plage.horaireDebut + ' - ' + plage.horaireFin
          });

          dates[date] = {disabled: false}
          
        });
      });

      setAvailableDates(dates);
      setCreneaux(formatted);

      setActivity(false);
    }

    // async function getHoraires(){
    //   Creneaux.forEach((obj) => {
    //     console.log("Date:",obj.date);
        
    //     if (obj.date == "2023-11-13")
    //     {
    //       Horaires.push(obj); 
    //     }
    //   });
    // }
    setActivity(true);
    fetchHoraires();
    getCreneauxValues();


  }, [isFocused]);

  console.log("Creneux",Creneaux);

  // // let horairesTimes = [];
  // const handleDayPress = (date) => {
  //   // setSelectedDate(moment(date).format("YYYY/MM/DD"));
  //   setActivity(true);
  //   try{
  //     let dateString = moment(date).format("YYYY-MM-DD");
  //     Creneaux.forEach((obj) => {
  //       console.log("Date:",obj.date);
        
  //       if (obj.date == "2023-11-13")
  //       {
  //         Horaires.push(obj); 
  //       }
  //     });
  //   }
  //   catch(error)
  //   {
  //     console.log("Error");
  //   }

  //   setActivity(false);
  //   console.log("Horaires Times:", Horaires);
  // }

  const fetchHoraires = ()=> 
  {
    setLoading(true)
    try{
      Creneaux.forEach((obj) => {      
        if (obj.date == "2023-11-13")
        {
          setHoraires(obj); 
        }
      });
    }
    catch(error){
      console.log("Erreur :", error);
      setLoading(true)
    }
    setLoading(false)
  }

  console.log('New Horaire', Horaires);


  async function handleTimeSelect (obj) {
    setModalVisible(false);

    await saveDepotCreneau(obj);

  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const hours =[
    {
      id: 1,
      label: "08h-10h"
    },
    {
      id: 2,
      label: "10h-12h"
    },
    {
      id: 3,
      label: "13h-15h"
    },
    {
      id: 4,
      label: "16h-18h"
    },
  ]

  if (Activity === true|| !Service)
  {
    return (

      <View style={{justifyContent: 'center', height: '80%'}}>
        <ActivityIndicator size="large" color="#3292E0" style={{}} />
      </View>
   
    );
  }

  if(Loading === true || !Horaires){
    return (

      <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
      </View>
   
    );
  }

  let dateCreneau  = ''
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{paddingBottom: 50}} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1}}>
           
        <ServiceHeader 
          navigation={props.navigation}
          service={Service}
          paysLivraison={paysLivraisonObject}
          language={Language}
        />

            <View>
              <Stepper position={1}/>
            </View>

            <View style={{ marginTop: 30}}>
                <View style={{marginBottom: 10, paddingHorizontal: 26,}}>
                    <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", color: "#000", fontSize: 16}}>
                      {t('Créneau d’enlévement')}
                    </Text>
                </View>
                <View style={{paddingHorizontal: 26,}}>
                <TimeDatePicker 
                    selectedDate={now}
                    onSelectedChange={(selected) => {
                      // handleDayPress(moment(selected).format("YYYY/MM/DD"))
                      // handleDayPress(selected)
                      // setSelectedDate(moment(selected).format("YYYY/MM/DD"))
                      dateCreneau = moment(selected).format("YYYY/MM/DD");
                    }}
                  style={{height: 350, paddingTop: 12, borderWidth: 1,borderRadius: 4 ,borderColor: "#E5E5E5"}}
                  options={{ borderColor: "transparent", mainColor: "#2196F3", textSecondaryColor: "#999"}}
                  onMonthYearChange={(month) => {
                    console.log("month: ", month);
                  }}
                />
                </View>
                <View style={{ marginTop: 30, marginBottom: 20}}>
                      <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{paddingLeft: 26}}
                      >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4}}>
                              {/* <TouchableOpacity onPress={() => {setActiveHour(index); handleTimeSelect(item.id)}} style={ activeHour === index ? styles.hourActiveContaianer : styles.hourContaianer }> */}
                              <TouchableOpacity  style={styles.hourActiveContaianer} onPress={() => {setActiveHour(Horaires.id); handleTimeSelect(Horaires.id)}}>
                                {/* <Text style={styles.hourContaianerActiveText}>Test</Text> */}
                                <Text style={styles.hourContaianerText}>{ Horaires.horaireDebut + ' - ' + Horaires.horaireFin }</Text>
                              </TouchableOpacity>
                    </View>
                      </ScrollView>
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: "flex-end", alignItems: 'center', paddingBottom: 72}}>
              <Button title={t("valider")} navigation={()=>{navigateToDelivery()}} />
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  hourContaianer : {
    backgroundColor: "#fff", 
    marginRight: 4, 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 10
  },
  hourActiveContaianer : {
    backgroundColor: "#2196F3", 
    marginRight: 4, 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 10
  }, 
  hourContaianerText:{
    color: "#fff",
    fontFamily: "Roboto-Regular", 
    fontSize: 13, 
  },
  hourContaianerActiveText:{
    color: "#000",
    fontFamily: "Roboto-Regular", 
    fontSize: 13, 
  },
})

export default DepotScreen3