import {View, Text, StatusBar} from 'react-native';
import React from 'react';
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


const Home = createNativeStackNavigator();
const Profile = createNativeStackNavigator();
const AppNavigation = () => {
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
        name='mail'
        component={MessageScreen}
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
        </Tab.Screen>
        <Tab.Screen
        name='Cart'
        component={CartScreen}
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
                    <Text style={{fontSize: 12, fontFamily: "Poppins-Medium", color: "#fff"}}>2</Text>
                  </View>
                </View>
              );
            },
          }}
        >
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
                <Profile.Screen name='ProfileScreen' component={ProfileScreen}/>
                <Profile.Screen name='CartBancair' component={CartBancair}/>
                <Profile.Screen name='EditProfile' component={EditProfile}/>
                <Profile.Screen name='RemiseAvoir' component={RemiseAvoirScreen}/>
                <Profile.Screen name='MessageScreen' component={MessageScreen}/>
                <Profile.Screen name='LanguageScreen' component={LanguageScreen}/>
                <Profile.Screen name='CommandeScreen' component={CommandScreen}/>
                <Profile.Screen name='DetailCommandeScreen' component={CommandeDetail}/>
                <Profile.Screen name='AdresseScreen' component={AdresseScreen}/>
                <Profile.Screen name='AddAdresseScreen' component={AddAdressScreen}/>
                <Profile.Screen name='TermsAndConditionsScreen' component={TermsConditions}/>
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
