import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './HomePage';
import PayModePage from './component/PayModePage';
import Wallet from './component/Wallet';
import NetBanking from './component/NetBanking';
import UpiCollect from './component/UpiCollect';
import UpiIntent from './component/UpiIntent';
import UpiPush from './component/UpiPush';
import NewCard from './component/NewCard';
import SavedCard from './component/SavedCard';
import { StatusBar } from 'react-native';
import BlankPage from './BlankPage';

const Stack = createStackNavigator();

const headerColor = '#026bc2';

export default function App() {
  return (
    <>
      <StatusBar barStyle="default" backgroundColor={headerColor} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: headerColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Blank"
            component={BlankPage}
            options={{ title: 'React Native App' }}
          />
          <Stack.Screen
            name="Home"
            component={HomePage}
            options={{ title: 'React Native App' }}
          />
          <Stack.Screen
            name="PayMode"
            component={PayModePage}
            options={{ title: 'PayModes' }}
          />
          <Stack.Screen
            name="Wallet"
            component={Wallet}
            options={{ title: 'Wallet' }}
          />
          <Stack.Screen
            name="NetBanking"
            component={NetBanking}
            options={{ title: 'NetBanking' }}
          />
          <Stack.Screen
            name="UpiCollect"
            component={UpiCollect}
            options={{ title: 'Upi Collect' }}
          />
          <Stack.Screen
            name="UpiIntent"
            component={UpiIntent}
            options={{ title: 'Upi Intent' }}
          />
          <Stack.Screen
            name="UpiPush"
            component={UpiPush}
            options={{ title: 'Upi Push' }}
          />
          <Stack.Screen
            name="NewCard"
            component={NewCard}
            options={{ title: 'New Card' }}
          />
          <Stack.Screen
            name="SavedCard"
            component={SavedCard}
            options={{ title: 'Saved Card' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
