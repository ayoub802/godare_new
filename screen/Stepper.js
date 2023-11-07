import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import StepIndicator from 'react-native-step-indicator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const labels = ["Panier","Dépot","Livraison","Confirmation"];

const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 4.5,
    stepStrokeCurrentColor: '#2BA6E9',
    stepStrokeWidth: 5,
    stepStrokeFinishedColor: '#2BA6E9',
    stepStrokeUnFinishedColor: '#CBCBCB',
    separatorFinishedColor: '#7eaec4',
    separatorUnFinishedColor: '#dedede',
    stepIndicatorFinishedColor: '#FFF',
    stepIndicatorUnFinishedColor: '#CBCBCB',
    stepIndicatorCurrentColor: '#fff',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: '#000',
    stepIndicatorLabelFinishedColor: '#000',
    stepIndicatorLabelUnFinishedColor: '#000',
    labelColor: '#999999',
    labelSize: 11,
    currentStepLabelColor: '#000',
    labelFontFamily: "Poppins-Medium"
    
}
const Stepper = ({ position}) => {

    const navigation = useNavigation();
    const [currentPosition, setCurrentPosition] = useState(position)
    const onStepPress = async (position) => {
        setCurrentPosition(position);
        if(position === 0){
            navigation.navigate('Cart', {screen: 'WeightCal'});
        }
        if(position === 1){
            let cartValidation = await AsyncStorage.getItem('cart_validation');
            
            if (!cartValidation)
            {
                return Alert.alert(
                    t('Information'),
                    t('Vous devez valider le panier afin de pouvoir accéder à cette section'),
                    [
                      {
                        text: 'OK',
                        style: 'cancel',
                      }
                    ],
                  );
            }

		    navigation.navigate("DepotScreen1");
        }
        if(position === 2){
            let depotValidation = await AsyncStorage.getItem('cart_depotValidation');


              if (!depotValidation)
              {
                  return Alert.alert(
                      t('Information'),
                      t('Vous devez completer les informations de dépôt afin de pouvoir accéder à cette section'),
                      [
                        {
                          text: 'OK',
                          style: 'cancel',
                        }
                      ],
                    );
            }

		    navigation.navigate("Livraison1");
        }
        if(position === 3){
            let deliveryValidation = await AsyncStorage.getItem('cart_deliveryValidation');

            if (!deliveryValidation)
            {
                return Alert.alert(
                    t('Information'),
                    t('Vous devez completer les informations de livraison afin de pouvoir accéder à cette section'),
                    [
                      {
                        text: 'OK',
                        style: 'cancel',
                      }
                    ],
                  );
            }

		    navigation.navigate("CheckoutScreen");
        }
        if(position === 4){
            console.log("Number 4");
        }
      };
  return (
    <View style={{ marginTop: 10}}>
        <View style={{ marginHorizontal: 45}}>
            <StepIndicator
                customStyles={customStyles}
                currentPosition={currentPosition}
                stepCount={4}
                labels={labels}
                onPress={onStepPress}
            />
        </View>
    </View>
  )
}


export default Stepper