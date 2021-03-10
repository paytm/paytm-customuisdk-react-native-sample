import React from 'react';
import {
  View,
  Text, 
  Alert, 
  FlatList, 
  StyleSheet, 
  Button,
  TextInput
} from 'react-native';
import PaytmCustomuisdk from 'paytm-customuisdk-react-native';

export default function SavedCard({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { paymentFlow } = route.params;
  const { savedInstruments } = route.params;

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

  const goForSaveCardTranscation = (item: any) => {
    if (item.cardCvv === undefined || (item.cardCvv as string).length < 3) {
      showAlert('enter cvv', false, false);
    }
    PaytmCustomuisdk.goForSavedCardTransaction(
      item.cardDetails.cardId,
      item.cardCvv,
      item.cardDetails.cardType,
      paymentFlow,
      item.channelCode,
      item.issuingBank,
      '',
      item.authModes[0]
    )
      .then((res) => {
        showAlert(JSON.stringify(res), true);
      })
      .catch((err) => {
        showAlert(err.message, false);
      });
  };

  return (
    <View style={styles.mainView}>
      <FlatList
        data={savedInstruments}
        renderItem={({ item }: { item: any }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              margin: 8,
              backgroundColor: 'white',
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {item.displayName}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 8, marginStart: 8 }}>
              {item.cardDetails.firstSixDigit} ••••••{' '}
              {item.cardDetails.lastFourDigit}
            </Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              defaultValue={item.cardCvv}
              placeholder={'Cvv'}
              onChangeText={(e) => (item.cardCvv = e)}
            />
            <View style={styles.buttonStyle}>
              <Button
                title="Pay"
                onPress={() => goForSaveCardTranscation(item)}
              />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => item.dislayName + index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 8,
    padding: 4,
  },
  buttonText: {
    fontSize: 18,
    padding: 8,
  },
  textInput: {
    fontSize: 16,
    padding: 8,
    marginStart: 4,
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  buttonStyle: {
    padding: 8,
    margin: 8,
  },
});
