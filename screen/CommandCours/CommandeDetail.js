import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeaderEarth } from '../../components/Header';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../axiosInstance';
import { getAuthUserEmail } from '../../modules/GestionStorage';
import Button from '../../components/Button';
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
  
              <ScrollView>
  
              <Button title="Retour" onPress={() => navigation.goBack()} />
  
                <View> 
                  <Text style={styles.NameTxt}>
                    {t('Service')} : { Commande.service ? Commande.service : 'Fret par avion' }
                  </Text>
  
                  <Text style={styles.textPrice}>
                  {t('Prix total')} : €{Commande.totalPrice}
                  </Text>
  
                  <Text style={styles.textPrice}>
                    {t('Numéro de la commande')} : { Commande.uuid ? Commande.uuid : 222222 }
                  </Text>
  
                  <Text style={styles.NameTxt}>
                  {t('Date de la commande')} : { Commande.createdAt }
                  </Text>
  
                  <Text style={styles.NameTxt}>
                    {t('Statut')} : {Commande.statut}
                  </Text>
  
                  <Text style={styles.NameTxt}>
                    {t('Mode paiement')} : {Commande.modePaiement}
                  </Text>
  
                  {Commande.avoir && Commande.avoir > 0 && (
                      <Text style={styles.NameTxt}>
                      {t('Avoir')} : {Commande.avoir}
                      </Text>
                    )
                  }
  
                  {Commande.remise && Commande.remise > 0 && (
                      <Text style={styles.NameTxt}>
                      {t('Remise')} : {Commande.remise}
                      </Text>
                    )
                  }
  
                  <View>
                    <Text style={styles.titleText}>
                      { t('Produit(s)') }
                    </Text>
                  </View>
  
                  <View>
                    {
                      Commande.commandeProducts.map(commandeProduct => (
                        <View style={{ marginBottom:20 }}>
                          <Text style={styles.NameTxt}>
                            {t('Nom')} : {commandeProduct.product.name} - { t('Quantité') } : { commandeProduct.quantite }
                          </Text>
  
                          {Object.values(commandeProduct.attributs).length > 0 && (
                            <Text style={styles.NameTxt}>
                              {t('Attributs')} : { Object.values(commandeProduct.attributs).join(', ') }
                            </Text>
                          )
                          }
  
                          {commandeProduct.prixAchat && (
                            <Text style={styles.NameTxt}>
                            {t("Prix d'achat")} : { commandeProduct.prixAchat}
                            </Text>
                          )
                          }
  
                          {commandeProduct.url && (
                            <Text style={styles.NameTxt}>
                            {t('URL')} : { commandeProduct.url}
                            </Text>
                          )
                          }
  
                          {commandeProduct.informationComplementaire && (
                            <Text style={styles.NameTxt}>
                            {t('Information(s) complémentaire(s)')} : { commandeProduct.informationComplementaire}
                            </Text>
                          )
                          }
  
                          {commandeProduct.photo && (
                            <Image
                            source={{uri: commandeProduct.photo}}
                            resizeMode="contain"
                            style={{ width: 70, height: 50, }}
                          />
                          )
                          }
                        </View>
                      ))
                    }
                  </View>
  
                  {(Commande.service == 'Fret par avion' || Commande.service == 'Fret par bateau') && Commande.depot ?
                      (
                          <>
                            <View>
                              <Text style={styles.titleText}>
                               {'enlevement' == Commande.depot.mode ? t('Enlèvement à domicile') : t('Dépôt au magasin')}
                              </Text>
                            </View>
  
                            <View>
  
                              {Commande.depot.nom && (
                                  <Text style={styles.NameTxt}>
                                  { Commande.depot.nom }
                                  </Text>
                                )
                              }
  
                              <Text style={styles.NameTxt}>
                                {t('Adresse')} : {Commande.depot.adresse}
                              </Text>
  
                              {Commande.depot.telephone && (
                                  <Text style={styles.NameTxt}>
                                  { Commande.depot.telephone }
                                  </Text>
                                )
                              }
  
                              {Commande.depot.creneauEnlevementPlage && (
                                  <Text style={styles.NameTxt}>
                                  { t("Date d'enlèvement") } : { Commande.depot.creneauEnlevementPlage.date + t(' entre ') + Commande.depot.creneauEnlevementPlage.horaireDebut + t(' et ') + Commande.depot.creneauEnlevementPlage.horaireFin }
                                  </Text>
                                )
                              }
  
                              
                            </View>
                          </>
                      )
                      : 
                      <></>
                    }
  
                    <View>
                      <Text style={styles.titleText}>
                          { 'relais' == Commande.livraison.mode ? t('Retrait en point relais') : t('Livraison à domicile')}
                      </Text>
                    </View>
  
                    <View>
                      <Text style={styles.NameTxt}>
                        {Commande.livraison.nom}
                      </Text>
  
                      <Text style={styles.NameTxt}>
                        {Commande.livraison.adresse}
                      </Text>
  
                      <Text style={styles.NameTxt}>
                        {Commande.livraison.telephone}
                      </Text>
                    </View>
  
                    
  
                    <View>
                      <Button title="Imprimer la facture" onPress={() => imprimerFacture()} />
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