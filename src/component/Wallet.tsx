import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import PaytmCustomuisdk from 'paytm-customuisdk-react-native';

export default function Wallet({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { paymentFlow } = route.params;
  const { paytmWalletBalance } = route.params;
  const { amount } = route.params;
  
  const showAlert = (message: string, isSuccess: boolean) => {
    setTimeout(
      (alertMessage, isSuccess) => {
        var title = 'Error';
        if (isSuccess) {
          title = 'Response';
        }
        Alert.alert(
          title,
          alertMessage,
          [{ text: 'OK', onPress: () => navigation.popToTop() }],
          { cancelable: false }
        );
      },
      300,
      message,
      isSuccess
    );
  };

  const addAndPay = () => {
    PaytmCustomuisdk.openPaytmAppForAddMoneyToWallet()
        .then((res) => {
          showAlert(JSON.stringify(res), true);
        })
        .catch((err) => {
          showAlert(err.message, false);
        });
  }

  const goForWalletTransaction = () => {
    PaytmCustomuisdk.goForWalletTransaction(paymentFlow)
    .then((res) => {
      showAlert(JSON.stringify(res), true);
    })
    .catch((err) => {
      showAlert(err.message, false);
    });
  }  

  return (
    <View style={styles.mainView}>
      <Text style={styles.headerText}>
        Wallet Balance - {paytmWalletBalance}
      </Text>
      {paytmWalletBalance != undefined && paytmWalletBalance != "" && parseFloat(amount) <= parseFloat(paytmWalletBalance) && (
      <View style={styles.buttonStyle}>
        <Button title="Pay" onPress={() => goForWalletTransaction()} />
      </View>
      )}
      {paytmWalletBalance != undefined && paytmWalletBalance != "" && parseFloat(amount) > parseFloat(paytmWalletBalance) && (
      <View>
        <Text style={styles.headerText}>
          Insuffcent Balance
        </Text>
        <View style={styles.buttonStyle}>
          <Button title="Add and Pay" onPress={() => addAndPay()} />
        </View>
      </View>
      )}
      {(paytmWalletBalance == undefined || paytmWalletBalance == "") && (
      <View>
        <Text style={styles.headerText}>
          Not Logged In
      </Text>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 16,
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
  },
  buttonStyle: {
    padding: 8,
    margin: 4,
  },
});
