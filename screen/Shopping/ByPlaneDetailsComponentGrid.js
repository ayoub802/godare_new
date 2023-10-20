//import liraries
import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  Image,
  FlatList
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
import Button, { ButtonIcon } from '../../components/Button';
import ListCard from '../../components/ListCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const ByPlaneDetailsComponentGrid = (props) => {

  // Donnée statique
  const navigation = props.navigation
  const Service = props.service;
  const PaysLivraison = props.paysLivraison;
  const Language = props.language;
  const filter = props.filter;

  const Product = props.data;
  const Images = Product.productImages;

  const productSpecificites = Product.productSpecificites ? Product.productSpecificites[0] : null;

  const douane = productSpecificites ? productSpecificites.douane : null;

  const quantiteMax = productSpecificites ? productSpecificites.quantiteMax : 400;

  // Pour la gestion de la langue
  const {t} = useTranslation();

  const data = [
    {label: t('Neuf'), value: 'New'},
    {label: t('Usagé'), value: 'Used'},
  ];


  // Donnée dynamique
  const [StateValue, setStateValue] = useState(null);
  const [QuantitySelected, setQuantitySelected] = useState(null);
  const [productValue, setProductValue] = useState(0);
  const [userImage, setUserImage] = useState('');
  const [active, setActive] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeChange, setActiveChange] = useState(filter)

  
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

      Toast.show({
        type: 'success',
        text1: t('Image'),
        text2: t('Image ajoutée'),
      });

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

      Toast.show({
        type: 'success',
        text1: t('Image'),
        text2: t('Image ajoutée'),
      });

      setModalVisible(!isModalVisible);
    });
  };


  // Afficher un message des frais de douane à prevoir
  const showDouaneMessage = (item) => {
    
    afficherMessageDouane(item, douane).then(message => {
      if (message)
      {
        Toast.show({
          type: 'success',
          text1: t('Douane'),
          text2: message,
        });
      }
    });
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
      Toast.show({
        type: 'error',
        text1: t('Quantité'),
        text2: t('La quantité est obligatoire !'),
      });

      return;
    }

    if (!StateValue)
    {
      Toast.show({
        type: 'error',
        text1: t('Etat'),
        text2: t("L'état du produit est obligatoire !"),
      });

      return;
    }

    if (douane)
    {
      let coefficientDouane = 'New' == StateValue ? douane.coefficient : douane.coefficientProduitOccasion;

      if (coefficientDouane && !productValue)
      {
        Toast.show({
          type: 'error',
          text1: t('Valeur'),
          text2: t('La valeur est obligatoire !'),
        });
  
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
    navigation.navigate("Login", {fromCart: 'cart'});

    let authStatus = await getAuthUserEmail();

    let CatProducts = [];

    let match = false;

    const obj = {
        ID: (Math.random() + 1).toString(36).substring(7),
        product: Product,
        ProductId: Product.id,
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

      Toast.show({
        type: 'success',
        text1: t('Succès'),
        text2: t('Ajouter au panier avec succès'),
      });

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
        Toast.show({
          type: 'error',
          text1: t('Il y a un problème !'),
          text2: t('Ce produit a déjà été ajouté'),
        });
      }
      else 
      {
        basketData.push(obj);

        await savePanier(basketData);
                
        Toast.show({
          type: 'success',
          text1: t('Succès'),
          text2: t('Ajouter au panier avec succès'),
        });
    
        success = true;
      } 
    }

    if (success)
    {
      // Not Login
      if (authStatus === null) 
      {
        navigation.navigate("Login", {fromCart: 'cart'});
        return; //should never reach
      } 
    }
  };

  return (
    <>
    <ScrollView
    nestedScrollEnabled={true}
    showsVerticalScrollIndicator={false}
    style={{marginBottom: 50}}>
     <View style={{ 
      backgroundColor: "#fff", 
      margin: 4.5, 
      borderRadius: 10,    
      }}>

          <View style={{flexDirection: "row", alignItems: "center",justifyContent: "space-between" ,gap: 10, paddingTop: 16, paddingLeft: 6, paddingRight: 6}}>
          <View style={{maxWidth: 130}}>
      <Text style={{fontFamily: "Poppins-SemiBold",textAlign: "left" ,fontSize: 10, color: "#000"}}>
        {'fr' == Language ? Product.name : Product.nameEN}
        </Text>
      </View>
            <View style={{flexDirection: "column", alignItems: "center", gap: 5}}>
                    <View>
                      <Text style={{fontSize: 13, fontFamily: "Poppins-Medium",color: "#000"}}>
                      {productSpecificites ? productSpecificites.prix  : 0}€/{Product.unite ? Product.unite.valeur : ''}
                    </Text>
                        </View>
                    <View>
                    {productSpecificites && productSpecificites.prixAncien ? 
                          <Text style={{fontSize: 13, fontFamily: "Poppins-Medium",color: "#000"}}>
                          {productSpecificites.prixAncien}€/{Product.unite ? Product.unite.valeur : ''}
                        </Text>
                        :
                        <></>
                      }
                    </View>
            </View>
          </View>
          <View style={{flexDirection: "row", alignItems: "center", gap: 10, paddingBottom: 8, paddingLeft: 6}}>
              {/* <View style={{backgroundColor: "#F5F5F5", height: hp(14), width: wp(20), borderRadius: 20, paddingTop: 10}}>
              <Image source={{uri: item.productImages[0].url}} style={{height: hp(12),objectFit: "cover" ,borderRadius: 22, width: wp(19)}}/>
              </View> */}
                <ScrollView
                pagingEnabled
                horizontal
                onScroll={({nativeEvent}) => Change(nativeEvent)}
                showsHorizontalScrollIndicator={false}
                style={styles.imageSwipergGrid}>
                {Images.map((image, index) => (
                      
                  <PhotoZoomer key={index} image={image} windowWidth={windowWidth} windowHeight={windowHeight} />
                    
                ))}
              </ScrollView>
              <View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingRight: 6}}>

              </View>
          </View>

          <View style={{justifyContent: "center", alignItems: "center", paddingBottom: 16}}>
              <Button title="Ajouter au panier"/>
          </View>
      </View>
  </ScrollView>

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
    width: windowWidth * 0.4,
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
    backgroundColor: '#d5d6d7',
    width: windowWidth * 0.4,
    height: 50,
    borderRadius: 10,
    elevation: 1,
  },
  inputStyle: {
    padding: 10,
    color: '#000',
    fontFamily: 'Roboto-Regular',
    marginLeft: 10,
    fontSize: 16,
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

//make this component available to the app
export default ByPlaneDetailsComponentGrid;
