//import liraries
import React, {useEffect} from 'react';
import {View, Text, Image, StatusBar,TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import Earth from "../../assets/images/LOGO_GS.png"
import Shape1 from "../../assets/images/shape_1.png"
import Shape2 from "../../assets/images/shape_2.png"


// create a component
const Splash = props => {

  useEffect(() => {
      setTimeout(() => {
        const {navigate} = props.navigation;
        navigate('BottomTab');
      }, 2000);
  }, []);

  return (
    // <LinearGradient
    //   colors={['#3885DA', '#29A9EA', '#3A7FD8']}
    //   style={styles.container}>
    //   <StatusBar backgroundColor="#3885DA" barStyle="light-content" />
    //   <View style={styles.INContainer}>
    //     <Image style={styles.imageStyler} source={Earth} resizeMode="center" />
        
    //     <Text style={styles.mainTextStyle}>GS</Text>
        
    //   </View>
    //   <View style={styles.bottomTextView}>
    //     <TouchableOpacity>
    //     <Text style={styles.footerTextStyle}>Godare Services</Text>
    //     </TouchableOpacity>
    //   </View>
    // </LinearGradient>
    <View style={{flex: 1, position: "relative", height: "100%", backgroundColor: "#2DA0E6"}}>
            <StatusBar backgroundColor="#2DA0E6" barStyle="light-content" />
            <View style={{flex: 1, alignItems:"center", justifyContent: "center", marginTop: -50}}>
                <Image source={Earth} style={{width: 200, height: 199, marginBottom: 10}}/>
                <Text style={{fontSize: 24, fontFamily: "Roboto-Medium", color: "#fff"}}>Godare Services</Text>
            </View>
            <View style={{position: "absolute", top: "40%", left: 0}}>
              <Image source={Shape1}/>
            </View>
            <View style={{position: "absolute", top: "15%", right: 0}}>
              <Image source={Shape2}/>
            </View>
    </View>
  );
};

//make this component available to the app
export default Splash;
