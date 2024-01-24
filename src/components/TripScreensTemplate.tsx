import React from 'react'
import { Button, Image, View, } from 'tamagui'
import { ChevronLeft, Clipboard as ClipboardIcon, } from '@tamagui/lucide-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Menu from './Menu'
import * as Clipboard from 'expo-clipboard';
import { useToast } from '../hooks/toast'
import SettingsButton from '../components/SettingsButton'
import { TRIP_SETTINGS_SCREEN } from '../constants/screens'
import MyText from './MyText'

const TripScreensTemplate = ({ title, image, imageUrl, children, tripId, }: { title: string, image?: any, imageUrl?: string, children: any, tripId: string, }) => {

  const navigation = useNavigation();
  const { left, top, bottom, right, } = useSafeAreaInsets();

  const { showToast, } = useToast();

  async function copyTipIdToClipboard(tripId: string) {
    console.log("hello")
    try {
      await Clipboard.setStringAsync(tripId);
      showToast("Trip ID Copied to Clipboard");
    }
    catch (err) {

    }
  }

  return (
    <View flex={1} bg="$primaryColor">
      <View h="$15" bg="#000000" >
        <Image
          opacity={0.5}
          resizeMode="cover"
          alignSelf="center"
          height={"100%"}
          width={"100%"}
          source={image ? image : {
            uri: imageUrl
          }}
        />
        <MyText m={"$2"} position='absolute' left={left} bottom={0} color="#ffffff" fontWeight={"bold"} fontSize={"$6"}>{title}</MyText>
        <Button
          pressStyle={{
            scale: 1.2,
          }}
          animateOnly={["transform",]}
          animation={"fast"}
          onPress={() => navigation.goBack()}
          icon={<ChevronLeft size={20} />}
          top={top + 10}
          left={left + 20}
          position='absolute'
          color={"#000000"}
          circular
          bg="#ffffff"
        />
        <View top={top + 10}
          right={right + 20}
          position='absolute'
          onPress={() => copyTipIdToClipboard(tripId)}
        >
          <Button
            pressStyle={{
              scale: 1.2,
            }}
            onPress={() => copyTipIdToClipboard(tripId)}
            animateOnly={["transform",]}
            animation={"fast"}
            icon={<ClipboardIcon size={20} />}
            color={"#ffffff"}
            circular
            bg="$accentColor"
          />
          <MyText color="#ffffff" fontWeight={"bold"}>Trip ID</MyText>
        </View>
      </View>
      <View flex={1}>
        {children}
      </View>
      <Menu />
      <SettingsButton screen={TRIP_SETTINGS_SCREEN} data={{ tripId, }} />
    </View>
  )
}

export default TripScreensTemplate