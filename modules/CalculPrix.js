

/**
 * Permet de calculer le prix de livraison
 * 
 * @param {array} data 
 * 
 */
export function calculProductPrices(data, remiseValue, RemiseProduct, type = 'avion'){

    let prix = 0;
    let quantite = 1;
    let frais = 0;
    let sommeFraisDouane = 0;
    let prixQuantite = 0;
    let totalPrix = 0;
    let prixFretRegroupement = 0;
    let productToApplyRemisePrice = 0;
    data.forEach(function (item){

      prix = parseFloat(item.Price);
      prix = isNaN(prix) ? 0 : prix;

      quantite = parseInt(item.quantite);
      quantite = isNaN(quantite) ? 1 : quantite;

      // Prix quantite
      prixQuantite = prix * quantite;

      if (RemiseProduct == item.ProductId)
      {
        productToApplyRemisePrice = prixQuantite;
      }

      // Frais de douane
      frais = 0;
      douane = item.product.productSpecificites[0].douane;

      if (douane)
      {
        let forfaitDouane = 'New' == item.StateValue ? douane.forfait : douane.forfaitProduitOccasion;
        let coefficientDouane = 'New' == item.StateValue ? douane.coefficient : douane.coefficientProduitOccasion;

        if (forfaitDouane)
        {
          frais = parseFloat(forfaitDouane);
          frais = isNaN(frais) ? 0 : frais;
          frais = frais * quantite;
        }
        else if (coefficientDouane)
        {
          frais = parseFloat(coefficientDouane);
          frais = isNaN(frais) ? 0 : frais;
          frais = (frais * item.ProductValue) / 100;
        }
      }

      sommeFraisDouane = sommeFraisDouane + frais;

      
      // Classe regroupement
      let classeRegroupements = item.product.productSpecificites[0].expedition;

      if ('avion' == type)
      {
        classeRegroupements = classeRegroupements ? classeRegroupements.classeRegroupementFretAvion : null;
      }
      else 
      {
        classeRegroupements = classeRegroupements ? classeRegroupements.classeRegroupementFretBateau : null;
      }

      if (!classeRegroupements)
      {
        classeRegroupements = [];
      }

      classeRegroupements.map(regroupement => {
        let classeRegroupementPrix = parseFloat(regroupement.prix);
        classeRegroupementPrix = isNaN(classeRegroupementPrix) ? 0 : classeRegroupementPrix;
        prixFretRegroupement = prixFretRegroupement + classeRegroupementPrix;
      });

      totalPrix = totalPrix + prixQuantite + frais + prixFretRegroupement;
    });

    let remiseTotal = parseFloat(remiseValue);
    remiseTotal = isNaN(remiseTotal) ? 0 : remiseTotal;
    remiseTotal = RemiseProduct ? ( (remiseTotal * productToApplyRemisePrice) / 100 ) : ( (remiseTotal * totalPrix) / 100 );
    remiseTotal = remiseTotal.toFixed(2);


    let totalPrixAvecDouaneRemiseAvoir = totalPrix - remiseTotal;
    totalPrixAvecDouaneRemiseAvoir = totalPrixAvecDouaneRemiseAvoir.toFixed(2);

    return {
        'sommeFraisDouane': sommeFraisDouane,
        'prixQuantite': prixQuantite,
        'totalPrix': totalPrix,
        'remiseTotal': remiseTotal,
        'totalPrixAvecDouaneRemiseAvoir': totalPrixAvecDouaneRemiseAvoir,
        'prixFretRegroupement': prixFretRegroupement
    }
}

/**
 * Permet de calculer le prix de livraison
 * 
 * @param {object} produit 
 * 
 */
export function calculFraisLivraison(produits)
{
  let produitsAvecLienClasseRegroupementLivraison = [];
  let produitsSansLienClasseRegroupementLivraison = [];

  let minLienClasseRegroupementLivraison = 1;
  let palierMinLienClasseRegroupementLivraison = 1;
  let prixMinLienClasseRegroupementLivraison = 1;
  let prixMaxMinLienClasseRegroupementLivraison = null;

  produits.forEach(function (produit)
  {
    let livraison = produit.product.productSpecificites[0].livraison;

     if (livraison && livraison.classeRegroupement)
     {
        produitsAvecLienClasseRegroupementLivraison.push(produit);

        if (livraison.classeRegroupement.lienClasseLivraison < minLienClasseRegroupementLivraison)
        {
          minLienClasseRegroupementLivraison = livraison.classeRegroupement.lienClasseLivraison;

          palierMinLienClasseRegroupementLivraison = livraison.classeRegroupement.palier;

          prixMinLienClasseRegroupementLivraison = livraison.classeRegroupement.prixLivraison;

          prixMaxMinLienClasseRegroupementLivraison = livraison.classeRegroupement.prixMaxLivraison;
        }
     }
     else 
     {
        produitsSansLienClasseRegroupementLivraison.push(produit);
     }
  });

  // Produits sans lien classe de regroupement
  let somme = 0;
  let fraisLivraison = 0;
  produitsSansLienClasseRegroupementLivraison.forEach(function (produit)
  {
      let quantite = produit.quantite;

      let livraison = produit.product.productSpecificites[0].livraison;
      let palier = livraison ? livraison.palier : 1;
      let prixLivraison = livraison ? livraison.prix : 1;
      let prixMaxLivraison = livraison ? livraison.prixMax : null;

      /**
       * Prix de livraison = (quantite / palier de livraison ) * prix de livraison
       * prendre le chiffre superieur
       */
      somme = Math.ceil ( ( quantite / palier  ) * prixLivraison );

      // Si cette somme est superieure au prix max de livraison alors prendre le prix max
      if (somme > prixMaxLivraison)
      {
        somme = prixMaxLivraison;
      }

      fraisLivraison = fraisLivraison + somme;
  });

    // Produits avec lien classe de regroupement
    // Avant de calculer le prix de livraison, on doit ramener les autres quantités à la quantite du lien
    // le plus bas et les additionner
    let quantiteAgregee = 0;
    let sommeQuantite = 0;
    produitsAvecLienClasseRegroupementLivraison.forEach(function (produit)
    {
      let livraison = produit.product.productSpecificites[0].livraison;

        if (livraison.classeRegroupement.lienClasseLivraison == minLienClasseRegroupementLivraison)
        {
          quantiteAgregee = quantiteAgregee + produit.quantite;
        }
        else 
        {
          sommeQuantite = minLienClasseRegroupementLivraison / livraison.classeRegroupement.lienClasseLivraison;
          sommeQuantite = sommeQuantite * produit.quantite;

          quantiteAgregee = quantiteAgregee + sommeQuantite;
        }
    });

    // Calcul du prix de livraison
    somme = Math.ceil ( ( quantiteAgregee / palierMinLienClasseRegroupementLivraison ) * prixMinLienClasseRegroupementLivraison );

    if (prixMaxMinLienClasseRegroupementLivraison && (somme > prixMaxMinLienClasseRegroupementLivraison))
    {
      somme = prixMaxMinLienClasseRegroupementLivraison;
    }

    let fraisLivraisonTotale = somme + fraisLivraison;

    return fraisLivraisonTotale;
}

export async function calculFraisTransit(produits, type)
{
  let produitsAvecLienClasseRegroupement = [];
  let produitsSansLienClasseRegroupement = [];

  let minLienClasseRegroupement = 1;
  let palierMinLienClasseRegroupement = 1;
  let prixMinLienClasseRegroupement = 1;
  let prixMaxMinLienClasseRegroupement = null;

  produits.forEach(function (produit)
  {
    let prodSpecificites = produit.product.productSpecificites[0];

    if ('avion' == type)
    {
      if (prodSpecificites.lienClasseTransitAvion)
      {
         produitsAvecLienClasseRegroupement.push(produit);
 
         if (prodSpecificites.lienClasseTransitAvion < minLienClasseRegroupement)
         {
           minLienClasseRegroupement = prodSpecificites.lienClasseTransitAvion;
 
           palierMinLienClasseRegroupement = prodSpecificites.palierFretAvion;
 
           prixMinLienClasseRegroupement = prodSpecificites.prixFretAvion;
 
           prixMaxMinLienClasseRegroupement = prodSpecificites.prixMaxTransitAvion;
         }
      }
      else 
      {
       produitsSansLienClasseRegroupement.push(produit);
      }
    }
    else 
    {
      if (prodSpecificites.lienClasseTransitBateau)
      {
         produitsAvecLienClasseRegroupement.push(produit);
 
         if (prodSpecificites.lienClasseTransitBateau < minLienClasseRegroupement)
         {
           minLienClasseRegroupement = prodSpecificites.lienClasseTransitBateau;
 
           palierMinLienClasseRegroupement = prodSpecificites.palierFretBateau;
 
           prixMinLienClasseRegroupement = prodSpecificites.prixFretBateau;
 
           prixMaxMinLienClasseRegroupement = prodSpecificites.prixMaxTransitBateau;
         }
      }
      else 
      {
       produitsSansLienClasseRegroupement.push(produit);
      }
    }
  });

  // Produits sans lien classe de regroupement
  let somme = 0;
  let fraisTransit = 0;
  produitsSansLienClasseRegroupement.forEach(function (produit)
  {
      let prodSpecificites = produit.product.productSpecificites[0];
 
      let quantite = produit.quantite;
      let palier = 'avion' == type ? prodSpecificites.palierFretAvion : prodSpecificites.palierFretBateau;
      let prix = 'avion' == type ? prodSpecificites.prixFretAvion : prodSpecificites.prixFretBateau;
      let prixMax = 'avion' == type ? prodSpecificites.prixMaxTransitAvion : prodSpecificites.prixMaxTransitBateau;

      somme = Math.ceil ( ( quantite / (palier ?? 1) ) * (prix ?? 1) );

      if (somme > prixMax)
      {
        somme = prixMax;
      }

      fraisTransit = fraisTransit + somme;
  });

    // Produits avec lien classe de regroupement
    // Avant de calculer le prix , on doit ramener les autres quantités à la quantite du lien
    // le plus bas et les additionner
    let quantiteAgregee = 0;
    let sommeQuantite = 0;
    produitsAvecLienClasseRegroupement.forEach(function (produit)
    {
      let prodSpecificites = produit.product.productSpecificites[0];

      let lienClasseRegroupement = 'avion' == type ? prodSpecificites.lienClasseTransitAvion : prodSpecificites.lienClasseTransitBateau;
       
        if (lienClasseRegroupement == minLienClasseRegroupement)
        {
          quantiteAgregee = quantiteAgregee + produit.quantite;
        }
        else 
        {
          sommeQuantite = minLienClasseRegroupement / lienClasseRegroupement;
          sommeQuantite = sommeQuantite * produit.quantite;

          quantiteAgregee = quantiteAgregee + sommeQuantite;
        }
    });

    // Calcul du prix de livraison
    somme = Math.ceil ( ( quantiteAgregee / palierMinLienClasseRegroupement ) * prixMinLienClasseRegroupement );

    if (prixMaxMinLienClasseRegroupement && (somme > prixMaxMinLienClasseRegroupement))
    {
      somme = prixMaxMinLienClasseRegroupement;
    }

    let fraisTransitTotale = somme + fraisTransit;

    return fraisTransitTotale;
}