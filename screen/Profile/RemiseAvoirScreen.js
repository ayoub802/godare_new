import {View, Text, ScrollView, FlatList, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {HeaderEarth} from '../../components/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RenderItem, RenderItemCode} from '../../components/RenderItem';
import {DataTable} from 'react-native-paper';

const RemiseAvoirScreen = () => {
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
      width: 100
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
                fontSize: 16,
                color: '#000',
                textAlign: 'center',
              }}>
              Mes avoirs : 80€
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
                      fontSize: 13,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </View>
            <ScrollView horizontal={true} style={{width: 750}}>
              <FlatList
                data={headerData}
                style={{width: 375}}
                renderItem={({item}) => <RenderItem data={item} />}
                numColumns={1}
              />
            </ScrollView>
          </View>

          <View style={{marginTop: 24, marginBottom: 12}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: '#000',
                textAlign: 'center',
              }}>
              Remises en cours
            </Text>
          </View>

          <View style={{}}>
            <DataTable style={styles.container}>
              <DataTable.Header style={styles.tableHeader}>
                {headerRemise.map((item, index) => (
                  <DataTable.Title key={index} style={{maxWidth: item.width}}><Text style={styles.tableHeaderTitle}>{item.title}</Text></DataTable.Title>
                ))}
              </DataTable.Header>
              {headerDataRemise.map((item, index) => (
                <DataTable.Row key={index} style={styles.tableBody}>
                  <DataTable.Cell><Text style={styles.tableBodyText}>{item.code}</Text></DataTable.Cell>
                  <DataTable.Cell style={{maxWidth: 40}}><Text style={styles.tableBodyText}>{item.percentage}</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableBodyText}>{item.service}</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableBodyText}>{item.pays}</Text></DataTable.Cell>
                  <DataTable.Cell style={{paddingRight: 6}}><Text style={[styles.tableBodyText, {paddingRight: 50}]}>{item.produit}</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableBodyText}>{item.invlide}</Text></DataTable.Cell>
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
    padding: 15,
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
    color: "#000", fontFamily: "Poppins-Regular", fontSize: 12,
  },
  tableHeaderTitle:{
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    textTransform: "capitalize",
    textAlign: "center"
  }
});
export default RemiseAvoirScreen;
