import { getPanier, getPaysLivraison, getPaysDepart, getParametrages } from "./GestionStorage";

/**
 * Permet de voir si on doit afficher un message pour les frais de douane
 * 
 * @param {object} douane 
 * @param {string} etatSelectionnee 
 * 
 * @returns {boolean}
 * 
 */
export async function afficherMessageDouane(etatSelectionnee, douane){

    if (!douane)
    {
        return false;
    }

    let parametrages = await getParametrages();


    if ('New' == etatSelectionnee)
    {
        if (!parametrages.messageFraisDouane)
        {
            return false;
        }

        if (douane.forfait > 0 || douane.coefficient > 0)
        {
            return parametrages.messageFraisDouane;
        }
    }

    if ('Used' == etatSelectionnee)
    {
        if (!parametrages.messageFraisUsageDouane)
        {
            return false;
        }

        if (douane.forfaitProduitOccasion > 0 || douane.coefficientProduitOccasion > 0)
        {
            return parametrages.messageFraisUsageDouane;
        }
    }
    
    return false;
}


export async function afficherMessageProduitServiceDifferent(productService, PaysLivraison){

    let panier = await getPanier();
    
    if (panier.length < 1)
    {
        return false;
    }


    let cartHasProductFromAnotherService = false;
    panier.map(ls => {
        if (ls.service != productService || ls.paysLivraison.id != PaysLivraison.id) {
            cartHasProductFromAnotherService = true;
        }
    });

    return cartHasProductFromAnotherService;
}