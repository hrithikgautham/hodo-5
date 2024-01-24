import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Input, useThemeName, YStack, Button, } from "tamagui";
import { SIGNIN_SCREEN, SIGNUP_SCREEN } from '../../constants/screens';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../hooks/toast';
import MyText from '../../components/MyText';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';

const ResetPasswordScreen = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigation = useNavigation();
  const { showToast, } = useToast();
  const [showSpinner, setShowSpinner] = useState(false);

  async function sendPasswordResetLink(email: string) {
    try {
      setShowSpinner(true);
      await sendPasswordResetEmail(getAuth(), email);
      navigation.navigate(SIGNIN_SCREEN);
      showToast("Password Reset Link Sent!");
    }
    catch (error: any) {
      // Some error occurred.
      if (error.code == "auth/user-not-found") {
        showToast("You do not have an account. Please Sign Up!");
        navigation.replace(SIGNUP_SCREEN);
      }

    }
    finally {
      setShowSpinner(false);
    }

  }

  const theme = useThemeName();

  return (
    <View bg="$primaryColor" flex={1}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        scrollEnabled={false}
      >
        <SafeAreaView>
          <YStack p={"$6"} alignItems='center'>
            <Input
              allowFontScaling={false}
              w="100%"
              autoFocus
              keyboardAppearance={theme}
              keyboardType='email-address'
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
              placeholder='Enter Email...'
              placeholderTextColor={"$secondaryFontColor"}
              fontSize={"$5"}
              value={userEmail}
              onChangeText={setUserEmail} />
            <Button
              pressStyle={{
                scale: 0.9,
                opacity: 0.8,
              }}
              animateOnly={["transform"]}
              animation={"fast"}
              onPress={() => sendPasswordResetLink(userEmail)}
              bg="$accentColor"
              w={"40%"}
            >
              <MyText fontFamily={DEFAULT_FONT_BOLD} fontSize={"$4"} color="#ffffff">
                Reset
              </MyText>
            </Button>
          </YStack>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default ResetPasswordScreen