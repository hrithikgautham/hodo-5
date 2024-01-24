import React from 'react'
import { Button, ScrollView, View } from "tamagui"
import Menu from '../../components/Menu'
import { SafeAreaView } from 'react-native'
import MyText from '../../components/MyText'
import { Bell, UserCircle2, UserX2 } from '@tamagui/lucide-icons'
import { DEFAULT_FONT_BOLD, DEFAULT_FONT_EXTRA_BOLD } from '../../constants/fonts'
import { COUCH_SURF_INFO_SCREEN, DELETE_ACCOUNT_SCREEN, NOTIFICATIONS_SETTINGS_SCREEN, USER_INFO_SCREEN } from '../../constants/screens'
import { useNavigation } from '@react-navigation/native'

const SettingsScreen = () => {
  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView style={{ height: "100%" }}>
        <View>
          <MyText fontFamily={DEFAULT_FONT_BOLD} fontSize={30} color={"$primaryFontColor"} paddingHorizontal={"$4"} bold>Settings</MyText>
        </View>
        <ScrollView p="$4">
          <SettingItem title="User Profile" icon={<UserCircle2 />} screen={USER_INFO_SCREEN} />
          {/* <SettingItem title="Surf Profile" icon={<UserCircle2 />} screen={COUCH_SURF_INFO_SCREEN} /> */}
          <SettingItem title="Notifications" icon={<Bell />} screen={NOTIFICATIONS_SETTINGS_SCREEN} />
          <SettingItem title="Delete Account" icon={<UserX2 />} screen={DELETE_ACCOUNT_SCREEN} />
        </ScrollView>

      </SafeAreaView>
      <Menu />
    </View>
  )
}

function SettingItem({ title, icon, screen, }) {
  const navigation = useNavigation();

  return (
    <Button bg="$secondaryColor" p="$2" borderRadius={10} marginVertical="$2" icon={icon} onPress={() => navigation.navigate(screen)}>
      <MyText>{title}</MyText>
    </Button>
  )
}

export default SettingsScreen