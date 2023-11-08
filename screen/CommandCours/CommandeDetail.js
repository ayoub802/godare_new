import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeaderEarth } from '../../components/Header';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../axiosInstance';
import { getAuthUserEmail } from '../../modules/GestionStorage';
import Button from '../../components/Button';
import Truck from "../../assets/images/truck.png"
import Feather from "react-native-vector-icons/Feather"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CommandeDetail = ({ navigation, route }) => {
    const { commandeId } = route.params;
    const [Commande, setCommande] = useState(null);
    const [Loader, setLoader] = useState(true);

    const {t} = useTranslation();
  
    useEffect(() => {
      fetchCommande();
    }, []);
  
    const fetchCommande = async () => 
    {
        setLoader(true);

        try 
        {
          const email = await getAuthUserEmail();

          const response = await axiosInstance.get('/commandes/' + commandeId + '/' + email);
  
          setCommande(response.data);

          console.log('commande', response.data)
        }
        catch (erreur)
        {
          console.log('commande error', erreur);
        }

        setLoader(false);
    };

    const imprimerFacture = () => 
    {
        // call backoffice to generate pdf et show it
    };
  

    if (true === Loader)
    {
        return (
        <View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>
        );
    }
  
    return (

        <View style={{flex: 1}}>
              <HeaderEarth />
  
              <ScrollView style={{flex: 1}}>
  
  
                <View style={{flex: 1, marginBottom: 50}}> 
                <View style={{marginTop: 24, paddingHorizontal: 16}}>
                     <Text style={{fontSize: 14, color: "#C3BCBC", fontFamily: "Poppins-Regular", letterSpacing: 1}}>Order ID</Text>
                     <View>
                       <Text style={{color: "#292625", fontSize: 24, letterSpacing: 1, fontFamily: "Poppins-Medium"}}>{ Commande.uuid ? Commande.uuid : 222222 }</Text>
                     </View>
                </View>
                <View style={{marginTop: 14, paddingHorizontal: 16}}>
                     <Text style={{fontSize: 16, color: "#292625", fontFamily: "Poppins-Medium", letterSpacing: 1}}>{t("History")}</Text>
                    <View style={{backgroundColor: "#fff",padding: 14,borderRadius: 10}}>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>{t("Commande validée")}</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>{ Commande.createdAt }</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>{t('Produits réceptionnés')}</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>{ Commande.createdAt }</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>{("Préparée")}</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>{ Commande.createdAt }</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#EF5448"}}></View>
                              <View style={{ width: 1, height: 70,justifyContent: "center",alignItems: "center" ,borderWidth: 1, borderStyle: "dashed", borderColor: "#EF5448"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>{t('Expédiée')}</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>{ Commande.createdAt }</Text>
                           </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "flex-start", gap: 20}}>
                           <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <View style={{width: 12, height: 12, borderRadius: 50, backgroundColor: "#fff", borderWidth: 4, borderColor: "#498BF0"}}></View>
                           </View>
                           <View>
                              <Text style={{color: "#292625", fontFamily: "Poppins-Medium", fontSize: 14, letterSpacing: 1}}>{t('Commande livrée')}</Text>
                              <Text style={{color: "#C3BCBC", fontFamily: "Poppins-Regular", fontSize: 12, letterSpacing: 1}}>Colis N° { Commande.uuid ? Commande.uuid : 222222 }</Text>
                           </View>
                      </View>
                    </View>
                </View>
                <View style={{marginTop: 24, paddingHorizontal: 16}}>
                  <View style={{backgroundColor: "#fff", paddingTop: 24, paddingBottom: 13, paddingLeft: 13, paddingRight: 10, borderRadius: 10}}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                       <View style={{width: 46, height: 46, backgroundColor: "#498bf04d", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                         <Image source={Truck}/>
                       </View>
                       <View>
                          <Text style={{color: "#292625", fontSize: 14, fontFamily: "Poppins-Medium", letterSpacing: 1}}>{t('Colis livré')}</Text>
                          <Text style={{color: "#C3BCBC", fontSize: 13, fontFamily: "Poppins-Regular", letterSpacing: 1}}>
                             Colis N° { Commande.uuid ? Commande.uuid : 222222 }
                          </Text>
                       </View>
                       <View>
                         <TouchableOpacity>
                           <Text style={{fontSize: 12, color: "#498BF0", textDecorationLine: "underline", fontFamily: "Poppins-Medium", textAlign: "center"}}>{t('Suivre le colis')}</Text>
                         </TouchableOpacity>
                         <TouchableOpacity>
                           <Text style={{fontSize: 12, color: "#498BF0", textDecorationLine: "underline", fontFamily: "Poppins-Medium", textAlign: "center"}}>{t('Voir le contenu')}</Text>
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => imprimerFacture()}>
                           <Text style={{fontSize: 12, color: "#498BF0", textDecorationLine: "underline", fontFamily: "Poppins-Medium",textAlign: "center"}}>{t('Éditer la facture')}</Text>
                         </TouchableOpacity>
                       </View>
                    </View>
                  </View>
                </View>
                  
  
                </View>
  
          
              </ScrollView>
  
            </View>
        
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //     justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    orderDetailsContainer: {
      backgroundColor: '#fff',
      width: windowWidth * 0.9,
      height: 'auto',
      alignSelf: 'center',
      elevation: 3,
      borderRadius: 10,
      justifyContent: 'space-around',
      marginTop: windowHeight * 0.03,
    },
    TextContainer: {
      // backgroundColor: 'red',
      height: 'auto',
      //width: windowWidth * 0.45,
      alignItems: 'flex-start',
      //justifyContent: 'space-evenly',
      marginTop:10
    },
    NameTxt: {
      // backgroundColor: 'green',
     // width: windowWidth * 0.45,
      fontFamily: 'Roboto-Regular',
      fontSize: 12,
      color: '#000',
      marginTop:5
    },
    textPrice: {
      marginLeft: windowWidth * 0.3
    },
    PriceAndDateText: {
      // backgroundColor: 'gold',
      width: windowWidth * 0.3,
      fontFamily: 'Roboto-Regular',
      fontSize: 10,
      color: '#000',
    },
    textRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    AllTextContainer: {
      // backgroundColor: 'gold',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 'auto',
    },
    boxContainer: {
      backgroundColor: '#feafc9',
      width: 100,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 7,
    },
    boxText: {
      fontFamily: 'Roboto-Bold',
      fontSize: 13,
      color: '#fff',
    },
    orderAgainContainer: {
      backgroundColor: '#3292E0',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: windowWidth * 0.7,
      height: windowHeight * 0.05,
      borderRadius: 50,
      marginTop:10,
      marginBottom:12
    },
    TExtstyle: {
      fontFamily: 'Roboto-Regular',
      fontSize: 13,
      color: '#fff',
    },
    containerFlatelist: {
      // flex: 1,
      //         justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#fff',
      width: windowWidth * 1.0,
      height: windowHeight * 1.0,
    },
    titleText: {
      color: '#000',
      fontSize: 18,
      fontFamily: 'Roboto-Bold',
    },
  });
  

export default CommandeDetail