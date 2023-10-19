 
import {
    NativeModules, 
    Platform
} from 'react-native';

import { savePlatformLanguage } from './GestionStorage';


export const GetPlatformLanguageAndSavedInStorage = async () => {

    let deviceLanguage =
        Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;


    // si n'avons pas le français alors mettre en anglais
    deviceLanguage = deviceLanguage.includes('fr_') ? 'fr' :  'en';

    await savePlatformLanguage(deviceLanguage); 

    return deviceLanguage;
}