import React, { useState } from 'react';
import { 
  View, 
  Alert, 
  StyleSheet, 
  Button, 
  Text,
  Switch,
 TextInput 
} from 'react-native';
import PaytmCustomuisdk from 'paytm-customuisdk-react-native';

export default function UpiCollect({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [upiCode, setUpiCode] = useState('');
  const [saveVPA, setSaveVPA] = useState(false);
  const { paymentFlow } = route.params;

  const showAlert = (message: string, isSuccess: boolean, goToTop = true) => {
    setTimeout(
      (alertMessage, isSuccess, goToTop) => {
        var title = 'Error';
        if (isSuccess) {
          title = 'Response';
        }
        Alert.alert(
          title,
          alertMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                if (goToTop) navigation.popToTop();
              },
            },
          ],
          { cancelable: false }
        );
      },
      300,
      message,
      isSuccess,
      goToTop
    );
  };

  const goForUpiCollectTransaction = () => {
    PaytmCustomuisdk.goForUpiCollectTransaction(upiCode, paymentFlow, saveVPA)
      .then((res) => {
        showAlert(JSON.stringify(res), true);
      })
      .catch((err) => {
        showAlert(err.message, false);
      });
  };

  const getLastSavedVPA = () => {
    PaytmCustomuisdk.getLastSavedVPA()
      .then((res) => {
        showAlert(JSON.stringify(res), true, false);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  return (
    <View style={styles.mainView}>
      <TextInput
        style={styles.textInput}
        defaultValue={upiCode}
        placeholder={'Upi Collect Code'}
        onChangeText={(e) => setUpiCode(e)}
      />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 0.15 }}>
          <Switch
            value={saveVPA}
            onValueChange={() =>
              saveVPA ? setSaveVPA(false) : setSaveVPA(true)
            }
          />
        </View>
        <View style={{ flex: 0.85 }}>
          <Text style={{ fontSize: 18 }}>
            saveVPA : {saveVPA ? 'true' : 'false'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonStyle}>
        <Button title="Pay" onPress={() => goForUpiCollectTransaction()} />
      </View>

      <View style={styles.buttonStyle}>
        <Button title="get Last Saved vpa" onPress={() => getLastSavedVPA()} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 16,
    padding: 4,
  },
  buttonStyle: {
    padding: 8,
    margin: 8,
  },
  textInput: {
    fontSize: 18,
    padding: 8,
    borderColor: 'gray',
    marginStart: 8,
    marginEnd: 8,
    borderBottomWidth: 1,
  },
});
