import React from 'react'
import { AlertDialog, Button, XStack, useThemeName } from 'tamagui'
import { DARK_THEME_PRIMARY_COLOR, DARK_THEME_PRIMARY_FONT_COLOR, LIGHT_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_FONT_COLOR } from '../constants/colors';
import MyText from './MyText';
import { DEFAULT_FONT_BOLD } from '../constants/fonts';

const MyAlert = ({ button, description, open, setOpen, onOk, onCancel, }: { button?: any, description: string, open: boolean, setOpen: any, onOk?: any, onCancel?: any }) => {
  const theme = useThemeName();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        {button}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay collapsable key="overlay"
          animation="bouncy"
          opacity={0.5}
          animateOnly={["transform", "opacity"]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }} />
        <AlertDialog.Content
          minWidth={"60%"}
          maxWidth={"80%"}
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={"bouncy"}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          borderWidth={0}
          shadowRadius={0}
          bg={theme == "dark" ? LIGHT_THEME_PRIMARY_COLOR : DARK_THEME_PRIMARY_COLOR}>
          {/* <AlertDialog.Title /> */}
          <AlertDialog.Description fontSize={"$6"} textAlign='center' fontWeight={"bold"} mb="$4" color={theme == "dark" ? LIGHT_THEME_PRIMARY_FONT_COLOR : DARK_THEME_PRIMARY_FONT_COLOR}>
            {description}
          </AlertDialog.Description>
          <XStack space="$3" justifyContent="center">
            <AlertDialog.Cancel asChild onPress={(e) => onCancel && onCancel()}>
              <Button 
              pressStyle={{
                scale: 1.1,
              }}
                animateOnly={["transform",]} 
                animation={"bouncy"}
                bg="$secondaryFontColor" 
                p="$2" 
                borderRadius={"$4"}
                >
                <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Cancel</MyText>
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action onPress={() => onOk()} asChild>
              <Button 
              pressStyle={{
                scale: 1.1,
              }}
                animateOnly={["transform",]} 
                animation={"bouncy"}
                bg="$red10Light" 
                p="$2" 
                borderRadius={"$4"}
                >
                <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Accept</MyText>
              </Button>
            </AlertDialog.Action>
          </XStack>
          {/* ... */}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}

export default MyAlert