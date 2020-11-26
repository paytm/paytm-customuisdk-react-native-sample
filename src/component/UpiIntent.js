import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PaytmCustomuisdk from 'paytm-customuisdk-react-native';

export default function UpiIntent({
  navigation,
  route,
}) {
  const [isUpiIntentListFetched, setUpiIntentListFetched] = useState(false);
  const [upiIntentList, setUpiIntentList] = useState([]);
  const { paymentFlow } = route.params;

  const showAlert = useCallback(
    (message, isSuccess, goToTop = true) => {
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
    },
    [navigation]
  );

  const getUpiIntentList = useCallback(() => {
    PaytmCustomuisdk.getUpiIntentList()
      .then((res) => {
        var list = res.list;
        if (list.length === 0) {
          showAlert('No upi intent found', false, false);
        } else {
          setUpiIntentList(res.list);
        }
      })
      .catch((err) => {
        showAlert('Fetching upi intent list' + err.message, false, false);
      });
  }, [showAlert]);

  useEffect(() => {
    if (!isUpiIntentListFetched) {
      getUpiIntentList();
      setUpiIntentListFetched(true);
    }
  }, [isUpiIntentListFetched, getUpiIntentList]);

  const onClick = (upiAppName) => {
    console.log(upiAppName);
    PaytmCustomuisdk.goForUpiIntentTransaction(upiAppName, paymentFlow)
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
        data={upiIntentList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => onClick(item.appName)}
          >
            <Text style={styles.buttonText}>{item.appName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.appName + index.toString()}
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
    height: 40,
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
