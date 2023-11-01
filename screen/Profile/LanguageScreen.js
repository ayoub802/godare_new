import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { savePlatformLanguage } from '../../modules/GestionStorage';
import { Dropdown } from 'react-native-element-dropdown';
import { HeaderEarth } from '../../components/Header';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const LanguageScreen = (props) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const {t, i18n} = useTranslation();
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);

  const data = [
    {
      label: 'Français',
      value: 'fr',
    },
    {
      label: 'English',
      value: 'en',
    },
  ];


  const changeLanguage = async () => {

  
    await savePlatformLanguage(value);

    props.navigation.goBack();

    console.log(value);

    i18n.changeLanguage(value)
      .then(() => setCurrentLanguage(value))
      .catch(err => console.log(err));
  };

  return (
    <View>
      <HeaderEarth />
      <View style={styles.dropContainerStyle}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          autoScroll
          iconStyle={styles.iconStyle}
          containerStyle={styles.containerrrrStyle}
          data={data}
          maxHeight={120}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Français' : '...'}
          value={value}
          showsVerticalScrollIndicator={false}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View>
      <View style={{justifyContent: "center", alignItems: "center"}}>
        <Text>{t('Hey')}</Text>
      </View>
      <TouchableOpacity
        style={styles.ButtonContainer}
        onPress={() => changeLanguage()}>
        <Text style={styles.ButtonText}>{t('valider')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerStyle: {
    flex: 1,
  },
  spacerStyle: {
    marginBottom: 15,
  },
  safeContainerStyle: {
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ButtonContainer: {
    width: '40%',
    height: 45,
    borderRadius: 60,
    justifyContent: 'center',
    backgroundColor: '#3292E0',
    marginTop: windowHeight * 0.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  ButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  dropContainerStyle: {
    justifyContent: 'center',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.9,
    // borderRadius:0
    alignSelf: 'center',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.01,
  },

  dropdown: {
    height: 50,
    borderRadius: 7,
    paddingHorizontal: 17,
    backgroundColor: '#fff',
    // elevation: 1,
    width: windowWidth * 0.8,
    borderWidth: 1,
    borderColor: '#DADAED',
    alignSelf: 'center',
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
  containerrrrStyle: {
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 100,
  },
});

export default LanguageScreen