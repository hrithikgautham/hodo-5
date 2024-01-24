import React, { useRef, useState } from 'react'
import { SafeAreaView, } from 'react-native';
import { Button, Form, Input, Separator, Spinner, View, YStack, useThemeName } from 'tamagui'
import { Image } from '@tamagui/image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LogIn } from '@tamagui/lucide-icons';
import { Auth, getAuth, createUserWithEmailAndPassword, } from 'firebase/auth';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { USERS_COLLECTION } from '../../constants/collections';
import { useNavigation } from '@react-navigation/native';
import { SIGNIN_SCREEN } from '../../constants/screens';
import ThemeSetter from '../../components/ThemeSetter';
import { useToast } from '../../hooks/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OtherAuthMethods from '../../components/OtherAuthMethods';
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from '../../constants/fonts';
import MyText from '../../components/MyText';

const SignUpScreen = () => {
  const theme = useThemeName();
  const { showToast, } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const auth = getAuth();
  const navigation = useNavigation();
  const [showSpinner, setShowSpinner] = useState(false);

  async function signUp(auth: Auth, email: string, password: string, confirmPassword: string) {
    if (!validate(email, password, confirmPassword)) {
      return;
    }

    setShowSpinner(true);

    console.log("signing up")

    try {
      const { user, } = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, `${USERS_COLLECTION}/${user.uid}`);
      await setDoc(userDocRef, {
        email,
        emailVerified: false,
        creationTime: Timestamp.now(),
        gotInfo: false,
        isHost: false,
        ...user,
      });
    }
    catch (error: any) {
      console.log(error.message)
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        showToast("Email Already in Use. Please Sign In.", "");
        // navigation.navigate(SIGNIN_SCREEN);
      }
      else if (errorCode === "auth/invalid-email") {
        showToast("Invalid Email.", "");
      }
      else if (errorCode === "auth/weak-password") {
        showToast("Password should be at least 6 characters", "");
      }
    }
    finally {
      setShowSpinner(false);
    }
  }

  function validate(email: string, password: string, confirmPassword: string) {
    if (!email) {
      showToast("Please Enter Email");
      return false;
    }

    if (!password) {
      showToast("Please Enter Password");
      return false;
    }

    if (!confirmPassword) {
      showToast("Please Enter Confirm Password");
      return false;
    }

    if (password != confirmPassword) {
      showToast("Password and Confirm Password Doesnt Match");
      return false;
    }

    return true;
  }

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const { top, right } = useSafeAreaInsets()

  return (
    <View>
      <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" scrollEnabled={false} contentContainerStyle={{ height: "100%", }}>
        <View bg="$primaryColor" flex={1} >
          <SafeAreaView>
            <ThemeSetter top={top} right={right + 10} />
            <Image shadowColor={"#ffffff"} shadowRadius={0} shadowOpacity={0.5} shadowOffset={{
              width: 2,
              height: 1
            }} alignSelf='center' source={require('../../../assets/logos/Symbol.png')} width={200} height={200} />
            <YStack paddingHorizontal="$3" space="$3">

              <Form onSubmit={() => signUp(auth, email, password, confirmPassword)}>

                <YStack mx="$5" space="$3">
                  <Input
                    allowFontScaling={false}
                    ref={emailRef}
                    fontFamily={DEFAULT_FONT}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    keyboardAppearance={theme}
                    keyboardType='email-address'
                    shadowOffset={{
                      width: 0.5,
                      height: 0.5
                    }} shadowOpacity={0.5}
                    shadowColor={"#cccccc"}
                    shadowRadius={0.1}
                    borderWidth={0}
                    my="$2"
                    bg="$secondaryColor"
                    color={"$primaryFontColor"}
                    placeholder='Enter Email...'
                    placeholderTextColor={"$secondaryFontColor"}
                    value={email}
                    onChangeText={setEmail} />
                  <Input
                    allowFontScaling={false}
                    ref={passwordRef}
                    fontFamily={DEFAULT_FONT}
                    onSubmitEditing={() => confirmPasswordRef.current.focus()}
                    secureTextEntry
                    keyboardAppearance={theme}
                    shadowOffset={{
                      width: 0.5,
                      height: 0.5
                    }}
                    shadowOpacity={0.5}
                    shadowColor={"#cccccc"}
                    shadowRadius={0.1}
                    borderWidth={0}
                    my="$2"
                    bg="$secondaryColor"
                    color={"$primaryFontColor"}
                    placeholder='Enter Password...'
                    placeholderTextColor={"$secondaryFontColor"}
                    value={password}
                    onChangeText={setPassword} />
                  <Input
                    allowFontScaling={false}
                    ref={confirmPasswordRef}
                    fontFamily={DEFAULT_FONT}
                    secureTextEntry
                    keyboardAppearance={theme}
                    shadowOffset={{
                      width: 0.5,
                      height: 0.5
                    }}
                    shadowOpacity={0.5}
                    shadowColor={"#cccccc"}
                    shadowRadius={0.1}
                    borderWidth={0}
                    my="$2"
                    bg="$secondaryColor"
                    color={"$primaryFontColor"}
                    placeholder='Confirm Password...'
                    placeholderTextColor={"$secondaryFontColor"}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword} />
                </YStack>
                <Form.Trigger asChild>
                  <Button
                    disabled={!email || !password || !confirmPassword}
                    pressStyle={{
                      scale: 0.95,
                      opacity: 0.9
                    }}
                    iconAfter={<LogIn color={"#ffffff"} />}
                    my="$4"
                    alignSelf='center'
                    bg="$accentColor"
                    miw={"30%"}
                    maw={"50%"}>
                    {
                      showSpinner ? <Spinner size="small" color="#ffffff" /> : <MyText fontFamily={DEFAULT_FONT_BOLD} color={"#ffffff"} fontWeight={"$10"}>Sign Up</MyText>
                    }
                  </Button>
                </Form.Trigger>
              </Form>

              {/* </View> */}
            </YStack>
            <View justifyContent='center' alignItems='center' flexDirection='row'>
              <MyText color={"$secondaryFontColor"}>Already have an Account? </MyText>
              <Button onPress={() => navigation.navigate(SIGNIN_SCREEN)} pressStyle={{
                scale: 0.95,
                opacity: 0.9
              }} p={0} bg="$primaryColor">
                <MyText color={"$accentColor"} fontFamily={DEFAULT_FONT_BOLD}>Sign In!</MyText>

              </Button>
            </View>
            <View flexDirection='row' alignItems='center' my="$2">
              <Separator mx="$2" bg={"$secondaryFontColor"} />
              <MyText color={"$secondaryFontColor"}>OR</MyText>
              <Separator mx="$2" />
            </View>

            <YStack alignItems='center' space={"$4"}>
              <MyText color="$primaryFontColor">Sign Up Using</MyText>
              <OtherAuthMethods isSignUp={true} />
            </YStack>

          </SafeAreaView >
        </View>
      </KeyboardAwareScrollView >
    </View>
  )
}

export default SignUpScreen;