import React from 'react';
import { View, Text, Alert, FlatList, StyleSheet, Button } from 'react-native';
import PaytmCustomuisdk from 'paytm-customuisdk-react-native';

export default function UpiIntent({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { paymentFlow } = route.params;
  const { vpaDetails } = route.params;
  const { bankAccounts } = route.params;
  const { merchantDetails } = route.params;

  const showAlert = (message: string, isSuccess: boolean, goToTop = true) => {
    setTimeout(
      (alertMessage, isSuccess) => {
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
      isSuccess
    );
  };

  const goForUpiPushTransaction = (item: any) => {
    PaytmCustomuisdk.goForUpiPushTransaction(
      paymentFlow,
      item,
      vpaDetails[0].name,
      merchantDetails
    )
      .then((res) => {
        showAlert(JSON.stringify(res), true);
      })
      .catch((err) => {
        showAlert(err.message, false);
      });
  };

  const fetchUpiBalance = (item: any) => {
    PaytmCustomuisdk.fetchUpiBalance(item, vpaDetails[0].name)
      .then((res) => {
        showAlert(JSON.stringify(res), true, false);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  const setUpiMpin = (item: any) => {
    PaytmCustomuisdk.setUpiMpin(item, vpaDetails[0].name)
      .then((res) => {
        showAlert(JSON.stringify(res), true, false);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  return (
    <View style={styles.mainView}>
      <FlatList
        data={bankAccounts}
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
            <Text style={styles.headerText}>{item.bank}</Text>
            <View
              style={{
                marginTop: 16,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <View style={{ flex: 0.3, margin: 8 }}>
                <Button
                  title="Check Balance"
                  onPress={() => fetchUpiBalance(item)}
                />
              </View>
              <View style={{ flex: 0.3, margin: 8 }}>
                <Button title="Set MPIN" onPress={() => setUpiMpin(item)} />
              </View>
              <View style={{ flex: 0.3, margin: 8 }}>
                <Button
                  title="Pay"
                  onPress={() => goForUpiPushTransaction(item)}
                />
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => item.bank + index.toString()}
      />
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 18,
    padding: 8,
  },
});
