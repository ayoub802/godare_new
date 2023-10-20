//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //     backgroundColor: '#fff',
  },
  mainTextStyle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: '#fff',
  },
  INContainer: {
    width: windowWidth * 0.22,
    height: windowHeight * 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: '#000',
    alignSelf: 'center',
    marginLeft: 50,
  },
  imageStyler: {
    // backgroundColor: 'tomato',
    width: 48,
    height: 47,
  },
  profileLogo: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    //     backgroundColor: 'tomato',
  },
  inputContainer: {
    // marginTop: windowHeight * 0.1,
  },
  inputCustom: {
    marginTop: windowHeight * 0.02,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: windowWidth * 0.8,
    height: windowHeight * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  inputNumbCustom: {
    marginTop: windowHeight * 0.02,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: windowWidth * 0.8,
    height: windowHeight * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  inputNumbStyled: {
    width: windowWidth * 0.57,
    // backgroundColor: 'green',
    marginLeft: windowWidth * 0.03,
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  errorMessageTextStyle: {
    color: 'red',
    textAlign: 'left',
    // backgroundColor: 'gold',
    width: windowWidth * 0.6,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
    fontSize: 12,
  },
  inputStyled: {
    width: windowWidth * 0.55,
    // backgroundColor: 'green',
    marginLeft: windowWidth * 0.03,
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  forgotPassContainer: {
    marginTop: windowHeight * 0.02,
  },
  forgotText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  Auth1: {
    backgroundColor: '#042C5C',
    borderRadius: 50,
    width: windowWidth * 0.6,
    height: windowHeight * 0.055,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.02,
    elevation: 2,
  },
  AuthButtonText: {
    fontSize: 12,
    color: '#fff',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.5,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
  },
  mainAuthBContain: {
    marginTop: windowHeight * 0.05,
  },
});

export default styles;
