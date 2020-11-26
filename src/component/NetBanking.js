import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import PaytmCustomuisdk from 'paytm-customuisdk-react-native';

export default function NetBanking({
  navigation,
  route,
}) {
  const [isNBFetched, setNBFetched] = useState(false);
  const [nbCodeList, setNBCodeList] = useState([]);
  const { paymentFlow } = route.params;
  const { txnToken } = route.params;
  const { orderId } = route.params;
  const { mid } = route.params;

  const showAlert = useCallback(
    (message, isSuccess, goToTop = true) => {
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
    },
    [navigation]
  );

  const getLastSavedNB = () => {
    PaytmCustomuisdk.getLastNBSavedBank()
      .then((res) => {
        showAlert(JSON.stringify(res), true, false);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  const getNBList = useCallback(() => {
    var tokenType = 'TXN_TOKEN'; //or ACCESS which required requestId
    PaytmCustomuisdk.fetchNBList(tokenType, txnToken, mid, orderId, '')
      .then((res) => {
        var body = res.body;
        var resultInfo = body.resultInfo;
        if (resultInfo.resultStatus === 'S') {
          var nbPayOption = body.nbPayOption;
          setNBCodeList(nbPayOption.payChannelOptions);
        } else {
          showAlert(resultInfo.resultMsg, false, false);
        }
      })
      .catch((err) => {
        showAlert(err, false, false);
      });
  }, [txnToken, mid, orderId, showAlert]);

  useEffect(() => {
    if (!isNBFetched) {
      getNBList();
      setNBFetched(true);
    }
  }, [isNBFetched, getNBList]);

  const onClick = (bankCode) => {
    console.log(bankCode);
    PaytmCustomuisdk.goForNetBankingTransaction(bankCode, paymentFlow)
      .then((res) => {
        console.log(res);
        showAlert(JSON.stringify(res), true);
      })
      .catch((err) => {
        console.log(err);
        showAlert(err.message, false);
      });
  };
  return (
    <View style={styles.mainView}>
      <View style={{ flexDirection: 'row', margin: 8 }}>
        <View style={{ flex: 0.5, margin: 8 }}>
          <Button
            title="fetch Last Saved NB"
            onPress={() => getLastSavedNB()}
          />
        </View>
      </View>
      <FlatList
        data={nbCodeList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => onClick(item.channelCode)}
          >
            <Text style={styles.buttonText}>{item.channelName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.channelCode + index.toString()}
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
  buttonStyle: {
    height: 45,
    justifyContent: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    padding: 8,
  },
  buttonText: {
    fontSize: 18,
    padding: 8,
  },
});
