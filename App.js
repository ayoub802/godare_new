import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import AppNavigation from './navigation/AppNavigation';
import SplashScreen from 'react-native-splash-screen';
import {StripeProvider} from '@stripe/stripe-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from './axiosInstance';
import { saveConditionsMentions, saveParametrages } from './modules/GestionStorage';
import { GetPlatformLanguageAndSavedInStorage } from './modules/DeviceSettings';
import { useTranslation } from 'react-i18next';

console.disableYellowBox = true;
const App = () => {
  const {t, i18n} = useTranslation();

  useEffect(() => {

    async function fetchParametrageAndConditionsLegales()
    {
      try 
      {
        const response = await axiosInstance.get('/parametrages');

        if (response.data)
        {
          let obj = {};

          response.data.map((row) => {
            obj[row.code] = row.message;
          });

          // Sauvegarder
          saveParametrages(obj);
        }
      }
      catch (erreur)
      {
        console.log('parametrages fetch error', erreur);
      }

      try 
      {
        const response = await axiosInstance.get('/conditions/mentions/legales/');

        if (response.data)
        {
          let obj = {};

          response.data.map((row) => {
            obj[row.code] = row;
          });

          // Sauvegarder
          saveConditionsMentions(obj);
        }
      }
      catch (erreur)
      {
        console.log('conditions et mentions legales fetch error', erreur);
      }
    }

    async function getLanguageAndSetI18n()
    {
        let deviceLanguage = await GetPlatformLanguageAndSavedInStorage();

        try 
        {
          const response = await i18n.changeLanguage(deviceLanguage);
        }
        catch (erreur)
        {
          console.log('change language error', erreur);
        }
    }

    // Récuperer la langue du téléphone et la sauvegarder
    getLanguageAndSetI18n();

    // Recuperer les parametrages
    fetchParametrageAndConditionsLegales();

  }, []);
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51MP1s8H53XOlotVAmo3JD8WTYIy7qYuXEKc7z2saRD9mmhBDxl0naLPsYa5oevuJn5wMYV2UOLP0WhDpdzOkjTVt00Bw8i8DRE">
      <SafeAreaView style={{flex: 1}}>
         <AppNavigation />
      </SafeAreaView>
    </StripeProvider>
  );
};

export default App;
