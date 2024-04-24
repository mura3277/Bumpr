import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BuyerHome from './src/screens/buyerHome';
import SellerHome from './src/screens/sellerHome';
import Splash from './src/screens/splash';
import Login from './src/screens/login';
import LoginChoice from './src/screens/loginChoice';
import Register from './src/screens/register';
import BuyerSettings from './src/screens/buyerSettings';
import SellerSettings from './src/screens/sellerSettings';

import BuyerMessages from './src/screens/buyerMessages';
import SellerMessages from './src/screens/sellerMessages';

import BuyerConvo from './src/screens/buyerConvo';
import SellerConvo from './src/screens/sellerConvo';
import EditPost from './src/screens/editPost';
import InterestedBuyers from './src/screens/interestedBuyers';

import { firebase } from './src/firebase/config'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Stack = createStackNavigator();
// put in the baseUrl for your backend, e.g. if local your https:ip address:5000
const baseUrl = "";

export {baseUrl};

function MyStack() {
  return (
    <Stack.Navigator
	initialRouteName="Splash"
    >
      <Stack.Screen 
          name="Splash"
	  component={Splash}
	  options={{ headerShown: false}}

      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
          options={{ headerShown: false}}
	  
      />
      <Stack.Screen 
        name="LoginChoice" 
        component={LoginChoice} 
          options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="SellerHome" 
        component={SellerHome} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="EditPost" 
        component={EditPost} 
        options={{ headerShown: false}} 
      />
	<Stack.Screen 
        name="InterestedBuyers" 
        component={InterestedBuyers} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="BuyerHome" 
        component={BuyerHome} 
          options={{ headerShown: false}} 
      />

      <Stack.Screen 
        name="BuyerSettings" 
        component={BuyerSettings} 
        options={{ headerShown: false}} 
      />

      <Stack.Screen 
        name="SellerSettings" 
        component={SellerSettings} 
        options={{ headerShown: false}} 
      />

      <Stack.Screen 
        name="BuyerMessages" 
        component={BuyerMessages} 
        options={{ headerShown: false}} 
      />

      <Stack.Screen 
        name="SellerMessages" 
        component={SellerMessages} 
        options={{ headerShown: false}} 
      />

      <Stack.Screen 
        name="BuyerConvo" 
        component={BuyerConvo} 
        options={{ headerShown: false}} 
      />

      <Stack.Screen 
        name="SellerConvo" 
        component={SellerConvo} 
        options={{ headerShown: false}} 
      />

      </Stack.Navigator>
    
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );


 /* 
// For a persistent login, something along these lines should eventually be written
useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);*/
}
