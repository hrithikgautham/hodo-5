import React, { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Dialog, Input, Sheet, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner, TextArea, Separator } from "tamagui";
import { useAuth } from "../hooks/auth";
import { DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../constants/colors";
import { useToast } from "../hooks/toast";
import { Plus } from "@tamagui/lucide-icons";
import { Keyboard, SafeAreaView } from "react-native";
import MyAlert from "./MyAlert";
import { db, } from "../../firebase";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { NOTES_COLLECTION } from "../constants/collections";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEFAULT_FONT_BOLD } from "../constants/fonts";

const NotePopOver = ({ tripId, docId, open, setOpen, title = "", description = "", }: { tripId: string, docId?: string, open: boolean, setOpen: any, title?: string, description?: string }) => {
  const { auth: { uid, } } = useAuth();
  const theme = useThemeName();
  const [tempTitle, setTempTitle] = useState(title);
  const [tempDescription, setTempDescription] = useState(description);
  const [showSpinner, setShowSpinner] = useState(false);
  const { right, top, } = useSafeAreaInsets();

  useEffect(() => {
    setTempTitle(title);
    setTempDescription(description)
  }, [title, description])

  // const [open, setOpen] = useState(false);
  const { showToast, } = useToast();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if (!open && title != tempTitle && description != tempDescription) {
      // show alert to save or not
      setOpenAlert(true);
    }
  }, [open]);

  async function saveNote(tripId: string, docId: string | undefined, title: string, description: string, uid: string) {
    console.log(title, description)
    try {
      if (docId) {
        const notes = doc(db, `${NOTES_COLLECTION}/${tripId}/${NOTES_COLLECTION}/${docId}`);
        await setDoc(notes, {
          title,
          description,
          lastUpdatedBy: uid,
          lastUpdatedAt: Timestamp.now(),
        });
      }
      else {
        const notes = collection(db, `${NOTES_COLLECTION}/${tripId}/${NOTES_COLLECTION}`);
        await addDoc(notes, {
          title,
          description,
          lastUpdatedBy: uid,
          lastUpdatedAt: Timestamp.now(),
        });
      }

      Keyboard.dismiss();
      showToast("Note saved!");
    }
    catch (err: any) {
      console.log(err.message);
      showToast("Couldnt save Note");
    }
    finally {
      setTempTitle("");
      setTempDescription("");
      setOpen(false);
    }
  }


  return (
    <>
      <MyAlert open={openAlert} setOpen={setOpenAlert} description="U have unsaved changes. Save?" onCancel={() => setOpen(false)} onOk={() => saveNote(tripId, docId, tempTitle, tempDescription, uid)} />
      <Popover open={open} onOpenChange={setOpen} size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button pressStyle={{
            scale: 1.1,
            opacity: 0.8,
          }}
            animateOnly={["transform"]}
            animation={"fast"}
            pos="absolute"
            zIndex={2}
            right={right + 10}
            alignSelf="flex-end"
            m="$4"
            circular
            icon={<Plus size={30} />} bg="$accentColor" color="#ffffff"
          />

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
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={{
              height: "100%"
            }}>
              <YStack space="$1" h="100%">
                <Input
                  allowFontScaling={false}
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
                  color={"$primaryFontColor"}
                  placeholder='Title...'
                  placeholderTextColor={"$secondayFontColor"}
                  fontFamily={DEFAULT_FONT_BOLD}
                  onChangeText={setTempTitle}
                  bg={"$primaryColor"}
                />
                {/* <Separator shadowColor={"$secondaryColor"} opacity={0.3} /> */}
                <View flex={1}>
                  {/* <TextArea
                    keyboardAppearance={theme}
                    maxLength={1000}
                    value={tempDescription}
                    onChangeText={setTempDescription}
                    borderWidth="$0"
                    color="$primaryFontColor"
                    bg="$secondaryColor"
                    placeholder='Type here...'
                    placeholderTextColor={"$secondayFontColor"}
                  /> */}
                  {/* <TextArea keyboardAppearance={theme} maxLength={1000} id="favFoods" value={tempDescription} onChangeText={setTempDescription} my="$2" size="$4" shadowOffset={{
                    width: 0.5,
                    height: 0.5
                  }} shadowOpacity={0.5}
                    shadowColor={"#cccccc"} borderWidth="$0" color="$primaryFontColor" bg="$secondaryColor" placeholder='What do you enjoy eating....' placeholderTextColor={"$secondayFontColor"} /> */}
                  <Input
                    allowFontScaling={false}
                    ref={descriptionRef}
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
                <Button onPress={() => saveNote(tripId, docId, tempTitle, tempDescription, uid)} bg="$accentColor" disabled={tempTitle === "" || tempDescription === "" || (tempTitle === title && tempDescription === description)} color="#ffffff">
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

export default NotePopOver;