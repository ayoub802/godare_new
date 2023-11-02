import {StyleSheet, Dimensions} from 'react-native';
import commonStyle from '../../helper/commonStyle';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
  },
  HeadingText: {
    fontFamily: commonStyle.regular,
    fontSize: 22,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
    fontFamily: commonStyle.Bold
  },
  CardImage: {
    width: '80%',
    height: 180,
    alignSelf: 'center',
    marginBottom: 20,
  },
  LeftSubHeading: {
    fontSize: 9,
    fontFamily: commonStyle.regular,
    marginLeft: '10%',
    // backgroundColor: 'tomato',
    alignSelf: 'flex-start',
  },
  CardMainContainer: {
    flexDirection: 'row',
    width: '81%',
    alignSelf: 'center',

    marginTop: 15,
  },
  CardFeild: {
    flexDirection: 'row',
    height: 30,
    width: '88%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  CardFeildImage: {
    width: '15%',
    height: 25,
    marginLeft: '2%',
  },
  CardFeildText: {
    fontSize: 10,
    color: '#34B3E8',
    marginLeft: '4%',
    marginTop: 7,
  },
  CardCircle: {
    marginLeft: '5%',
    marginTop: 3,
  },
  ButtonContainer: {
    width: '60%',
    height: 45,
    borderRadius: 60,
    justifyContent: 'center',
    backgroundColor: '#3292E0',
    marginTop: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  ButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
});

export default styles;
