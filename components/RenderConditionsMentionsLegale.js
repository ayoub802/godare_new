import React from "react";

import {
  View
} from 'react-native';
// import Pdf from "react-native-pdf";


class RenderConditionsMentionsLegale extends React.Component {
    constructor(props){
        super(props);
    }


    render() {
        const { pdfUrl } = this.props;

        return (
          
            

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  {/* <Pdf
                  key={'pdfView'}
                  source={pdfUrl}
                  style={{ flex: 1, width: '100%', height: '100%' }}
                  onLoadComplete={() => console.log('PDF chargé')}
                  onError={(error) => console.log('Erreur de chargement du PDF', error)}
                 /> */}
                 <Text>Nothing</Text>
        </View>
    
        
        )
    }
}


export default RenderConditionsMentionsLegale;