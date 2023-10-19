import {Dimensions, StyleSheet} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  serviceContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    width: windowWidth * 0.44,
    height: windowHeight * 0.28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ImageStyle: {
    // backgroundColor: 'tomato',
    width: windowWidth * 0.44,
    height: windowHeight * 0.15,
    alignSelf: 'center',
    marginBottom: 10,
  },
  textStylehead: {
    fontSize: 14,
    fontFamily: 'Roboto-bold',
    color: '#3885DA',
    textAlign: 'center',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.44,
    margin: 2,
  },
  textStyletail: {
    fontSize: 9,
    color: '#3885DA',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.44,
  },
  superContainer: {
    // backgroundColor: 'tomato',
    width: windowWidth * 0.95,
    height: windowHeight * 0.6,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: windowHeight * 0.02,
  },
  childContainer: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: windowWidth * 0.95,
    height: windowHeight * 0.3,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 11,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    // backgroundColor: 'tomato',
    width: windowWidth * 0.4,
    textAlign: 'center',
  },
  cameraGallerybuttons: {
    backgroundColor: '#1A6CAF',
    height: 50,
    width: windowWidth * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default styles;
