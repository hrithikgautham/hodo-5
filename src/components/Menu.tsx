import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Button, Theme, useThemeName } from 'tamagui'
import { Menu as MenuIcon } from "@tamagui/lucide-icons"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const Menu = () => {
  const navigation = useNavigation();
  const theme = useThemeName();
  const { left, bottom } = useSafeAreaInsets()
  const user = useSelector(state => state.user.user);

  return (
    <Theme inverse>
      <Button
        zi={2}
        elevate
        elevation={0.5}
        pressStyle={{
          scale: 1.1,
          opacity: 0.8,
        }}
        animateOnly={["transform"]}
        animation={"fast"}
        bg={"$secondaryColor"}
        p="$5"
        position='absolute'
        bottom={bottom + 10}
        left={left + 30}
        circular
        icon={<MenuIcon size={30} color={"$accentColor"} />}
        onPress={() => navigation.openDrawer()}
      >
      </Button>
    </Theme>
  )
}

export default Menu