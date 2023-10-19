import { View, Text, Image, StyleSheet,Dimensions, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native'
import React, {useState, useEffect} from 'react'
import { ScrollView } from 'react-native-virtualized-view'
import { HeaderEarth } from '../../components/Header'
import { getSelectedCountry, getSelectedService } from '../../modules/GestionStorage'
import axiosInstance from '../../axiosInstance'
import styles from './styles';
import Icon  from 'react-native-vector-icons/FontAwesome';
import PrivateSalesDetailComponent from './PrivateSalesDetailComponent'
import BuyingDemandDetailComponent from './BuyingDemandDetailComponent'
import ByPlaneDetailsComponent from './ByPlaneDetailsComponent'
import ServiceHeader from '../../components/ServiceHeader'
const windowWidth = Dimensions.get('window').width;


const ShoppingScreen = ({ navigation, route }) => {

    const [ActivityIndicatorVar, setActivityIndicatorVar] = useState(true);
    const [ActivityIndicatorProduct, setActivityIndicatorProduct] = useState(true);
    const [Categories, setCategories] = useState([]);
    const [SelectedCategorieId, setSelectedCategorieId] = useState('');
    const [products, setProducts] = useState([]);
    const [CategoriesProducts, setCategoriesProducts] = useState([]);
    const [Language, setLanguage] = useState('fr');
  
    // Par défaut le service Expéditions par avion sera selectionné (donc les sous categories seront chargées)
    const [Service, setService] = useState(null);
  
    const [PaysLivraison, setPaysLivraison] = useState(null);

    useEffect(() => {

        // Recuperer les sous categories
        async function fetchData()
        {
           setActivityIndicatorVar(true);
     

     
           // Recuperer le service selectionné
           const selectedService = await getSelectedService();
     
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
             
           }
           catch (erreur)
           {
             console.log('categories fetch error', erreur);
           }
     
           setActivityIndicatorVar(false);
           setActivityIndicatorProduct(false);
         };
     
     
       fetchData();
     
       }, []);

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

 const renderDemandItem = ({item}) => (
   <BuyingDemandDetailComponent
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
        <ScrollView contentContainerStyle={styles.container}>
  
          <HeaderEarth />
    
          <View style={styles.tabsContainer}>
            <View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>
          </View>
  
        </ScrollView>
      );
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <HeaderEarth />
      <ServiceHeader 
        navigation={navigation}
        service={Service}
        paysLivraison={PaysLivraison}
      />

      {
        Categories.length > 0 ? (
          <View style={styles.subTabbarContainer}>
            <ScrollView
              scrollEnabled
              horizontal={true}
              contentContainerStyle={styles.subTabbarScrollContainer}>

              {Categories.map( (row) => (
                <TouchableOpacity
                    key={row.id}
                    style={[
                      styles.imageTextContainer,
                      SelectedCategorieId == row.id
                        ? {backgroundColor: '#fff', elevation: 3, borderRadius: 5}
                        : null,
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
                    <Text style={styles.subtabarTextStyle}>
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
                <View style={styles.subTabbarContainerFilter}>

                  <TouchableOpacity style={[styles.filterTextContainer]} activeOpacity={0.5}>
                    <Text style={styles.filterTextStyle}>
                      Filtrer
                    </Text>
                  </TouchableOpacity>

                  { 'ventes-privees' != Service.code ?
                    (
                      <>
                        <TouchableOpacity style={[styles.filterTextContainer]} activeOpacity={0.5}>
                          <Text style={styles.filterTextStyle}>
                            Trier
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity  activeOpacity={0.5}>
                          <Icon name="square" color="#000" size={24} style={{ marginRight: windowWidth * 0.01 }}  />
                        </TouchableOpacity>

                        <TouchableOpacity  activeOpacity={0.5}>
                          <Icon name="th-large" color="#000" size={24} style={{ marginRight: windowWidth * 0.01 }}  />
                        </TouchableOpacity>
                      </>
                    )
                    :
                    <></>
                  } 
                  
                </View>

                {'fret-par-avion' == Service.code ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={products}
                    renderItem={renderByPlaneItem}
                    keyExtractor={item => item.id}
                  />
                ) : null}

                {'fret-par-bateau' == Service.code  ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={products}
                    renderItem={renderByPlaneItem}
                    keyExtractor={item => item.id}
                  />
                ) : null}

                {'demandes-d-achat' == Service.code   ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={products}
                    renderItem={renderDemandItem}
                    keyExtractor={item => item.id}
                  />
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
    </ScrollView>
  )
}

export default ShoppingScreen