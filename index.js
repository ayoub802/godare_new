/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent("Godare", () => App);

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById("Godare");
    AppRegistry.runApplication("Godare", { rootTag });
}