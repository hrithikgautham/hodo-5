import React from 'react'
import { Toast, } from '@tamagui/toast'
import { Theme, ThemeName, useThemeName } from 'tamagui'
import { VIEWPORT_NAME } from '../constants/contants'
import { DEFAULT_FONT_BOLD } from '../constants/fonts'

const MyToast = ({ open, setOpen, description, type }: { open: boolean, setOpen: any, title?: string, description: string, type?: string }) => {
  const theme: ThemeName = useThemeName();

  return (
    <Theme name={theme == "dark" ? "light" : "dark"}>
      {
        description ? (
          <Toast
            position='absolute'
            onOpenChange={setOpen}
            open={open}
            duration={5000}
            enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
            exitStyle={{ opacity: 0, scale: 1, y: -20 }}
            alignSelf='center'
            opacity={1}
            scale={1}
            animateOnly={["transform", "opacity"]}
            animation="medium"
            viewportName={VIEWPORT_NAME}
            bg={type == "success" ? "$green10Light" : type == "error" ? "$red10Light" : "$primaryColor"}
          >
            {/* {title ? <Toast.Title color={"$primaryFontColor"} fontSize={"$5"} fontWeight={"bold"}>{title}</Toast.Title> : <></>} */}
            <Toast.Description fontFamily={DEFAULT_FONT_BOLD} color={type == "success" || type == "error" ? "#ffffff" : "$primaryFontColor"} fontSize={"$3"}>{description}</Toast.Description>
          </Toast>
        ) :
          <></>
      }
    </Theme>
  )
}

export default MyToast