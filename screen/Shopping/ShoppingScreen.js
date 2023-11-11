import { View, Text, Image, StyleSheet,Dimensions, TouchableOpacity, FlatList, ActivityIndicator, ScrollView} from 'react-native'
import React, {useState, useEffect} from 'react'
import { HeaderEarth } from '../../components/Header'
import { getPlatformLanguage, getSelectedCountry, getSelectedService } from '../../modules/GestionStorage'
import axiosInstance from '../../axiosInstance'
import styles from './styles';
import Icon  from 'react-native-vector-icons/FontAwesome';
import PrivateSalesDetailComponent from './PrivateSalesDetailComponent'
import BuyingDemandDetailComponent from './BuyingDemandDetailComponent'
import ByPlaneDetailsComponent from './ByPlaneDetailsComponent'
import ServiceHeader from '../../components/ServiceHeader'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import Octicons from "react-native-vector-icons/Octicons"
import ByPlaneDetailsComponentGrid from './ByPlaneDetailsComponentGrid'
const windowWidth = Dimensions.get('window').width;
import MasonryList from '@react-native-seoul/masonry-list';
import BuyingDemandDetailComponentGrid from './BuyingDemandDetailComponentGrid'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'


const ShoppingScreen = ({ navigation, route }) => {

  var isFocused = useIsFocused();
  const {t, i18n} = useTranslation();

    const [ActivityIndicatorVar, setActivityIndicatorVar] = useState(true);
    const [ActivityIndicatorProduct, setActivityIndicatorProduct] = useState(true);
    const [Categories, setCategories] = useState([]);
    const [SelectedCategorieId, setSelectedCategorieId] = useState('');
    const [products, setProducts] = useState([]);
    const [CategoriesProducts, setCategoriesProducts] = useState([]);
    const [Language, setLanguage] = useState('fr');
    const [activeFilter, setActiveFilter] = useState(0);
    const [Loader,setLoader] = useState(false);

    // Par défaut le service Expéditions par avion sera selectionné (donc les sous categories seront chargées)
    const [Service, setService] = useState(null);
  
    const [PaysLivraison, setPaysLivraison] = useState(null);

    useEffect(() => {

      let mounted = true;
      setLoader(true)
      // Recuperer les sous categories
        async function fetchData()
        {
           setActivityIndicatorVar(true);
     

     
           // Recuperer le service selectionné
           const selectedService = await getSelectedService();

           const currentLanguage = await getPlatformLanguage();
           if(currentLanguage)
           {
            setLoader(false)
            setLanguage(currentLanguage)
           }
     
           if (!selectedService)
           {
             navigation.navigate('HomeScreen');
             return;
           }
     
           setService(selectedService);
     
           // Récuperer le pays de livraison
           const paysLivraison = await getSelectedCountry();
     
           setPaysLivraison(paysLivraison);
     
           try 
           {
             // Recuperer les catégories
             const response = await axiosInstance.get('/categories/actif/' + selectedService.code + '/' + paysLivraison.id);
     
             console.log('response.data', response.data)
     
             if (response.data)
             {
               let data = response.data;
     
               setCategories(data);
     
               // selectionner la 1ere categorie
               let find = false;
               data.map((row) => {
                 if (!find)
                 {
                   setSelectedCategorieId(row.id);
                   find = true;
                 }
               });
             }
             setLoader(false)
           }
           catch (erreur)
           {
             console.log('categories fetch error', erreur);
             setLoader(false)
           }
     
           setActivityIndicatorVar(false);
           setActivityIndicatorProduct(false);
         };
     
     
       fetchData();

       return (mounted) => mounted = false;

       }, [isFocused]);


    useEffect(() => {
        if (Service)
        {
          fetchSubcategoryProducts();
        }
      
    }, [SelectedCategorieId]);
       // Recuperer les produits
   async function fetchSubcategoryProducts()
   {
      setActivityIndicatorProduct(true);

      try 
      {
        setProducts([]);
        setCategoriesProducts([]);

        // Recuperer les sous-categories (avec leur produit) ou les produits
        let url = '/products/categories/actif/' + SelectedCategorieId + '/' + PaysLivraison.id;
        if ('ventes-privees' == Service.code)
        {
          url = '/categories/subcategories/products/actif/' + SelectedCategorieId + '/' + PaysLivraison.id;
        }

        const response = await axiosInstance.get(url);

        if (response.data)
        {
          if ('ventes-privees' == Service.code)
          {
            setCategoriesProducts(response.data)
          }
          else 
          {
            setProducts(response.data);
          }
        }
      }
      catch (erreur)
      {
        console.log('fetchSubcategoryProducts fetch error', erreur);
      }

     setActivityIndicatorProduct(false);
   }

  // Service display
  const renderByPlaneItem = ({item}) => (
      <ByPlaneDetailsComponent
       service={Service.code}
       data={item}
       navigation={navigation}
       paysLivraison={PaysLivraison}
       language={Language}
     />
 );
  const renderByPlaneGridItem = ({item}) => (
      <ByPlaneDetailsComponentGrid
       service={Service.code}
       data={item}
       navigation={navigation}
       paysLivraison={PaysLivraison}
       language={Language}
     />
 );

 const renderDemandItem = ({item}) => (
   <BuyingDemandDetailComponent
     service={Service.code}
     data={item}
     navigation={navigation}
     paysLivraison={PaysLivraison}
     language={Language}
   />
 );
 const renderDemandItemGrid = ({item}) => (
   <BuyingDemandDetailComponentGrid
     service={Service.code}
     data={item}
     navigation={navigation}
     paysLivraison={PaysLivraison}
     language={Language}
   />
 );

 const renderPrivateSaleItem = ({item}) => (
   <PrivateSalesDetailComponent
     service={Service.code}
     data={item}
     navigation={navigation}
     paysLivraison={PaysLivraison}
     language={Language}
   />
 );
    if (!Service || !PaysLivraison || true === ActivityIndicatorVar)
    {
      return (
        <View style={{flex: 1}}>
  
          <HeaderEarth />
    
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <View style={{justifyContent: 'center'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>
          </View>
  
        </View>
      );
    }
    if (Loader )
    {
      return (<View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>);
    }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{marginBottom: 85}}>
        <ServiceHeader 
          navigation={navigation}
          service={Service}
          paysLivraison={PaysLivraison}
          Language={Language}
        />

        {/* {
          Categories.length > 0 ? (
            <View style={{marginTop: 20}}>
              <ScrollView
                scrollEnabled
                horizontal={false}>

                          <FlatList 
                          horizontal
                          style={{paddingLeft: 10}}
                          showsHorizontalScrollIndicator={false}
                          data={Categories}
                          keyExtractor={item => item.id}
                          renderItem={({item}) => (
                            <TouchableOpacity onPress={() => setSelectedCategorieId(item.id)}  style={{ flexDirection: "row", alignItems: "center", gap: 12, width: 140}}>
                                    <View>
                                        <Image source={{ uri: item.image}} style={{width: 22, height: 22, objectFit: "cover"}}/>
                                    </View>
                                    <Text style={[SelectedCategorieId === item.id ? styles.textActive : styles.text, {fontFamily: "Poppins-Medium", fontSize: 12}]}>{item.name}</Text>
                                </TouchableOpacity>
                              )}
                          />
              </ScrollView>
            </View>
          ) : (<></>)
        } */}
        
        {Categories.length > 0 ? (
          <View style={styles.subTabbarContainer}>
            <ScrollView
              scrollEnabled
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subTabbarScrollContainer}> 

              {Categories.map( (row) => (
                <TouchableOpacity
                    key={row.id}
                    style={[
                      styles.imageTextContainer
                    ]}
                    activeOpacity={0.5}
                    onPress={() => {
                      setSelectedCategorieId(row.id);
                    }}>
                    <View>
                      <Image
                        style={styles.iconStyler}
                        source={{uri: row.image}}
                        resizeMode="center"
                      />
                    </View>
                    <Text style={[styles.subtabarTextStyle, SelectedCategorieId == row.id ? {color: "#376AED"} : {color: "#000"}]}>
                      {'fr' == Language ? row.name : row.nameEn}
                    </Text>
              </TouchableOpacity>
              ))}

            </ScrollView>
          </View>
        ) : (<></>)
      }

        {
          <>

            {true === ActivityIndicatorProduct ?
              <ActivityIndicator size={'large'} color={'#000'} />
              :
              (
                <>
                  <View style={{marginTop: 10, paddingHorizontal: 5}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",borderTopLeftRadius: 28, borderTopRightRadius: 28 ,backgroundColor: "#fff", paddingVertical: 27, paddingLeft: 15, paddingRight: 23}}>
                      
                      <View style={{flexDirection:"row", alignItems: "center", gap: 10}}>
                      <TouchableOpacity style={{flexDirection:"row", alignItems: "center", gap: 8}} activeOpacity={0.5}>
                        <Text style={{fontFamily: "Poppins-Medium", fontSize: wp(3.2), color: "#376AED" }}>
                          {t('Filtrer')}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" color="#376AED" size={25}/>
                      </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:"row", alignItems: "center", gap: 8}} activeOpacity={0.5}>
                          <Text style={{fontFamily: "Poppins-Medium", fontSize: wp(3.2), color: "#376AED" }}>
                            {t('Trier')}
                          </Text>
                          <MaterialIcons name="arrow-drop-down" color="#376AED" size={wp(6)}/>
                        </TouchableOpacity>
                      </View>

                      <View style={{flexDirection:"row", alignItems: "center", gap: 10}}>
                      {
                                  activeFilter === 0 
                                  ?
                                  <TouchableOpacity onPress={() => setActiveFilter(1)}>
                                      <Ionicons name="grid-outline" color="#00000033" size={wp(6)}/>
                                  </TouchableOpacity> 
                                  :
                                  <TouchableOpacity onPress={() => setActiveFilter(0)}>
                                      <Ionicons name="grid-outline" color="#376AED" size={wp(6)}/>
                                  </TouchableOpacity> 
                                }
                                {
                                  activeFilter === 1 
                                  ?
                                  <TouchableOpacity onPress={() => setActiveFilter(0)}>
                                      <Octicons name="list-unordered" color="#00000033" size={wp(6)}/>
                                  </TouchableOpacity> 
                                  :
                                  <TouchableOpacity onPress={() => setActiveFilter(1)}>
                                      <Octicons name="list-unordered" color="#376AED" size={wp(6)}/>
                                  </TouchableOpacity> 
                                }
                      </View>

                      
                    </View>
                  </View>

                  {'fret-par-avion' == Service.code ? (
                    <>
                    {
                      activeFilter === 0 
                      ?
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={products}
                      renderItem={renderByPlaneItem}
                      keyExtractor={item => item.id}
                    />
                    :
                  //   <FlatList
                  //   key={'#'}
                  //   showsVerticalScrollIndicator={false}
                  //   data={products}
                  //   renderItem={renderByPlaneGridItem}
                  //   keyExtractor={item => "#" + item.id}
                  //   numColumns={2}
                  // />
                  <MasonryList
                    data={products}
                    keyExtractor={(item)=> item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderByPlaneGridItem}
                    onEndReachedThreshold={0.1}
                  />
                    }

                    </>
                  ) : null}

                  {'fret-par-bateau' == Service.code  ? (
                    <>
                     {
                       activeFilter === 0 
                       ?
                       <FlatList
                         showsVerticalScrollIndicator={false}
                         data={products}
                         renderItem={renderByPlaneItem}
                         keyExtractor={item => item.id}
                       />
                       :
                       <MasonryList
                       data={products}
                       keyExtractor={(item)=> item.id}
                       numColumns={2}
                       showsVerticalScrollIndicator={false}
                       renderItem={renderByPlaneGridItem}
                       onEndReachedThreshold={0.1}
                     />
                     }
                    </>
                  ) : null}

                  {'demandes-d-achat' == Service.code   ? (
                    <>
                    {
                        activeFilter === 0 
                        ?
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          data={products}
                          renderItem={renderDemandItem}
                          keyExtractor={item => item.id}
                        />
                        :
                        <MasonryList
                        data={products}
                        keyExtractor={(item)=> item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderDemandItemGrid}
                        onEndReachedThreshold={0.1}
                      />
                    }
                    </>
                  ) : null}

                  {'ventes-privees' == Service.code  ? (
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    data={CategoriesProducts}
                    renderItem={renderPrivateSaleItem}
                    keyExtractor={item => item.id}
                  />
                  ) 
                  
                  : null}
                </>
              )
            }

            

          </>
        }
      </View>
    </ScrollView>
  )
}

export default ShoppingScreen