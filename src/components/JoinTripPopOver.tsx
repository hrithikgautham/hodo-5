import React, { useState } from "react";
import { Button, Dialog, Input, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner } from "tamagui";
import { JOIN_TRIP_URL } from "../constants/URL";
import { useAuth } from "../hooks/auth";
import { useNavigation } from "@react-navigation/native";
import { TRIP_ITEMS_SCREEN } from "../constants/screens";
import { DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../constants/colors";
import { useToast } from "../hooks/toast";
import MyText from "./MyText";
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from "../constants/fonts";

const JoinTripPopOver = ({ disabled }: { disabled: boolean, }) => {
  const { auth: { uid, } } = useAuth();
  const navigation = useNavigation();
  const theme = useThemeName();
  const [joinTripId, setJoinTripId] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const [open, setOpen] = useState(false);
  const { showToast, } = useToast();

  async function joinTrip(uid: string, tripId: string) {
    if (!tripId) {
      showToast("Please enter a valid Trip ID", "");
      return;
    }
    try {
      setShowSpinner(true);
      const res = await fetch(JOIN_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId,
          uid,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());
      console.log(res);
      setShowSpinner(false);
      if (res?.success) {
        setOpen(false);
        navigation.navigate(TRIP_ITEMS_SCREEN, { tripId });
      }
      else {
        // add toast // trip id doesnt exist
      }
    }
    catch (err) {
      // add toast
    }
    finally {
      setShowSpinner(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen} size="$5" allowFlip>
      <Popover.Trigger asChild disabled={disabled}>
        <Button pressStyle={{
          scale: 1.1,
          opacity: 0.8
        }}
          animation={"fast"}
          animateOnly={["transform"]}
          disabled={disabled}
          bg={disabled ? "#aaa" : "$accentColor"}
        >
          <MyText color="#ffffff" fontFamily={DEFAULT_FONT_BOLD} >
            Join Trip
          </MyText>
        </Button>
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame bg="$secondaryColor" padding="$4">
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

        <YStack space="$3">
          <Input
            allowFontScaling={false}
            alignSelf="center"
            fontFamily={DEFAULT_FONT}
            disabled={showSpinner}
            autoFocus={true}
            width="80%"
            id="joinTripId"
            keyboardAppearance={theme}
            value={joinTripId}
            shadowOffset={{
              width: 0.5,
              height: 0.5
            }} shadowOpacity={0.5}
            shadowColor={"#cccccc"}
            shadowRadius={0.1}
            borderWidth={0}
            my="$2"
            bg="$primaryColor"
            color={"$primaryFontColor"}
            placeholder='Enter Trip ID...'
            placeholderTextColor={"$secondaryFontColor"}
            fontSize={"$5"}
            onChangeText={setJoinTripId}
          />
          <Button
            alignSelf="center"
            width={"30%"}
            size="$4"
            bg={showSpinner ? "#bbbbbbb" : "$accentColor"}
            color="#ffffff"
            fontWeight={"bold"}
            onPress={() => joinTrip(uid, joinTripId)}
            pressStyle={{
              scale: 1.1,
              opacity: 0.8,
            }}
            animateOnly={["transform"]}
            animation={"fast"}
          >
            <MyText>Join</MyText>
          </Button>
          {
            showSpinner ? <Spinner color={theme == "dark" ? LIGHT_THEME_PRIMARY_COLOR : DARK_THEME_PRIMARY_COLOR} size="large" /> : <></>
          }
          {/* <Popover.Close asChild>
            
          </Popover.Close> */}
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

export default JoinTripPopOver;