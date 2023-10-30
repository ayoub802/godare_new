//import liraries
import React, {Component, useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  SafeAreaView,
  ToastAndroid,
  Alert} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import commonStyle from '../../helper/commonStyle';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhotoZoomer from "../../components/PhotoZoomer"
import { getAuthUserEmail, removePanier, getPanier, savePanier } from '../../modules/GestionStorage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Button from '../../components/Button';
import { auth } from '../../modules/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const BuyingDemandDetailComponent = props =>  {

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
    <View style={{ backgroundColor: "#fff", margin: 5}}>
      <View style={{flexDirection: "row", alignItems: "center",gap: 10, paddingVertical: 12, paddingLeft: 22}}>


        <View>
          <ScrollView
            pagingEnabled
            horizontal
            onScroll={({nativeEvent}) => Change(nativeEvent)}
            showsHorizontalScrollIndicator={false}
            style={styles.imageSwiper}>
            {Images.map((image, index) => (
                <PhotoZoomer key={index} image={image} windowWidth={wp(30)} windowHeight={hp(40)} />
              
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
        </View>

        <View style={{flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
            <View style={{paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, justifyContent: "center", alignItems: "center", maxWidth: 250}}>
                <Text style={{fontFamily: "Poppins-Medium", fontSize: 12.5,textAlign: "center", maxWidth: 180}}>{'fr' == Language ? Product.name : Product.nameEN}</Text>
            </View>
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

            <View style={styles.dropDownscontainer}>

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

              <View style={{marginTop: 12, width: "100%",position: "relative", zIndex: -10}}>
                <TouchableOpacity
                  style={{ paddingVertical: 8 ,paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center" ,gap: 10, backgroundColor: "transparent",borderWidth: 1,borderColor: "#4E8FDA",color: "#4E8FDA" ,borderRadius: 25, }}
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
                              style={styles.cameraGallerybuttons}
                              onPress={() => {
                                selectImageFromGallery();
                              }}>
                              <Text style={styles.buttonText}>
                                {t('Choisir une image dans la galerie')}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cameraGallerybuttons}
                              onPress={() => {
                                openCameraForPicture();
                              }}>
                              <Text style={styles.buttonText}>
                                {t('Ouvrir la caméra')}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={toggleModal}>
                              <Text style={styles.buttonText}>{t('Annuler')}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  }
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 8, width: "100%", position: "relative", zIndex: -10}}>
                  <Button title="Ajouter au panier" navigation={() => { handleCartLogin(Product);}}/>
              </View>
              {/* <TouchableOpacity style={styles.buttonCartContainers}>
                 <Text style={styles.buttonText} onPress={() => { handleCartLogin(Product);}}>{t('Ajouter au panier')}</Text>
              </TouchableOpacity> */}
            </View>
          
            <View style={styles.bottomTextContainer}>
              
              <TextInput
                placeholder={t('Informations complémentaires')}
                placeholderTextColor={'#BCB8B1'}
                multiline={true}
                style={styles.commentInput}
                value={selectedProductValues[Product.id] ? selectedProductValues[Product.id]['infos'] : null}
                onFocus={handleModalOpen}
                onChangeText={text => {
                  handleInfosChange(Product, text);
                }}
              />
            
          </View>

        </View>

      </View>


    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  DetailsContainer: {
    backgroundColor: '#F4F6F8',
    width: windowWidth * 0.95,
    height: windowHeight * 0.6,
    marginTop: windowHeight * 0.03,
    borderRadius: 28,
    elevation: 1,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modalInput: {
    height: 200,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    marginTop: 10,
    width: '50%',
  },

  safeContainerStyle: {
    justifyContent: 'center',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.4,
    // borderRadius:0
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
    width: windowWidth * 0.32,
    height: windowHeight * 0.25,
    borderRadius: 10,
  },
  dotStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: windowHeight * 0.06,
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
    alignItems: 'center',
    marginVertical: 10
  },
  inputContainer: {
    backgroundColor: "#F5F5F5",
    width: windowWidth * 0.4,
    height: 50,
    borderRadius: 10,
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
  ModalInfosContainer: {
    width: windowWidth * 1.0,
    height: windowHeight ,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    bottom: 0,
    position: 'absolute',
  },
  infosComplementaires: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: windowWidth * 0.8,
    marginTop: windowHeight * 0.1,
    alignSelf: 'center',
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

//make this component available to the app
export default BuyingDemandDetailComponent;
