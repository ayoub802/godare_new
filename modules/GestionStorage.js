
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";



/**
 * Sauvegarde les services dans AsyncStorage
 * 
 * @param {array} remises 
 * @throws {Error} si les services ne sont pas de type tableau
 * 
 */
export async function saveRemises(remises){
    if (!Array.isArray(remises)){
        throw new Error('Remises doit être un tableau');
    }

    try {
        await AsyncStorage.setItem('remises', JSON.stringify(remises));
    } catch (error) {
        console.log('error', error);
    }
}


export async function saveConversationMessagesObject(messageObject){

    try {
        await AsyncStorage.setItem('conversationMessagesObject', JSON.stringify(messageObject));
    } catch (error) {
        console.log('error', error);
    }
}

export const getConversationMessagesObject = async () => {
    try{
        let conversationMessagesObject = await AsyncStorage.getItem('conversationMessagesObject');
        conversationMessagesObject = JSON.parse(conversationMessagesObject);

        return conversationMessagesObject ? conversationMessagesObject : [];
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function savePlatformLanguage(language){

    try {
        await AsyncStorage.setItem('platformLanguage', language);
    } catch (error) {
        console.log('error', error);
    }
}

export async function getPlatformLanguage(){

    try {
        let platformLanguage = await AsyncStorage.getItem('platformLanguage');

        platformLanguage = platformLanguage ? platformLanguage : 'fr';

        return platformLanguage;
    } catch (error) {
        console.log('error', error);

        return 'fr'; // Par défaut retourner le français
    }
}

/**
 * Retourne le pays selectionné dans AsyncStorage
 * 
 */
export const getAuth = async () => {
    try{
        let authStatusChecker = await AsyncStorage.getItem('authStatusChecker');

        return authStatusChecker;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export const getAuthUserEmail = async () => {
    try{
        let authUserEmail = await AsyncStorage.getItem('authUserEmail');

        return authUserEmail;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function saveMagasins(magasins){

    try {
        await AsyncStorage.setItem('magasins', JSON.stringify(magasins));
    } catch (error) {
        console.log('error', error);
    }
}

export const getMagasins = async () => {
    try{
        let magasins = await AsyncStorage.getItem('magasins');
        magasins = JSON.parse(magasins);

        return magasins ? magasins : [];
    } catch (error) {
        console.log('error', error);
        return [];
    }
}

export async function savePaysLivraison(paysLivraison){

    try {
        await AsyncStorage.setItem('paysLivraison', paysLivraison);
    } catch (error) {
        console.log('error', error);
    }
}

export const getAuthentificationData = async () => {
    try{
        let authUserEmail = await AsyncStorage.getItem('authUserEmail');

        return authUserEmail;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function saveAuthentificationData(email){

    try {
        await AsyncStorage.setItem('authStatusChecker', 'login');

        await AsyncStorage.setItem('authUserEmail', email);
    } catch (error) {
        console.log('error', error);
    }
}

export async function removeAuthentificationData(){

    try {
        await AsyncStorage.removeItem('authStatusChecker');
        await AsyncStorage.removeItem('authUserEmail');
    } catch (error) {
        console.log('error', error);
    }
}

export const getPaysLivraison = async () => {
    try{
        let paysLivraison = await AsyncStorage.getItem('paysLivraison');

        return paysLivraison;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function saveParametrages(parametrages){

    try {
        await AsyncStorage.setItem('parametrages', JSON.stringify(parametrages));
    } catch (error) {
        console.log('error', error);
    }
}

export const getParametrages = async () => {
    try{
        let parametrages = await AsyncStorage.getItem('parametrages');
        parametrages = JSON.parse(parametrages);

        return parametrages;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function saveConditionsMentions(conditionsMentionsLegales){

    try {
        await AsyncStorage.setItem('conditionsMentionsLegales', JSON.stringify(conditionsMentionsLegales));
    } catch (error) {
        console.log('error', error);
    }
}

export const getConditionsMentionsLegales = async () => {
    try{
        let conditionsMentionsLegales = await AsyncStorage.getItem('conditionsMentionsLegales');
        conditionsMentionsLegales = JSON.parse(conditionsMentionsLegales);

        return conditionsMentionsLegales;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}


export async function saveSelectedCountry(paysLivraison){
    try {
        await AsyncStorage.setItem('paysLivraison', JSON.stringify(paysLivraison));
    } catch (error) {
        console.log('error', error);
    }
}

export const getSelectedCountry = async () => {
    try{
        let paysLivraison = await AsyncStorage.getItem('paysLivraison');
        paysLivraison = JSON.parse(paysLivraison);

        return paysLivraison;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

/**
 * Sauvegarde le service selectionné dans AsyncStorage
 * 
 * @param {object} service 
 */
export async function saveSelectedService(service){

    try {
        await AsyncStorage.setItem('service', JSON.stringify(service));
    } catch (error) {
        console.log('error', error);
    }
}

/**
 * Retourne le pays selectionné dans AsyncStorage
 */
export const getSelectedService = async () => {
    try{

        let service = await AsyncStorage.getItem('service');
        service = JSON.parse(service);
  
        return service;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function saveServices(services){
    if (!Array.isArray(services)){
        throw new Error('Services doit être un tableau');
    }

    try {
        await AsyncStorage.setItem('services', JSON.stringify(services));
    } catch (error) {
        console.log('error', error);
    }
}


export const getServices = async () => {
    try{
        let services = await AsyncStorage.getItem('services');
        services = JSON.parse(services);

        return services ? services : [];
    } catch (error) {
        console.log('error', error);
        return [];
    }
}

export async function saveValidatedPanier(RemiseCode, RemiseValue, RemiseProduct){
    try {
        await AsyncStorage.setItem('cart_validation', 'true');
        await AsyncStorage.setItem('cart_remise', JSON.stringify(RemiseValue));
        await AsyncStorage.setItem('cart_remiseCode', JSON.stringify(RemiseCode));

        if (RemiseProduct)
        {
            await AsyncStorage.setItem('cart_remiseProduct', JSON.stringify(RemiseProduct));
        }
    } catch (error) {
        console.log('error', error);
    }
}


export const getRemiseUsed = async () => {
    try{
        let cartRemise = await AsyncStorage.getItem('cart_remise');
        cartRemise = JSON.parse(cartRemise);

        let cartRemiseCode = await AsyncStorage.getItem('cart_remiseCode');
        cartRemiseCode = JSON.parse(cartRemiseCode);

        let cartRemiseProduct = await AsyncStorage.getItem('cart_remiseProduct');
        cartRemiseProduct = JSON.parse(cartRemiseProduct);

        return {
            remiseValue: cartRemise ? cartRemise : 0,
            remiseCode: cartRemiseCode,
            remiseProduct: cartRemiseProduct
        };
    } catch (error) {
        console.log('error', error);
        return {
            remiseValue: null,
            remiseCode: null,
            remiseProduct: null
        };
    }
}

export const getNewAddedAddress = async () => {
    try{
        let newAddedAdresse = await AsyncStorage.getItem('newAddedAdresse');
        newAddedAdresse = JSON.parse(newAddedAdresse);

        return newAddedAdresse;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function savePanier(data){
    try {
        await AsyncStorage.setItem('cart_products', JSON.stringify(data));
    } catch (error) {
        console.log('error', error);
    }
}

/**
 * Retourne le pays selectionné dans AsyncStorage
 * 
 */
export const getPanier = async () => {
    try{
        let panier = await AsyncStorage.getItem('cart_products');
        
        panier = JSON.parse(panier);

        panier = panier ? panier : [];

        return panier;
    } catch (error) {
        console.log('error', error);
        return [];
    }
}

export const removePanier = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();

        let keysToRemove = [];
        keys.map((key) => {
            if (_.startsWith(key, 'cart'))
            {
                keysToRemove.push(key);
            }
        });

        if (keysToRemove.length > 0)
        {
            await AsyncStorage.multiRemove(keysToRemove);
        }

    } catch (error){
        console.log('error', error)
    }
}

export async function saveCreneaux(creneaux){
    try {
        await AsyncStorage.setItem('creneaux', JSON.stringify(creneaux));
    } catch (error) {
        console.log('error', error);
    }
}

export const getCreneaux = async () => {
    try{
        let creneaux = await AsyncStorage.getItem('creneaux');
        creneaux = JSON.parse(creneaux);

        return creneaux;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function saveDepotModeChoice(data){
    try {
        await AsyncStorage.setItem('cart_depotModeChoice', data);
    } catch (error) {
        console.log('error', error);
    }
}

export const getDepotModeChoice = async () => {
    try{
        let depotModeChoice = await AsyncStorage.getItem('cart_depotModeChoice');

        return depotModeChoice;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export async function saveDepotCreneau(data){
    try {
        await AsyncStorage.setItem('cart_depotCreneau', JSON.stringify(data));
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveDepotMagasinId(magasinId){
    try {
        await AsyncStorage.setItem('cart_depotMagasin', JSON.stringify(magasinId));
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveDepotAdresseId(data){
    try {
        await AsyncStorage.setItem('cart_depotAdresseId', JSON.stringify(data));
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveDepotMagasinValues(UserMagasinChoix, UserMagasinId){
    try {
        await AsyncStorage.setItem('cart_depotMode', 'magasin');
        await AsyncStorage.setItem('cart_depotMagasinAdresse', JSON.stringify(UserMagasinChoix));
        await AsyncStorage.setItem('cart_depotMagasinAdresseId', JSON.stringify(UserMagasinId));
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveDepotValidation(){
    try {
        await AsyncStorage.setItem('cart_depotValidation', 'true');
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveDepotAdresseValues(NomContact, TelContact, UserDomicileChoixLabel, UserDomicileId, departement, ville){
    try {
        await AsyncStorage.setItem('cart_depotMode', 'enlevement');
        await AsyncStorage.setItem('cart_depotNom', JSON.stringify(NomContact));
        await AsyncStorage.setItem('cart_depotTelephone', JSON.stringify(TelContact));
        await AsyncStorage.setItem('cart_depotEnlevementAdresse', JSON.stringify(UserDomicileChoixLabel));
        await AsyncStorage.setItem('cart_depotEnlevementAdresseId', JSON.stringify(UserDomicileId));
        await AsyncStorage.setItem('cart_depotDepartement', JSON.stringify(departement));
        await AsyncStorage.setItem('cart_depotVille', JSON.stringify(ville));
    } catch (error) {
        console.log('error', error);
    }
}

export const getDepotValues = async () => {
    try{
        let depotMode = await AsyncStorage.getItem('cart_depotMode');

        let depotMagasin = await AsyncStorage.getItem('cart_depotMagasin');
        depotMagasin = JSON.parse(depotMagasin);

        let depotMagasinAdresse = await AsyncStorage.getItem('cart_depotMagasinAdresse');
        depotMagasinAdresse = JSON.parse(depotMagasinAdresse);

        let depotMagasinAdresseId = await AsyncStorage.getItem('cart_depotMagasinAdresseId');
        depotMagasinAdresseId = JSON.parse(depotMagasinAdresseId);

        let depotAdresseId = await AsyncStorage.getItem('cart_depotAdresseId');
        depotAdresseId = JSON.parse(depotAdresseId);

        let depotNom = await AsyncStorage.getItem('cart_depotNom');
        depotNom = JSON.parse(depotNom);

        let depotTelephone = await AsyncStorage.getItem('cart_depotTelephone');
        depotTelephone = JSON.parse(depotTelephone);

        let depotEnlevementAdresse = await AsyncStorage.getItem('cart_depotEnlevementAdresse');
        depotEnlevementAdresse = JSON.parse(depotEnlevementAdresse);

        let depotEnlevementAdresseId = await AsyncStorage.getItem('cart_depotEnlevementAdresseId');
        depotEnlevementAdresseId = JSON.parse(depotEnlevementAdresseId);

        let depotDepartement = await AsyncStorage.getItem('cart_depotDepartement');
        depotDepartement = JSON.parse(depotDepartement);

        let depotVille = await AsyncStorage.getItem('cart_depotVille');
        depotVille = JSON.parse(depotVille);

        let depotCreneau = await AsyncStorage.getItem('cart_depotCreneau');
        depotCreneau = JSON.parse(depotCreneau);

        return {
            depotMode: depotMode,
            depotAdresseId: depotAdresseId,
            depotMagasin: depotMagasin,
            depotNom: depotNom,
            depotTelephone: depotTelephone,
            depotEnlevementAdresse: depotEnlevementAdresse,
            depotDepartement: depotDepartement,
            depotVille: depotVille,
            depotMagasinAdresse: depotMagasinAdresse,
            depotMagasinAdresseId: depotMagasinAdresseId,
            depotCreneau: depotCreneau,
            depotEnlevementAdresseId: depotEnlevementAdresseId
        };
    } catch (error) {
        console.log('error', error);
        return {
            depotMode: null,
            depotAdresseId: null,
            depotMagasin: null,
            depotNom: null,
            depotTelephone: null,
            depotEnlevementAdresse: null,
            depotDepartement: null,
            depotVille: null,
            depotMagasinAdresse: null,
            depotMagasinAdresseId: null,
            depotEnlevementAdresseId: null
        };
    }
}

export async function saveLivraisonAdresseId(adresseId){
    try {
        await AsyncStorage.setItem('cart_livraisonAdresseId', JSON.stringify(adresseId));
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveLivraisonMode(livraisonMode){
    try {
        await AsyncStorage.setItem('cart_livraisonMode', livraisonMode);
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveLivraisonRelaisId(UserMagasinId){
    try {
        await AsyncStorage.setItem('cart_livraisonRelaisId', JSON.stringify(UserMagasinId));
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveLivraisonPrices(prixTotalLivraison, totalPrixAvecDouaneRemiseAvoir, sommeFraisDouane){
    try {
        await AsyncStorage.setItem('cart_livraisonPrice', JSON.stringify(prixTotalLivraison));
        await AsyncStorage.setItem('cart_livraisonTotalPrixAvecDouaneRemiseAvoir', JSON.stringify(totalPrixAvecDouaneRemiseAvoir));
        await AsyncStorage.setItem('cart_sommeFraisDouane', JSON.stringify(sommeFraisDouane));
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveLivraisonMagasinData(UserMagasinLabel, UserMagasinId, NomContact, TelContact){
    try {

        await AsyncStorage.setItem('cart_livraisonAdresse', UserMagasinLabel);
        await AsyncStorage.setItem('cart_livraisonRelaisId', JSON.stringify(UserMagasinId));
        await AsyncStorage.setItem('cart_livraisonMode', 'relais');
        await AsyncStorage.setItem('cart_livraisonNom', NomContact);
        await AsyncStorage.setItem('cart_livraisonTelephone', JSON.stringify(TelContact));
        
        await AsyncStorage.setItem('cart_deliveryValidation', 'true');
    } catch (error) {
        console.log('error', error);
    }
}

export async function saveLivraisonDomicileData(UserDomicileLabel, UserDomicileId, NomContact, TelContact){
    try {

        await AsyncStorage.setItem('cart_livraisonMode', 'domicile');
        await AsyncStorage.setItem('cart_livraisonNom', NomContact);
        await AsyncStorage.setItem('cart_livraisonTelephone', JSON.stringify(TelContact));
        await AsyncStorage.setItem('cart_livraisonAdresse', UserDomicileLabel);
        await AsyncStorage.setItem('cart_livraisonAdresseId', JSON.stringify(UserDomicileId));
        
        await AsyncStorage.setItem('cart_deliveryValidation', 'true');
    } catch (error) {
        console.log('error', error);
    }
}

export const getLivraisonValues = async () => {
    try{
        let livraisonMode = await AsyncStorage.getItem('cart_livraisonMode');

        let livraisonNom =  await AsyncStorage.getItem('cart_livraisonNom');

        let livraisonTelephone =  await AsyncStorage.getItem('cart_livraisonTelephone');
        livraisonTelephone = JSON.parse(livraisonTelephone);
  
        let livraisonAdresse =  await AsyncStorage.getItem('cart_livraisonAdresse');

        let prixTotalLivraison = await AsyncStorage.getItem('cart_livraisonPrice');
        prixTotalLivraison = JSON.parse(prixTotalLivraison);

        let livraisonRelaisId = await AsyncStorage.getItem('cart_livraisonRelaisId');
        livraisonRelaisId = JSON.parse(livraisonRelaisId);

        let adresseId = await AsyncStorage.getItem('cart_livraisonAdresseId');
        adresseId = JSON.parse(adresseId);

        let livraisonTotalPrixAvecDouaneRemiseAvoir = await AsyncStorage.getItem('cart_livraisonTotalPrixAvecDouaneRemiseAvoir');
        livraisonTotalPrixAvecDouaneRemiseAvoir = JSON.parse(livraisonTotalPrixAvecDouaneRemiseAvoir);

        let sommeFraisDouane = await AsyncStorage.getItem('cart_sommeFraisDouane');
        sommeFraisDouane = JSON.parse(sommeFraisDouane);


        return {
            livraisonMode: livraisonMode,
            livraisonNom: livraisonNom,
            livraisonTelephone: livraisonTelephone,
            livraisonAdresse: livraisonAdresse,
            prixTotalLivraison: prixTotalLivraison,
            livraisonRelaisId: livraisonRelaisId,
            livraisonAdresseId: adresseId,
            livraisonTotalPrixAvecDouaneRemiseAvoir: livraisonTotalPrixAvecDouaneRemiseAvoir,
            sommeFraisDouane: sommeFraisDouane
        };
    } catch (error) {
        
        return {
            livraisonMode: null,
            livraisonNom: null,
            livraisonTelephone: null,
            livraisonAdresse: null,
            prixTotalLivraison: null,
            livraisonRelaisId: null,
            livraisonAdresseId: null,
            livraisonTotalPrixAvecDouaneRemiseAvoir: null,
            sommeFraisDouane: null
        };
    }
}

export async function savePrixFinalPanier(totalPrice, CartTotalPriceSansRemiseAvoir, remiseTotal, tva){
    try {
        await AsyncStorage.setItem('cart_finalPrice', JSON.stringify(totalPrice));
        await AsyncStorage.setItem('cart_finalPriceWithoutAvoirRemise', JSON.stringify(CartTotalPriceSansRemiseAvoir));
        await AsyncStorage.setItem('cart_tvaTotal', JSON.stringify(tva));

        if (remiseTotal)
        {
            await AsyncStorage.setItem('cart_remiseTotal', JSON.stringify(remiseTotal));
        }

    } catch (error) {
        console.log('error', error);
    }
}

export async function saveCartAvoir(AvoirValue){
    try {
        AsyncStorage.setItem('cart_avoirValue', JSON.stringify(AvoirValue));
    } catch (error) {
        console.log('error', error);
    }
}

export const getCartPrices = async () => {
    try{
        let finalPrice = await AsyncStorage.getItem('cart_finalPrice');
        finalPrice = JSON.parse(finalPrice);

        let finalPriceWithoutAvoirRemise = await AsyncStorage.getItem('cart_finalPriceWithoutAvoirRemise');
        finalPriceWithoutAvoirRemise = JSON.parse(finalPriceWithoutAvoirRemise);

        let avoirValue = await AsyncStorage.getItem('cart_avoirValue');
        avoirValue = JSON.parse(avoirValue);

        let remiseTotal = await AsyncStorage.getItem('cart_remiseTotal');
        remiseTotal = JSON.parse(remiseTotal);

        let tvaTotal = await AsyncStorage.getItem('cart_tvaTotal');
        tvaTotal = JSON.parse(tvaTotal);


        return {
            finalPrice: finalPrice,
            finalPriceWithoutAvoirRemise: finalPriceWithoutAvoirRemise,
            avoirValue: avoirValue,
            remiseTotal: remiseTotal,
            tvaTotal: tvaTotal
        };
    } catch (error) {
        console.log('error', error);
        return {
            finalPrice: null,
            finalPriceWithoutAvoirRemise: null,
            avoirValue: null,
            remiseTotal: null,
            tvaTotal: null
        };
    }
}

export async function saveAdresseIdFacturation(addressId, NomFacturation, type){
    try {
        await AsyncStorage.setItem('cart_adresseFacturationId', JSON.stringify(addressId));
        await AsyncStorage.setItem('cart_adresseFacturationType', type);
        await AsyncStorage.setItem('cart_facturationNom', NomFacturation);
    } catch (error) {
        console.log('error', error);
    }
}

export const getAdresseIdFacturation = async () => {
    try{
        let adresseIdFacturation =  await AsyncStorage.getItem('cart_adresseFacturationId');
        adresseIdFacturation = JSON.parse(adresseIdFacturation);

        let adresseFacturationType =  await AsyncStorage.getItem('cart_adresseFacturationType');

        let facturationNom =  await AsyncStorage.getItem('cart_facturationNom');

        return {
            adresseIdFacturation: adresseIdFacturation,
            adresseFacturationType: adresseFacturationType,
            facturationNom: facturationNom
        };
    } catch (error) {
        return {
            adresseIdFacturation: null,
            adresseFacturationType: null,
            facturationNom: null
        };
    }
}