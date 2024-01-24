import React from 'react'
import { Button, Theme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Settings } from '@tamagui/lucide-icons'
import { useNavigation } from '@react-navigation/native'

const SettingsButton = ({ screen, data, }: { screen: string, data: any, }) => {
  const { bottom, right, } = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <Theme inverse>
      <Button
        onPress={() => navigation.navigate(screen, data)}
        pressStyle={{
          scale: 1.1,
          opacity: 0.8,
        }}
        zIndex={100}
        margin="$2"
        alignSelf='flex-end'
        position='absolute'
        bottom={bottom}
        right={right + 30}
        animateOnly={["transform",]}
        animation={"fast"}
        bg="$primaryColor"
        icon={<Settings size={20} color="$accentColor" />}
        circular
      />
    </Theme>
  )
}

export default SettingsButton