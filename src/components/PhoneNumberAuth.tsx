import { PhoneAuthProvider, checkActionCode, getAuth, linkWithPhoneNumber, signInWithCredential, updateCurrentUser, updatePhoneNumber, } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { View, Label, Input, useThemeName, Button, Spinner, } from "tamagui";
import { useToast } from '../hooks/toast';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { getApp } from 'firebase/app';
import { useAuth } from '../hooks/auth';
import { CHECK_IF_PHONE_NUMBER_EXISTS_URL } from '../constants/URL';
import { SIGNIN_SCREEN, SIGNUP_SCREEN } from '../constants/screens';
import { useNavigation } from '@react-navigation/native';
import MyText from './MyText';


const PhoneNumberAuth = ({ isSignUp = false, setPhoneNumber, autofocus = true, }: { isSignUp?: boolean, setPhoneNumber?: any, autofocus?: boolean }) => {
  const { auth, } = useAuth();
  const theme: string = useThemeName();
  const { showToast, } = useToast();
  const recaptchaVerifier = useRef(null);
  const navigation = useNavigation();
  const [success, setSuccess] = useState<boolean>(false);

  const [userPhoneNumber, setUserPhoneNumber] = useState<string>(auth?.phoneNumber ? auth.phoneNumber : "");
  const [verificationId, setVerificationId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  const [showSendCodeSpinner, setShowSendCodeSpinner] = useState<boolean>(false);
  const [showCodeVerificationSpinner, setShowCodeVerificationSpinner] = useState<boolean>(false);
  const [confirmationResult, setconfirmationResult] = useState(null);

  const attemptInvisibleVerification = false;

  const phoneProvider = new PhoneAuthProvider(getAuth());
  const confirmationRef = useRef(null);

  async function sendVerificationCode(phoneNumber: string, recaptchaVerifier: any) {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.

    try {
      setShowSendCodeSpinner(true);
      const response = await fetch(CHECK_IF_PHONE_NUMBER_EXISTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
        })
      });
      console.log("isSignUp:", auth)
      const data = await response.json();
      console.log("data.success: ", data.success);
      const success = data.success;



      if (auth) {
        console.log("auth is there...")
        // if the user is already signed in
        const confirmationResult = await linkWithPhoneNumber(getAuth().currentUser, userPhoneNumber, recaptchaVerifier.current);
        setconfirmationResult(confirmationResult);
        showToast('Verification code has been sent to your phone');
      }
      else if (isSignUp && success) {
        showToast('Phone Number Already Exists');
        navigation.navigate(SIGNIN_SCREEN);
        return;
      }
      else if (!isSignUp && !success) {
        showToast("Phone Number Doesn't Exists");
        navigation.navigate(SIGNUP_SCREEN);
        return;
      }
      else if ((isSignUp && !success) || (!isSignUp && success)) {
        //  if it is sign up and the user doesnt exist or if it is sign in and the user exists
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          recaptchaVerifier.current
        );
        console.log("verificationId: ", verificationId);
        setVerificationId(verificationId);
        confirmationRef.current.focus();
        showToast('Verification code has been sent to your phone');
      }



    } catch (err: any) {
      console.log(err.message);
      if (err.code == "auth/too-many-requests") {
        showToast("Too many requests. Please try again later");
      }
      else if (err.code == "auth/invalid-verification-code") {
        showToast("Invalid Verification Code");
      }
      else {
        showToast(`Please try Again`);
      }

    }
    finally {
      setShowSendCodeSpinner(false);
    }
  }

  async function confirmVerificationCode(verificationId: string, verificationCode: string,) {
    try {
      setShowCodeVerificationSpinner(true);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      if (!auth) {
        await signInWithCredential(getAuth(), credential);
      }
      else {
        await confirmationResult.confirm(verificationCode);
      }
      setSuccess(true);
      setPhoneNumber && setPhoneNumber(userPhoneNumber)
      showToast("Phone Authentication Successful");
    } catch (err: any) {
      console.log(err.message)
      if (err.code == "auth/account-exists-with-different-credential") {
        showToast("Phone Number Already Exists");
        setVerificationCode("");
        setVerificationId("");
        setconfirmationResult(null);
      }
      else {
        showToast("Please try Again");
      }

    }
    finally {
      setShowCodeVerificationSpinner(false);
    }
  }



  return (
    <View >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={getApp().options}
      // attemptInvisibleVerification
      />
      <Label allowFontScaling={false} htmlFor="phoneNumber" color={"$secondaryFontColor"} fontSize={"$5"}>Phone Number <MyText color={"red"}>*</MyText></Label>
      <View flexDirection='row' alignItems='center' justifyContent='space-between' gap={"$2"}>
        <Input
          allowFontScaling={false}
          autoFocus={autofocus}
          flex={1}
          id="phoneNumber"
          keyboardAppearance={theme}
          disabled={success}
          value={userPhoneNumber}
          maxLength={15}
          shadowOffset={{
            width: 0.5,
            height: 0.5
          }} shadowOpacity={0.5}
          shadowColor={"#cccccc"}
          shadowRadius={0.1}
          borderWidth={0}
          my="$2"
          keyboardType='phone-pad'
          bg="$secondaryColor"
          color={"$primaryFontColor"}
          placeholder='Enter Phone Number...'
          placeholderTextColor={"$secondaryFontColor"}
          fontSize={"$5"}
          onChangeText={setUserPhoneNumber}
        />
        {
          userPhoneNumber != auth.phoneNumber ? (<Button
            pressStyle={{
              scale: 0.95,
              opacity: 0.9
            }}
            animateOnly={["transform"]}
            animation={"fast"}
            bg="$accentColor"
            onPress={() => sendVerificationCode(userPhoneNumber, recaptchaVerifier)}
          >
            {
              showSendCodeSpinner ? (<Spinner size='small' color="#ffffff" />) : (<MyText color="#ffffff">Send Code</MyText>)
            }
          </Button>) :
            (<></>)
        }
      </View>
      {
        confirmationResult || verificationId.length > 0 ? (<View flexDirection='row' alignItems='center' justifyContent='space-between' gap={"$2"}>
          <Input
            allowFontScaling={false}
            disabled={success}
            ref={confirmationRef}
            flex={1}
            keyboardAppearance={theme}
            value={verificationCode}
            maxLength={15}
            shadowOffset={{
              width: 0.5,
              height: 0.5
            }} shadowOpacity={0.5}
            shadowColor={"#cccccc"}
            shadowRadius={0.1}
            borderWidth={0}
            my="$2"
            keyboardType='phone-pad'
            bg="$secondaryColor"
            color={"$primaryFontColor"}
            placeholder='Enter Verification Code...'
            placeholderTextColor={"$secondaryFontColor"}
            fontSize={"$5"}
            onChangeText={setVerificationCode}
          />
          {
            verificationCode.length > 0 ? (<Button
              disabled={success}
              pressStyle={{
                scale: 0.95,
                opacity: 0.9
              }}
              animateOnly={["transform"]}
              animation={"fast"}
              bg="$accentColor"
              onPress={() => confirmVerificationCode(verificationId, verificationCode)}
            >
              {
                showCodeVerificationSpinner ? (<Spinner size='small' color="#ffffff" />) : (<MyText color="#ffffff">Verify</MyText>)
              }
            </Button>) : <></>
          }

        </View>) : <></>
      }
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  )
}

export default PhoneNumberAuth