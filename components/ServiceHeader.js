//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import CountryFlag from './CountryFlag';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const ServiceHeader = props => {

  const Navigation = props.navigation;
  const Service = props.service;
  const PaysLivraison = props.paysLivraison;
  const Language = props.language;

  return (
    <View style={styles.tabsContainer}>
        
        <View style={{ flexDirection: 'row' }}>

          <TouchableOpacity onPress={() => { Navigation.navigate('HomeScreen'); }} >
              <Text style={styles.tabarTextStyle}>
                { Service ? ( 'fr' == Language ? Service.nom : Service.nomEN ) : '' }
              </Text>
          </TouchableOpacity>
      
            <TouchableOpacity onPress={() => { Navigation.navigate('PaysLivraison'); }}>
              <CountryFlag 
                drapeauDepart={PaysLivraison.drapeauDepart} 
                drapeauDestination={PaysLivraison.drapeauDestination} 
                label={PaysLivraison.label} />
            </TouchableOpacity>

        </View>
        
    </View>
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
