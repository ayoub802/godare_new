//import liraries
import React, {Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
import { HeaderEarth } from '../../components/Header';

// create a component
const SuccessFullyRegOrder = props => {
  const {t, i18n} = useTranslation();

  return (
    <View style={styles.container}>
      <HeaderEarth />
      <View style={styles.textHeadingContainer}>
        {/* <Text style={styles.textHeading}>{t('Commande enregistrée')}</Text> */}
        <Text>{props.route.params.string}</Text>
      </View>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => props.navigation.navigate('CartScreen')}>
        <Text style={styles.btnText}>{t('Revenir à l’accueil')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //     justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  btnContainer: {
    backgroundColor: '#3292E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.02,
    width: windowWidth * 0.7,
    height: windowHeight * 0.07,
    borderRadius: 40,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
  },
  textHeading: {
    fontSize: 18,
    color: '#1C1939',
  },
  textHeadingContainer: {
    marginTop: windowHeight * 0.03,
  },
});

//make this component available to the app
export default SuccessFullyRegOrder;
