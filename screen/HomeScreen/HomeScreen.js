import {View, Text, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView} from 'react-native-safe-area-context';
import {categories} from '../../constant/data';
import CardHome from '../../components/CardHome';
import {HeaderEarth} from '../../components/Header';
import axios from 'axios';
import styles from './styles';
import { getPlatformLanguage, getServices, saveSelectedService, saveServices } from '../../modules/GestionStorage';
import axiosInstance from '../../axiosInstance';
import _ from "lodash";
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import i18next from 'i18next';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const { t, i18n } = useTranslation();

  var isFocused = useIsFocused()
  const [Services, setServices] = useState([]);
  const [ServicesRaw, setServicesRaw] = useState([]);
  const [Activity, setActivity] = useState(true);
  const [ActivityWave, setActivityWave] = useState(false);
  const [WaveSessionID, setWaveSessionID] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [loadLang, setLoadLang] = useState(false)
  const [language, setLanguage] = useState('fr')
  useEffect(() => {

    async function fetchServices()
    {
      setActivity(true);

      try 
      {

        let services = await getServices();

        if (services.length < 1)
        {
          const response = await axiosInstance.get('/service');

          services = response.data;

          // Sauvegarder
          await saveServices(response.data);
        }

        setServicesRaw(services);

        let data = [];
        services.map((row) => {

          let obj = {};
          obj.image = row.image;
          obj.id = row.id;
          obj.statut = row.statut;

          if (language == 'fr')
          {
            obj.nom = row.nom;
            obj.message = row.message;
          }
          else 
          {
            obj.nom = row.nomEN;
            obj.message = row.messageEN;
          }
          data.push(obj);
        });

        data = _.chunk(data, 2)

        setServices(data);
      }
      catch (erreur)
      {
        console.log('service fetch error', erreur);
      }

      setActivity(false);
    }

    fetchServices();
    gatLanguage()

  }, [isFocused]);

  async function gatLanguage(){
    setLoadLang(false)
    try{
      const currentLanguage = await getPlatformLanguage();
      setLoadLang(true)
      console.log("Language:",currentLanguage);
      setLanguage(currentLanguage)
    }
    catch(error){
      console.log("Error:", error);
    }
  }
 

  async function navigateToCountryDelivery(service) {

    if (service.statut)
    {
      let obj = null;

      ServicesRaw.map((row) => {
        if (row.id == service.id)
        {
          obj = row;
        }
      });

      if (obj)
      {
        await saveSelectedService(obj);
        console.log("Success");
        navigation.navigate('PaysLivraison');
      }
    }
  };



  if (Activity)
  {
    return (
      <View style={{flex : 1}}>
         <HeaderEarth />
        <View style={{justifyContent: 'center', alignItems: "center", flex: 1}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
        </View>
      </View>
    );
  }
  if (loadLang == false)
  {
    return (
      <View style={{flex : 1}}>
         <HeaderEarth />
        <View style={{justifyContent: 'center', alignItems: "center", flex: 1}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: 50}}>
        <View style={{flex: 1}}>
          <HeaderEarth />
        </View>

        <View style={styles.superContainer}>

          {Services.map( (row, index) => (
            <View style={styles.childContainer} key={index}>
              {row.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceContainer}
                  activeOpacity={0.7}
                  onPress={() => {
                    navigateToCountryDelivery(service);
                  }}>
                  <View>
                    <Text style={styles.textStylehead}>{service.nom}</Text>
                  </View>
                  <View>
                    <Image
                      source={{uri: service.image}}
                      resizeMode={'contain'}
                      style={styles.ImageStyle}
                    />
                  </View>
                  <View>
                    <Text style={styles.textStyletail}>{service.message}</Text>
                  </View>
                </TouchableOpacity>
              ))}

            </View>
          ))}
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};



export default HomeScreen;
