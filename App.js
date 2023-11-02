import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppNavigation from './navigation/AppNavigation';
import SplashScreen from 'react-native-splash-screen';
import {StripeProvider} from '@stripe/stripe-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from './axiosInstance';
import { getAuthUserEmail, getPanier, getSelectedCountry, getSelectedService, getServices, saveConditionsMentions, saveParametrages, saveSelectedCountry, saveSelectedService } from './modules/GestionStorage';
import { GetPlatformLanguageAndSavedInStorage } from './modules/DeviceSettings';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './language/i18n';

console.disableYellowBox = true;
const App = () => {
  const {t, i18n} = useTranslation();
  const [Loader,setLoader] = useState(false);
  const [Remises, setRemises] = useState([]);
  const [CartProducts, setCartProducts] = useState([]);
  const [RemiseLoader, setRemiseLoader] = useState(true);
  const [Service, setService] = useState(null);
  const [paysLivraison, setPaysLivraison] = useState('');
  const [BasketClasseRegroupement, setBasketClasseRegroupement] = useState('');

  useEffect(() => {

    let mounted = true;

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

    async function fetchValue() {
      try {



        // Information de connexion
        const userEmail = await getAuthUserEmail();


        // Recuperer le service
        let service = await getSelectedService();
        setService(service);


        // Recuperer le pays de livraison
        let selectedPaysLivraison = await getSelectedCountry();
        setPaysLivraison(selectedPaysLivraison);


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

            setService(service);

            await saveSelectedService(service);
          }

          // prendre tjr le pays de livraison du panier
          let cartPaysLivraison = basketData[0].paysLivraison;
          if (selectedPaysLivraison.id != cartPaysLivraison.id)
          {
            selectedPaysLivraison = cartPaysLivraison;

            setPaysLivraison(selectedPaysLivraison);

            await saveSelectedCountry(selectedPaysLivraison);
          }
          

          // Si vente privées recuperer la classe de regroupement (pour determiner si avion ou bateau)
          if ('ventes-privees' == service.code)
          {
            let classeRegroupement = null;

            basketData.map(ls => {

              let productSpecificites = ls.product.productSpecificites ? ls.product.productSpecificites[0] : null;

              let classeRegroupements = productSpecificites ? (productSpecificites.livraison ? productSpecificites.livraison.classeRegroupement : []) : [];

              if (classeRegroupements && classeRegroupements.length == 1)
              {
                classeRegroupement = classeRegroupements[0].type;
              }
            });

            // Probablement en face d'un type avec 2 classes de livraison, on ne prend que l'avion
            if (!classeRegroupement)
            {
              basketData.map(ls => {
                let productSpecificites = ls.product.productSpecificites ? ls.product.productSpecificites[0] : null;

                let classeRegroupements = productSpecificites ? (productSpecificites.livraison ? productSpecificites.livraison.classeRegroupement : []) : [];

                if (classeRegroupements && classeRegroupements.length == 2) // Juste pour s'assurer qu'on a bien defini le type de livraison
                {
                  classeRegroupement = 'avion';
                }
              });
            }
  
            setBasketClasseRegroupement(classeRegroupement);
          }
            
          setCartProducts(basketData);
        }

        if (!service)
        {
          return;
        }

        // Recuperer les remises
        axiosInstance.get('/remises/active/all/' + userEmail + '/' + service.code + '/' + selectedPaysLivraison.id).then((response) => {
          if (response.data)
          {
            setRemises(response.data);
            setRemiseLoader(false);
          }
        })
        .catch(function (error) {
          setRemiseLoader(false);
        });

        setLoader(false)

      } catch (error) {
        console.log('error', error);

        setLoader(false);
        setRemiseLoader(false);
      }
    }

    fetchValue();

    
    // Récuperer la langue du téléphone et la sauvegarder
    getLanguageAndSetI18n();
    
    // Recuperer les parametrages
    fetchParametrageAndConditionsLegales();
    SplashScreen.hide();
    return (mounted) => mounted = false;

  }, []);

  console.log("Count : ",CartProducts.length);

  return (
    <I18nextProvider i18n={i18n}>
      <StripeProvider publishableKey="pk_test_51MP1s8H53XOlotVAmo3JD8WTYIy7qYuXEKc7z2saRD9mmhBDxl0naLPsYa5oevuJn5wMYV2UOLP0WhDpdzOkjTVt00Bw8i8DRE">
        <SafeAreaView style={{flex: 1}}>
          <AppNavigation CartLenght={CartProducts.length}/>
        </SafeAreaView>
      </StripeProvider>
    </I18nextProvider> 
  );
};

export default App;
