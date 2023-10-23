import {StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //     justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headingContainer: {
    // backgroundColor: 'tomato',
    marginTop: windowHeight * 0.03,
    alignSelf: 'center',
  },
  headingText: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  superMethodsContainer: {
    // backgroundColor: 'tomato',
    width: windowWidth * 0.9,
    height: windowHeight * 0.6,
    alignSelf: 'center',
    marginTop: windowHeight * 0.03,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  PaymentMethodContainer: {
    backgroundColor: '#3292E0',
    width: windowWidth * 0.7,
    height: windowHeight * 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  PaymentMethodText: {
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    //     backgroundColor: 'tomato',
    width: windowWidth * 0.4,
    textAlign: 'center',
  },
});

export default styles;
