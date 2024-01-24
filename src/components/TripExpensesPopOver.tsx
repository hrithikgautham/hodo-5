import React, { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Dialog, Input, Sheet, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner, TextArea, Separator } from "tamagui";
import { useAuth } from "../hooks/auth";
import { DARK_THEME_ACCENT_COLOR, DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_ACCENT_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../constants/colors";
import { useToast } from "../hooks/toast";
import { Plus } from "@tamagui/lucide-icons";
import { Keyboard, SafeAreaView } from "react-native";
import { db, } from "../../firebase";
import { Timestamp, addDoc, collection, } from "firebase/firestore";
import { EXPENSES_COLLECTION, } from "../constants/collections";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEFAULT_FONT_BOLD } from "../constants/fonts";
import DateTimePicker from '@react-native-community/datetimepicker';

const TripExpensesPopOver = ({ tripId, docId, open, setOpen, title = "", description = "", }: { tripId: string, docId?: string, open: boolean, setOpen: any, title?: string, description?: string }) => {
  const { auth: { uid, } } = useAuth();
  const theme = useThemeName();
  const [whatWasPaid, setWhatWasPaid] = useState("");
  const [howMuchWasPaid, setHowMuchWasPaid] = useState("0");
  const [whenWasItPaid, setWhenWasItPaid] = useState(new Date());
  const [showSpinner, setShowSpinner] = useState(false);
  const { right, top, } = useSafeAreaInsets();

  const { showToast, } = useToast();
  const whatWasPaidRef = useRef(null);
  const howMuchWasPaidRef = useRef(null);
  const whenWasItPaidRef = useRef(null);

  async function saveExpense(tripId: string, whatWasPaid, howMuchWasPaid, whenWasItPaid, uid: string) {
    try {
      const eexpenses = collection(db, `${EXPENSES_COLLECTION}/${tripId}/${EXPENSES_COLLECTION}`);
      await addDoc(eexpenses, {
        whatWasPaid,
        howMuchWasPaid,
        whenWasItPaid: whenWasItPaid.toString(),
        lastUpdatedBy: uid,
        lastUpdatedAt: Timestamp.now(),
      });

      Keyboard.dismiss();
      showToast("Note saved!");
    }
    catch (err: any) {
      console.log(err.message);
      showToast("Couldnt save Note");
    }
    finally {
      setOpen(false);
    }
  }


  return (
    <>
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
              <YStack space="$4" h="100%">
                <View >
                  <Label fontFamily={DEFAULT_FONT_BOLD} color="$primaryFontColor" htmlFor="what-was-paid">What was Paid?</Label>
                  <Input
                    allowFontScaling={false}
                    ref={whatWasPaidRef}
                    onSubmitEditing={() => howMuchWasPaidRef.current.focus()}
                    alignSelf="center"
                    autoFocus={true}
                    width={"100%"}
                    id="what-was-paid"
                    keyboardAppearance={theme}
                    value={whatWasPaid}
                    borderWidth={0}
                    my="$2"
                    color={"$primaryFontColor"}
                    placeholder='What was Paid?'
                    placeholderTextColor={"$secondayFontColor"}
                    fontFamily={DEFAULT_FONT_BOLD}
                    onChangeText={setWhatWasPaid}
                    bg={"$primaryColor"}
                  />
                </View>
                {/* <Separator shadowColor={"$secondaryColor"} opacity={0.3} /> */}
                <View >
                  <Label fontFamily={DEFAULT_FONT_BOLD} color="$primaryFontColor" htmlFor="how-much-was-paid">How much was Paid?</Label>
                  <Input
                    allowFontScaling={false}
                    ref={howMuchWasPaidRef}
                    onSubmitEditing={() => whenWasItPaidRef.current.focus()}
                    alignSelf="center"
                    width={"100%"}
                    id="how-much-was-paid"
                    keyboardAppearance={theme}
                    keyboardType="numeric"
                    value={howMuchWasPaid}
                    borderWidth={0}
                    my="$2"
                    color={"$primaryFontColor"}
                    placeholder='How much was Paid?'
                    placeholderTextColor={"$secondayFontColor"}
                    onChangeText={setHowMuchWasPaid}
                    bg={"$primaryColor"}
                  />
                </View>
                <View flexDirection="row" alignItems="center">
                  <Label fontFamily={DEFAULT_FONT_BOLD} color="$primaryFontColor" htmlFor="when-was-it-paid">When was it Paid?</Label>
                  <DateTimePicker
                    ref={whenWasItPaidRef}
                    themeVariant={theme == "dark" ? "dark" : "light"}
                    accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                    display="default"
                    value={whenWasItPaid}
                    mode='date'
                    onChange={({ type }, value) => setWhenWasItPaid(value)} />
                </View>

                {
                  showSpinner ? <Spinner color={theme == "dark" ? LIGHT_THEME_PRIMARY_COLOR : DARK_THEME_PRIMARY_COLOR} size="large" /> : <></>
                }
                {/* <Popover.Close asChild>
            
          </Popover.Close> */}
                <Button onPress={() => saveExpense(tripId, whatWasPaid, howMuchWasPaid, whenWasItPaid, uid)} bg="$accentColor" disabled={!whatWasPaid || !whenWasItPaid || !howMuchWasPaid} color="#ffffff">
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

export default TripExpensesPopOver;