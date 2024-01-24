import React, { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Dialog, Input, Sheet, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner, TextArea, Separator } from "tamagui";
import { useAuth } from "../hooks/auth";
import { useNavigation } from "@react-navigation/native";
import { DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../constants/colors";
import { useToast } from "../hooks/toast";
import { Plus } from "@tamagui/lucide-icons";
import { Keyboard, SafeAreaView } from "react-native";
import { db, } from "../../firebase";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { REFERENCES_COLLECTION, USERS_COLLECTION } from "../constants/collections";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CSReferencePopOver = ({ disableTrigger = false, description = "", docId, open, setOpen, }: { disableTrigger: boolean, description: string, docId?: string, open: boolean, setOpen: any, }) => {
  const { auth: { uid, } } = useAuth();
  const theme = useThemeName();
  const [tempDescription, setTempDescription] = useState(description);
  const [showSpinner, setShowSpinner] = useState(false);
  const { right, top, } = useSafeAreaInsets();
  const { showToast, } = useToast();

  useState(() => {
    console.log("description  in comp: ", description)
  }, [])

  async function saveReference(docId: string | undefined, description: string, uid: string) {
    try {
      setShowSpinner(true)
      if (docId) {
        const notes = doc(db, `${USERS_COLLECTION}/${uid}/${REFERENCES_COLLECTION}/${docId}`);
        await setDoc(notes, {
          description,
          referredBy: uid,
          lastUpdatedAt: Timestamp.now(),
        });
      }
      else {
        const notes = collection(db, `${USERS_COLLECTION}/${uid}/${REFERENCES_COLLECTION}`);
        await addDoc(notes, {
          description,
          referredBy: uid,
          lastUpdatedAt: Timestamp.now(),
        });
      }

      Keyboard.dismiss();
      showToast("Reference saved!");
    }
    catch (err: any) {
      console.log(err.message);
      showToast("Couldnt save Reference. Please try Again");
    }
    finally {
      setTempDescription("");
      setOpen(false);
      setShowSpinner(false);
    }
  }


  return (
    <>
      <Popover open={open} onOpenChange={setOpen} size="$5" allowFlip>
        {
          disableTrigger ? (<></>) : (<Popover.Trigger asChild>
            <Button pressStyle={{
              scale: 1.1,
              opacity: 0.8,
            }}
              animateOnly={["transform"]}
              animation={"fast"}
              zIndex={2}
              right={right + 10}
              alignSelf="flex-end"
              m="$4"
              circular
              icon={<Plus size={30} />} bg="$accentColor" color="#ffffff"
            />

          </Popover.Trigger>)
        }


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
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={{
              height: "100%"
            }}>
              <YStack space="$1" h="100%">

                <View flex={1}>
                  <Input
                    allowFontScaling={false}
                    alignSelf="center"
                    width={"100%"}
                    id="title"
                    keyboardAppearance={theme}
                    value={tempDescription}
                    borderWidth={0}
                    my="$2"
                    color={"$primaryFontColor"}
                    placeholder='Type Here...'
                    placeholderTextColor={"$secondayFontColor"}
                    onChangeText={setTempDescription}
                    bg={"$primaryColor"}
                  // flex={1}
                  // multiline
                  />
                </View>

                {
                  showSpinner ? <Spinner color={theme == "dark" ? LIGHT_THEME_PRIMARY_COLOR : DARK_THEME_PRIMARY_COLOR} size="large" /> : <></>
                }
                {/* <Popover.Close asChild>
            
          </Popover.Close> */}
                <Button onPress={() => saveReference(docId, tempDescription, uid)} bg="$accentColor" disabled={tempDescription === "" || (tempDescription === description)} color="#ffffff">
                  Save
                </Button>
              </YStack>

            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Popover.Content>
      </Popover>
    </>
  )
}

export default CSReferencePopOver;