import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import Feather from "react-native-vector-icons/Feather"
import Entypo from "react-native-vector-icons/Entypo"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import France from "../../assets/images/france.png"
import CoteIvoire from "../../assets/images/cote_ivoire.png"
import SmallEarth from "../../assets/images/small_earth.png"
import Stepper from '../Stepper'
import { productCart } from '../../constant/data'
import Button, { ButtonPrix } from '../../components/Button'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { getAuthUserEmail, getDepotValues, getLivraisonValues, getPanier, getRemiseUsed, getSelectedCountry, getSelectedService, removePanier, saveAdresseIdFacturation, saveCartAvoir, savePrixFinalPanier, saveSelectedCountry, saveSelectedService } from '../../modules/GestionStorage'
import axiosInstance from '../../axiosInstance'
import { calculProductPrices } from '../../modules/CalculPrix'
import { Dropdown } from 'react-native-element-dropdown'
import Icon from 'react-native-vector-icons/Feather';
import { getImageType } from '../../modules/TraitementImage'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ServiceHeader from '../../components/ServiceHeader'
import styles from './styles'
import Checkbox from 'expo-checkbox'

const CheckoutScreen = (props) => {
  var isFocused = useIsFocused();

  const {t, i18n} = useTranslation();
  const [Loader,setLoader] = useState(false);
  const [Avoirs, setAvoirs] = useState([]);
  const [AvoirValue, setAvoirValue] = useState(0);
  const [RemiseValue, setRemiseValue] = useState(0);
  const [RemiseProduct, setRemiseProduct] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [isFocusAvoir, setIsFocusAvoir] = useState(false);
  const [AvoirChoice, setAvoirChoice] = useState(false);
  const [Service, setService] = useState(null);
  const [paysLivraisonObject, setPaysLivraisonObject] = useState(null);
  const [cartLivraisonPrice, setCartLivraisonPrice] = useState(0);
  const [sommeFraisDouane, setSommeFraisDouane] = useState(0);
  const [modeLivraison, setModeLivraison] = useState(null);
  const [UserEmail, setUserEmail] = useState(null);
  const [CartTotalPriceSansAvoir, setCartTotalPriceSansAvoir] = useState(0);
  const [CartTotalPriceSansRemiseAvoir, setCartTotalPriceSansRemiseAvoir] = useState(0);
  const [Language, setLanguage] = useState('fr');
  const [LivraisonData, setLivraisonData] = useState({});
  const [DepotData, setDepotData] = useState({});
  const [AdresseFacturationDifferente, setAdresseFacturationDifferente] = useState(false);
  const [Adresses, setAdresses] = useState([]);
  const [AdresseFacturationId, setAdresseFacturationId] = useState('');
  const [NomFacturation, setNomFacturation] = useState('');
  const [TVA, setTVA] = useState(0);
  const [LoadingPayment, setLoadingPayment] = useState(false);

  
  useEffect(() => {

    // Pour eviter un probleme de memoire, il faut ajouter un cleanup
    let mounted = true;
 
    setLoader(true);

    async function fetchValue() {
      try {


        // Email
        const email = await getAuthUserEmail();
        setUserEmail(email);

        try 
        {
          const response = await axiosInstance.get('adresses/user/' + email);

          let formatted = response.data.map(ls=>{
            return {id:ls.id, label:(ls.adresse + ' ' + ls.codePostal + ' ' + ls.ville + ' ' + ls.pays), value:ls.id, codePostal: ls.codePostal, ville: ls.ville, nom: ls.nom, telephone: ls.telephone}
          })

          setAdresses(formatted);

          setLoader(false);
        }
        catch (erreur)
        {
          console.log('adresse fetch error', erreur);
        }

        // Depot
        let depotValues = await getDepotValues();
        setDepotData(depotValues);


        // Prix de livraison
        let livraisonValues = await getLivraisonValues();
        console.log(livraisonValues);
        setLivraisonData(livraisonValues);

        let livraisonPrice = livraisonValues.prixTotalLivraison;
        setCartLivraisonPrice(livraisonPrice ? livraisonPrice : 0);


        let livraisonMode = livraisonValues.modeLivraison;
        setModeLivraison(livraisonMode);


        let fraisDouane = livraisonValues.sommeFraisDouane;
        setSommeFraisDouane(fraisDouane);


        // Pays de livraison
        let paysLivraisonObject = await getSelectedCountry();
        setPaysLivraisonObject(paysLivraisonObject);


         // Get service
        let service = await getSelectedService();

   
        // Get avoir
        axiosInstance.get('/avoirs/active/all/' + email).then((response) => {
          if (response.data)
          {
            let data = response.data;

            let somme = 0;
            data.map( function (value) {
              somme = somme + parseFloat(value.montant) - parseFloat(value.montantConsomme ? value.montantConsomme : 0);
            });

            if (somme > 0)
            {
              let formatted = [{
                id: 1, label: somme, value: somme
              }];

              setAvoirs(formatted);
            }
          }
        })
        .catch(function (error) {
          console.log('error', error)
        });


        // Remise
        let remiseUsed = await getRemiseUsed();

        setRemiseValue(remiseUsed.remiseValue);
        setRemiseProduct(remiseUsed.remiseProduct);


        // Panier
        let basketData = await getPanier();

        if (basketData.length > 0)
        {
          setCartProducts(basketData);

          // Prend tjr le service du panier
          let cartService = basketData[0].service;
          if (cartService != service.code)
          {
            let services = await AsyncStorage.getItem('services');
            services = JSON.parse(services);

            var newData = services.filter(ls => {
    
              if (ls.code == cartService) {
                return ls;
              }
            });

            service = newData[0];

            await saveSelectedService(service);
          } 
          
          // prendre tjr le pays de livraison du panier
          let cartPaysLivraison = basketData[0].paysLivraison;
          if (paysLivraisonObject.id != cartPaysLivraison.id)
          {
            paysLivraisonObject = cartPaysLivraison;

            setPaysLivraisonObject(paysLivraisonObject);

            await saveSelectedCountry(paysLivraisonObject);
          }
        }

        setService(service);

        // Calcul TVA
        let sommeTva = 0;
        basketData.forEach(function (item)
        {
          let tva = item.product.productSpecificites[0] ? item.product.productSpecificites[0].tva : 0;
          tva = parseFloat(tva);
          tva = isNaN(tva) ? 0 : tva;

          let prix = parseFloat(item.Price);
          prix = isNaN(prix) ? 0 : prix;

          let quantite = parseInt(item.quantite);
          quantite = isNaN(quantite) ? 1 : quantite;

          // Prix quantite
          let prixQuantite = prix * quantite;

          sommeTva = sommeTva + ( (prixQuantite * tva) / 100 );
        });

        sommeTva = sommeTva.toFixed(2);
        setTVA(sommeTva);

        

       
        setLoader(false)
 
      } catch (error) {
        console.log('error', error)
      }
    }

    fetchValue();

    return (mounted) => mounted = false;

  }, [isFocused]);


  // Paiement
  async function NavigateToPayment(totalPrice, remiseTotal){
    
    await savePrixFinalPanier(totalPrice, CartTotalPriceSansRemiseAvoir, remiseTotal, TVA);

    let adresseFacturation = AdresseFacturationId;
    let type = 'user_adresse';

    if (!adresseFacturation)
    {
      adresseFacturation = 'relais' == LivraisonData.livraisonMode ? LivraisonData.livraisonRelaisId : LivraisonData.livraisonAdresseId;

      type = 'relais' == LivraisonData.livraisonMode  ? 'livraison' : 'user_adresse';

      setAdresseFacturationId(adresseFacturation);
    }

    await saveAdresseIdFacturation(adresseFacturation, NomFacturation, type);


    if ('demandes-d-achat' == Service.code)
    {
      let statut = 'A confirmer';

      return Alert.alert(
        t('Validation'),
        t('Votre commande va être transmise pour cotation. Validez-vous la commande ?'),
        [
          {
            text: t('Annuler'),
            style: 'cancel',
          },
          {text: t('OK'), onPress: () => validateCommande(statut, remiseTotal)},
        ],
      );
    }

    if (totalPrice == 0)
    {
      let statut = 'Payée';

      validateCommande(statut, remiseTotal);

      return;
    }

    props.navigation.navigate("AddCardScreen");
  };

  const NavigateToUserAddress = () => {
  props.navigation.navigate("AddCardScreen", {pageFrom: 'summary', email: UserEmail});
  }



  // Valider la commande
  async function validateCommande(statut, remiseTotal){
    
    setLoadingPayment(true);

    let avoir = 0;

    if (AvoirValue)
    {
      let remain = CartTotalPriceSansRemiseAvoir - AvoirValue;

      if (remain < 0)
      {
        avoir = CartTotalPriceSansRemiseAvoir;
      }
      else 
      {
        avoir = AvoirValue;
      }
    }

    let data = await buildCommande();

    data.commande.statut = statut;

    data.commande.totalPaye = 0;

    if ('Payée' == statut)
    {
      data.commande.modePaiement = 'Avoir';
      data.commande.totalPaye = avoir;

      data.montantPayeEnAvoir = avoir;

      if (remiseTotal)
      {
        data.montantPayeEnRemise = remiseTotal;
      }
    }

    const formData = new FormData();

    formData.append('livraison', JSON.stringify(data.livraison));
    formData.append('depot', JSON.stringify(data.depot));
    formData.append('remise', JSON.stringify(data.remise));
    formData.append('avoir', avoir);
    formData.append('client', UserEmail);
    formData.append('commande', JSON.stringify(data.commande));
    formData.append('products', JSON.stringify(data.products));
    formData.append('adresseFacturation', data.adresseFacturation);
    formData.append('adresseFacturationType', data.adresseFacturationType);
    formData.append('facturationNom', NomFacturation);

    data.productImages.forEach((productImage) => {
      let productId = productImage.productId;
      let image = productImage.image;

      if (image)
      {
        formData.append('image_' + productId, {
          uri: image,
          type: getImageType(image),
          name: 'image_' + productId
        });
      }

    });


    try 
    {
      const response = await axiosInstance.post('/commandes/new', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log('response', response.data)

      removePanier();

      return Alert.alert(
        'Succès',
        'Votre commande a été validée',
        [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.navigate("CartScreen");
            },
          },
        ],
      );
    }
    catch (error)
    {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error response', error.response.data);
        console.log('Error response', error.response.status);
        console.log('Error response', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('request', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }

    setLoadingPayment(false);
  }


  // Afficher les attributs
  const RenderAttribute = props => {

    const service = props.service;

    const product = props.product;

    if ('ventes-privees' == service.code || 'demandes-d-achat' == service.code)
    {
      const attributeValues = product.attributes ? Object.values(product.attributes) : [];

      return (
  
        <View>
        <Text style={styles.WeightCalSubText}>
          { attributeValues.join(', ') }
        </Text>
        {'demandes-d-achat' == service.code ?
          (
            <Text>{t('Infos complementaires')}: { product.informationsComplementaires }</Text>
          )
          :
          <></>
        }
        
        </View>
      );
    }

    return (

      <Text style={styles.WeightCalSubText}>
        {t('Etat')} : {('Used' == product.StateValue ? t('Occasion') : t('Neuf'))} {product.ProductValue ? (' - ' + t('Valeur') + ' : ' + product.ProductValue) : ''}
      </Text>
    
    );
  }
 

  // Afficher les produits
  const RenderItem = ({item}) => {

    let prix = 0;

    prix = isNaN(parseFloat(item.Price)) ? 0 : parseFloat(item.Price);

    let quantite = isNaN(parseInt(item.quantite)) ? 0 : parseInt(item.quantite)

    let totalPrice = prix * quantite;

    return (
        <View style={{backgroundColor: "#fff", paddingLeft: 28 ,paddingVertical: 12, marginBottom: 16, borderRadius: 18}}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20}}>
            {/* First Row */}
            <View style={{position: "relative"}}>
                <View>
                    {
                      item.ProductImage ? (<Image
                        source={{uri: item.ProductImage[0].url}}
                        resizeMode="contain"
                        style={{width: wp(26), height: wp(28)}}
                      /> ) : <Text></Text>
                    }
               
                  </View>
                  <View style={{position: "absolute", bottom: 0}}>
                    <ButtonPrix title={totalPrice}/>
                  </View>
            </View>
            
            {/* second Row */}
            <View style={styles.secondRow}>
              <View>
                <Text style={{fontSize: 14, fontFamily: "Poppins-Regular", color: "#000", maxWidth: 190}}>
                  {'fr' == Language ? item.product.name : item.product.nameEN}
                </Text>

                <RenderAttribute service={Service} product={item} />
               
              </View>
              
            </View>
            
          </View>
        </View>
    );
  };


  // Afficher le total
  const RenderTotal = ({data}) => {


    let prices = calculProductPrices(data, RemiseValue, RemiseProduct);

    let remiseTotal = prices.remiseTotal ;

    let totalPrixAvecDouaneRemiseAvoir = prices.totalPrixAvecDouaneRemiseAvoir ;

    let TotalWithLivraison = totalPrixAvecDouaneRemiseAvoir + cartLivraisonPrice;
    TotalWithLivraison = isNaN(parseFloat(TotalWithLivraison)) ? 0 : parseFloat(TotalWithLivraison);

    let resteApayer = 0;
    let resteAvoir = 0;
    let apreRemise = 0
    let calcuteRemise = 0 
    if (AvoirValue > TotalWithLivraison)
    {
      resteAvoir = AvoirValue - TotalWithLivraison;
      resteAvoir = resteAvoir.toFixed(2);
    }
    else 
    {
      resteApayer = TotalWithLivraison - AvoirValue;
    }

    resteApayer = resteApayer.toFixed(2);

    let priceWithTva = parseFloat(TVA);
    priceWithTva = isNaN(priceWithTva) ? 0 : priceWithTva;

    TotalWithLivraison = TotalWithLivraison + priceWithTva;
    
    TotalWithLivraison = TotalWithLivraison.toFixed(2);
    calcuteRemise =  (TotalWithLivraison * remiseTotal) / 100;
    apreRemise = TotalWithLivraison - calcuteRemise;
    apreRemise = apreRemise.toFixed(2);
    setCartTotalPriceSansRemiseAvoir(prices.totalPrix.toFixed(2));

    if (AvoirValue)
    {
      saveCartAvoir(AvoirValue);
    }

    let montantApayer = apreRemise + cartLivraisonPrice + sommeFraisDouane;
    montantApayer = isNaN(parseFloat(montantApayer)) ? 0 : parseFloat(montantApayer);
    montantApayer = montantApayer.toFixed(2);
    return (
      
      <View>
        <View style={{marginTop: 13, paddingHorizontal: 12}}>
                <View style={{backgroundColor: "#fff", paddingTop: 22, paddingHorizontal: 13, paddingBottom: 30,borderRadius: 8}}>
                    {'demandes-d-achat' != Service.code 
                    ? 
                    
                      (
                        <>
                      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                          <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                            Sous Total
                          </Text>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                          { TotalWithLivraison } €
                          </Text>
                       </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                              <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#ACB2B2", letterSpacing: .8}}>
                                Avez-vous un code remise ?
                              </Text>
                              <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                                -{ remiseTotal }%
                              </Text>
                        </View>
                        {'domicile' == modeLivraison ?
                            (
                              <View style={styles.secondContainer}>
                                <View style={styles.totalContainer}>
                                  <Text style={styles.totalText}>{t('Prix de livraison')}</Text>
                                  <Text style={styles.totalText}>{cartLivraisonPrice > 0 ? (cartLivraisonPrice + '€') : t('Offert')}</Text>

                                  
                                </View>
                              </View>
                            )
                            :
                            <></>
                          }
                          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                                <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                                Sous-Total aprés remise
                                </Text>
                                <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                                {apreRemise}€
                                </Text>
                          </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingTop: 19}}>
                              <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#ACB2B2", letterSpacing: .8}}>
                              Frais de douane
                              </Text>
                              <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                              {sommeFraisDouane}€
                              </Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                              <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#ACB2B2", letterSpacing: .8}}>
                              Frais de livraison
                              </Text>
                              <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                                {cartLivraisonPrice}€
                              </Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                              <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                              Montant à payer
                              </Text>
                              <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                              {montantApayer}€
                              </Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15, paddingTop: 19,borderBottomWidth: 1, borderColor: "#E9E9E9"}}>
                              <Text style={{fontFamily: "Poppins-Regular", fontSize: 12, color: "#000", letterSpacing: .8}}>
                              Avez-vous un avoir?
                              </Text>
                              <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                <Entypo name="check" color="#01962A" size={15}/>
                                <Feather name="x" color="#E10303" size={15}/>
                              </View>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",  paddingTop: 19,}}>
                              <Text style={{fontFamily: "Poppins-SemiBold", fontSize: 12, color: "#000", letterSpacing: .8}}>
                              Reste à payer
                              </Text>
                              <Text style={{fontFamily: "Poppins-Medium", fontSize: 14, color: "#262A2B", letterSpacing: .8}}>
                              {resteApayer} €
                              </Text>
                        </View>

                        </>
                      )
                      :
                      <>

                      </>
                    }
                </View>
              </View>

          {
            'demandes-d-achat' != Service.code &&  Avoirs.length > 0 && (
            

          <View style={styles.dropContainerStyle}>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              autoScroll
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerDepotStyle}
              data={Avoirs}
              maxHeight={120}
              labelField="label"
              valueField="value"
              placeholder={!isFocusAvoir ? t('Avoirs' ) : '...'}
              value={AvoirValue}
              showsVerticalScrollIndicator={false}
              onFocus={() => setIsFocusAvoir(true)}
              onBlur={() => setIsFocusAvoir(false)}
              onChange={item => {
                setAvoirValue(item.value);
                setAvoirChoice(true);
                setIsFocusAvoir(false)
              }}
            />
          </View>
            )
          }

          {
            ('demandes-d-achat' != Service.code &&  AvoirChoice ) && (<View style={styles.secondContainer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>{t('Reste à payer')}</Text>
                <Text style={styles.totalText}>
                  { resteApayer < 0 ? 0 : resteApayer } €
                </Text>
              </View>
            </View>)
          }

          
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 30}}>
              <TouchableOpacity
                style={{ paddingVertical: 8,paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center", backgroundColor: "#4E8FDA", borderRadius: 25}}
                activeOpacity={.2}
                onPress={() => {
                  NavigateToPayment(resteApayer, remiseTotal)
                }}
                disabled={LoadingPayment}>
                <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#fff"}}>
                  {'demandes-d-achat' == Service.code ?
                    t('Transmettre pour cotation')
                    :
                    t('Valider la commande')
                  }
                </Text>
              </TouchableOpacity> 
            </View>


        {LoadingPayment && <ActivityIndicator />}

        

      </View>
    );
  };

  if (Loader || !Service)
  {
    return (<View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>);
  }
  return (
    <View style={{ flex: 1,}}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingBottom: 80 , flex: 1}}>
          <ServiceHeader 
            navigation={props.navigation}
            service={Service}
            paysLivraison={paysLivraisonObject}
            language={Language}
          />

              <View>
                  <Stepper position={2}/>
                </View>

          <View>
          <View style={{marginTop: 16}}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={cartProducts}
                renderItem={({ item }) => <RenderItem item={item} />}
                keyExtractor={item => item.id}
            />
          </View>

          <View style={{marginTop: 13, paddingHorizontal: 12}}>
                  <Text style={{fontSize: 10, color: "#000"}}>*Livrasion 72h aprés  la prise en charge</Text>
                </View>


            <RenderTotal data={cartProducts} />
            
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

export default CheckoutScreen