import React, { useState } from "react";
import { Button, Dialog, Input, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner, Image, ScrollView } from "tamagui";
import { JOIN_TRIP_URL } from "../constants/URL";
import { useAuth } from "../hooks/auth";
import { useNavigation } from "@react-navigation/native";
import { TRIP_ITEMS_SCREEN } from "../constants/screens";
import { DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../constants/colors";
import { useToast } from "../hooks/toast";
import MyText from "./MyText";
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from "../constants/fonts";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const ImagePreviewPopOver = ({ uri, open, setOpen, }: { uri: string, open: boolean, setOpen: any, }) => {

  return (
    <Popover open={open} onOpenChange={setOpen} size="$5" allowFlip>

      {/* <Popover.Trigger asChild >
        <Button pressStyle={{
          scale: 1.1,
          opacity: 0.8
        }}
          animation={"fast"}
          animateOnly={["transform"]}
          bg={disabled ? "#aaa" : "$accentColor"}
        >
          <MyText color="#ffffff" fontFamily={DEFAULT_FONT_BOLD} >
            Join Trip
          </MyText>
        </Button>
      </Popover.Trigger> */}

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame bg="$secondaryColor">
            <Adapt.Contents />
          </Popover.Sheet.Frame >
          <Popover.Sheet.Overlay
            animation="lazy"
            animateOnly={["transform", "opacity"]}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={"fast"}
        animateOnly={["transform", "opacity"]}
        bg="$red11Dark"
      >
        <YStack>
          <Image w={screenWidth} h={"100%"} resizeMode="contain" source={{
            uri,
          }} />
         
          {/* <Popover.Close asChild>
            
          </Popover.Close> */}
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

export default ImagePreviewPopOver;