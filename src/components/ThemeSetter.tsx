import React from 'react'
import { Button, Theme, useThemeName } from 'tamagui'
import { Moon, Sun } from '@tamagui/lucide-icons'
import { setTheme } from '../slices/themeSlice'
import { useDispatch } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ThemeSetter = ({ top, right }: { top: number, right: number, }) => {
  const theme = useThemeName();
  const dispatch = useDispatch();

  return (
    <Theme name={theme == "light" ? "dark" : "light"}>
      <Button
        position='absolute'
        top={top}
        right={right}
        circular m="$2"
        alignSelf="flex-end"
        onPress={() => {
          dispatch(setTheme(theme == "light" ? "dark" : "light"))
        }}
        bg={"$primaryColor"}
        pressStyle={{
          scale: 0.95,
          opacity: 0.8,
        }}
        zIndex={2}
      >
        {theme == "light" ? <Moon color="$primaryFontColor" /> : <Sun color="$primaryFontColor" />}
      </Button>
    </Theme>
  )
}

export default ThemeSetter