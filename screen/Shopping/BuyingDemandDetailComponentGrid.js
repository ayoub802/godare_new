//import liraries
import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Image,
  FlatList,
  ToastAndroid,
  ScrollView
} from 'react-native';

import {Dropdown} from 'react-native-element-dropdown';
import commonStyle from '../../helper/commonStyle';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import PhotoZoomer from "../../components/PhotoZoomer"
import { afficherMessageDouane, afficherMessageProduitServiceDifferent } from '../../modules/RegleGestion';
import { removePanier, savePanier, getAuthUserEmail, getPanier } from '../../modules/GestionStorage';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Feather from "react-native-vector-icons/Feather"
import Button, { ButtonIcon } from '../../components/Button';
import ListCard from '../../components/ListCard';
import DropDownPicker from 'react-native-dropdown-picker';
import { auth } from '../../modules/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const BuyingDemandDetailComponentGrid = (props) => {

  // Donnée statique
  const Navigation = props.navigation;
  const Service = props.service;
  const PaysLivraison = props.paysLivraison;
  const Language = props.language;

  const Product = props.data;
  const Images = Product.productImages;

  const productSpecificites = Product.productSpecificites ? Product.productSpecificites[0] : null;

  const douane = productSpecificites ? productSpecificites.douane : null;

  const livraison = productSpecificites ? productSpecificites.livraison : null;

  const expedition = productSpecificites ? productSpecificites.expedition : null;

  const quantiteMax = productSpecificites ? productSpecificites.quantiteMax : 400;


  // Translation
  const {t, i18n} = useTranslation();


  // Donnée dynamique
  const [active, setActive] = useState(0);
  const [userImage, setUserImage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedProductValues, setSelectedProductValues] = useState({});
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false)
  const [StateValue, setStateValue] = useState(null);
  const [user, setUser] = useState([]);


 
  // Quantité
  const arrayOFF = Array.from(Array(quantiteMax).keys());
  
  const sweeterArray = arrayOFF.map(arrayOFF => {
    return {label: (arrayOFF + 1), value: (arrayOFF + 1 )};
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      setUser(user)
    })
  }, [])

  console.log(user);

  // Scroll
  const Change = nativeEvent => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };
  


  // Modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleModalOpen = () => {
    setDescriptionModalVisible(true);
  };
  
  const handleModalClose = () => {
    setDescriptionModalVisible(false);
  };
  
  const handleModalSave = () => {
    handleModalClose();
  };



  // Choix attribut
  const handleAttributeChange = (product, attributeId, value) => {
 
    const newSelectedAttributes = { ...selectedAttributes, [attributeId]: value };
    setSelectedAttributes(newSelectedAttributes);

    if (!selectedProductValues[product.id])
    {
      selectedProductValues[product.id] = {};
    }

    if (!selectedProductValues[product.id]['attributes'] )
    {
      selectedProductValues[product.id]['attributes'] = {};
    }

    selectedProductValues[product.id]['attributes'][attributeId] = value;
    setSelectedProductValues(selectedProductValues); 

    setSelectedProduct(product);
};



// Quantité
const handleQuantiteChange = (product, quantite) => {

  let productId = product.id;

  setSelectedProduct(product);

  if (!selectedProductValues[product.id])
  {
    selectedProductValues[product.id] = {'quantite': {}};
  }

  if (!selectedProductValues[product.id])
  {
    selectedProductValues[product.id] = {};
  }

  if (!selectedProductValues[product.id]['quantite'] )
  {
    selectedProductValues[product.id]['quantite'] = {};
  }

  selectedProductValues[productId]['quantite'] = quantite;

  setSelectedProductValues(selectedProductValues);
};



// Info supplementaire
const handleInfosChange = (product, infos) => {

  let productId = product.id;

  setSelectedProduct(product);

  if (!selectedProductValues[product.id])
  {
    selectedProductValues[product.id] = {'infos': {}};
  }

  if (!selectedProductValues[product.id])
  {
    selectedProductValues[product.id] = {};
  }

  if (!selectedProductValues[product.id]['infos'] )
  {
    selectedProductValues[product.id]['infos'] = {};
  }

  selectedProductValues[productId]['infos'] = infos;

  setSelectedProductValues(selectedProductValues);
};



// URL
const handleURLChange = (product, url) => {

  let productId = product.id;

  setSelectedProduct(product);

  if (!selectedProductValues[product.id])
  {
    selectedProductValues[product.id] = {};
  }

  if (!selectedProductValues[product.id]['url'] )
  {
    selectedProductValues[product.id]['url'] = {};
  }

  selectedProductValues[productId]['url'] = url;

  setSelectedProductValues(selectedProductValues);
};



// Prix d'achat
const handleAchatChange = (product, prixAchat) => {

  let productId = product.id;

  setSelectedProduct(product);

  if (!selectedProductValues[product.id])
  {
    selectedProductValues[product.id] = {};
  }

  if (!selectedProductValues[product.id]['prix'] )
  {
    selectedProductValues[product.id]['prix'] = {};
  }

  selectedProductValues[productId]['prix'] = prixAchat;

  setSelectedProductValues(selectedProductValues);
};



// Camera
const selectImageFromGallery = () => {
  ImagePicker.openPicker({
    
  }).then(image => {
    setUserImage(image.path);

    Toast.show({
      type: 'success',
      text1: t('Image'),
      text2: t('Image ajoutée'),
    });

    ToastAndroid.show("Image ajoutée", ToastAndroid.SHORT)
    setModalVisible(!isModalVisible);
  });
};

 
const openCameraForPicture = () => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  }).then(image => {
    setUserImage(image.path);

    Toast.show({
      type: 'success',
      text1: t('Image'),
      text2: t('Image ajoutée'),
    });
    ToastAndroid.show("Image ajoutée", ToastAndroid.SHORT)

    setModalVisible(!isModalVisible);
  });
};


// Gestion panier
const handleCartLogin = async (product) => {

  let productValues = selectedProductValues[product.id];
  let quantite = productValues ? productValues['quantite'] : null;

  if (!quantite)
  {
    Toast.show({
      type: 'error',
      text1: t('Quantité'),
      text2: t('La quantité est obligatoire !'),
    });
    ToastAndroid.show("La quantité est obligatoire !", ToastAndroid.SHORT)

    return;
  }

  try {

    let basketData = await getPanier();

    let cartHasProductFromAnotherService = false;

    basketData.map(ls => {
      if (ls.Service != Service || ls.paysLivraison.id != PaysLivraison.id) {
        cartHasProductFromAnotherService = true;
      }
    });

    if (cartHasProductFromAnotherService)
    {
      return Alert.alert(
        t('Information'),
        t('Votre panier contient des produits d\'un autre service (ou pays de départ ou pays de destination). Vous perdrez votre panier si vous continuez. Voulez-vous continuer ?'),
        [
          {
            text: t('Non'),
            style: 'cancel',
          },
          {
            text: t('Oui'),
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

    reponse.then(() => {
      if (isSuccess)
      {
        // Not Login
        if (user === null) 
        {
          Navigation.navigate('LoginScreen', {fromCart: 'cart'});
          return; //should never reach
        } 
      }
    })
  } 
  catch (e) {}
};

  const handleCartRemove = async (product) => {

    await removePanier();

    const authStatus = await getAuthUserEmail();

    let reponse = handleCart(product);

    reponse.then(() => {
      if (isSuccess)
      {
        // Not Login
        if (authStatus === null) 
        {
          Navigation.navigate('LoginScreen', {fromCart: 'cart'});
          return; //should never reach
        } 
      }
    })
    
  }

  const handleCart = async (product) => {

    let CatProducts = [];


    let selectedValues = selectedProductValues[product.id];

    let prix = selectedValues ? selectedValues['prix'] : 0;
    let url = selectedValues ? selectedValues['url'] : null;
    let infos = selectedValues ? selectedValues['infos'] : null;
    let quantite = selectedValues ? selectedValues['quantite'] : 1;
    let attributes = selectedValues ? selectedValues['attributes'] : {};


    const obj = {
        ID: (Math.random() + 1).toString(36).substring(7),
        product: product,
        ProductId: product.id,
        discount: product.discount,
        ProductImage: product.productImages,
        quantiteMax: quantiteMax,
        quantite: quantite,
        service: Service,
        image: userImage,
        paysLivraison: PaysLivraison,
        Price: prix,
        attributes: attributes,
        url: url,
        informationsComplementaires: infos,
    };

  console.log('object to add', obj)

    CatProducts.push(obj);

    let basketData = await getPanier();

    if (basketData.length == 0)
    {
      await savePanier(CatProducts);
   
      Toast.show({
        type: 'success',
        text1: t('Succès'),
        text2: t('Ajouter au panier avec succès'),
      });
      ToastAndroid.show("Ajouter au panier avec succès", ToastAndroid.SHORT)

      return true;
    }


    basketData.push(obj);
              
    await savePanier(basketData);

    Toast.show({
      type: 'success',
      text1: t('Succès'),
      text2: t('Ajouter au panier avec succès'),
    });
    ToastAndroid.show("Ajouter au panier avec succès", ToastAndroid.SHORT)

    return true;
  };

 

  const RenderQuantite = props => {

    const StateValue = selectedProductValues[props.product.id] ? selectedProductValues[props.product.id]['quantite'] : null;
    
    return (
      <View style={styles.safeContainerStyle}>
        <DropDownPicker
          placeholderStyle={styles.placeholderStyle}
          autoScroll
          open={open}
          setOpen={()=> setOpen(!open)}
          iconStyle={styles.iconStyle}
          style={{backgroundColor: "#F5F5F5", borderColor: "transparent", padding: 0, position: "relative", zIndex: 1000}}
          dropDownContainerStyle={{backgroundColor: "#F5F5F5", borderColor: 'transparent',fontSize: 54,}}
          items={sweeterArray}
          maxHeight={200}
          placeholder={t('Quantité')}
          searchPlaceholder="Search..."
          value={StateValue}
          setValue={val => setStateValue(val)}
          showsVerticalScrollIndicator={false}
          onSelectItem={item => {
            handleQuantiteChange(props.product, item.value);
          }}

        />
      </View>
    );
  }

 
  return (
    <>
     <View style={{ 
      backgroundColor: "#fff", 
      margin: 4.5, 
      borderRadius: 10,    
      }}>

          <View style={{flexDirection: "row", alignItems: "center",justifyContent: "space-between" ,gap: 10, paddingTop: 16, paddingLeft: 6, paddingRight: 6}}>
          <View style={{maxWidth: 130}}>
              <Text style={{fontFamily: "Poppins-SemiBold",textAlign: "left" ,fontSize: 9.3, color: "#000"}}>
                {'fr' == Language ? Product.name : Product.nameEN}
                </Text>
          </View>
            <View style={{flexDirection: "column", alignItems: "center", gap: 2}}>
                    <View>
                      <Text style={{fontSize: 11, fontFamily: "Poppins-Medium",color: "#000"}}>
                      {productSpecificites ? productSpecificites.prix  : 0}€/{Product.unite ? Product.unite.valeur : ''}
                    </Text>
                        </View>
                    <View>
                    {productSpecificites && productSpecificites.prixAncien ? 
                      <Text style={{fontSize: 11, fontFamily: "Poppins-Medium",color: "#000", textDecorationLine: "line-through"}}>
                      {productSpecificites.prixAncien}€/{Product.unite ? Product.unite.valeur : ''}
                    </Text>
                    :
                    <></>
                  }
                    </View>
            </View>
          </View>
          <View style={{flexDirection: "column", alignItems: "center", paddingBottom: 8, paddingLeft: 6}}>
              {/* <View style={{backgroundColor: "#F5F5F5", height: hp(14), width: wp(20), borderRadius: 20, paddingTop: 10}}>
              <Image source={{uri: item.productImages[0].url}} style={{height: hp(12),objectFit: "cover" ,borderRadius: 22, width: wp(19)}}/>
              </View> */}
                <ScrollView
                pagingEnabled
                horizontal
                onScroll={({nativeEvent}) => Change(nativeEvent)}
                showsHorizontalScrollIndicator={false}
                style={styles.imageSwiper}
                >
                {Images.map((image, index) => (
                      
                  <PhotoZoomer key={index} image={image} windowWidth={wp(19)} windowHeight={hp(21)} />
                    
                ))}
              </ScrollView>
              <View style={styles.dotStyle}>
                  {Images.map((i, k) => (
                    <Text
                      key={k}
                      style={
                        k == active ? styles.pagingActiveText : styles.pagingText
                      }>
                      ⬤
                    </Text>
                  ))}
                </View>
              <View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingRight: 6}}>
              <View style={styles.inputContainer}>
              <TextInput
                key={'url' + Product.id}
                placeholder="URL"
                keyboardType="ascii-capable"
                placeholderTextColor={'#14213D'}
                style={styles.inputStyle}
                onChangeText={text => {
                  handleURLChange(Product, text);
                }}
              />
            </View>
            {Product.attributs.map((attribute) => {

                const product = Product;
                let prevChoice = selectedProductValues[product.id];

                prevChoice = prevChoice ? prevChoice['attributes'] : null;
                const selectedValue = prevChoice ? prevChoice[attribute.attribut.id] : null;


                return (
                <View style={styles.inputContainer}>
                    <TextInput
                    key={attribute.id}
                    placeholder={attribute.attribut.name}
                    keyboardType="ascii-capable"
                    placeholderTextColor={'#14213D'}
                    style={styles.inputStyle}
                    value={selectedValue}
                    onChangeText={text => {
                    handleAttributeChange(product, attribute.attribut.name, text);
                    }}
                    />
                    </View>
                )

                })}

                    
                <RenderQuantite product={Product} />
                <View style={[styles.inputContainer, {marginTop: 10}]}>
                    <TextInput
                    placeholder={t('Prix d’achat')}
                    keyboardType="ascii-capable"
                    placeholderTextColor={'#14213D'}
                    style={styles.inputStyle}
                    onChangeText={text => {
                        handleAchatChange(Product, text);
                    }}
                    />
                </View>
              </View>
          </View>

          <View style={{marginTop: 8, width: "100%",position: "relative", zIndex: -10, marginBottom: 4, paddingHorizontal: 8}}>
              <TouchableOpacity
                style={{ paddingVertical: 8, paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center" ,gap: 10, backgroundColor: "transparent",borderWidth: 1,borderColor: "#4E8FDA",color: "#4E8FDA" ,borderRadius: 25, }}
                onPress={toggleModal}>
                <View><FontAwesome5 name="camera" size={15} color='#4E8FDA'/></View>
                <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#4E8FDA"}}>{t('Prendre une photo')}</Text>
                {
                  <View>
                    <Modal
                      isVisible={isModalVisible}
                      backdropOpacity={0.4}
                      animationIn={'fadeInUp'}
                      animationInTiming={600}
                      animationOut={'fadeOutDown'}
                      animationOutTiming={600}
                      useNativeDriver={true}>
                      <View style={styles.ModalContainer}>
                        <View style={styles.uploadContainer}>
                          <Text style={styles.uploadText}>
                            {t('Télécharger une photo')}
                          </Text>
                          <Text style={styles.uploadSubText}>
                            {t('Choisissez une image')}
                          </Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                          <TouchableOpacity
                            style={{ paddingVertical: 8, width: "100%", paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center" ,gap: 10, backgroundColor: "transparent",borderWidth: 1,borderColor: "#4E8FDA",color: "#4E8FDA" ,borderRadius: 25, }}
                            onPress={() => {
                              selectImageFromGallery();
                            }}>
                              <FontAwesome5 name="image" size={20} color="#4E8FDA"/>
                            <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#4E8FDA"}}>
                              {t('Choisir une image dans la galerie')}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ paddingVertical: 8, width: "100%" ,paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center" ,gap: 10, backgroundColor: "transparent",borderWidth: 1,borderColor: "#4E8FDA",color: "#4E8FDA" ,borderRadius: 25, }}
                            onPress={() => {
                              openCameraForPicture();
                            }}>
                            <FontAwesome5 name="camera" size={20} color="#4E8FDA"/>
                            <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#4E8FDA"}}>
                              {t('Ouvrir la caméra')}
                            </Text>
                          </TouchableOpacity>  
                        </View>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={toggleModal}>
                            <Feather name="x" size={20}/>
                          </TouchableOpacity>
                      </View>
                    </Modal>
                  </View>
                }
              </TouchableOpacity>
              </View>
              <View style={{marginTop: 8, width: "100%", position: "relative", zIndex: -10, paddingHorizontal: 8, paddingBottom: 10}}>
                <Button title="Ajouter au panier" navigation={() => { handleCartLogin(Product);}}/>
              </View>
                        
            <View style={styles.bottomTextContainer}>
              
              <TextInput
                placeholder={t('Informations complémentaires')}
                placeholderTextColor={'#BCB8B1'}
                multiline={true}
                style={{fontSize: 10,fontFamily: "Poppins-Regular",width: windowWidth * 0.5 ,borderRadius: 8, paddingVertical: 5, paddingLeft: 12}}
                value={selectedProductValues[Product.id] ? selectedProductValues[Product.id]['infos'] : null}
                onFocus={handleModalOpen}
                onChangeText={text => {
                  handleInfosChange(Product, text);
                }}
              />
            
          </View>
      </View>
    </>
  );
};


// define your styles
const styles = StyleSheet.create({
  DetailsContainer: {
    backgroundColor: '#F4F6F8',
    width: windowWidth * 0.95,
    height: windowHeight * 0.5,
    marginTop: windowHeight * 0.03,
    borderRadius: 28,
    elevation: 1,
  },
  safeContainerStyle: {
    justifyContent: 'center',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.46,
    // borderRadius:0
    marginTop: 5
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
    flexDirection: 'row',
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
    marginLeft: '10%',
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
    // backgroundColor: 'tomato',
    margin: 2,
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
    // backgroundColor: 'tomato',
    width: windowWidth * 0.4,
    height: windowHeight * 0.3,
  },
  imageSwiper: {
    // backgroundColor: 'gold',
    width: windowWidth * 0.2,
    height: windowHeight * 0.2,
    borderRadius: 10,
  },
  imageSwipergGrid: {
    // backgroundColor: 'gold',
    width: windowWidth * 0.12,
    height: windowHeight * 0.15,
    borderRadius: 10,
  },
  dotStyle: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1500,
    bottom: windowHeight * .19,
    alignSelf: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.1,
    color: '#000',
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
    height: windowHeight * 0.33,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputContainer: {
    backgroundColor: "#F5F5F5",
    width: windowWidth * 0.46,
    height: 40,
    borderRadius: 10,
    marginTop: 8,
  },
  inputStyle: {
    padding: 10,
    color: '#000',
    fontFamily: 'Roboto-Regular',
    marginLeft: 10,
    fontSize: 14,
  },
  buttonContainers: {
    backgroundColor: '#3292E0',
    height: windowHeight * 0.04,
    width: windowWidth * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonUploadContainers: {
    backgroundColor: '#1A6CAF',
    height: windowHeight * 0.04,
    width: windowWidth * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    // marginTop:10
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
    fontSize: 11,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.4,
    textAlign: 'center',
  },
  dropdown: {
    height: 35,
    borderRadius: 8,
    paddingHorizontal: 17,
    backgroundColor: "#F5F5F5",
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#14213D',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#14213D',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerStyle: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    maxHeight: 100,
  },
  ModalContainer: {
    width: windowWidth * 1.0,
    height: windowHeight * 0.3,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 20,
    // justifyContent: 'space-around',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: "absolute",
    top: 10,
    right: 10
  },
  uploadContainer: {
    // backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  uploadSubText: {
    color: '#cccccc',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  buttonsContainer: {
    // backgroundColor: 'tomato',
    width: windowWidth * 0.7,
    alignItems: 'center',
    gap: 12,
    justifyContent: "center",
    marginTop: 50
  },
  bottomTextContainer: {
    // backgroundColor: 'gold',
    alignSelf: 'center',
    paddingLeft: 20,
    paddingBottom: 10
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

//make this component available to the app
export default BuyingDemandDetailComponentGrid;
