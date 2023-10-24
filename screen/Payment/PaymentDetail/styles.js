import {StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //     justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  PaymentInputsContainer: {
    // backgroundColor: 'tomato',
    height: windowHeight * 0.22,
    width: windowWidth * 0.9,
    marginTop: windowHeight * 0.03,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputContainer: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: windowWidth * 0.8,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4EBF9',
  },
  inputStyle: {
    backgroundColor: '#000',
    width: windowWidth * 0.6,
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  typesCardContainer: {
    // backgroundColor: 'tomato',
    width: 245,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.05,
  },
  cardTypeImageStyle: {
    width: 245,
    height: 37,
    alignSelf: 'center',
  },
  btnContainer: {
    backgroundColor: '#3292E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.2,
    width: windowWidth * 0.7,
    height: windowHeight * 0.07,
    borderRadius: 40,
  },
  btnText: {
    fontFamily: 'Roboto-Regular',
    color: '#fff',
  },
  headingText: {
    marginTop:20,
    marginBottom: 20,
    color: '#000',
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  CardMainContainer: {
    flexDirection: 'row',
    width: '81%',
    alignSelf: 'center',
    marginTop: 15,
  },
  CardField: {
    flexDirection: 'row',
    height: 30,
    width: '88%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  CardFieldImage: {
    width: '15%',
    height: 25,
    marginLeft: '2%',
  },
  CardFieldText: {
    fontSize: 10,
    color: '#34B3E8',
    marginLeft: '4%',
    marginTop: 7,
  },
  CardCircle: {
    marginLeft: '5%',
    marginTop: 3,
  },
  centeredView:{
    // backgroundColor:'red',
    width:"90%",
    height:'90%',
    alignSelf:'center',
    marginTop:'auto',
    marginBottom:'auto'
  },
  cross:{
    backgroundColor:'red',
    marginRight:20,
    marginTop:10,
    marginLeft:'auto',
    width:30,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:100
  },
  image:{
    width:50,
    height:50

  }
});

export default styles;
