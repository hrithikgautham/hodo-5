import React, { useEffect } from "react";
import { Heart, LogOut, Pencil, Save, Settings, X, } from "@tamagui/lucide-icons";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Dialog, Input, Sheet, useThemeName, View, XStack, YStack, Popover, Adapt, Label, Spinner, Separator, ScrollView } from "tamagui";
import { ADD_USER_TO_COMPARE_URL, ADD_USER_TO_TRIP_URL, COMPARE_TRIPS_URL, END_TRIP_URL, JOIN_TRIP_URL, REMOVE_USER_FROM_COMPARE_URL, REMOVE_USER_FROM_TRIP_URL, UPDATE_COMPARE_TRIPS_URL, } from "../../constants/URL";
import { useAuth } from "../../hooks/auth";
import { useNavigation } from "@react-navigation/native";
import { COMPARISON_SCREEN, TRIPS_SCREEN, TRIP_ITEMS_SCREEN } from "../../constants/screens";
import { DARK_THEME_ACCENT_COLOR, DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_ACCENT_COLOR, LIGHT_THEME_PRIMARY_COLOR } from "../../constants/colors";
import { useToast } from "../../hooks/toast";
import GoogleMapInput from "../../components/GoogleMapInput";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import AddRemoveTravellers from "../../components/AddRemoveTravellers";
import { Keyboard, SafeAreaView } from "react-native";
import { doc, updateDoc, } from "firebase/firestore";
import { db } from "../../../firebase";
import { COMPARE_TRIPS_COLLECTION, TRIPS_COLLECTION, USERS_COLLECTION } from "../../constants/collections";
import MyText from "../../components/MyText";

const CompareTripsSettingsScreen = ({ route: { params: { compareId, }, }, }) => {
  const { auth: { uid, } } = useAuth();
  const navigation = useNavigation();
  const theme = useThemeName();

  const {
    destinations: currentDestinations,
    origin: currentOrigin,
    startDate: currentStartDate,
    endDate: currentEndDate,
    budget: currentBudget,
  } = useSelector(state => state.compares.compares[compareId]);

  const travellers = useSelector(state => state.compares.travellers[compareId]);

  const [open, setOpen] = useState(false);
  const { showToast, } = useToast();

  const [origin, setOrigin] = useState(currentOrigin);
  const [destinations, setDestinations] = useState(currentDestinations);
  const [startDate, setStartDate] = useState(new Date(currentStartDate));
  const [endDate, setEndDate] = useState(new Date(currentEndDate));
  const [budget, setBudget] = useState(currentBudget);

  const [isEditing, setIsEditing] = useState(false);
  const { top, right, bottom, } = useSafeAreaInsets();

  function formatDate(date: string) {
    const d = new Date(date);
    return d.toLocaleString('default', { day: '2-digit', month: "short", year: "numeric" }).split(" ").join("-")
  }

  async function addTripToUser(user: any, compareId: string,) {
    try {

      const res = await fetch(ADD_USER_TO_COMPARE_URL, {
        method: "POST",
        body: JSON.stringify({
          compareId,
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

  async function removeTripFromUser(uid: string, compareId: string,) {
    try {

      const res = await fetch(REMOVE_USER_FROM_COMPARE_URL, {
        method: "POST",
        body: JSON.stringify({
          compareId,
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
    setOrigin(currentOrigin)
    setDestinations(currentDestinations)
    setIsEditing(false)
  }

  async function save(origin, destinations, startDate, endDate, budget, travellers, uid: string, compareId: string) {
    try {
      Keyboard.dismiss();
      await updateDoc(doc(db, `${USERS_COLLECTION}/${uid}/${COMPARE_TRIPS_COLLECTION}/${compareId}`), {
        processed: false,
      });
      fetch(UPDATE_COMPARE_TRIPS_URL, {
        method: "POST",
        body: JSON.stringify({
          id: compareId,
          origin,
          destinations,
          startDate: `${startDate}`,
          endDate: `${endDate}`,
          travellers,
          uid,
          budget,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      showToast("It may take sometime to Update!", "");

      reset();
      navigation.replace(COMPARISON_SCREEN);
    }
    catch (err: any) {
      console.log(err.message)
      showToast("Please try Again", "");
    }
    finally {

    }
  }

  function removeDestination(item: any) {
    const temp = destinations.filter(dest => dest != item);
    setDestinations(temp);
  }

  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView>
        <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>

          <YStack p="$3">

            <View marginVertical={"$3"}>
              <Label allowFontScaling={false} id="origin" mb={10} color={"$primaryFontColor"} fontSize={"$6"}><MyText>Origin: </MyText></Label>
              {
                isEditing ? (<GoogleMapInput setLocation={setOrigin} location={origin} />) : (<Input
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

            <View marginVertical={"$3"}>
              <Label allowFontScaling={false} id="origin" mb={10} color={"$primaryFontColor"} fontSize={"$6"}><MyText>Destinations: </MyText></Label>
              {
                isEditing ? (<View>
                  <GoogleMapInput setLocation={setDestinations} location={destinations} clearOnSelect={true} />
                  <View >
                    {
                      destinations.map((item: any, index) => (<View marginVertical={"$2"} key={item.description} bg="$primaryColor" flexDirection='row' alignItems='center' gap="$2">
                        <MyText color="$primaryFontColor">{item.description}</MyText>
                        {/* <Button alignSelf='center' p={0} icon={<X size={20} color={"red"} />} h="$0" onPress={() => removeDestination(item)} /> */}
                        <Button
                          onPress={() => removeDestination(item)}
                          pressStyle={{
                            scale: 1.1,
                            opacity: 0.8
                          }}
                          animateOnly={["transform",]}
                          animation={"fast"}
                          borderRadius={100}
                          h={20}
                          w={20}
                          bg="$red11Dark"
                          icon={<X size={20} color="#ffffff" />}
                          p="$0"
                        />
                      </View>))
                    }
                  </View>
                </View>) : (<View>
                  {
                    destinations.map(destination => (<Input
                      id="origin"
                      keyboardAppearance={theme}
                      value={destination.description}
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
                    />))
                  }
                </View>)
              }
            </View>

            <View marginVertical={"$3"}>
              <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}><MyText>Dates</MyText></Label>
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
                      onChange={(event, value) => setEndDate(value)} />) : (
                      <View borderRadius={"$4"} bg="$secondaryColor" p="$2">
                        <MyText fontSize={"$6"} color="$primaryFontColor" >{formatDate(currentEndDate)}</MyText>
                      </View>
                    )
                  }
                </View>
              </View>
            </View>

            <View marginVertical="$3">
              <Label allowFontScaling={false} htmlFor='budget' mb={10} fontSize={"$6"} color={"$primaryFontColor"}><MyText>Budget: </MyText></Label>
              <Input
                allowFontScaling={false}
                id="budget"
                keyboardAppearance={theme}
                keyboardType="numeric"
                value={budget}
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
                placeholder='Eg: 50000'
                placeholderTextColor={"$secondaryFontColor"}
                fontSize={"$5"}
                onChangeText={setBudget}
                disabled={!isEditing}
              />
            </View>
            {
              isEditing ? (<Button
                onPress={() => save(origin, destinations, startDate, endDate, budget, travellers, uid, compareId)}
                pressStyle={{
                  scale: 1.1,
                  opacity: 0.8,
                }}
                animateOnly={["transform",]}
                animation={"fast"}
                shadowRadius={0.1}
                shadowOpacity={0.1}
                shadowOffset={{
                  width: 1,
                  height: 1
                }}
                shadowColor={"$primaryFontColor"}
                bg="$accentColor"
                icon={<Save color="#ffffff" />}
                fontWeight={"bold"} color="#ffffff"
              >
                Save
              </Button>) : (<></>)
            }
            <Separator marginVertical={"$4"} borderColor={"$primaryColor"} />
            {
              isEditing ? <></> : (
                <>
                  <View marginTop="$4" marginBottom={"$10"}>
                    <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}><MyText>Travellers</MyText></Label>
                    {/* goes here */}
                    <AddRemoveTravellers travellers={travellers} addTraveller={async (user: string) => addTripToUser(user, compareId)} removeTraveller={async (user: string) => removeTripFromUser(user.uid, compareId)} />

                  </View>
                </>
              )
            }

            {/* <Popover.Close asChild>

</Popover.Close> */}




          </YStack>

        </KeyboardAwareScrollView>
        <Button
          pressStyle={{
            scale: 1.1,
            opacity: 0.8,
          }}
          onPress={() => isEditing ? reset() : setIsEditing(true)}
          animateOnly={["transform",]}
          animation={"fast"}
          shadowRadius={0.1}
          shadowOpacity={0.1}
          position="absolute"
          top={top + 10}
          right={right + 20}
          shadowOffset={{
            width: 1,
            height: 1
          }}
          shadowColor={"$primaryFontColor"}
          bg={theme == "dark" ? LIGHT_THEME_PRIMARY_COLOR : DARK_THEME_PRIMARY_COLOR}
          icon={isEditing ? <X size={20} color={theme == "dark" ? DARK_THEME_PRIMARY_COLOR : LIGHT_THEME_PRIMARY_COLOR} /> : <Pencil size={20} color={theme == "dark" ? DARK_THEME_PRIMARY_COLOR : LIGHT_THEME_PRIMARY_COLOR} />}
          circular
        />
      </SafeAreaView>
    </View>
  )
}

export default CompareTripsSettingsScreen;