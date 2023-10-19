import axiosInstance from "../../axiosInstance";


export const fetchPaymentIntentClientSecret = async (amount, email, nom, savedCard) => {

  const response = await axiosInstance.post('/stripe/payment', {
    amount: amount * 100,
    email: email,
    nom: nom,
    savedCard: savedCard
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data.paymentIntent;
};

export const doPaymentWithSavedCard = async (email, cardId, amount) => {

  const response = await axiosInstance.post('/stripe/payment/use_saved_card', {
    email: email,
    cardId: cardId,
    amount: amount * 100
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};


export const getClientCards = async (email) => {

    const response = await axiosInstance.post('/stripe/all/cards', {
      email: email
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    return response.data;
};

export const saveCard = async (email, nom, paymentMethodId) => {

  const response = await axiosInstance.post('/stripe/save/cards', {
    paymentMethodId: paymentMethodId,
    email: email,
    nom: nom
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};

export const removeCard = async (email, cardId) => {

  const response = await axiosInstance.post('/stripe/remove/cards', {
    cardId: cardId,
    email: email
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};

