
import React from 'react';
import { View,Button} from 'react-native';

export default function BlankPage({
  navigation
}: {
  navigation: any;
}) {

   const startProcess = () => {
    navigation.navigate('Home')
   }

  return (
    <View style={{flex:1, justifyContent:"center",padding:16}}>
       <Button
          title="Start Process"
          onPress={() => {startProcess()
          }}>
        </Button>
    </View>
  );
}