import {StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabsContainer: {
    // backgroundColor: 'tomato',
    width: windowWidth * 1.0,
    height: windowHeight * 0.05,
    flexDirection: 'column',
   // alignItems: 'center',
   // justifyContent: 'space-around',
  //  alignSelf: 'center',
    position: 'absolute',
    top: windowHeight * 0.1,
  },
  tabNameContainer: {
    // backgroundColor: 'green',
    borderBottomColor: '#fff',
    // borderBottomWidth: 2,
  },
  tabarTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#fff',
    marginLeft: windowWidth * 0.1,
    paddingTop: windowHeight * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  selectCountryTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#fff',
    paddingLeft: windowWidth * 0.1,
    paddingTop: windowHeight * 0.01,
  },
  headerStyle: {
    backgroundColor: '#3292E0',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 280,
    borderBottomEndRadius: 250,
    borderBottomLeftRadius: 250,
    transform: [{scaleX: 1.3}],
    zIndex: 1,
  },
  mainTextStyle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: '#fff',
  },
  INContainer: {
    width: 100,
    height: windowHeight * 0.1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'tomato',
    alignSelf: 'center',
    marginLeft: 170,
    marginRight: 140,
    // marginTop: 60,
  },
  imageStyler: {
    width: windowWidth * 0.14,
    height: windowHeight * 0.09,
  },
  subTabbarContainer: {
    backgroundColor: '#DCE5F4',
    height: windowHeight * 0.055,
    width: windowWidth * 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center',
    // padding: 10,
    elevation: 5,
    // marginBottom: 10,
  },
  subTabbarContainerFilter: {
 
    height: windowHeight * 0.055,
    width: windowWidth * 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'center',
    elevation: 5,
    justifyContent: 'center',
  
  },
  subTabbarScrollContainer: {
    alignSelf: 'center',
    // backgroundColor: 'tomato',
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconStyler: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    // backgroundColor: 'green',
  },
  textActive:{
    color: "#376AED"
  },
  text: {
    color: "#616162"
},
  imageTextContainer: {
    flexDirection: 'row',
    height: windowHeight * 0.035,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: windowWidth * 0.28,
    // margin: 5,
  },
  filterTextContainer: {
    flexDirection: 'row',
    height: windowHeight * 0.035,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: windowWidth * 0.15,
    backgroundColor: '#fff', 
    elevation: 3, 
    borderRadius: 5,
    margin:windowWidth * 0.01,
  },
  filterTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    color: '#000',
    width: windowWidth * 0.2,
    height: windowHeight * 0.035,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
   
  },
  subtabarTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 7,
    color: '#000',
    // backgroundColor: 'gold',
    width: windowWidth * 0.2,
    height: windowHeight * 0.035,
    textAlign: 'center',
    textAlignVertical: 'center',
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
});

export default styles;
