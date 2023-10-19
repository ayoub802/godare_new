
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPanier, getDepotValues, getLivraisonValues, getRemiseUsed, getAdresseIdFacturation, getCartPrices } from "./GestionStorage";



export const buildCommande = async () => {
    try
    {
       // Depot
      let depotValues = await getDepotValues();

      let depotMode = depotValues.depotMode;
      let depotNom =  depotValues.depotNom;
      let depotTelephone =  depotValues.depotTelephone;
      let depotCreneau =  depotValues.depotCreneau;
    
      let depotAdresse = depotValues.depotEnlevementAdresse;
      if ('magasin' == depotMode)
      {
        depotAdresse = depotValues.depotMagasinAdresse;
      }

      let depot = {};
      depot.mode = depotMode;
      depot.adresse = depotAdresse;
      depot.magasinId = depotValues.depotMagasin;

      if ('enlevement' == depotMode)
      {
        depot.nom = depotNom;
        depot.telephone = depotTelephone;
        depot.creneauId = depotCreneau;
      }

      // Livraison
      let livraisonValues = await getLivraisonValues();

      let livraison = {};
      livraison.mode = livraisonValues.livraisonMode;
      livraison.adresse = livraisonValues.livraisonAdresse;
      livraison.nom = livraisonValues.livraisonNom; 
      livraison.telephone = livraisonValues.livraisonTelephone;
      livraison.livraisonRelaisId = livraisonValues.livraisonRelaisId;
      livraison.livraisonAdresseId = livraisonValues.livraisonAdresseId;

      // Adresse facturation
      let adresseFacturationValue = await getAdresseIdFacturation();


      // Commande
      let prixTotalLivraison = livraisonValues.prixTotalLivraison;


      // Remise
      let remiseData = await getRemiseUsed();

      let remise = {};
      remise.value = remiseData.remiseValue;
      remise.code = remiseData.remiseCode;


      // commande
      let sommeFraisDouane = livraisonValues.sommeFraisDouane;


      // Total  price without discount
      let cartPrices = await getCartPrices();

      let cartFinalPriceWithoutAvoirRemise = cartPrices.finalPriceWithoutAvoirRemise;
      let tva = cartPrices.tvaTotal;

      let commande = {};

      commande.totalPrice = cartFinalPriceWithoutAvoirRemise;
      commande.prixLivraison = prixTotalLivraison;
      commande.fraisDouane = sommeFraisDouane ? sommeFraisDouane : 0;
      commande.tva = tva;


      // Product
      let basketData = await getPanier();
  
      let obj = {};
      let commandeProducts = [];
      let productImages = [];
      basketData.forEach(function (item){
        obj = {
          quantite: item.quantite,
          productId: item.ProductId,
          prixAchat: 'demandes-d-achat' == item.service ? item.Price : null,
          informationsComplementaire: item.informationsComplementaires,
          attributs: item.attributes,
          url: item.url
        };

        commandeProducts.push(obj);

        productImages.push({
          productId: item.ProductId,
          image: item.image
        });
      });


      return {
        depot: depot,
        livraison: livraison,
        remise: remise,
        commande: commande,
        products: commandeProducts,
        productImages: productImages,
        adresseFacturation: adresseFacturationValue.adresseIdFacturation,
        adresseFacturationType: adresseFacturationValue.adresseFacturationType,
        facturationNom: adresseFacturationValue.facturationNom
      };
    } 
    catch (error) {
        console.log('error', error);
        return null;
    }
}

