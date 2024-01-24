import React, { useEffect } from "react";
import { Heart, LogOut, Pencil, Save, Settings, X, } from "@tamagui/lucide-icons";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Dialog, Input, Sheet, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner, Separator, ScrollView } from "tamagui";
import { ADD_USER_TO_TRIP_URL, END_TRIP_URL, JOIN_TRIP_URL, REMOVE_USER_FROM_TRIP_URL, UPDATE_TRIP_URL } from "../../constants/URL";
import { useAuth } from "../../hooks/auth";
import { useNavigation } from "@react-navigation/native";
import { TRIPS_SCREEN, TRIP_ITEMS_SCREEN } from "../../constants/screens";
import { DARK_THEME_ACCENT_COLOR, DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_ACCENT_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../../constants/colors";
import { useToast } from "../../hooks/toast";
import GoogleMapInput from "../../components/GoogleMapInput";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import AddRemoveTravellers from "../../components/AddRemoveTravellers";
import { Keyboard, SafeAreaView } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { TRIPS_COLLECTION, USERS_COLLECTION } from "../../constants/collections";
import MyAlert from "../../components/MyAlert";
import MyText from "../../components/MyText";
import { DEFAULT_FONT_BOLD } from "../../constants/fonts";

const TripSettingsScreen = ({ route: { params: { tripId, }, }, }) => {
  const { auth: { uid, } } = useAuth();
  const navigation = useNavigation();
  const theme = useThemeName();

  const {
    destination: currentDestination,
    origin: currentOrigin,
    startDate: currentStartDate,
    endDate: currentEndDate,
    itinirary,
    tripEnded,
  } = useSelector(state => state.trips.trips[tripId]);
  const travellers = useSelector(state => state.trips.travellers[tripId])

  // const [open, setOpen] = useState(false);
  const { showToast, } = useToast();

  const [origin, setOrigin] = useState(currentOrigin);
  const [destination, setDestination] = useState(currentDestination);
  const [startDate, setStartDate] = useState(new Date(currentStartDate));
  const [endDate, setEndDate] = useState(new Date(currentEndDate));

  const [isEditing, setIsEditing] = useState(false);
  const { top, right, bottom, } = useSafeAreaInsets();

  function formatDate(date: string) {
    const d = new Date(date);
    return d.toLocaleString('default', { day: '2-digit', month: "short", year: "numeric" }).split(" ").join("-")
  }

  async function leaveTrip(uid, tripId) {
    try {
      const res = await fetch(REMOVE_USER_FROM_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId,
          uid,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());
      if (res?.success) {
        showToast("You have left the trip!", "");
        navigation.replace(TRIPS_SCREEN);
      }
      else {
        showToast("Please try Again", "");
      }
    }
    catch (err: any) {
      console.log(err.message)
      showToast("Please try Again", "");
    }
    finally {

    }
  }

  async function endTripNow(uid, tripId) {
    try {
      const res = await fetch(END_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId,
          uid,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());

      if (res?.success) {
        showToast("Trip Ended!", "");
        navigation.replace(TRIPS_SCREEN);
      }
      else {
        showToast("Please try Again", "");
      }
    }
    catch (err: any) {
      console.log(err.message)
      showToast("Please try Again", "");
    }
    finally {

    }
  }

  async function addTripToUser(user: any, tripId: string) {
    try {

      const res = await fetch(ADD_USER_TO_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId,
          user,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());
      if (!res?.success) {
        showToast("Please try Again");
      }
      else {
        showToast("User Added!");
      }
    }
    catch (err: any) {
      console.log(err.message)
      showToast("Please try Again");
    }
    finally {

    }
  }

  async function removeTripFromUser(uid, tripId) {
    try {

      const res = await fetch(REMOVE_USER_FROM_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId,
          uid,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());

      if (!res?.success) {
        showToast("Please try Again");
      }
      else {
        showToast("User Removed!");
      }
    }
    catch (err: any) {
      console.log(err.message)
      showToast("Please try Again");
    }
    finally {

    }
  }

  function reset() {
    setStartDate(new Date(currentStartDate))
    setEndDate(new Date(currentEndDate))
    setOrigin(null)
    setDestination(null)
    setIsEditing(false)
  }

  async function save(origin, destination, startDate, endDate, travellers, uid: string, tripId: string) {
    try {
      Keyboard.dismiss();
      await updateDoc(doc(db, `${USERS_COLLECTION}/${uid}/${TRIPS_COLLECTION}/${tripId}`), {
        processed: false,
      });
      fetch(UPDATE_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          origin, destination, startDate: `${startDate}`, endDate: `${endDate}`, travellers, uid, tripId,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      showToast("It may take sometime to Update Trip!", "");

      reset();
      navigation.replace(TRIPS_SCREEN);
    }
    catch (err) {
      showToast("Please try Again", "");
    }
    finally {

    }
  }

  const [openEndTripAlert, setOpenEndTripAlert] = useState(false);
  const [openLeaveTripAlert, setOpenLeaveTripAlert] = useState(false);

  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView style={{ flex: 1, }}>
        <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps='handled' nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
          <YStack p="$6" space={"$6"} flex={1}>

            <View >
              <Label allowFontScaling={false} id="origin" mb={10} color={"$primaryFontColor"} fontSize={"$6"}>Where are you Now?</Label>
              {
                isEditing ? (<GoogleMapInput setLocation={setOrigin} location={origin} />) : (<Input
                  allowFontScaling={false}
                  id="origin"
                  keyboardAppearance={theme}
                  value={currentOrigin.description}
                  shadowOffset={{
                    width: 0.5,
                    height: 0.5
                  }} shadowOpacity={0.5}
                  shadowColor={"#cccccc"}
                  shadowRadius={0.1}
                  borderWidth={0}
                  my="$2"
                  bg="$secondaryColor"
                  color={"$secondaryFontColor"}
                  placeholder='Enter Email...'
                  placeholderTextColor={"$secondaryFontColor"}
                  fontSize={"$5"}
                  disabled={true}
                />)
              }
            </View>

            <View >
              <Label allowFontScaling={false} id="destination" mb={10} color={"$primaryFontColor"} fontSize={"$6"}>Where do you want to go?</Label>
              {
                isEditing ? (<GoogleMapInput setLocation={setDestination} location={destination} />) : (<Input
                  allowFontScaling={false}
                  id="destination"
                  keyboardAppearance={theme}
                  value={currentDestination.description}
                  shadowOffset={{
                    width: 0.5,
                    height: 0.5
                  }} shadowOpacity={0.5}
                  shadowColor={"#cccccc"}
                  shadowRadius={0.1}
                  borderWidth={0}
                  my="$2"
                  bg="$secondaryColor"
                  color={"$secondaryFontColor"}
                  placeholder='Enter Email...'
                  placeholderTextColor={"$secondaryFontColor"}
                  fontSize={"$5"}
                  disabled={true}
                />)
              }
            </View>

            <View>
              <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}>Dates</Label>
              <View flexDirection='row' justifyContent='space-around' alignContent='center'>
                <View>
                  {
                    isEditing ? (<DateTimePicker
                      themeVariant={theme == "dark" ? "dark" : "light"}
                      accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                      display="default"
                      minimumDate={new Date(currentStartDate) < new Date() ? new Date(currentStartDate) : new Date()}
                      value={startDate}
                      mode='date'
                      onChange={(event, value) => setStartDate(value)}
                      textColor={""} />) : (
                      <View borderRadius={"$4"} bg="$secondaryColor" p="$2">
                        <MyText fontSize={"$6"} color="$primaryFontColor" >{formatDate(currentStartDate)}</MyText>
                      </View>
                    )
                  }
                </View>
                <View>
                  <MyText alignSelf='center' color="$primaryFontColor">TO</MyText>
                </View>
                <View>
                  {
                    isEditing ? (<DateTimePicker
                      themeVariant={theme == "dark" ? "dark" : "light"}
                      accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                      display="default"
                      minimumDate={startDate}
                      value={endDate}
                      mode='date'
                      onChange={(event, value) => setEndDate(value)} />) : (<View borderRadius={"$4"} bg="$secondaryColor" p="$2">
                        <MyText fontSize={"$6"} color="$primaryFontColor" >{formatDate(currentEndDate)}</MyText>
                      </View>
                    )
                  }
                </View>
              </View>
            </View>
            <Separator borderColor={"$secondaryColor"} />
            {
              isEditing ? (<Button
                onPress={() => save(origin, destination, startDate, endDate, travellers, uid, tripId)}
                pressStyle={{
                  scale: 1.1,
                  opacity: 0.8,
                }}
                animateOnly={["transform",]}
                animation={"fast"}

                bg="$accentColor"
                icon={<Save color="#ffffff" />}
                fontWeight={"bold"} color="#ffffff"
              >
                Save
              </Button>) : (<></>)
            }
            
            {
              isEditing ? <></> : (
                <YStack space={"$4"}>
                  <View >
                    <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}><MyText>Travellers</MyText></Label>
                    {/* goes here */}
                    <AddRemoveTravellers readOnly={tripEnded} travellers={travellers} addTraveller={async (user: string) => addTripToUser(user, tripId)} removeTraveller={async (user: string) => removeTripFromUser(user.uid, tripId)} />

                  </View>

                  {
                    tripEnded ? <></> : (<XStack justifyContent="space-around">
                      <MyAlert 
                      button={<Button bg="$red10Dark" onPress={() => { }} icon={<Heart color="#ffffff" />}>
                        <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">End Trip</MyText>
                      </Button>} 
                      description={"The trip will be ended for all all the Travellers. Continue?"} 
                      open={openEndTripAlert} 
                      setOpen={(val) => {
                        // setOpen(false);
                        setOpenEndTripAlert(val)
                      }} 
                      onOk={() => endTripNow(uid, tripId)} 
                      />

                      <MyAlert 
                      button={<Button bg="$red10Dark" onPress={() => { }} icon={<LogOut color="#ffffff" />}>
                        <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Leave Trip</MyText>
                      </Button>} 
                      description={"You will no longer be part of this trip. Continue?"} 
                      open={openLeaveTripAlert} 
                      setOpen={(val, x) => {
                        console.log(x)
                        // setOpen(false);
                        setOpenLeaveTripAlert(val)
                      }} 
                      onOk={() => leaveTrip(uid, tripId)} 
                      />

                    </XStack>)
                  }
                </YStack>
              )
            }

            {/* <Popover.Close asChild>
  
</Popover.Close> */}



          </YStack>
        </KeyboardAwareScrollView>
        {
          tripEnded ? <></> : (<Button
            pressStyle={{
              scale: 1.1,
              opacity: 0.8,
            }}
            onPress={() => isEditing ? reset() : setIsEditing(true)}
            animateOnly={["transform",]}
            animation={"fast"}
            position="absolute"
            top={top + 10}
            right={right + 10}
            bg={theme == "dark" ? LIGHT_THEME_PRIMARY_COLOR : DARK_THEME_PRIMARY_COLOR}
            icon={isEditing ? <X size={20} color={theme == "dark" ? DARK_THEME_PRIMARY_COLOR : LIGHT_THEME_PRIMARY_COLOR} /> : <Pencil size={20} color={theme == "dark" ? DARK_THEME_PRIMARY_COLOR : LIGHT_THEME_PRIMARY_COLOR} />}
            circular
          />)
        }
      </SafeAreaView>
    </View>
  )
}

export default TripSettingsScreen;