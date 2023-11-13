//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import CountryFlag from './CountryFlag';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../assets/images/france.png"
import Feather from "react-native-vector-icons/Feather"
import CoteIvoire from "../assets/images/cote_ivoire.png"
import SmallEarth from "../assets/images/earth.png"
import Flag from 'react-native-flags';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const ServiceHeader = props => {

  const Navigation = props.navigation;
  const Service = props.service;
  const PaysLivraison = props.paysLivraison;
  const Language = props.language;

  return (
    <>

                <View style={{ position: "relative" ,alignItems: "center", backgroundColor: "#2BA6E9", justifyContent: "center", height: hp(12)}}>
                <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Bold"}}>
                  { Service ? ( 'fr' == Language ? Service.nom : Service.nomEN ) : '' }
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10}}>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                         <Flag size={24} code={'FR'} type='flat' />
                        <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Regular"}}>{PaysLivraison.depart}</Text>
                        <Feather name="arrow-up-right" color="#fff" size={22}/>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                        <Flag size={24} code={PaysLivraison.drapeauDestination} type='flat' />
                        <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Regular"}}>{PaysLivraison.destination}</Text>
                        <Feather name="arrow-down-right" color="#fff" size={22}/>
                    </View>
                </View>

                <View style={{ position: "absolute", top: 15, right: 10}}>
                    <Image source={SmallEarth} style={{width: wp(7), height: wp(7)}}/>
                    <Text style={{ fontSize: 14, color: "#fff", fontFamily: "Roboto-Bold", textAlign: "center", marginTop: 4}}>GS</Text>
                </View>
            </View>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  tabsContainer: {
    width: windowWidth * 1.0,
    height: windowHeight * 0.05,
    flexDirection: 'column',
    position: 'absolute',
    top: windowHeight * 0.1,
  },
  tabarTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#fff',
    marginLeft: windowWidth * 0.1,
    paddingTop: windowHeight * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
});

//make this component available to the app
export default ServiceHeader;
