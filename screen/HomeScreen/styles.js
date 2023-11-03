import {Dimensions, StyleSheet} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  // },
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#444",
    fontSize: 28,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    color: "#000",
    paddingVertical: 4,
  },
  selectedText: {
    fontSize: 18,
    fontWeight: "600",
    color: "tomato",
    paddingVertical: 4,
  },
  serviceContainer: {
    backgroundColor: '#fff',
    elevation: 1,
    width: windowWidth * 0.44,
    height: windowHeight * 0.28,
    borderRadius: 10,    
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    paddingBottom: 16,
  },
  ImageStyle: {
    // backgroundColor: 'tomato',
    width: windowWidth * 0.44,
    height: windowHeight * 0.15,
    alignSelf: 'center',
    marginBottom: 10,
  },
  textStylehead: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold", 
    textAlign: "center", 
    color: "#000",
    width: windowWidth * 0.44,
    margin: 2,
  },
  textStyletail: {
    textAlign: "center", 
    fontSize: 9, 
    fontFamily: "Poppins-Regular",
    // backgroundColor: 'tomato',
    width: windowWidth * 0.44,
    color:"#000"
  },
  superContainer: {
    // backgroundColor: 'tomato',
    width: windowWidth * 0.95,
    height: windowHeight * 0.6,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: windowHeight * 0.08,
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
