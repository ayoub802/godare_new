import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderEarth} from '../../components/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RenderItem, RenderItemCode} from '../../components/RenderItem';
import {DataTable} from 'react-native-paper';
import { getAuthUserEmail, getAuthentificationData } from '../../modules/GestionStorage';
import axiosInstance from '../../axiosInstance';
import { ScrollView } from 'react-native-virtualized-view';
import { useTranslation } from 'react-i18next';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../modules/FirebaseConfig';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const RemiseAvoirScreen = () => {

  const {t, i18n} = useTranslation();
  
  const headerTable = [
    {
      title: 'total',
    },
    {
      title: 'restant',
    },
    {
      title: 'Début Validité',
    },
    {
      title: 'fin Validité',
    },
  ];
  const headerRemise = [
    {
      title: 'code',
      width: 50
    },
    {
      title: '%',
      width: 36
    },
    {
      title: 'Service',
      width: 100
    },
    {
      title: 'Pays',
      width: 100
    },
    {
      title: 'Produit',
      width: 100
    },
    {
      title: 'in validité',
      width: 100
    },
  ];
  const headerData = [
    {
      id: 1,
      price: 30 + '€',
      restant: 'Restant',
      date: '15/06/23',
      fin: ' 14/06/24',
    },
    {
      id: 2,
      price: 30 + '€',
      restant: 'Restant',
      date: '15/06/23',
      fin: ' 14/06/24',
    },
    {
      id: 3,
      price: 30 + '€',
      restant: 'Restant',
      date: '15/06/23',
      fin: ' 14/06/24',
    },
    {
      id: 4,
      price: 30 + '€',
      restant: 'Restant',
      date: '15/06/23',
      fin: ' 14/06/24',
    },
  ];

  const headerDataRemise = [
    {
      id: 1,
      code: 'NOEL',
      percentage: 10 + '%',
      service: 'FA',
      pays: ' ',
      produit: ' ',
      invlide: '14/06/24',
    },
    {
      id: 2,
      code: 'NOEL',
      percentage: 10 + '%',
      service: 'FA',
      pays: ' ',
      produit: ' ',
      invlide: '14/06/24',
    },
    {
      id: 3,
      code: 'NOEL',
      percentage: 10 + '%',
      service: '',
      pays: ' ',
      produit: 'IPhone 14',
      invlide: '14/06/24',
    },
  ];

  const [List, setList] = useState([{id: 1}, {id: 2}, {id: 3}]);
  const [Loader, setLoader] = useState(false);
  const [Avoirs, setAvoirs] = useState([]);
  const [AvoirTotal, setAvoirTotal] = useState(0);
  const [Remises, setRemises] = useState([]);
  const [user, setUser] = useState(null);


  useEffect(() => {

    async function fetchValue() 
    {
      setLoader(true);


      try 
      {
        const response = await axiosInstance.get('/avoirs/active/all/' + user);

        let total = 0;
        response.data.forEach(function (avoir)
        {
          let montant = parseFloat(avoir.montant);
          montant = isNaN(montant) ? 0 : montant;

          let montantConsomme = parseFloat(avoir.montantConsomme);
          montantConsomme = isNaN(montantConsomme) ? 0 : montantConsomme;

          total = total + (montant - montantConsomme);
        });

        setAvoirTotal(total);

        setAvoirs(response.data);
      }
      catch (erreur)
      {
        console.log('avoir fetch error', erreur);
      }

      try 
      {
        const userEmail = await getAuthentificationData();
        console.log("Admin :", userEmail);
        const response = await axiosInstance.get('/remises/all/'+ userEmail);

        console.log('response remises', response.data)

        setRemises(response.data);
      }
      catch (erreur)
      {
        console.log('commande fetch error', erreur);
      }

      setLoader(false);
    }

    async function fectUser(){
      setLoader(true);
      try{
        onAuthStateChanged(auth, (user) => {
          console.log('user', user);
          setUser(user.email)
        })
      }
      catch(error){
        console.log("Erreur :", error);
      }
      setLoader(false);
    }

    fectUser();
    fetchValue();

  }, []);


  const FlatListView = ({item, index}) => {
    return (
      <View style={styles.MainContainer}>
        <View style={{width: '65%', marginTop: 15}}>
          <Text style={styles.MainContainerText}>Total : {item.montant}</Text>
          <Text style={styles.MainContainerText}>Restant : {item.montant - item.montantConsomme}</Text>
          <Text style={styles.MainContainerText}>Début validité : {item.createdAt}</Text>
          <Text style={styles.MainContainerText}>Fin validité : {item.dateExpiration}</Text>
        </View>
      </View>
    );
  };

  const RemiseView = ({item, index}) => {
    return (
      <View style={styles.MainContainer}>
        <View style={{width: '65%', marginTop: 15}}>
          <Text style={styles.MainContainerText}>Code produit : {item.code}</Text>
          <Text style={styles.MainContainerText}>montant (en %) : {item.valeur}%</Text>
          <Text style={styles.MainContainerText}>Service : {item.service ? item.service.nom : ''}</Text>
          <Text style={styles.MainContainerText}>Pays : {item.paysLivraison ? item.paysLivraison.libelle : ''}</Text>
          <Text style={styles.MainContainerText}>Produit : {item.produit ? item.produit.name : ''}</Text>
        </View>
      </View>
    );
  };

  if (true === Loader)
  {
    return (<View style={{justifyContent: 'center', height: '80%'}}><ActivityIndicator size={'large'} color="#3292E0" /></View>);
  }


  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        nestedScrollEnabled={true}
        style={{marginBottom: 70, flex: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <HeaderEarth />

          <View style={{marginTop: 24, marginBottom: 12}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: windowWidth * 0.035,
                color: '#000',
                textAlign: 'center',
              }}>
              {t('Mes avoirs')} : {AvoirTotal}€
            </Text>
          </View>

          <View style={{paddingHorizontal: 18}}>
          <View
              style={{
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                backgroundColor: '#fff',
                paddingVertical: 16,
                paddingHorizontal: 22,
              }}>
              {headerTable.map((item, index) => (
                <View key={index}>
                  <Text
                    style={{
                      textTransform: 'capitalize',
                      color: '#000',
                      fontSize: windowWidth * 0.028,
                      textAlign: 'center',
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </View>
   

            {
              Avoirs.length !== 0 ? 
            <ScrollView horizontal={true} style={{width: 750}}>
              <FlatList
                data={Avoirs}
                style={{width: 375}}
                renderItem={({item}) => <RenderItem data={item} />}
                numColumns={1}
              />
            </ScrollView>
             : 
             <View style={{  alignItems: "center",justifyContent: 'center' ,backgroundColor: "#EDEDF3",borderBottomWidth: 1, borderBottomColor: "#E2E2E2" ,paddingVertical: 16, paddingHorizontal: 22, width: "100%"}}>
                  <Text style={{color: "#000", fontFamily: "Poppins-Medium", textTransform: "uppercase"}}>Nothing</Text>
                </View>
            }
          </View>

          <View style={{marginTop: 24, marginBottom: 12}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: windowWidth * 0.035,
                color: '#000',
                textAlign: 'center',
              }}>
              {t('Remises en cours')}
            </Text>
          </View>


          <View style={{}}>
            <DataTable style={{padding: 15}}>
              <DataTable.Header style={styles.tableHeader}>
                {headerRemise.map((item, index) => (
                  <DataTable.Title key={index} style={{maxWidth: item.width}}><Text style={styles.tableHeaderTitle}>{item.title}</Text></DataTable.Title>
                ))}
              </DataTable.Header>
              {Remises.map((item, index) => (
                <DataTable.Row key={index} style={styles.tableBody}>
                  <DataTable.Cell style={{maxWidth: 50}}><Text style={styles.tableBodyText}>{item.code}</Text></DataTable.Cell>
                  <DataTable.Cell style={{maxWidth: 40}}><Text style={styles.tableBodyText}>{item.valeur}%</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableBodyText}>{item.service ? item.service.nom : ''}</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableBodyText}>{item.paysLivraison ? item.paysLivraison.libelle : ''}</Text></DataTable.Cell>
                  <DataTable.Cell style={{paddingRight: 6}}><Text style={[styles.tableBodyText, {paddingRight: 50}]}>{item.produit ? item.produit.name : ''}</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableBodyText}>{item.dateFin}</Text></DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
  },
  tableHeader: {
    backgroundColor: '#FFF',
    paddingVertical: 6,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  tableBody: {
    backgroundColor: "#EDEDF3",borderBottomWidth: 1, borderBottomColor: "#E2E2E2", opacity: 1
  },
  tableBodyText :{
    color: "#000", fontFamily: "Poppins-Regular", fontSize: windowWidth * 0.026,
  },
  tableHeaderTitle:{
    fontSize:  windowWidth * 0.027,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    textTransform: "capitalize",
    textAlign: "center"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: windowHeight * 1.0,
  },
  MainContainer: {
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 5,
    height: 100,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 9,
  },
  ButtonStyle: {
    width: windowWidth * 0.2,
    height: 46,
    backgroundColor: '#DFE7F5',
    justifyContent: 'center',
    marginTop: 25,
    borderRadius: 5,
  },
  MainContainerText: {
    width: '80%',
    marginLeft: '13%',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  ButtonStyleText: {
    textAlign: 'center',
    color: '#042C5C',
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
  },
  headerTextcontainer: {
    // backgroundColor: 'red',
    width: windowWidth * 0.6,
    height: windowHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 20,
  },
  titleText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#000',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
});
export default RemiseAvoirScreen;
