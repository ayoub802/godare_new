//import liraries
import React, {useState, useEffect,useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions, 
<<<<<<< HEAD
  ScrollView
=======
>>>>>>> 795ac6a480649a7e3d043d53d80f07c23883605a
} from 'react-native';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import ServiceHeader from '../../components/ServiceHeader';
import Feather from "react-native-vector-icons/Feather"
import { 
  getPanier, 
  getAuthUserEmail,
  getSelectedService,
  getServices,
  saveSelectedService,
  saveValidatedPanier,
  removePanier,
  getSelectedCountry,
  getPlatformLanguage,
  savePanier,
  saveSelectedCountry
} from '../../modules/GestionStorage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

import { calculProductPrices } from '../../modules/CalculPrix';
import { HeaderEarth } from '../../components/Header';
import axiosInstance from '../../axiosInstance';
import Button, { ButtonPrix } from '../../components/Button';
import Stepper from '../Stepper';
<<<<<<< HEAD
=======
import { ScrollView } from 'react-native-virtualized-view';
>>>>>>> 795ac6a480649a7e3d043d53d80f07c23883605a
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CartScreen = (props) => {


  var isFocused = useIsFocused();

  const {t, i18n} = useTranslation();
  const [Loader,setLoader] = useState(false);
  const [LocalStorage, setLocalStorage] = useState(null);
  const [paysLivraison, setPaysLivraison] = useState('');
  const [Remises, setRemises] = useState([]);
  const [RemiseValue, setRemiseValue] = useState(0);
  const [RemiseProduct, setRemiseProduct] = useState(null);
  const [RemiseCode, setRemiseCode] = useState('');
  const [CartProducts, setCartProducts] = useState([]);
  const [RemiseLoader, setRemiseLoader] = useState(true);
  const [Service, setService] = useState(null);
  const [paysLivraisonObject, setPaysLivraisonObject] = useState(null);
  const [BasketClasseRegroupement, setBasketClasseRegroupement] = useState('');
  const [Language, setLanguage] = useState('fr');
  const [couponShow, setCouponShow] = useState(false);


  
  useEffect(() => {
 
    // Pour eviter un probleme de memoire, il faut ajouter un cleanup
    let mounted = true;
 
    setLoader(true);
    setRemiseLoader(true);
    setCartProducts([]);

    async function fetchValue() {
      try {

        // Language
        const currentLanguage = await getPlatformLanguage();
        setLanguage(currentLanguage);


        // Information de connexion
        const userEmail = await getAuthUserEmail();

        setLocalStorage(userEmail);
 
        if (null === userEmail)
        {
          setLoader(false);
          setRemiseLoader(false);

          props.navigation.navigate("Login", {fromCart: 'cart'});
          return;
        }

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
          props.navigation.navigate(Navigationstrings.SelectService);
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

  }, [isFocused]);


  // Vider le panier
  const DeleteBasket = useCallback( async() => { 

    setLoader(true);

    setCartProducts([]);

    await removePanier();

    Toast.show({
      type: 'success',
      text1: t('Suppression'),
      text2: t('Le panier a été vidé'),
    });

    setLoader(false);
  },[]);
  

  // Reduire ou augmenter la quantité
  const func = async( item, operation) => {

    let quantity = item.quantite;

    if (quantity)
    {
      quantity = 'increment' === operation ? (quantity + 1) : (quantity - 1);

      if (quantity == 0)
      {
        quantity = 1;
      }
      else if (quantity > item.quantiteMax)
      {
        quantity = quantity - 1;
      }
      else 
      {
        saveProductNewQuantity(item, quantity);
      }
    }
  }


  // Aller au dépot
  async function navigateToDepotMethod() {

    // Sauvegarder les elements du panier
    await saveValidatedPanier(RemiseCode, RemiseValue, RemiseProduct);


    // Si c'est un produit de vente privées ou demande d'achat, il faut aller à la livraison
    if ('ventes-privees' == Service.code || 'demandes-d-achat' == Service.code)
    {
      props.navigation.navigate('Livraison1');

      return;// should not be reached
    }

    props.navigation.navigate('DepotScreen1');
  };


  // Verifier la remise
  const handleChangeRemise = (item) => {

    let found = false;
    Remises.map( function (remise) {
      if (remise.code.toLowerCase() == item.toLowerCase())
      {
        // le produit n'est pas vide
        if (remise.produit)
        {
          CartProducts.forEach(function (produit)
          {
            if (produit.ProductId == remise.produit.id)
            {
              found = true;
              setRemiseValue(remise.valeur);
              setRemiseCode(item);
              setRemiseProduct(produit.ProductId);
            }
          });
        }
        else 
        {
          found = true;
          setRemiseValue(remise.valeur);
          setRemiseCode(item);
          setRemiseProduct('');
        }

      }
    });

    if (!found)
    {
      setRemiseValue(0);
      setRemiseCode('');
      setRemiseProduct('');
    }
  };

  // Sauvegarder la nouvelle quantité
  const saveProductNewQuantity = async (item, quantity) => {

    var newData = CartProducts.filter(ls => {
   
      if (ls.ID == item.ID) {
        ls.quantite = quantity;
      }

      return ls
    });

    setCartProducts(newData);

    await savePanier(newData);
  };

 
  // Supprimer un produit
  async function removeProductFromCart(item){
  
    var newData = CartProducts.filter(ls => {
   
      if (ls.ID != item.ID) {
        return ls
      }
    });

    setCartProducts(newData);

    await savePanier(newData);
  
    Toast.show({
      type: 'success',
      text1: t('Succès'),
      text2: t('Produit supprimé du panier'),
    });
  };

  // Afficher les attributs (dans le cas de vente privée et demande d'achat)
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
        Etat : {('Used' == product.StateValue ? t('Occasion') : t('Neuf') )} {product.ProductValue ? (' - ' + t('Valeur') + ' : ' + product.ProductValue) : ''}
      </Text>
    
    );
  }


  // Afficher le produit
  const RenderItem = ({item}) => {

    let prix = parseFloat(item.Price);
    prix = isNaN(prix) ? 0 : prix;

    let quantite = parseInt(item.quantite);
    quantite = isNaN(quantite) ? 0 : quantite;

    let totalPrice = prix * quantite;

    return (
      <View style={{backgroundColor: "#fff",paddingVertical: 12, marginBottom: 16, borderRadius: 18}}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20, width: windowWidth * 0.85, alignSelf: "center"}}>

                <View>
                 {
                      item.ProductImage ? 
                      (
                      <Image
                        source={{uri: item.ProductImage[0].url}}
                        resizeMode="contain"
                        style={{width: wp(18), height: wp(28),}}
                      /> ) : <Text></Text>
                    }
               
                  </View>
            <View>
              <View style={{flexDirection: "row",justifyContent: "space-between" ,alignItems: "flex-start", gap: wp(10)}}>

                  <View>
                      <Text style={{ fontSize: 12,textAlign: "left",maxWidth: 180,fontFamily: "Poppins-Regular", color: "#000"}}>                            
                      {'fr' == Language ? item.product.name : item.product.nameEN}                           
                      </Text>                         
                    </View>    

                    <TouchableOpacity
                      onPress={() => {
                        removeProductFromCart(item);
                      }}
                    >
                          <Feather name="trash-2" color="#E10303" size={25}/>
                      </TouchableOpacity>
                  </View>
                  <View style={{marginTop: 8}}>
                     <RenderAttribute service={Service} product={item} />
                  </View>
                  <View style={{flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12}}>
                    <ButtonPrix title={totalPrice}/>
                      <View style={{flexDirection: "row", alignItems: "center",justifyContent: "center" ,gap: 25, backgroundColor:"#EFEFEF", borderRadius: 18, width: windowWidth * .35, paddingVertical: 5}}>
                        <TouchableOpacity
                          onPress={() => {
                            func(item, "decrement");
                          }}>
                             <Feather name="minus" color="#000" size={25}/>
                        </TouchableOpacity>

                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                          <Text style={{fontFamily: "Poppind-Regular", color: "#343434", fontSize: 20}}>{ item.quantite }</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            func(item, "increment");
                          }}>
                             <Feather name="plus" color="#000" size={22}/>
                        </TouchableOpacity>
                    
                      </View>
                  </View>
        

                </View>
              
        </View>
   </View>
    );
  };


  // Afficher le total
  const RenderTotal = ({data, type}) => {

    let prices = calculProductPrices(data, RemiseValue, RemiseProduct);
    console.log("Prices :", prices);

    return (
      
      <View style={{marginTop: 25, justifyContent: "center", alignItems: "center", width: windowWidth * 0.9, alignSelf: "center"}}>

        {'demandes-d-achat' != Service.code ?
          (
            <>
            <View style={{paddingHorizontal: 48}}>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                   <Text style={{color: "#000", fontSize: wp(3.5),fontFamily: "Poppins-SemiBold", letterSpacing: 0.3}}>Sub Total:</Text>
<<<<<<< HEAD
                   <Text style={{color: "#000", fontSize: wp(3.4),fontFamily: "Poppins-SemiBold", letterSpacing: 0.3}}>{ prices.totalPrix.toFixed(2) } €</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: wp(1)}}>
                    <Text style={{color: "#000", fontSize: wp(3.5),fontFamily: "Poppins-Medium", letterSpacing: 0.3}}>{t('fais douane')}:</Text>
                    <Text style={{color: "#000", fontSize: wp(3.4),fontFamily: "Poppins-Regular", letterSpacing: 0.3}}>{'ventes-privees' == Service.code ? t('Offert') : (prices.sommeFraisDouane + '€') }</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: wp(4.5), backgroundColor: "#fff", borderRadius: 15}}>
                   <TextInput 
                     placeholder={t('Saisir le code')}
                     placeholderTextColor="#666"
                     value={RemiseCode}
                     onChangeText={remisetext => setRemiseCode(remisetext)}
                    // defaultValue={RemiseCode}
                    // onEndEditing={(item) => handleChangeRemise(item.nativeEvent.text)}
                     style={{padding: 0, paddingLeft: 19, width: 200, color: "#000"}}
                   />
                   <Button title={t('Appliquer remise')} navigation={() => {handleChangeRemise(RemiseCode); setCouponShow(!couponShow)}}/>
=======
                   <Text style={{color: "#000", fontSize: wp(3.4),fontFamily: "Poppins-SemiBold", letterSpacing: 0.3}}>{ prices.totalPrixAvecDouaneRemiseAvoir } €</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: wp(4.5), backgroundColor: "#fff", borderRadius: 15}}>
                   <TextInput 
                     placeholder='FD248AK268'
                     placeholderTextColor="#666"
                     style={{padding: 0, paddingLeft: 19, width: 200, color: "#000"}}
                   />
                   <Button title={t('Appliquer Coupon')} navigation={() => setCouponShow(!couponShow)}/>
                </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: wp(8)}}>
                    <Text style={{color: "#000", fontSize: wp(4.1),fontFamily: "Poppins-Medium", letterSpacing: 0.3}}>{t('fais douane')}:</Text>
                    <Text style={{color: "#000", fontSize: wp(3.8),fontFamily: "Poppins-Regular", letterSpacing: 0.3}}>{'ventes-privees' == Service.code ? t('Offert') : (prices.sommeFraisDouane + '€') }</Text>
>>>>>>> 795ac6a480649a7e3d043d53d80f07c23883605a
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: wp(4), width: windowWidth * 0.8,}}>
                  <Text style={{fontSize: wp(4.1), fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.4}}>{t('Montant total')} :</Text>
                  <Text style={{fontSize: wp(3.8), fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.3}}>
                    { prices.totalPrix.toFixed(2) } €
                  </Text>
              </View>
                <View style={!couponShow ? {display: "none"} : {display: "flex"} }>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingHorizontal: 10, paddingVertical: 4 ,marginTop: 13, backgroundColor: "#fff", borderRadius: 15}}>
                      <View style={{flexDirection: "row", alignItems: "center", gap: 13}}>
                          <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.3}}>
                            {RemiseCode}
                          </Text>
                          {/* <TouchableOpacity>
                            <Feather name="edit" color='#000' size={15}/>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Feather name="trash-2" color='#E10303' size={15}/>
                          </TouchableOpacity> */}
                      </View>

                      <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#01962A", letterSpacing: 0.3}}>
                        coupon appliqué
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: 5}}>
                          <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.4}}>
                            coupon appliqué
                          </Text>

                      <Text style={{fontSize: 12, fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.3}}>
                          {prices.remiseTotal}€
                      </Text>
                    </View>
                 </View>
            </View>
            </>
          )
          :
          <></>
        }
        

        {
          'ventes-privees' == Service.code ?
          (
            <View style={styles.secondContainer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>{t('frais transit')} </Text>
                <Text style={styles.totalText}>{t('Offert')}</Text>
              </View>
            </View>
          )
          :
          <></>
        }
        

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: wp(4), width: windowWidth * 0.8,}}>
<<<<<<< HEAD
            <Text style={{fontSize: wp(4.1), fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.4}}>{t('Total')} :</Text>
=======
            <Text style={{fontSize: wp(4.1), fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.4}}>{t('Montant total')} :</Text>
>>>>>>> 795ac6a480649a7e3d043d53d80f07c23883605a
            <Text style={{fontSize: wp(3.8), fontFamily: "Poppins-Regular", color: "#000", letterSpacing: 0.3}}>
              { prices.totalPrixAvecDouaneRemiseAvoir } €
            </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",marginTop: wp(5.6)}}>
<<<<<<< HEAD
                   <Button title={t("Valider")} navigation={() => navigateToDepotMethod()} width={wp(45)}/>
=======
                   <Button title="checkout" navigation={() => navigateToDepotMethod()} width={wp(45)}/>
>>>>>>> 795ac6a480649a7e3d043d53d80f07c23883605a
          </View> 
      </View>
    );
  };

  if (Loader || RemiseLoader)
  {
    return (<View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>);
  }

  if (!Service)
  {
    return (
      <View style={{ backgroundColor:'#fff',height:'100%' }}>
        <ScrollView>
           <HeaderEarth />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View >
              <ActivityIndicator size={'large'} color="#3292E0" />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (null === LocalStorage || CartProducts.length < 1)
  {
    return (
      <View style={{height:'100%' }}>
        <ScrollView>

          <ServiceHeader 
            navigation={props.navigation}
            service={Service}
            paysLivraison={paysLivraison}
            language={Language}
          />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View >
              <View style={styles.panierVide}>
              <Text style={styles.WeightCalText}>
                {t('Panier vide')}
              </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{height:'100%' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1,marginBottom: 70}}>
            <ServiceHeader 
              navigation={props.navigation}
              service={Service}
              paysLivraison={paysLivraison}
              language={Language}
            />

            <Stepper position={0}/>


            <View style={{marginTop: 32}}>

            {
              CartProducts.length > 0  ?
              (<><FlatList
                  showsVerticalScrollIndicator={false}
                  data={CartProducts}
                  renderItem={({ item }) => <RenderItem item={item}/>}
                  keyExtractor={item => item.ID}
              />
              <RenderTotal data={CartProducts} /></>)
              
              :
              <></>
            }

            
          </View>

          </View>
        
         {/* <HeaderEarth /> */}

      </ScrollView>
    </View>
  );
}


export default CartScreen