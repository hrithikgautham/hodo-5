import React from 'react'
import { Button, YStack } from 'tamagui'
import MyText from '../../components/MyText'
import { View, } from "tamagui";
import { DEFAULT_FONT_BOLD, DEFAULT_FONT_EXTRA_BOLD } from '../../constants/fonts';
import { SafeAreaView } from 'react-native';

const DeleteAccountScreen = () => {
  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView>
        <YStack space={"$4"} p={"$4"}>
          <YStack mt={"$4"} space={"$4"}>
            <MyText fontFamily={DEFAULT_FONT_BOLD} color={"$primaryFontColor"}>You will no longer be able to access your trips, trips compares, couch surf data after deleting you account.</MyText>
            <MyText fontSize={20} fontFamily={DEFAULT_FONT_EXTRA_BOLD} color={"$primaryFontColor"}>Are you sure you want to delete your account?</MyText>
          </YStack>
          <View alignSelf='center' w={"50%"}>
            <Button bg="$red10Light" p="$2" borderRadius={10} marginVertical="$2">
              <MyText fontSize={20} fontFamily={DEFAULT_FONT_EXTRA_BOLD} color="#ffffff">Delete Account</MyText>
            </Button>
          </View>
        </YStack>
      </SafeAreaView>
    </View>
  )
}

export default DeleteAccountScreen