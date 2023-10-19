import { View, Text } from 'react-native'
import React, { useState } from 'react'
import StepIndicator from 'react-native-step-indicator';
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 25,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 9.5,
    stepStrokeCurrentColor: '#2BA6E9',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#2BA6E9',
    stepStrokeUnFinishedColor: '#F2F2F2',
    separatorFinishedColor: '#2BA6E9',
    separatorUnFinishedColor: '#F2F2F2',
    stepIndicatorFinishedColor: '#2BA6E9',
    stepIndicatorUnFinishedColor: '#F2F2F2',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#7eaec4',
    
}


const SteperCounter = ({ position, count}) => {
    const [currentPosition, setCurrentPosition] = useState(position)
    const onStepPress = (position) => {
        setCurrentPosition(position);
      };
  return (
    <View style={{ marginTop: 10}}>
        <View style={{ marginHorizontal: 0}}>
            <StepIndicator
                customStyles={customStyles}
                currentPosition={currentPosition}
                stepCount={count}
                onPress={onStepPress}
                
            />
        </View>
    </View>
  )
}

export default SteperCounter