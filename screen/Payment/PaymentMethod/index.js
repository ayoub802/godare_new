//import liraries
import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import { HeaderEarth } from '../../../components/Header';

// create a component
const PaymentMethods = props => {

  const {t, i18n} = useTranslation();


  const navigateToCardPayment = () => {
    props.navigation.navigate("PaymentDetail");
  };


  const navigateToMobile = () => {
    props.navigation.navigate("PaymentWaveDetails");
  };

  const navigateToHomePickup = () => {
    const StoreAddress = firestore()
      .collection('Paydelivery')
      .onSnapshot(documentSnapshot => {
        let datacome = documentSnapshot.docs.map(d => d.data())
        // setStoreAddress(datacome.map(ls=>ls.Address[0]));
        console.log('datacome', datacome[0].name);
        props.navigation.navigate(Navigationstrings.SuccessFullyRegOrder, {
          string: datacome[0].name,
        });
      });
  };

  const navigateToPaybyStore = () => {
    const StoreAddress = firestore()
      .collection('Paydepositstore')
      .onSnapshot(documentSnapshot => {
        let datacome = documentSnapshot.docs.map(d => d.data())
        // setStoreAddress(datacome.map(ls=>ls.Address[0]));
        console.log('datacome', datacome[0].name);
        props.navigation.navigate(Navigationstrings.SuccessFullyRegOrder, {
          string: datacome[0].name,
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled>
      <HeaderEarth />
      
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>{t('Moyen de paiement')}</Text>
      </View>
      <View style={styles.superMethodsContainer}>
        <TouchableOpacity
          style={styles.PaymentMethodContainer}
          onPress={() => {
            navigateToCardPayment();
          }}>
          <Text style={styles.PaymentMethodText}>
            {t('Payer par carte bancaire')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.PaymentMethodContainer}
          onPress={() => {
            navigateToMobile();
          }}>
          <Text style={styles.PaymentMethodText}>
            {t('Payer par mobile money ou transfer d’agent')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.PaymentMethodContainer}
          onPress={() => {
            navigateToHomePickup();
          }}>
          <Text style={styles.PaymentMethodText}>
            {t('Payer à l’enlèvement à domicile')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.PaymentMethodContainer}
          onPress={() => {
            navigateToPaybyStore();
          }}>
          <Text style={styles.PaymentMethodText}>
            {t('Payer au dépôt au magasin')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

//make this component available to the app
export default PaymentMethods;
