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
import ByPlaneDetailsComponentGrid from "./ByPlaneDetailsComponentGrid"
import DropDownPicker from 'react-native-dropdown-picker';
import { auth } from '../../modules/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const ByPlaneDetailsComponent = (props) => {

  // Donnée statique
  const navigation = props.navigation
  const Service = props.service;
  const PaysLivraison = props.paysLivraison;
  const Language = props.language;

  const Product = props.data;
  const Images = Product.productImages;
  const [user, setUser] = useState([]);
  const [ispenModal, setOpenModal] = useState(false)

  const productSpecificites = Product.productSpecificites ? Product.productSpecificites[0] : null;

  const douane = productSpecificites ? productSpecificites.douane : null;

  const quantiteMax = productSpecificites ? productSpecificites.quantiteMax : 400;
  console.log(Product.name);

  console.log(quantiteMax);
  // Pour la gestion de la langue
  const {t} = useTranslation();

  const data = [
    {label: t('Neuf'), value: 'New'},
    {label: t('Usagé'), value: 'Used'},
  ];

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      setUser(user)
    })
  }, [])


  // Donnée dynamique
  const [StateValue, setStateValue] = useState(null);
  const [QuantitySelected, setQuantitySelected] = useState(null);
  const [productValue, setProductValue] = useState(0);
  const [userImage, setUserImage] = useState('');
  const [active, setActive] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false);
  const [modalVisiblePhoto, setModalVisiblePhoto] = useState(false)
  
  // Gestion du scroll
  const Change = nativeEvent => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  // Build quantity label

  const arrayOFF = Array.from(Array(quantiteMax).keys());

  const sweeterArray = arrayOFF.map(arrayOFF => {
    let label = arrayOFF + 1;
    
    if (Product.unite && Product.unite.valeur.toLowerCase() != 'unité')
    {
      if (label > 1)
      {
        label = label + ' ' + Product.unite.valeur + '(s)';
      }
      else 
      {
        label = label + ' '  + Product.unite.valeur;
      }
    }
    
    return {label: label, value: (arrayOFF + 1)};
  });

  
  // Modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  // Choix image
  const selectImageFromGallery = () => {
    ImagePicker.openPicker({
      
    }).then(image => {
      setUserImage(image.path);

      ToastAndroid.show("Image ajoutée",ToastAndroid.SHORT)
      setModalVisible(!isModalVisible);
    });
  };

   // Prendre une photo ou selectionner une image
   const openCameraForPicture = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setUserImage(image.path);

      ToastAndroid.show("Image ajoutée",ToastAndroid.SHORT)


      setModalVisible(!isModalVisible);
    });
  };

  console.log("Image picker :", userImage);


    openModal = () => {
      setModalVisiblePhoto(true);;
  };

  closeModal = () => {
    setModalVisiblePhoto(false);
  };

  // Afficher un message des frais de douane à prevoir
  const showDouaneMessage = (item) => {
    ToastAndroid.show("success Duoane",ToastAndroid.SHORT);
    console.log("success Duoane");
    // afficherMessageDouane(item, douane).then(message => {
    //   if (message)
    //   {
    //   }
    // });
  }


  
  // Vider le panier
  const handleCartRemove = async () => {

    await removePanier();

    handleCart();
  }

  // Ajouter les produits au panier
  const handleCartLogin = async () => {


    if (!QuantitySelected)
    {
      ToastAndroid.show("La quantité est obligatoire !",ToastAndroid.SHORT)

      return;
    }

    if (!StateValue)
    {

      ToastAndroid.show("L'état du produit est obligatoire !",ToastAndroid.SHORT)

      return;
    }

    if (douane)
    {
      let coefficientDouane = 'New' == StateValue ? douane.coefficient : douane.coefficientProduitOccasion;

      if (coefficientDouane && !productValue)
      {

        ToastAndroid.show("La valeur est obligatoire !",ToastAndroid.SHORT)

        return;
      }
    }
    

    try {

      let isProductFromDifferentService = await afficherMessageProduitServiceDifferent(Service, PaysLivraison);

      if (isProductFromDifferentService)
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
                handleCartRemove();
                return;
              },
            },
          ],
        );
      }

      // Sauvegarder dans le panier
      handleCart();
    } 
    catch (e) {
      console.log('add cart error', e)
    }
  };

  // Ajout au panier
  const handleCart = async () => {

    let authStatus = await getAuthUserEmail();

    let CatProducts = [];

    let match = false;

    const obj = {
        ID: (Math.random() + 1).toString(36).substring(7),
        product: Product,
        ProductId: Product.id,
        ProductImage: Product.productImages,
        discount: Product.discount,
        stateValue: StateValue,
        quantiteMax: quantiteMax,
        quantite: QuantitySelected,
        productValue: productValue,
        service: Service,
        image: userImage,
        paysLivraison: PaysLivraison,
        Price: productSpecificites ? productSpecificites.prix : null
    };

    console.log('current data', obj)

    CatProducts.push(obj);

    let basketData = await getPanier(); 

    let success = false;

    if (basketData.length == 0)
    {
      await savePanier(CatProducts);

      ToastAndroid.show("Ajouter au panier avec succès",ToastAndroid.SHORT)


      success = true;
    }
    else 
    {
      basketData.map(ls => {
        if (ls.product.name === obj.product.name && ls.product.productCategories[0].name === obj.product.productCategories[0].name && ls.stateValue === obj.stateValue) {
          match = true;
        }
      });
  
      if (match === true) 
      {
        ToastAndroid.show("Ce produit a déjà été ajouté",ToastAndroid.SHORT)

      }
      else 
      {
        basketData.push(obj);

        await savePanier(basketData);
                
        
        ToastAndroid.show("Ajouter au panier avec succès",ToastAndroid.SHORT)
        success = true;
      } 
    }

    if (success)
    {
      // Not Login
      if (user === null) 
      {
        navigation.navigate("Login", {fromCart: 'cart'});
        return; //should never reach
      } 
    }
  };
 
  return (
    <>
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
                <PhotoZoomer key={index} image={image} windowWidth={wp(29)} windowHeight={hp(40)} />
              
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
          <View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
              <View style={{paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, justifyContent: "center", alignItems: "center", maxWidth: 250}}>
                <Text style={{fontFamily: "Poppins-Medium", fontSize: 12.5,textAlign: "center", maxWidth: 180, color: "#666"}}>{'fr' == Language ? Product.name : Product.nameEN}</Text>
              </View>

              <View style={{flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8}}>
                  <Text style={{fontSize: 13, fontFamily: "Poppins-Medium",color: "#000"}}>
                      {productSpecificites ? productSpecificites.prix  : 0}€/{Product.unite ? Product.unite.valeur : ''}
                  </Text>
                  {productSpecificites && productSpecificites.prixAncien ? 
                      <Text style={{fontSize: 13, fontFamily: "Poppins-Medium",color: "#000", textDecorationLine: "line-through"}}>
                      {productSpecificites.prixAncien}€/{Product.unite ? Product.unite.valeur : ''}
                    </Text>
                    :
                    <></>
                  }
              </View>
              
              <View style={styles.safeContainerStyle}>
                <DropDownPicker 
                items={data}
                open={open2}
                setOpen={() => setOpen2(!open2)}
                value={StateValue}
                setValue={val => setStateValue(val)}
                placeholder={t('etat')}
                maxHeight={100}
                autoScroll
                style={{backgroundColor: "#F5F5F5", borderColor: "transparent", padding: 0, position: "relative", zIndex: 1000}}
                dropDownContainerStyle={{backgroundColor: "#F5F5F5", borderColor: 'transparent',fontSize: 54,}}
                onSelectItem={item => {
                  showDouaneMessage(item.value);
                  setStateValue(item.value);
                }}
              />
              </View>
              <View style={styles.safeContainerStyle}>
              <DropDownPicker 
                items={sweeterArray}
                open={open}
                setOpen={() => setOpen(!open)}
                value={QuantitySelected}
                setValue={val => setQuantitySelected(val)}
                placeholder={t('quantité')}
                autoScroll
                maxHeight={120}
                style={{backgroundColor: "#F5F5F5", borderColor: "transparent", padding: 0, position: "relative", zIndex: 1000}}
                dropDownContainerStyle={{backgroundColor: "#F5F5F5", borderColor: 'transparent',fontSize: 54,}}
              />
                </View>

          <View style={[styles.inputContainer, {position: "relative", zIndex: -10}]}>
            <TextInput
              placeholder={t('valeur')}
              keyboardType="ascii-capable"
              placeholderTextColor={'#14213D'}
              style={styles.inputStyle}
              value={productValue}
              onChangeText={text => {
                setProductValue(text);
              }}

            />
          </View>
              <View style={{marginTop: 8, width: "100%",position: "relative", zIndex: -10}}>
              <TouchableOpacity
                style={{ paddingVertical: 8, paddingHorizontal: 22,flexDirection: "row", alignItems: "center",justifyContent: "center" ,gap: 10, backgroundColor: "transparent",borderWidth: 1,borderColor: "#4E8FDA",color: "#4E8FDA" ,borderRadius: 25, }}
                onPress={toggleModal}>
                <View><FontAwesome5 name="camera" size={15} color='#4E8FDA'/></View>
                <Text style={{fontFamily:"Poppins-Medium", fontSize: 12, color:"#4E8FDA"}}>{t('prendre photo')}</Text>
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

              <View style={{marginTop: 8, width: "100%", position: "relative", zIndex: -10}}>
                  <Button title={t('ajouter au panier')} navigation={() => handleCartLogin()}/>
              </View>
          </View>
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
    width: windowWidth * 0.32,
    height: windowHeight * 0.25,
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
    bottom: windowHeight * 0.06,
    alignSelf: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.1,
    color: 'dodgeblue',
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
export default ByPlaneDetailsComponent;
