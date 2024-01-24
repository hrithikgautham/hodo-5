import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PHONE_NUMBER_AUTH_SCREEN, RESET_PASSWORD_SCREEN, SIGNIN_SCREEN, SIGNUP_SCREEN} from '../constants/screens';
import SignInScreen from '../screens/unauthenticated/SignInScreen';
import SignUpScreen from '../screens/unauthenticated/SignUpScreen';
import {useAuth} from '../hooks/auth';
import PhoneNumberAuthScreen from '../screens/unauthenticated/PhoneNumberAuthScreen';
import ResetPasswordScreen from '../screens/unauthenticated/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

const UnAuthenticatedStack = () => {
  const {auth, } = useAuth();

  return (
    !auth ? <Stack.Navigator initialRouteName={SIGNIN_SCREEN}>
      <Stack.Screen name={SIGNIN_SCREEN} component={SignInScreen} options={{
        headerShown: false,
      }} />
      <Stack.Screen name={SIGNUP_SCREEN} component={SignUpScreen} options={{
        headerShown: false,
      }} />
      <Stack.Screen name={PHONE_NUMBER_AUTH_SCREEN} component={PhoneNumberAuthScreen} options={{
        headerShown: false,
      }} />
      <Stack.Screen name={RESET_PASSWORD_SCREEN} component={ResetPasswordScreen} options={{
        headerShown: false,
      }} />
    </Stack.Navigator> : <></>
  )
}

export default UnAuthenticatedStack