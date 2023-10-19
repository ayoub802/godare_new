import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import StepIndicator from 'react-native-step-indicator';
const labels = ["Panier","Dépot","Livraison","Confirmation"];

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 1.5,
    currentStepStrokeWidth: 5.5,
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

    const [currentPosition, setCurrentPosition] = useState(position)
    const onStepPress = (position) => {
        setCurrentPosition(position);
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