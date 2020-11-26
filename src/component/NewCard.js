import React, { useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Switch,
  Dimensions,
} from 'react-native';
import PaytmCustomuisdk from 'paytm-customuisdk-react-native';

export default function NewCard({
  navigation,
  route,
}) {
  const [cardNumber, setCardNubmer] = useState('');
  const [channelCode, setChannelCode] = useState('');
  const [issuingBankCode, setIssuingBankCode] = useState('');
  const [authModes, setAuthModes] = useState([]);
  const cardTypeList = [
    { name: 'Debit Card', value: 'DEBIT_CARD' },
    { name: 'Credit Card', value: 'CREDIT_CARD' },
  ];
  const [cardType, setCardType] = useState('DEBIT_CARD');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [authMode, setAuthMode] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const { paymentFlow } = route.params;
  const { txnToken } = route.params;
  const { mid } = route.params;

  const showAlert = (message, isSuccess, goToTop = true) => {
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

  const getBin = (cardNumberValue) => {
    var tokenType = 'TXN_TOKEN'; //or ACCESS which required requestId
    PaytmCustomuisdk.getBin(cardNumberValue, tokenType, txnToken, mid, '')
      .then((res) => {
        console.log(res);
        var resultInfo = res.body.resultInfo;
        if (resultInfo.resultStatus === 'S') {
          var binDetail = res.body.binDetail;
          setChannelCode(binDetail.channelCode);
          setIssuingBankCode(binDetail.issuingBankCode);
          setAuthModes(res.body.authModes);
        } else {
          showAlert('getBin => ' + resultInfo.resultMsg, false, false);
        }
        // showAlert(res, true, false)
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  const fetchEmiDetail = () => {
    if (cardType === '' || channelCode === '') {
      showAlert('cardType or channelCode is empty', false, false);
      return;
    }

    PaytmCustomuisdk.fetchEmiDetails(cardType, channelCode)
      .then((res) => {
        showAlert(JSON.stringify(res), true);
      })
      .catch((err) => {
        showAlert(err.message, false, false);
      });
  };

  const goForNewCardTransaction = () => {
    PaytmCustomuisdk.goForNewCardTransaction(
      cardNumber,
      cardExpiry,
      cardCvv,
      cardType,
      paymentFlow,
      channelCode,
      issuingBankCode,
      '',
      authMode,
      saveCard
    )
      .then((res) => {
        console.log(res);
        showAlert(JSON.stringify(res), true);
      })
      .catch((err) => {
        console.log(err);
        showAlert(err.message, false);
      });
  };

  const checkCardNumber = (num) => {
    setCardNubmer(num);
    if (num.length >= 6) {
      getBin(num);
    }
  };

  const { width } = Dimensions.get('window');
  const itemWidth = (width - 69) / 2;

  return (
    <View style={styles.mainView}>
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
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          defaultValue={cardNumber}
          placeholder={'Card Number'}
          onChangeText={(e) => checkCardNumber(e)}
        />
        <TextInput
          style={styles.textInput}
          defaultValue={cardExpiry}
          placeholder={'Card Expiry MM/YY'}
          onChangeText={(e) => setCardExpiry(e)}
        />
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          defaultValue={cardCvv}
          placeholder={'Card Cvv'}
          onChangeText={(e) => setCardCvv(e)}
        />
        <View
          style={{
            borderColor: 'lightskyblue',
            borderWidth: 1,
            marginStart: 8,
            marginTop: 16,
            marginEnd: 8,
          }}
        >
          <FlatList
            horizontal={true}
            data={cardTypeList}
            keyExtractor={(item, index) => item.value + index.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => setCardType(item.value)}>
                <View
                  style={{
                    flex: 1,
                    minWidth: itemWidth,
                    maxWidth: itemWidth,
                  }}
                >
                  {item.value === cardType && (
                    <View style={styles.selectedView}>
                      <Text style={styles.selectedHeaderText}>{item.name}</Text>
                    </View>
                  )}
                  {item.value != cardType && (
                    <View style={styles.unselectedView}>
                      <Text style={styles.unSelectedHeaderText}>
                        {item.name}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
        {authModes.length != 0 && (
          <View style={styles.listView}>
            <Text style={styles.listHeaderText}>Auth Mode</Text>
            <View style={{ flex: 0.1 }} />
            <View style={{ flex: 0.5 }}>
              <FlatList
                style={{
                  borderColor: 'lightskyblue',
                  borderWidth: 1,
                }}
                data={authModes}
                keyExtractor={(index) => index}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => setAuthMode(item)}>
                    <View>
                      {item === authMode && (
                        <View style={styles.selectedView}>
                          <Text style={styles.selectedHeaderText}>{item}</Text>
                        </View>
                      )}
                      {item != authMode && (
                        <View style={styles.unselectedView}>
                          <Text style={styles.unSelectedHeaderText}>
                            {item}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            </View>
          </View>
        )}
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
              value={saveCard}
              onValueChange={() =>
                saveCard ? setSaveCard(false) : setSaveCard(true)
              }
            />
          </View>
          <View style={{ flex: 0.85 }}>
            <Text style={{ fontSize: 18 }}>
              saveCard : {saveCard ? 'true' : 'false'}
            </Text>
          </View>
        </View>
        <View style={styles.buttonStyle}>
          <Button title="Pay" onPress={() => goForNewCardTransaction()} />
        </View>
        <View style={{ flexDirection: 'row', margin: 8 }}>
          <View style={{ flex: 0.3, margin: 8 }}>
            <Button title="fetch Emi detail" onPress={() => fetchEmiDetail()} />
          </View>
        </View>
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
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
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
  listView: {
    margin: 8,
    flexDirection: 'row',
  },
  listHeaderText: {
    padding: 8,
    fontWeight: 'bold',
    flex: 0.3,
    alignSelf: 'center',
  },
  selectedView: {
    backgroundColor: 'lightskyblue',
    borderColor: 'white',
  },
  selectedHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
    alignSelf: 'center',
  },
  unSelectedHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    padding: 8,
    alignSelf: 'center',
  },
  unselectedView: {
    backgroundColor: 'white',
  },
});
