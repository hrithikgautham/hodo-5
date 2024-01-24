import React, { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Dialog, Input, Sheet, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner, TextArea, Separator } from "tamagui";
import { useAuth } from "../hooks/auth";
import { useNavigation } from "@react-navigation/native";
import { DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../constants/colors";
import { useToast } from "../hooks/toast";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MyText from "./MyText";
import { SEND_CS_REQUEST_TO_USER } from "../constants/URL";
import { DEFAULT_FONT_BOLD } from "../constants/fonts";

const CouchSurfRequestPopOver = ({ to, open, setOpen, }: { to: string, open: boolean, setOpen: any, }) => {
  const { auth: { uid: from, } } = useAuth();
  const navigation = useNavigation();
  const theme = useThemeName();
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const { right, top, } = useSafeAreaInsets();

  // const [open, setOpen] = useState(false);
  const { showToast, } = useToast();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  async function requestUser(from, to, title, description) {
    try {
      setShowSpinner(true)
      const res = await fetch(SEND_CS_REQUEST_TO_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, title, description, }),
      }).then(res => res.json());

      if (!res?.success) {
        console.log("error")
        showToast("Please try Again");
      }
      else {
        showToast("Request Sent");
        setOpen(false);
      }
    }
    catch (err) {
      console.log("error")
      console.log(err.message);
      showToast("Please try Again");
    }
    finally {
      setShowSpinner(false);
    }
  }


  return (
    <>
      <Popover open={open} onOpenChange={setOpen} size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button
            pressStyle={{
              scale: 1.1,
              opacity: 0.8,
            }}
            animateOnly={["transform"]}
            animation={"fast"}
            bg="$accentColor"
          >
            <MyText color="#ffffff">Request</MyText>
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

          <SafeAreaView>
            <MyText m={"$2"} fontFamily={DEFAULT_FONT_BOLD} fontSize={"$6"} color={"$primaryFontColor"}>Send Personalised Request</MyText>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={{
              height: "100%"
            }}>
              <YStack space="$3" h="100%">
                <Input
                  allowFontScaling={false}
                  disabled={showSpinner}
                  ref={titleRef}
                  onSubmitEditing={() => descriptionRef.current.focus()}
                  alignSelf="center"
                  autoFocus={true}
                  width={"100%"}
                  id="title"
                  keyboardAppearance={theme}
                  value={tempTitle}
                  borderWidth={0}
                  my="$2"
                  bg={"$primaryColor"}
                  color={"$primaryFontColor"}
                  placeholder='Title...'
                  placeholderTextColor={"$secondaryFontColor"}
                  fontSize={"$8"}
                  onChangeText={setTempTitle}
                />
                {/* <Separator shadowColor={"$secondaryColor"} opacity={0.3} /> */}
                <View>
                  <Input
                    allowFontScaling={false}
                    disabled={showSpinner}
                    ref={descriptionRef}
                    alignSelf="center"
                    width={"100%"}
                    id="description"
                    keyboardAppearance={theme}
                    value={tempDescription}
                    borderWidth={0}
                    my="$2"
                    bg={"$primaryColor"}
                    color={"$primaryFontColor"}
                    placeholder='Why you want to stay with them...'
                    placeholderTextColor={"$secondaryFontColor"}
                    fontSize={"$8"}
                    onChangeText={setTempDescription}
                  // flex={1}
                  // multiline
                  />
                </View>

                {/* {
                  showSpinner ? <Spinner color={theme == "dark" ? LIGHT_THEME_PRIMARY_COLOR : DARK_THEME_PRIMARY_COLOR} size="large" /> : <></>
                } */}
                {/* <Popover.Close asChild>
            
          </Popover.Close> */}
                <Button onPress={() => requestUser(from, to, tempTitle, tempDescription)} bg="$accentColor" disabled={tempTitle === "" || tempDescription === "" || showSpinner} color="#ffffff">
                  Send Request
                </Button>
              </YStack>

            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Popover.Content>
      </Popover>
    </>
  )
}

export default CouchSurfRequestPopOver;