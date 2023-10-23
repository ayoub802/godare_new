import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderEarth } from '../../components/Header'
import Textarea from 'react-native-textarea';
import Button from '../../components/Button';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-virtualized-view';
import { useTranslation } from 'react-i18next'
import axiosInstance from '../../axiosInstance';
import { getAuthUserEmail } from '../../modules/GestionStorage';
import Plane from "../../assets/images/plane.png"
import Boat from "../../assets/images/boat.png"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CommandScreen = (props) => {

    const [CommandesEnCours, setCommandesEnCours] = useState([]);
    const [CommandesPrecedentes, setCommandesPrecedentes] = useState([]);
  
    const [Loader, setLoader] = useState(true);
  
    const {t, i18n} = useTranslation();
  
    useEffect(() => {

        async function fetchValue()
        {
            setLoader(true);
    
            const userEmail = await getAuthUserEmail();
    
            try 
            {
              const response = await axiosInstance.get('commandes/khalildonald%40yahoo.fr');
    
              let dataEnCours = [];
              let dataPrecedents = [];
    
              response.data.forEach(function (commande)
              {
                  if ('disponible' ==  commande.statut.toLowerCase() || 'livrée' ==  commande.statut.toLowerCase() || 'annulée' ==  commande.statut.toLowerCase())
                  {
                    dataPrecedents.push(commande);
                  }
                  else 
                  {
                    dataEnCours.push(commande);
                  }
              });
    
              console.log('response', response.data)
    
              setCommandesEnCours(dataEnCours);
    
              setCommandesPrecedentes(dataPrecedents);
    
              setLoader(false);
            }
            catch (erreur)
            {
              console.log('commande fetch error', erreur);
    
            }
        }
    
        fetchValue();
      
      }, []);
  
      const handleCommandeClick = (commandeId) => {
        props.navigation.navigate('DetailCommandeScreen', { commandeId });
      };

      const Item = ({item}) => (
        <View style={{ backgroundColor: "#fff", borderRadius: 10, paddingTop: 14, paddingBottom: 25, paddingRight: 8, paddingLeft: 14}}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            
             <View style={{ flexDirection: "row", alignItems: "center", gap: 12}}>
              
              <View style={styles.textRow}> 
                <Text style={styles.NameTxt}>
                  { 
                   'Fret par avion' == item.service ? (
                    <View style={{ padding: 15, backgroundColor: "#FFF3F3", borderRadius: 10}}>
                    <Image source={Plane}/>
                   </View>  
                   )

                : 
                <></>
                  }
                  { 
                   'Fret par bateau' == item.service ? (
                    <View style={{ padding: 15, backgroundColor: "#FFF3F3", borderRadius: 10}}>
                    <Image source={Boat}/>
                   </View>  
                   )

                : 
                <></>
                  }
                </Text>
                </View>            

                <View>
                  <Text style={{fontSize: 13, color: "#000", fontFamily: "Poppins-SemiBold", letterSpacing: 1}}>
                   {item.service ? item.service : "Fret par avion"}
                  </Text>
    
                  <Text style={{fontSize: 14, color: "#292625", fontFamily: "Poppins-Medium", letterSpacing: 1}}>
                    { item.createdAt }
                  </Text>
                </View>
             </View>
             <View style={{ paddingRight: 22}}> 
                  <Text style={{fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#498BF0"}}>{item.totalPrice}€</Text>
              </View>
    
          </View>
    
          <View style={{marginTop: 27}}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <TouchableOpacity>
                <Text style={{ fontSize: 12, color: "#292625", fontFamily: "Poppins-Medium"}}>{t(item.statut)}</Text>
              </TouchableOpacity>
            <TouchableOpacity onPress={()=> console.log("Test")}>
                   <Button title="commander à nouveau" navigation={() => props.navigation.navigate('CartScreen')}/>
            </TouchableOpacity>
            <TouchableOpacity  key={item.id} onPress={() => handleCommandeClick(item.id)}>
                <Text style={{ fontSize: 12, color: "#292625", fontFamily: "Poppins-Regular", textDecorationLine: "underline"}}>{t('Suivis colis')}</Text>
             </TouchableOpacity>
            </View>
          </View>
    
        </View>
      );
    
  
    if (true === Loader)
    {
        return (
        <View style={{justifyContent: 'center', flex: 1}}><ActivityIndicator size={'large'} color="#3292E0" /></View>
        );
    }
    return (
        <View style={{ flex: 1}}>
          <HeaderEarth />
    
          <ScrollView  showsVerticalScrollIndicator={false}>
            <View style={{flex: 1, marginBottom: 50}}>
                <View style={{marginTop: 24}}>
                        <Text
                            style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 16,
                            color: '#000',
                            textAlign: 'center',
                            }}>
                            Vos commandes en cours
                        </Text>
                    </View>
        
            
                    <View style={{paddingHorizontal: 8}}>
                        <View style={{flexDirection: "column", gap: 20}}>
                                {CommandesEnCours.length > 0 ? 
                                
                                (
                                    CommandesEnCours.map(item => (
                                    <Item item={item} key={item.id} />
                                    ))
                                )
                                :
                                <Text>Pas de commandes</Text>
                                }
                        </View>
                    </View>
            
        
                    <View style={{marginTop: 24}}>
                        <Text
                            style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 16,
                            color: '#000',
                            textAlign: 'center',
                            }}>
                            Vos commandes en cours
                        </Text>
                    </View>
        
                    <View style={{paddingHorizontal: 8}}>
                      <View style={{flexDirection: "column", gap: 20}}>
                            {CommandesPrecedentes.length > 0 ? 
                            (
                                CommandesPrecedentes.map(item => (
                                <Item item={item} key={item.id} />
                                ))
                            )
                            :
                            <Text>Pas de commandes</Text>
                            }
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

export default CommandScreen