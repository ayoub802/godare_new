import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = "https://godaregroup.com/api";


const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: false
});


// Ne pas tenter de regenrer 2 fois le token si on a toujours un 401
let tokenGeneration = false; 


// Fonction pour generer le token JWT
const generateToken = async () => 
{
  const username = 'apigodare@godaregroup.com';
  const password = 'godare_api_A7d8c5v4b5e@@7ss4d1';

  try 
  {
    // Generer le token
    const response = await axiosInstance.post('/login_check', {
      username: username,
      password: password
    });

    const token = response.data.token;

    // Sauvegarder le nouveau token dans AsyncStorage
    await AsyncStorage.setItem('jwt_token', token);

    return token;
  } 
  catch (error) 
  {
    console.error('Erreur lors de la génération du token :', error);
    throw error;
  }
};


// Ajouter un intercepteur pour ajouter le token JWT à chaque requête sortante
/*
axiosInstance.interceptors.request.use(async (config) => 
{
  // Récupérer le token JWT
  let token = await AsyncStorage.getItem('jwt_token');

  // Ajouter le token
  if (token) 
  {
    config.headers.Authorization = `Bearer ${token}`;
  }

  //console.log('axios request', JSON.stringify(config, null, 2))

  return config;
}, (error) => 
{
  return Promise.reject(error);
});

// Ajouter un intercepteur pour gérer la réponse 401 "Expired JWT Token"
axiosInstance.interceptors.response.use((response) => 
{
  //console.log('axios response', JSON.stringify(response, null, 2));

  return response;

}, async (error) => 
{
  // Vérifier si la réponse est une erreur 401 "Expired JWT Token"
  if (error.response && error.response.status === 401 && (error.response.data.message === "Expired JWT Token" || error.response.data.message === "JWT Token not found")) 
  { 
    if (!tokenGeneration)
    {
      try 
      {
        // Générer un nouveau token
        const newToken = await generateToken();

        // Pour éviter de refaire la generation si on a tjr une erreur 401
        tokenGeneration = true;

        // Récupérer la configuration de la requête originale
        const config = error.config;

        // Mettre à jour l'en-tête de la requête avec le nouveau token
        config.headers.Authorization = `Bearer ${newToken}`;

        // Refaire la requête avec le nouveau token
        return axiosInstance.request(config);
      } 
      catch (error) 
      {
        console.error('Erreur lors de la génération du nouveau token :', error);
      }
    }
  }

  // Si la réponse n'est pas une erreur 401 "Expired JWT Token", renvoyer l'erreur d'origine
  return Promise.reject(error);
});

*/


export default axiosInstance