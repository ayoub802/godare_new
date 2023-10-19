import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import AppNavigation from './navigation/AppNavigation'
import SplashScreen from 'react-native-splash-screen'

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])
  
  return (
    <AppNavigation />
  )
}

export default App