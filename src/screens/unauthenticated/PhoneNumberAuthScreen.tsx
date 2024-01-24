import { SafeAreaView } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ThemeSetter from '../../components/ThemeSetter'
import { Image, YStack, View, } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PhoneNumberAuth from '../../components/PhoneNumberAuth'

const PhoneNumberAuthScreen = ({ route: { params: { isSignUp, }, }, }) => {
  const { top, right, } = useSafeAreaInsets();

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

              {/* goes here */}
              <PhoneNumberAuth isSignUp={isSignUp} />
              {/* </View> */}
            </YStack>
          </SafeAreaView >
        </View>
      </KeyboardAwareScrollView >
    </View>
  )
}

export default PhoneNumberAuthScreen