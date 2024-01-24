import React, { useState } from 'react'
import { DrawerContentScrollView, DrawerItemList, } from "@react-navigation/drawer";
import { useAuth } from '../hooks/auth';
import { Button, Image, View, XStack, YStack } from 'tamagui';
import { SafeAreaView } from 'react-native';
import ThemeSetter from './ThemeSetter';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MyText from './MyText';
import { DEFAULT_FONT_BOLD } from '../constants/fonts';
import MyAlert from './MyAlert';

// https://www.google.com/search?client=firefox-b-d&q=customize+drawer+menu+react+navigation#kpvalbx=_esD5ZPeLGauSseMP4r6r6A8_40
const MyDrawerMenu = (props: any) => {

  const { signOutUser, auth: { email, displayName, photoURL, }, } = useAuth();
  const { top, right } = useSafeAreaInsets()
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  return (
    <View bg="$primaryColor" h="100%">
      <SafeAreaView style={{ flex: 1 }}>
        <YStack justifyContent='space-between' flex={1}>
          <YStack>
            <XStack justifyContent='space-between' p="$2" alignItems='center' >
              <View>
                <Image source={photoURL ? { uri: photoURL, } : require("../../assets/unknown-user.jpg")} width={50} height={50} borderRadius={25} />
              </View>
              <View>
                <MyText textAlign='right' color="$primaryFontColor" fontSize={"$7"} fontWeight={"bold"}>{displayName}</MyText>
                <MyText textAlign='right' color="$secondaryFontColor" fontSize={"$2"} fontWeight={"bold"}>{email}</MyText>
              </View>
            </XStack>

            <View>
              <ThemeSetter top={0} right={right} />
              <View pos="absolute" flex={1} bg="$primaryColor" width={"100%"}>

                <DrawerContentScrollView style={{ padding: 0, }} {...props}>
                  <View>
                    <DrawerItemList {...props} />
                  </View>
                </DrawerContentScrollView>
              </View>
            </View>
          </YStack>
          <MyAlert button={<Button bg="$red10Light" borderRadius={"$0"}>
            <MyText fontFamily={DEFAULT_FONT_BOLD} color={"#ffffff"} fontWeight={"bold"}>Sign Out</MyText>
          </Button>} description='Are you Sure?' open={showSignOutAlert} setOpen={setShowSignOutAlert} onOk={signOutUser} />
        </YStack>
      </SafeAreaView>
    </View >
  )
}

export default MyDrawerMenu