import {View, Text, Image, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HeaderEarth} from '../../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import axiosInstance from '../../axiosInstance';
import { getSelectedService, saveSelectedCountry } from '../../modules/GestionStorage';
import styles from './styles';
import Flag from 'react-native-flags';

const PaysLivraison = ({navigation, route}) => {
  var isFocused = useIsFocused();

  const [paysData, setPaysData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [ActivityIndicatorVar, setActivityIndicatorVar] = useState(false);

  const items = [
    {
      label: '',
      value: 'france',
      icon: () => {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 30,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Image source={require('../../assets/images/france.png')} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Roboto-Medium',
                  }}>
                  France
                </Text>
                <Feather name="arrow-up-right" size={22} color="#000" />
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Image
                  source={require('../../assets/images/cote_ivoire.png')}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Roboto-Medium',
                  }}>
                  Côte d'ivoire
                </Text>
                <Feather name="arrow-down-right" size={22} color="#000" />
              </View>
            </View>
          </>
        );
      },
    },
    {
      label: '',
      value: 'germany',
      icon: () => {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 30,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Image source={require('../../assets/images/france.png')} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Roboto-Medium',
                  }}>
                  France
                </Text>
                <Feather name="arrow-up-right" size={22} color="#000" />
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Image source={require('../../assets/images/mali.png')} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Roboto-Medium',
                  }}>
                  Mali
                </Text>
                <Feather name="arrow-down-right" size={22} color="#000" />
              </View>
            </View>
          </>
        );
      },
    },
    {
      label: '',
      value: 'italy',
      icon: () => {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 30,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Image source={require('../../assets/images/france.png')} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Roboto-Medium',
                  }}>
                  France
                </Text>
                <Feather name="arrow-up-right" size={22} color="#000" />
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Image source={require('../../assets/images/congo.png')} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Roboto-Medium',
                  }}>
                  Congo
                </Text>
                <Feather name="arrow-down-right" size={22} color="#000" />
              </View>
            </View>
          </>
        );
      },
    },
  ];


  useEffect(() => {

    async function getData() {

      setActivityIndicatorVar(true);

      // Recuperer la langue

      // Recuperer le service selectionné
      let service = await getSelectedService();
      
      if (!service)
      {
        navigation.navigate('HomeScreen');
        return;
      }

      try 
      {
        // Récuperer les pays actifs
        const response = await axiosInstance.get('/pays/actif/' + service.id);

        if (response.data)
        {
          let data = response.data;

          let formatted = [];
          data.forEach(function (item){
            if (item.libelle)
            {
              let obj = {id: item.id, value: item.id, drapeauDepart: item.drapeauDepart,depart: item.depart ,drapeauDestination: item.drapeauDestination };
              obj.label = item.libelle;
              obj.depart = item.depart;
              obj.destination = item.destination;
              formatted.push(obj);
            }
          });

          setData(formatted);
        }
      }
      catch (erreur)
      {
        console.log('country fetch error', erreur);
      }

      setActivityIndicatorVar(false);
    };

    getData();


  }, [isFocused]);


  async function navigateToReturnByServiceScreen()
  {
    var choice = data.filter(ls => {
      if (ls.id == value) {
        return ls
      }
    });

    if (choice.length > 0)
    {
      await saveSelectedCountry(choice[0]);

      navigation.navigate('ShoppingScreen');
    }
  }


  const renderItem = (item) => {
  
    if (!item.drapeauDepart && !item.drapeauDestination)
    {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      );
    }

    if (!item.drapeauDestination)
    {
      return (
        <View style={styles.item}>
          <Flag size={24} code={item.drapeauDepart} type='flat' />
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      );
    }

    if (!item.drapeauDepart)
    {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          <Flag size={24} code={item.drapeauDestination} type='flat' />
        </View>
      );
    }

    return (
      <View style={styles.item}>
        <Flag size={32} code={item.drapeauDepart} type='flat' />
        <Text style={styles.textItem}>{item.label}</Text>
        <Flag size={32} code={item.drapeauDestination} type='flat' />
      </View>
    );
  };

  if (ActivityIndicatorVar === true)
  {
    return (
      <View style={{justifyContent: 'center', height: '80%'}}>
        <ActivityIndicator size={'large'} color="#3292E0" />
      </View>
    )
  }
  return (
    <View >
      <HeaderEarth />

      <View style={{paddingHorizontal: 16, marginTop: 70}}>
      <Text
            style={{
              textAlign: 'center',
              color: '#000',
              fontFamily: 'Roboto-Medium',
              fontSize: 16,
            }}>
            Pays de livraison
          </Text>

      </View>

      <View style={styles.safeContainerStyle}>
        {/* <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          autoScroll
          iconStyle={styles.iconStyle}
          containerStyle={styles.containerStyle}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={'Choisir le pays'}
          value={value}
          showsVerticalScrollIndicator={false}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          
          renderItem={renderItem}
        /> */}
            <DropDownPicker
              items={
                data.map(item => (
                  {
                    label: '',
                    value: item,
                    icon: () => {
                      return (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 30,
                            }} key={item.id}>
                            <View
                              style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                              <View>
                                <Flag code={item.drapeauDepart} size={32}/>
                              </View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: '#000',
                                  fontFamily: 'Roboto-Medium',
                                }}>
                                {item.depart}
                              </Text>
                              <Feather name="arrow-up-right" size={22} color="#000" />
                            </View>
                            <View
                              style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                              <View>
                                <Flag code={item.drapeauDestination} size={32}/>
                              </View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: '#000',
                                  fontFamily: 'Roboto-Medium',
                                }}>
                                {item.destination}
                              </Text>
                              <Feather name="arrow-down-right" size={22} color="#000" />
                            </View>
                          </View>
                        </>
                      );
                    },
                  }))
              } 
              open={isOpen}
              setOpen={() => setIsOpen(!isOpen)}
              value={current}
              setValue={val => setCurrent(val)}
              onChangeValue={item => setCurrent(item)}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderColor: '#2BA6E9',
                fontSize: 54,
              }}
              style={{
                backgroundColor: '#fff',
                borderColor: '#2BA6E9',
                fontSize: 54,
              }}
              placeholder="Pays de Livraison"
              placeholderStyle={{
                color: '#86909C',
                fontFamily: 'Roboto-Regular',
                fontSize: 14,
              }}
              textStyle={{fontFamily: 'Roboto-Regular', fontSize: 14}}
              searchable={true}
              searchContainerStyle={{borderBottomWidth: 0}}
              searchTextInputStyle={{borderColor: '#2BA6E9'}}
              searchPlaceholder="Recherche Pays..."
              onSelectItem={async (value, index) => {
                navigateToReturnByServiceScreen();
                navigation.navigate('ShoppingScreen');
              }}
            />
      </View>

      {/* <TouchableOpacity
        onPress={() => {
          navigateToReturnByServiceScreen();
        }}
        style={{
          backgroundColor: '#3885DA',
          width: '80%',
          height: 50,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}>

        <Text style={styles.butnText}>{'Valider'}</Text>

      </TouchableOpacity> */}

      
    </View>
  );
};

export default PaysLivraison;
