import React, { useState, useEffect} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
    Modal
  } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import _ from "lodash";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Icon  from 'react-native-vector-icons/FontAwesome';
import { getAuthUserEmail, getPanier, removePanier, savePanier } from '../../modules/GestionStorage';
import { HeaderEarth } from '../../components/Header';
import PhotoZoomer from "../../components/PhotoZoomer"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Ionicons from "react-native-vector-icons/Ionicons"
import Octicons from "react-native-vector-icons/Octicons"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../../components/Button';

const ProductList = ({ navigation }) => {
    const { params } = useRoute();
    const [activeFilter, setActiveFilter] = useState(0);
    const category = params?.category;
    const PaysLivraison = params?.PaysLivraison;
    const Service = params?.Service;
    const Language = params?.Language;
    const products = category.products || [];


    const [selectedProductValues, setSelectedProductValues] = useState({});
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedStock, setSelectedStock] = useState([]);
    const [isSuccess, setIsSuccess] = useState(true);

    const [active, setActive] = useState(0);

    const [minPrices, setMinPrices] = useState({});
    const [minQuantities, setMinQuantities] = useState({});
    const [Quantities, setQuantities] = useState({});
    const [Prices, setPrices] = useState({});

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    

    useEffect(() => {
        const newMinPrices = {};
        const newMinQuantities = {};
        const newPrices = {};
        const newSelectedProductValues = {};
      
    
        products.forEach((product) => {

          let minPrice = null;
          let minQuantity = null;

          // Stock
          product.stocks.forEach((stock) => {

            let quantity = parseInt(stock.stock);
            quantity = isNaN(quantity) ? 1 : quantity;
            
            let currentPrice = parseFloat(stock.prix);
            currentPrice = isNaN(currentPrice) ? 0 : currentPrice;

     
            if (!minPrice || currentPrice< minPrice) {
              minPrice = currentPrice;
            }

            if (!minQuantity || (quantity != 0 && quantity < minQuantity)) {
                minQuantity = quantity;
            }
          });


          // Stock specifique
          let stockSpecifiques = product.stockSpecifiques ? product.stockSpecifiques : [];

          stockSpecifiques.forEach((stock) => {

            let quantity = parseInt(stock.stockSpecifique);
            quantity = isNaN(quantity) ? 1 : quantity;
            
            let currentPrice = parseFloat(stock.prix);
            currentPrice = isNaN(currentPrice) ? 0 : currentPrice;

     
            if (!minPrice || currentPrice < minPrice) {
              minPrice = currentPrice;
            }

            if (!minQuantity || (quantity != 0 && quantity < minQuantity)) {
                minQuantity = quantity;
            }
          });

          newMinPrices[product.id] = minPrice;
          newMinQuantities[product.id] = minQuantity;
          newPrices[product.id] = null;

          newSelectedProductValues[product.id] = {
            attributes: {},
            quantite: null,
            prix: null
          }
        });

        setMinPrices(newMinPrices);
        setMinQuantities(newMinQuantities);
        setPrices(newPrices);
        setSelectedProductValues(newSelectedProductValues);

        console.log('newSelectedProductValues', newSelectedProductValues)
    }, []);


    // Gestion panier
    const handleCartLogin = async (product) => {
      const data = selectedProductValues[product.id];
      const numberAttributes = product.attributs ? product.attributs.length : 0 ;
      const keys = Object.keys(data['attributes']);
      const quantite = selectedProductValues[product.id]['quantite'];

      if (keys.length != numberAttributes)
      {
        Toast.show({
          type: 'error',
          text1: 'Attribut',
          text2: "Vous devez selectionner tous les attributs du produit",
        });

        return;
      }

      if (!quantite)
      {
        Toast.show({
          type: 'error',
          text1: 'Quantité',
          text2: "La quantité est obligatoire",
        });

        return;
      }


      try {

        let basketData = await getPanier();
  
        let cartHasProductFromAnotherService = false;
  
        basketData.map(ls => {
          if (ls.Service != Service || ls.ShipCountry != PaysLivraison.id) 
          {
            cartHasProductFromAnotherService = true;
          }
        });
  

        // Verifier les produits avec une classe de regroupement
        let cartHasProductFromAnotherClasseRegroupement = false;
        let currentProductClasseRegroupement = product.classeRegroupement;
  
        
        if (currentProductClasseRegroupement && currentProductClasseRegroupement.length == 1)
        {
          basketData.map(ls => {
            let classeRegroupements = ls.classeRegroupement;
  
            if (classeRegroupements && classeRegroupements.length == 1)
            {
              if (classeRegroupements[0].type != currentProductClasseRegroupement[0].type)
              {
                cartHasProductFromAnotherClasseRegroupement = true;
              }
            }
          });
        }
        
  
        if (cartHasProductFromAnotherService)
        {
          return Alert.alert(
            'Information',
            'Votre panier contient des produits d\'un autre service (ou pays de départ ou pays de destination). Vous perdrez votre panier si vous continuez. Voulez-vous continuer ?',
            [
              {
                text: 'Non',
                style: 'cancel',
              },
              {
                text: 'Oui',
                onPress: () => {
                  handleCartRemove(product);
                  return;
                },
              },
            ],
          );
        }
  
        if (cartHasProductFromAnotherClasseRegroupement)
        {
          return Alert.alert(
            'Information',
            'Votre panier contient des produits d\'un autre type de livraison. Vous perdrez votre panier si vous continuez. Voulez-vous continuer ?',
            [
              {
                text: 'Non',
                style: 'cancel',
              },
              {
                text: 'Oui',
                onPress: () => {
                  handleCartRemove(product);
                  return;
                },
              },
            ],
          );
        }
  
        const authStatus = await getAuthUserEmail();
  
        let reponse = handleCart(product);
  
        reponse.then((response) => {
          if (isSuccess)
          {
            // Not Login
            if (authStatus === null) 
            {
              console.log("Success");
              navigation.navigate("Login", {fromCart: 'cart'});
              return; //should never reach
            } 
          }
        })
      } 
      catch (e) {
        console.log('error', e)
      }
    };
  
    // Ajouter au panier
    const handleCart = async (product) => {

      const data = selectedProductValues[product.id];
     
      const quantite = selectedProductValues[product.id]['quantite'];
  
      let CatProducts = [];

   
      let match = false;
      const obj = {
          ID: (Math.random() + 1).toString(36).substring(7),
          product: product,
          ProductId: product.id,
          discount: product.discount,
          quantiteMax: Quantities[product.id],
          quantite: quantite,
          service: Service,
          paysLivraison: PaysLivraison,
          Price: Prices[product.id],
          attributes: data ? data.attributes : null,
      };

      CatProducts.push(obj);
  
      let basketData = await getPanier();

      
      if (basketData.length == 0)
      {
        await savePanier(CatProducts);
  
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Ajouter au panier avec succès',
        });
  
        return true;
      }
  
      basketData.map(ls => {
        if (ls.product.name === obj.product.name && ls.service === obj.service) {
          match = true;
        }
      });
  
  
      if (match === true) 
      {
        Toast.show({
          type: 'error',
          text1: 'Il y a un problème !',
          text2: 'Ce produit a déjà été ajouté',
        });
  
        setIsSuccess(false);
  
        return false;
      } 
  
      basketData.push(obj);
                
      await savePanier(basketData);
  
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Ajouter au panier avec succès',
      });
  
      return true;
    };

    // Vider le panier et ajouter les elements
    const handleCartRemove = async (product) => {

          await removePanier();
      
          const authStatus = await getAuthUserEmail();
      
          let reponse = handleCart(product);
      
          reponse.then((response) => {
            if (isSuccess)
            {
              // Not Login
              if (authStatus === null) 
              {
                navigation.navigate('Login', {fromCart: 'cart'});
                return; //should never reach
              } 
            }
          })
          
    }

  
    // Bouton retour
    const handleReturnPress = () => {
      navigation.goBack();
    };


    // Gestion du scroll
    const Change = nativeEvent => {
        const slide = Math.ceil(
          nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
        );
        if (slide !== active) {
          setActive(slide);
        }
    };

    // Ajouter l'attribut
    const handleAttributeChange = (product, attributeId, value) => {
        
        const newSelectedAttributes = { ...selectedAttributes, [attributeId]: value };
        setSelectedAttributes(newSelectedAttributes);

        const matchingStocks = findMatchingStock(product, newSelectedAttributes);
        setSelectedStock(matchingStocks);

        selectedProductValues[product.id]['attributes'][attributeId] = value;
        setSelectedProductValues(selectedProductValues); 
    };


    // Verifier le stock
    const findMatchingStock = (product, attributes) => {

      if (Object.keys(attributes).length == product.attributs.length)
      {
        // Vérifier la disponibilité dans le stock
        const selectedCombination = Object.values(attributes).join(', ');


        let matchFound = false;

        let stockSpecifiques = product.stockSpecifiques ? product.stockSpecifiques : [];

        stockSpecifiques.forEach((stock) => {
          if (!matchFound && stock.combinaison == selectedCombination)
          {
            matchFound = true;

            const newSelectedQuan = { ...Quantities, [product.id]: stock.stock };
            setQuantities(newSelectedQuan);

            const newPrices = { ...Prices, [product.id]: stock.prix };
            setPrices(newPrices);
          }
        });

        if (!matchFound)
        {
          product.stocks.forEach((stock) => {
            if (!matchFound && stock.combinaison == selectedCombination)
            {
              matchFound = true;

              const newSelectedQuan = { ...Quantities, [product.id]: stock.stockSpecifique };
              setQuantities(newSelectedQuan);

              const newPrices = { ...Prices, [product.id]: stock.prix };
              setPrices(newPrices);
            }
          });  
        }

        if (!matchFound) {
          Toast.show({
            type: 'error',
            text1: 'Stock !',
            text2: 'Rupture de stock',
          });
        }
      }
    };


    // Sauvegarder la quantité
    const handleQuantiteChange = (product, quantite) => {

      let productId = product.id;

      selectedProductValues[productId]['quantite'] = quantite;

      setSelectedProductValues(selectedProductValues);
    };


    // Afficher la quantité
    const RenderQuantite = props => {

      let product = props.product;
      let productId = props.product.id;

      let minQuantite = minQuantities[productId] ?? null;

      let quantite = Quantities[productId];

      let attributeCount = product.attributs.length;

      if (attributeCount > 0)
      {
        if (!minQuantite && !quantite)
        {
          return (
            <View style={styles.safeContainerStyle}>
              <Text style={{ color: 'red' }}>Rupture de stock</Text>
            </View>
          );
        }
      }

      if (!minQuantite)
      {
        return (
          <View style={styles.safeContainerStyle}>
            <Text style={{ color: 'red' }}>Rupture de stock</Text>
          </View>
        );
      }

      let quantiteMax = quantite ? parseInt(quantite) : parseInt(minQuantite);

      let sweeterArray = [];
      for (let i = 1; i < (quantiteMax + 1); i++)
      {
        sweeterArray.push({label: i, value: i})
      }

      const quantiteSelectedValue = selectedProductValues[productId] ? selectedProductValues[productId]['quantite'] : null;
      
  
      return (
        <View style={styles.safeContainerStyle} key={'quantite' + productId}>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            autoScroll
            iconStyle={styles.iconStyle}
            containerStyle={styles.containerStyle}
            labelField="label"
            valueField="value"
            value={quantiteSelectedValue}
            placeholder={'Quantité'}
            searchPlaceholder="Search..."
            showsVerticalScrollIndicator={false}
            data={sweeterArray}
            onChange={item => {
              handleQuantiteChange(product, item.value);
            }} 
          />
        </View>
      );
    }

    // Afficher la description
    const RenderLivraisonAndDescriptionLink = props => {

      const product = props.product;
     
      const specificites = product.productSpecificites[0]; // On retournera tjr une specificité par pays

      const image = 'fr' == Language ? product.imageDescription : product.imageDescriptionEN;
      
      if (!image)
      {
        return (
          <View>
            <Text>{specificites.livraison ? ('fr' == Language ? specificites.livraison.delai : specificites.livraison.delaiEN ) : '' }</Text>
          </View>
        );
      }

      return (

        <>
          <View>
            <Text>{specificites.livraison ? ('fr' == Language ? specificites.livraison.delai : specificites.livraison.delaiEN ) : '' }</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => {
              setSelectedProduct(product);
              setModalVisible(true);
            }}>
              <Text style={{ color: 'blue' }}>{'Voir plus'}</Text>
            </TouchableOpacity>
          </View>
          
        </>
      );
    }
    
    // Afficher la description du produit
    const RenderProductDescription = props => {

      const product = props.product;
      const isPdf = 'fr' == Language ? product.imageDescription.endsWith('.pdf') : product.imageDescriptionEN.endsWith('.pdf');
      const source = {
        uri: 'fr' == Language ? product.imageDescription : product.imageDescriptionEN,
      };

      if (isPdf)
      {
        return (
          <PDFView
          style={{ flex: 1, width: '100%', height: '100%' }}
          resource={source.uri}
          resourceType="url"
          onLoad={() => console.log('PDF chargé')}
          onError={(error) => console.log('Erreur de chargement du PDF', error)}
          />
        );
        
      }

      return (
        <Image
            key={index}
            source={{uri: 'fr' == Language ? product.imageDescription : product.imageDescriptionEN}}
            style={{
            width: windowWidth * 0.4,
            height: windowHeight * 0.25,
            borderRadius: 10,
            }}
            resizeMode={'contain'}
        />
      );
    }


    // Afficher le prix
    const RenderPrices = props => {

      const product = props.product;

      const price = Prices[product.id];

      const minPrice = minPrices[product.id];

      if (!price && !minPrice)
      {
        return (<></>);
      }

      if (price)
      {
        return (
          price + '€' + ( product.unite ? (' / ' + product.unite.valeur) : '' )
        );
      }

      return (
        'A partir de' + ' ' + minPrice + '€' + ( product.unite ? (' / ' + product.unite.valeur) : '' )
      );
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>

          <HeaderEarth />
            <View style={styles.containerMarginBottom}>

            {/* <View style={styles.returnButtonContainerFilter}>
              <TouchableOpacity onPress={handleReturnPress}>
                <Button
                        title={"Retourner"}
                        onPress={handleReturnPress}
                    />
              </TouchableOpacity>
            </View> */}

             <View style={{marginTop: 10, paddingHorizontal: 5}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",borderTopLeftRadius: 28, borderTopRightRadius: 28 ,backgroundColor: "#fff", paddingVertical: 27, paddingLeft: 15, paddingRight: 23}}>
                      
                      <View style={{flexDirection:"row", alignItems: "center", gap: 10}}>
                      <TouchableOpacity style={{flexDirection:"row", alignItems: "center", gap: 8}} activeOpacity={0.5}>
                        <Text style={{fontFamily: "Poppins-Medium", fontSize: 13, color: "#376AED" }}>
                          Filtrer
                        </Text>
                        <MaterialIcons name="arrow-drop-down" color="#376AED" size={25}/>
                      </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:"row", alignItems: "center", gap: 8}} activeOpacity={0.5}>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: 13, color: "#376AED" }}>
                            Trier
                          </Text>
                          <MaterialIcons name="arrow-drop-down" color="#376AED" size={25}/>
                        </TouchableOpacity>
                      </View>

                      <View style={{flexDirection:"row", alignItems: "center", gap: 10}}>
                      {
                                  activeFilter === 0 
                                  ?
                                  <TouchableOpacity onPress={() => setActiveFilter(1)}>
                                      <Ionicons name="grid-outline" color="#00000033" size={25}/>
                                  </TouchableOpacity> 
                                  :
                                  <TouchableOpacity onPress={() => setActiveFilter(0)}>
                                      <Ionicons name="grid-outline" color="#376AED" size={25}/>
                                  </TouchableOpacity> 
                                }
                                {
                                  activeFilter === 1 
                                  ?
                                  <TouchableOpacity onPress={() => setActiveFilter(0)}>
                                      <Octicons name="list-unordered" color="#00000033" size={25}/>
                                  </TouchableOpacity> 
                                  :
                                  <TouchableOpacity onPress={() => setActiveFilter(1)}>
                                      <Octicons name="list-unordered" color="#376AED" size={25}/>
                                  </TouchableOpacity> 
                                }
                      </View>

                      
                    </View>
             </View>



            {products.map((product) => (
            // <View style={styles.DetailsContainer} key={product.id}>
            //     <View style={styles.upperRow}>
            //         <View style={styles.detailTextContainer}>
            //             <Text style={styles.detailNameText}>
            //                 { 'fr' == Language ? product.name : product.nameEN}
            //             </Text>
            //             <Text style={styles.discountPriceText}>
            //               <RenderPrices product={product} />
            //             </Text>
            //         </View>
            //     </View>
            //     <View style={styles.downRow}>
            //         <View style={styles.dropDowncontainer}>
            //         <ScrollView
            //             pagingEnabled
            //             horizontal
            //             onScroll={({nativeEvent}) => Change(nativeEvent)}
            //             showsHorizontalScrollIndicator={false}

            //             style={styles.imageSwiper}>
            //             {product.productImages.map((image, index) => (
            //                <PhotoZoomer key={index} image={image} windowWidth={windowWidth} windowHeight={windowHeight} />
            //             ))}
            //         </ScrollView>
            //         <View style={styles.dotStyle}>
            //             {product.productImages.map((i, k) => (
            //             <Text
            //                 key={k}
            //                 style={
            //                 k == active ? styles.pagingActiveText : styles.pagingText
            //                 }>
            //                 ⬤
            //             </Text>
            //             ))}
            //         </View>
            //         <TouchableOpacity style={styles.buttonCartContainers} onPress={() => {
            //           handleCartLogin(product);
            //         }}>
            //             <Text style={styles.buttonText} >Ajouter au panier</Text>
            //         </TouchableOpacity>
            //         </View>
            //         <View style={styles.dropDownscontainer}>

            //         {product.attributs.map((attribute) => {
            
            //           const prevChoice = selectedProductValues[product.id] ? selectedProductValues[product.id]['attributes'] : null;
            //           const selectedValue = prevChoice ? prevChoice[attribute.attribut.id] : null
                     
            //           const buildAttributes = attribute.attributValues.map(obj => {
            //             return {label: obj.valeur, value: obj.valeur};
            //           });

                     
            //           return (

            //             <View style={styles.safeContainerStyle} key={attribute.id}>
            //               <Dropdown
            //                 style={[styles.dropdown]}
            //                 placeholderStyle={styles.placeholderStyle}
            //                 selectedTextStyle={styles.selectedTextStyle}
            //                 autoScroll
            //                 iconStyle={styles.iconStyle}
            //                 containerStyle={styles.containerStyle}
            //                 labelField="label"
            //                 valueField="value"
            //                 value={selectedValue}
            //                 placeholder={'fr' == Language ? attribute.attribut.name : attribute.attribut.nameEN}
            //                 searchPlaceholder="Search..."
            //                 showsVerticalScrollIndicator={false}
            //                 data={buildAttributes}
            //                 onChange={item => {
            //                   handleAttributeChange(product, attribute.attribut.id, item.value);
            //                 }} 
            //               />
            //             </View>
            //           );
            //         })}

            //         <RenderQuantite product={product} />

            //         </View>

                    
            //     </View>

            //     <View style={styles.descrContainer}>
            //       <RenderLivraisonAndDescriptionLink product={product} />
            //     </View>

            //     </View>
            <View style={{ backgroundColor: "#fff", margin: 5}}>
            <View style={{flexDirection: "row", alignItems: "center",gap: 10, paddingVertical: 12, paddingLeft: 22}}>
              <View>
              <ScrollView
                  pagingEnabled
                  horizontal
                  onScroll={({nativeEvent}) => Change(nativeEvent)}
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageSwiper}>
                  {product.productImages.map((image, index) => (
                    
                    <PhotoZoomer key={index} image={image} windowWidth={wp(39)} windowHeight={hp(30)} />
                  ))}
                </ScrollView>
                <View style={styles.dotStyle}>
                  {product.productImages.map((i, k) => (
                    <Text
                      key={k}
                      style={
                        k == active ? styles.pagingActiveText : styles.pagingText
                      }>
                      ⬤
                    </Text>
                  ))}
                </View>
              </View>
                <View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
                    <View style={{paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, justifyContent: "center", alignItems: "center", maxWidth: 250}}>
                      <Text style={{fontFamily: "Poppins-Medium", fontSize: 12.5,textAlign: "center", maxWidth: 180}}>{'fr' == Language ? product.name : product.nameEN}</Text>
                    </View>
      
                    <Text style={{fontSize: 13, fontFamily: "Poppins-Medium",color: "#000"}}>
                        <RenderPrices product={product}/>
                    </Text>
                      <View style={{marginVertical: 20}}>
                        {product.attributs.map((attribute) => {
                
                          const prevChoice = selectedProductValues[product.id] ? selectedProductValues[product.id]['attributes'] : null;
                          const selectedValue = prevChoice ? prevChoice[attribute.attribut.id] : null
                        
                          const buildAttributes = attribute.attributValues.map(obj => {
                            return {label: obj.valeur, value: obj.valeur};
                          });

                        
                          return (

                            <View style={[styles.safeContainerStyle, {marginBottom: 10}]} key={attribute.id}>
                              <DropDownPicker
                                style={[styles.dropdown, {borderColor: "transparent"}]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                autoScroll
                                iconStyle={styles.iconStyle}
                                containerStyle={styles.containerStyle}
                                labelField="label"
                                valueField="value"
                                value={selectedValue}
                                placeholder={'fr' == Language ? attribute.attribut.name : attribute.attribut.nameEN}
                                searchPlaceholder="Search..."
                                showsVerticalScrollIndicator={false}
                                data={buildAttributes}
                                onChange={item => {
                                  handleAttributeChange(product, attribute.attribut.id, item.value);
                                }} 
                              />
                            </View>
                          );
                        })}
                      </View>
      
                      <RenderQuantite product={product} />

                      <View style={{marginTop: 8, width: "100%", position: "relative", zIndex: -10}}>
                        <Button title="Ajouter au panier" navigation={() => handleCartLogin()}/>
                     </View>
                </View>
              </View>
          </View>
            ))}

          {selectedProduct && (
            <Modal visible={modalVisible} animationType="slide">
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ color: 'blue' }}>{'Fermer'}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <RenderProductDescription product={selectedProduct} />
                </View>
              </View>
            </Modal>
          )}

            </View>
        </ScrollView>

      
    );
  };


  const styles = StyleSheet.create({
    DetailsContainer: {
      backgroundColor: '#F4F6F8',
      width: windowWidth * 0.95,
      height: windowHeight * 0.6,
      marginTop: windowHeight * 0.03,
      borderRadius: 28,
      elevation: 1,
    },
    descrContainer: {
      textAlign: 'justify',
      padding: windowWidth * 0.02
    },
    safeContainerStyle: {
      justifyContent: 'center',
      // backgroundColor: 'tomato',
      width: windowWidth * 0.4,
      // borderRadius:0
      
    },
    subTabbarContainerFilter: {

      height: windowHeight * 0.055,
      width: windowWidth * 0.95,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      alignSelf: 'center',
      elevation: 5,
      justifyContent: 'center',
    
    },
    returnButtonContainerFilter: {

      height: windowHeight * 0.055,
      width: windowWidth * 0.95,
      flexDirection: 'row',
      alignItems: 'flex-start',
      margin: 10,
      alignSelf: 'flex-start',
      elevation: 5,
      justifyContent: 'flex-start',
    
    },
    filterTextContainer: {
      flexDirection: 'row',
      height: windowHeight * 0.035,
      alignItems: 'center',
      justifyContent: 'space-around',
      width: windowWidth * 0.15,
      backgroundColor: '#fff', 
      elevation: 3, 
      borderRadius: 5,
      margin:windowWidth * 0.01,
    },
    filterTextStyle: {
      fontFamily: 'Roboto-Regular',
      fontSize: 10,
      color: '#000',
      width: windowWidth * 0.2,
      height: windowHeight * 0.035,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
     
    },
    containerMarginBottom: {
      marginBottom: windowHeight * 0.3
    },
    upperRow: {
      // backgroundColor: 'green',
      flexDirection: 'row',
      height: windowHeight * 0.1,
      width: windowWidth * 0.95,
      alignItems: 'center',
      justifyContent: 'space-around',
      marginTop: windowHeight * 0.03,
    },
    detailTextContainer: {
      // backgroundColor: 'tomato',
      height: windowHeight * 0.08,
      width: windowWidth * 0.8,
      alignItems: 'flex-start',
      justifyContent: 'space-around',
    },
    detailNameText: {
      color: '#000',
      fontFamily: 'Roboto-Regular',
      fontSize: 14,
      // backgroundColor: 'tomato',
      margin: 2,
      width: windowWidth * 0.6,
    },
    discountPriceText: {
      color: '#000',
      fontFamily: 'Roboto-Regular',
      fontSize: 13,
      // backgroundColor: 'tomato',
      margin: 2,
    },
    priceText: {
      color: '#000',
      fontFamily: 'Roboto-Regular',
      fontSize: 13,
      textDecorationLine: 'line-through',
    },
  
    counterTExt: {
      fontSize: 30,
      color: '#000',
    },
    counterButton: {
      width: 50,
      height: 50,
      borderRadius: 100,
      backgroundColor: '#DFE8F2',
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    counterButtonText: {
      color: '#A1B0C1',
      fontSize: 20,
    },
    downRow: {
      // backgroundColor: 'tomato',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: windowWidth * 0.9,
      height: windowHeight * 0.35,
      alignSelf: 'center',
    },
    dropDowncontainer: {
      // backgroundColor: 'green',
      width: windowWidth * 0.4,
      height: windowHeight * 0.33,
    },
    imageSwiper: {
      // backgroundColor: 'gold',
      width: windowWidth * 0.4,
      height: windowHeight * 0.25,
      borderRadius: 10,
    },
    dotStyle: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: windowHeight * 0.09,
      alignSelf: 'center',
      justifyContent: 'space-around',
      // backgroundColor: 'tomato',
      width: windowWidth * 0.1,
    },
    pagingText: {
      color: '#888',
      fontSize: 16,
      opacity: 0.1,
    },
    pagingActiveText: {
      color: '#14213D',
      fontSize: 16,
    },
    dropDownscontainer: {
      // backgroundColor: 'green',
      width: windowWidth * 0.4,
      height: windowHeight * 0.35,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    inputContainer: {
      backgroundColor: '#d5d6d7',
      width: windowWidth * 0.4,
      height: 50,
      borderRadius: 10,
      elevation: 1,
    },
    inputStyle: {
      padding: 10,
      color: '#14213D',
      fontFamily: 'Roboto-Regular',
      marginLeft: 10,
      fontSize: 16,
    },
    buttonContainers: {
      backgroundColor: '#1A6CAF',
      height: windowHeight * 0.04,
      width: windowWidth * 0.45,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
    buttonCartContainers: {
      backgroundColor: '#3292E0',
      height: windowHeight * 0.04,
      width: windowWidth * 0.4,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
    buttonText: {
      fontSize: 10,
      color: '#fff',
      fontFamily: 'Roboto-Regular',
    },
    dropdown: {
      height: 50,
      borderRadius: 8,
      paddingHorizontal: 17,
      backgroundColor: '#d5d6d7',
      elevation: 1,
    },
    placeholderStyle: {
      fontSize: 16,
      fontFamily: 'Roboto-Regular',
      color: '#14213D',
    },
    selectedTextStyle: {
      fontSize: 16,
      fontFamily: 'Roboto-Regular',
      color: '#14213D',
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    containerStyle: {
      backgroundColor: '#d5d6d7',
      borderRadius: 8,
      maxHeight: 100,
    },
    ModalContainer: {
      width: windowWidth * 1.0,
      height: windowHeight * 0.4,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-around',
      bottom: 0,
      position: 'absolute',
    },
    cameraGallerybuttons: {
      backgroundColor: '#1A6CAF',
      height: 50,
      width: windowWidth * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
    cancelButton: {
      backgroundColor: '#ff726f',
      height: 50,
      width: windowWidth * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
    uploadContainer: {
      // backgroundColor: 'tomato',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: windowWidth * 0.8,
      height: 40,
      alignSelf: 'center',
    },
    uploadText: {
      fontSize: 18,
      color: '#000',
      textAlign: 'center',
      fontFamily: 'Roboto-Bold',
    },
    uploadSubText: {
      color: '#cccccc',
      textAlign: 'center',
      fontFamily: 'Roboto-Regular',
    },
    buttonsContainer: {
      // backgroundColor: 'tomato',
      width: windowWidth * 0.9,
      height: windowHeight * 0.3,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    bottomTextContainer: {
      // backgroundColor: 'gold',
      width: windowWidth * 0.9,
      height: windowHeight * 0.1,
      alignSelf: 'center',
    },
    bottomText: {
      fontFamily: 'Roboto-Regular',
      color: '#BCB8B1',
      fontSize: 14,
      margin: 10,
    },
    commentInput: {
      // backgroundColor: 'tomato',
      alignSelf: 'center',
      width: windowWidth * 0.85,
      height: windowHeight * 0.1,
      textAlignVertical: 'top',
      color: '#000',
      fontFamily: 'Roboto-Regular',
    },
  });
  
  export default ProductList;