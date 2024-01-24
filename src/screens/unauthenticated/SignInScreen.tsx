import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, } from 'react-native';
import { Button, Form, Input, Separator, Spinner, Square, View, YStack, useThemeName, } from 'tamagui'
import { Image } from '@tamagui/image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Auth, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { RESET_PASSWORD_SCREEN, SIGNUP_SCREEN } from '../../constants/screens';
import ThemeSetter from '../../components/ThemeSetter';
import { useToast } from '../../hooks/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OtherAuthMethods from '../../components/OtherAuthMethods';
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from '../../constants/fonts';
import MyText from '../../components/MyText';

const SignInScreen = () => {
  const theme = useThemeName();
  const { showToast, } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const navigation = useNavigation();
  const [showSpinner, setShowSpinner] = useState(false);
  const { top, right } = useSafeAreaInsets()

  async function signIn(auth: Auth, email: string, password: string) {
    try {
      if (!validate(email, password)) {
        return;
      }
      setShowSpinner(true);
      await signInWithEmailAndPassword(auth, email, password);
    }
    catch (err: any) {
      console.log(err.code)
      if (err.code == "auth/user-not-found") {
        showToast("You do not have an account. Please Sign Up!");
        navigation.navigate(SIGNUP_SCREEN);
      }
      else if (err.code == "auth/invalid-email" || err.code == "auth/wrong-password" || err.code == "auth/missing-password") {
        showToast("Invalid Email/Password. Please Try Again!",);
      }
      else {
        signOut(auth);
        showToast("Please Try Again!",);
      }
    }
    finally {
      setShowSpinner(false);
    }
  }

  function validate(email: string, password: string) {
    if (!email || email.length == 0) {
      showToast("Please Enter Email", "");
      return false;
    }

    if (!password || password.length == 0) {
      showToast("Please Enter Password", "")
      return false;
    }

    return true;
  }

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <View>
      <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" scrollEnabled={false} contentContainerStyle={{ height: "100%", }}>
        <View bg="$primaryColor" flex={1} >
          <SafeAreaView>
            <ThemeSetter top={top} right={right + 10} />
            <Image shadowColor={"#ffffff"} shadowRadius={0} shadowOpacity={0.5} shadowOffset={{
              width: 2,
              height: 1
            }} alignSelf='center' source={require('../../../assets/logos/HODO_LOGO.png')} width={200} height={200} />
            <YStack paddingHorizontal="$3" space="$3">

              <Form onSubmit={() => signIn(auth, email, password)}>

                <YStack mx="$5" space="$2">
                  <Input
                    allowFontScaling={false}
                    ref={emailRef}
                    keyboardAppearance={theme}
                    keyboardType='email-address'
                    onSubmitEditing={() => passwordRef.current.focus()}
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
                    fontFamily={DEFAULT_FONT}
                    value={email}
                    onChangeText={setEmail} />
                  <Input
                    ref={passwordRef}
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
                    fontFamily={DEFAULT_FONT}
                    value={password}
                    onChangeText={setPassword} />
                  <View
                    onPress={() => navigation.navigate(RESET_PASSWORD_SCREEN)} alignSelf='flex-end' pressStyle={{
                      scale: 0.95,
                      opacity: 0.9
                    }}
                    animateOnly={["transform"]}
                    animation={"fast"}>
                    <MyText color="$secondaryFontColor">Forgot Password?</MyText>
                  </View>
                </YStack>

                <Form.Trigger asChild>
                  <Button
                    disabled={!email || !password}
                    pressStyle={{
                      scale: 0.95,
                      opacity: 0.9
                    }}
                    my="$4"
                    alignSelf='center'
                    bg="$accentColor"
                    miw={"30%"}
                    maw={"50%"}
                    onPress={() => { }}>
                    {
                      showSpinner ? <Spinner color="#ffffff" size={"small"} /> : <MyText fontFamily={DEFAULT_FONT_BOLD} color={"#ffffff"}>Sign In</MyText>
                    }
                  </Button>
                </Form.Trigger>
              </Form>

              {/* </View> */}
            </YStack>
            <View justifyContent='center' alignItems='center' flexDirection='row'>
              <MyText color={"$secondaryFontColor"}>Do not have an Account? </MyText>
              <Button
                onPress={() => navigation.navigate(SIGNUP_SCREEN)}
                pressStyle={{
                  scale: 0.95,
                  opacity: 0.9
                }}
                bg="$primaryColor"
                p={0}
              >
                <MyText fontFamily={DEFAULT_FONT_BOLD} color={"$accentColor"}>Sign Up!</MyText>
              </Button>
            </View>
            <View flexDirection='row' alignItems='center' my="$2">
              <Separator mx="$2" bg={"$secondaryFontColor"} />
              <MyText color={"$secondaryFontColor"}>OR</MyText>
              <Separator mx="$2" />
            </View>

            <YStack alignItems='center' space={"$4"}>
              <MyText color="$primaryFontColor">Sign In Using</MyText>
              <OtherAuthMethods />
            </YStack>

          </SafeAreaView >
        </View>
      </KeyboardAwareScrollView >
    </View >
  )
}

export default SignInScreen;