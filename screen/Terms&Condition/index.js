import { View, Text } from 'react-native'
import React from 'react'
import axiosInstance from '../../axiosInstance';
import { getConditionsMentionsLegales } from '../../modules/GestionStorage';
import RenderConditionsMentionsLegale from '../../components/RenderConditionsMentionsLegale';

const TermsConditions = () => {
  
  const [ActivityMentionsConditions, setActivityMentionsConditions] = useState(true);
  const [ConditionsMentionsLegales, setConditionsMentionsLegales] = useState({});


  useEffect(() => {

    async function fetchValue() {

      // Mentions légales
      setActivityMentionsConditions(true);
      
      let mentionsConditions = await getConditionsMentionsLegales();

      console.log('mentionsConditions', mentionsConditions)

      if (!mentionsConditions)
      {
        axiosInstance.get('/conditions/mentions/legales/')
        .then((response) => {
          if (response.data)
          {
            let obj = {};

            response.data.map((row) => {
              obj[row.code] = row;
            });

            setConditionsMentionsLegales(obj);

            saveConditionsMentions(obj);


            setActivityMentionsConditions(false);
          }
        })
        .catch(function (error) {
          console.log('error', error);
          setActivityMentionsConditions(false);
        });
      }
      else 
      {
        setConditionsMentionsLegales(mentionsConditions);
        setActivityMentionsConditions(false);
      }
    }

    fetchValue();

  }, []);
  
  if (true === ActivityMentionsConditions)
  {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" color="#3292E0" style={{}} />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <RenderConditionsMentionsLegale pdfUrl={ConditionsMentionsLegales.conditions_legales.fichier} /> */}
    </View>
  )
}

export default TermsConditions