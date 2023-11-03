import {View, Text, StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import PaysLivraison from '../screen/LivraisonScreen/PaysLivraison';
import DepotScreen1 from '../screen/DepotScreen/DepotScreen1';
import Stepper from '../screen/Stepper';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import Feather from "react-native-vector-icons/Feather"
import Search from '../screen/Search/Search';
import ContactScreen from '../screen/ContactScreen/ContactScreen';
import ProfileScreen from '../screen/Profile/ProfileScreen';
import Livraison1 from '../screen/LivraisonScreen/Livraison1';
import LoginScreen from '../screen/Login/LoginScreen';
import EditProfile from '../screen/Profile/EditProfile';
import RemiseAvoirScreen from '../screen/Profile/RemiseAvoirScreen';
import MessageScreen from '../screen/ContactScreen/MessageScreen';
import LanguageScreen from '../screen/Profile/LanguageScreen';
import AdresseScreen from '../screen/Profile/AdresseScreen';
import AddCardScreen from '../screen/CartScreen/AddCardScreen';
import DepotScreen2 from '../screen/DepotScreen/DepotScreen2';
import DepotScreen3 from '../screen/DepotScreen/DepotScreen3';
import Livraison2 from '../screen/LivraisonScreen/Livraison2';
import CartBancair from '../screen/CartScreen/CartBancair';
import CommandScreen from '../screen/Profile/CommandScreen';
import CartScreen from '../screen/CartScreen/CartScreen';
import VerifyCardScreen from '../screen/CartScreen/VerfiyCardScreen';
import CommandCours from '../screen/CommandCours/CommandCours';
import ShoppingScreen from '../screen/Shopping/ShoppingScreen';
import LoginShoppinScreen from '../screen/Shopping/LoginScreen';
import CheckoutScreen from '../screen/ChekoutScreen/CheckoutScreen';
import ColiSuivi from '../screen/Coli/ColiSuivi';
import VerifyCardChckoutScreen from '../screen/Shopping/VerfiyCardScreen';
import AddCardChekoutScreen from '../screen/Shopping/AddCardScreen';
import ProductList from '../screen/Shopping/ProductList';
import SignUpScreen from '../screen/Login/SignUpScreen';
import AddAdressScreen from '../screen/Profile/AddAdressScreen';
import TermsConditions from '../screen/Terms&Condition';
import CommandeDetail from '../screen/CommandCours/CommandeDetail';
import PaymentMethods from '../screen/Payment/PaymentMethod';
import PaymentDetails from '../screen/Payment/PaymentDetail';
import PaymentWaveDetails from '../screen/Payment/PaymentWaveDetails';
import LegalNotice from '../screen/LegalNotice';
import SuccessFullyRegOrder from '../screen/SuccessFullyRegOrder';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../modules/FirebaseConfig';
import { getAuthUserEmail, getPanier, getSelectedCountry, getSelectedService, getServices, saveSelectedCountry, saveSelectedService } from '../modules/GestionStorage';
import CreditCard from '../screen/CreaditCard';
import AddStripeUserCard from '../screen/CreaditCard/AddUserStripe';
import Signup from '../screen/Login/SignUp';
import ConversationList from '../screen/Conversation/ConversationList';
import ConversationDetails from '../screen/Conversation/ConversationDetails';


const Home = createNativeStackNavigator();
const Profile = createNativeStackNavigator();
const Cart = createNativeStackNavigator();
const Contact = createNativeStackNavigator();
const AppNavigation = (props) => {


  CartLenght = props.CartLenght;
  const [user, setUser] = useState(null);
  const [Service, setService] = useState(null);
  const [Loader,setLoader] = useState(false);
  const [Remises, setRemises] = useState([]);
  const [CartProducts, setCartProducts] = useState([]);
  const [RemiseLoader, setRemiseLoader] = useState(true);
  const [paysLivraison, setPaysLivraison] = useState('');
  const [BasketClasseRegroupement, setBasketClasseRegroupement] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      setUser(user)
    })
  }, [])

  useEffect(() => {
 
    let mounted = true;

    setLoader(true);
    setRemiseLoader(true);
    setCartProducts([]);

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

    return (mounted) => mounted = false;

  }, []);


  return (
    <NavigationContainer>
    <StatusBar backgroundColor="#2BA6E9"/>
        <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            elevation: 0,
            height: 53,
            backgroundColor: '#2BA6E9',
          },
        }}
         initialRouteName='Login'
        >
        <Tab.Screen
        name='Home'
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={24}
                    color={focused ? '#fff' : '#ffffffb3'}
                  />
                </View>
              );
            },
          }}
        >
          {
            () => (
              <Home.Navigator screenOptions={{ headerShown: false}}>
                <Home.Screen name="HomeScreen" component={HomeScreen} />
                <Home.Screen name="PaysLivraison" component={PaysLivraison} />
                <Home.Screen name="DepotScreen1" component={DepotScreen1} />
                <Home.Screen name="DepotScreen2" component={DepotScreen2} />
                <Home.Screen name="DepotScreen3" component={DepotScreen3} />
                <Home.Screen name="Livraison1" component={Livraison1} />
                <Home.Screen name="Livraison2" component={Livraison2} />
                <Home.Screen name="AddCardScreen" component={AddCardScreen} />
                <Home.Screen name="VerifyCardScreen" component={VerifyCardScreen} />
                <Home.Screen name="CommandCours" component={CommandCours} />
                <Home.Screen name="Login" component={LoginScreen} />
                <Home.Screen name="SignUpScreen" component={SignUpScreen} />
                <Home.Screen name="LoginShoppins" component={LoginShoppinScreen} />
                <Home.Screen name="Signup" component={Signup} />
                <Home.Screen name="ProductList" component={ProductList} />
                <Home.Screen name="ShoppingScreen" component={ShoppingScreen} />
                <Home.Screen name="CartScreen" component={CartScreen} />
                <Home.Screen name="CheckoutScreen" component={CheckoutScreen} />
                <Home.Screen name="ColiScreen" component={ColiSuivi} />
                <Home.Screen name="VerifyCardChckoutScreen" component={VerifyCardChckoutScreen} />
                <Home.Screen name="AddCardChckoutScreen" component={AddCardChekoutScreen} />
                <Home.Screen name='AddAdresse' component={AddAdressScreen}/>
                <Home.Screen name='PaymentMethod' component={PaymentMethods}/>
                <Home.Screen name='PaymentDetail' component={PaymentDetails}/>
                <Home.Screen name='PaymentWaveDetails' component={PaymentWaveDetails}/>
                <Home.Screen name='SuccessFully' component={SuccessFullyRegOrder}/>
              </Home.Navigator>
            )
          }
        </Tab.Screen>
        <Tab.Screen
        name='Search'
        component={Search}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <MaterialIcons
                    name="search"
                    size={24}
                    color={focused ? '#fff' : '#ffffffb3'}
                  />
                </View>
              );
            },
          }}
        >
        </Tab.Screen>
        <Tab.Screen
        name='mailscreen'
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Entypo
                    name="mail"
                    size={24}
                    color={focused ? '#fff' : '#ffffffb3'}
                  />
                </View>
              );
            },
          }}
        >
                    {
            () => (
              <Contact.Navigator screenOptions={{ headerShown: false}}>

                  <Contact.Screen name='mail' component={MessageScreen}/>
                  <Contact.Screen name='Conversation' component={ConversationList}/>
                  <Contact.Screen name='ConversationDetails' component={ConversationDetails}/>

              </Contact.Navigator>
            )
          }
        </Tab.Screen>
        <Tab.Screen
        name='Cart'
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center', position: "relative"}}>
                  <SimpleLineIcons
                    name="handbag"
                    size={24}
                    color={focused ? '#fff' : '#ffffffb3'}
                  />
                  <View style={{ position: "absolute", top: -5, right: -5, backgroundColor: '#F4951A', width: 20, height: 20, justifyContent: "center", alignItems: "center", borderRadius: 50}}>
                    <Text style={{fontSize: 12, fontFamily: "Poppins-Medium", color: "#fff"}}>{CartLenght}</Text>
                  </View>
                </View>
              );
            },
          }}
        >
          {
            () => (
              <Cart.Navigator screenOptions={{ headerShown: false}}>
                {
                  user 
                  ?
                  <Cart.Screen name="CartBag" component={CartScreen}/>
                  :
                  <Cart.Screen name="Login" component={LoginScreen}/>
                }
              </Cart.Navigator>
            )
          }
        </Tab.Screen>
        <Tab.Screen
        name='Profile'
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Feather
                    name="user"
                    size={24}
                    color={focused ? '#fff' : '#ffffffb3'}
                  />
                </View>
              );
            },
          }}
        >
          {
            () => (
              <Profile.Navigator screenOptions={{ headerShown: false}}>
                {
                  user ? (
                    <Profile.Screen name='ProfileScreen' component={ProfileScreen}/>
                  )
                  :
                  (
                    <Profile.Screen name='LoginScreen' component={LoginScreen}/>
                  )
                }
                <Profile.Screen name='CartBancair' component={CartBancair}/>
                <Profile.Screen name='EditProfile' component={EditProfile}/>
                <Profile.Screen name='ConversationList' component={ConversationList}/>
                <Profile.Screen name='RemiseAvoir' component={RemiseAvoirScreen}/>
                <Profile.Screen name='MessageScreen' component={MessageScreen}/>
                <Profile.Screen name='LanguageScreen' component={LanguageScreen}/>
                <Profile.Screen name='CommandeScreen' component={CommandScreen}/>
                <Profile.Screen name='DetailCommandeScreen' component={CommandeDetail}/>
                <Profile.Screen name='AdresseScreen' component={AdresseScreen}/>
                <Profile.Screen name='AddAdresseScreen' component={AddAdressScreen}/>
                <Profile.Screen name='TermsAndConditionsScreen' component={TermsConditions}/>
                <Profile.Screen name='CreditCard' component={CreditCard}/>
                <Profile.Screen name='AddStripeUserCard' component={AddStripeUserCard}/>
                <Profile.Screen name='LegalNotice' component={LegalNotice}/>
              </Profile.Navigator>
            )
          }
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const Tab = createBottomTabNavigator();

export default AppNavigation;
