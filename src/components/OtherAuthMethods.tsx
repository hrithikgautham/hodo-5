import { useNavigation } from '@react-navigation/native';
import { Phone } from '@tamagui/lucide-icons';
import React from 'react';
import { View, Button, } from 'tamagui';
import { PHONE_NUMBER_AUTH_SCREEN } from '../constants/screens';
import { DEFAULT_FONT_BOLD } from '../constants/fonts';
import MyText from './MyText';

const OtherAuthMethods = ({ isSignUp = false }: { isSignUp?: boolean, }) => {
  const navigation = useNavigation();

  return (
    <View>
      <Button bg="$accentColor" icon={<Phone color="#ffffff" />} onPress={() => navigation.navigate(PHONE_NUMBER_AUTH_SCREEN, { isSignUp, })}>
        <MyText fontFamily={DEFAULT_FONT_BOLD} color={"#ffffff"}>Phone Number</MyText>
      </Button>
    </View>
  )
}

export default OtherAuthMethods