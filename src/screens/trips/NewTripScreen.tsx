import { Keyboard, Platform, SafeAreaView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Dialog, Form, Input, Label, View, XStack, YStack, useThemeName } from 'tamagui'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GoogleMapInput from '../../components/GoogleMapInput'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useAuth } from '../../hooks/auth'
import AddRemoveTravellers from '../../components/AddRemoveTravellers'
import { DARK_THEME_ACCENT_COLOR, DARK_THEME_PRIMARY_FONT_COLOR, LIGHT_THEME_ACCENT_COLOR } from '../../constants/colors'
import { Timestamp, addDoc, collection, deleteDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { TRIPS_COLLECTION, USERS_COLLECTION } from '../../constants/collections'
import { NEW_TRIP_URL } from '../../constants/URL'
import { useNavigation } from '@react-navigation/native'
import { TRIPS_SCREEN } from '../../constants/screens'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useToast } from '../../hooks/toast'
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from '../../constants/fonts'
import MyText from '../../components/MyText'
import GlobalStyles from '../../../global';

const NewTripScreen = () => {
  const { auth: { email, uid, displayName: username, } } = useAuth();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [travellers, setTravellers] = useState([{ email, uid, username, },]);
  const { bottom, right, left, } = useSafeAreaInsets();
  const { showToast, } = useToast();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);


  const theme = useThemeName();
  const navigation = useNavigation();

  async function createTrip(origin, destination, startDate, endDate, travellers, uid) {
    Keyboard.dismiss();
    // setLoading(true);
    let docRef = null;
    try {
      docRef = await addDoc(collection(db, `${USERS_COLLECTION}/${uid}/${TRIPS_COLLECTION}`), {
        processed: false,
        creationTime: Timestamp.now(),
        uid,
      });

      fetch(NEW_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          origin, destination, startDate: `${startDate}`, endDate: `${endDate}`, travellers, uid, tripId: docRef.id,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      showToast("Please wait while we create your Trip");
      navigation.replace(TRIPS_SCREEN);
    }
    catch (err) {
      await deleteDoc(docRef);
    }
    finally {

    }
  }

  function toggleStartDatePicker() {
    setShowStartDatePicker(!showStartDatePicker);
  }

  function toggleEndDatePicker() {
    setShowEndDatePicker(!showEndDatePicker);
  }


  function formatDate(date: any) {
    const d = new Date(date);
    console.log(d.toLocaleString('default', { day: '2-digit', month: "short", year: "numeric" }))
    return d.toLocaleString('default', { day: '2-digit', month: "short", year: "numeric" }).split(" ").join("-")
  }

  function setAndroidStartDate(type, value) {
    if (type == "set") {
      setStartDate(value)
    }
    toggleStartDatePicker();
  }

  function setAndroidEndDate(type, value) {
    if (type == "set") {
      setEndDate(value)
    }
    toggleEndDatePicker();
  }

  return (
    <View flex={1} bg={"$primaryColor"}>

      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps='handled' nestedScrollEnabled={true} >
          <View p="$4" flex={1}>
            <Form flex={1} onSubmit={() => createTrip(origin, destination, startDate, endDate, travellers, uid)}>
              <YStack flex={1} space={"$6"} >
                <YStack flex={1} space={"$6"}>
                  <View >
                    <Label allowFontScaling={false} fontFamily={DEFAULT_FONT} mb={10} color={"$primaryFontColor"} fontSize={"$6"}>Where are you Now?</Label>
                    <GoogleMapInput setLocation={setOrigin} location={origin} />
                  </View>

                  <View >
                    <Label allowFontScaling={false} fontFamily={DEFAULT_FONT} mb={10} fontSize={"$6"} color={"$primaryFontColor"}>Where do you want to go?</Label>
                    <GoogleMapInput setLocation={setDestination} location={destination} />
                  </View>

                  <View >
                    <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}>Dates</Label>
                    <View flexDirection='row' justifyContent='space-around' alignItems='center'>
                      <View>
                        {
                          Platform.OS == "android" ? (<View pressStyle={{
                            scale: 0.9,
                            opacity: 0.8

                          }} animateOnly={["transform"]} animation={"fast"} borderRadius={"$4"} bg="$secondaryColor" p="$2" onPress={toggleStartDatePicker}>
                            <MyText fontSize={"$6"} color="$primaryFontColor" >{formatDate(startDate)}</MyText>
                          </View>) : (<DateTimePicker
                            themeVariant={theme == "dark" ? "dark" : "light"}
                            accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                            display="default"
                            minimumDate={new Date()}
                            value={startDate}
                            mode='date'
                            onChange={({ type }, value) => setStartDate(value)}
                            textColor={""} />)
                        }
                        {
                          showStartDatePicker ? (<DateTimePicker
                            themeVariant={theme == "dark" ? "dark" : "light"}
                            accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                            display="default"
                            minimumDate={new Date()}
                            value={startDate}
                            mode='date'
                            onChange={({ type }, value) => setAndroidStartDate(type, value)}
                            textColor={""} />) : <></>
                        }

                      </View>
                      <View>
                        <MyText alignSelf='center' color="$primaryFontColor">TO</MyText>
                      </View>
                      <View>
                        {
                          Platform.OS == "android" ? (<View pressStyle={{
                            scale: 0.9,
                            opacity: 0.8

                          }} animateOnly={["transform"]} animation={"fast"} borderRadius={"$4"} bg="$secondaryColor" p="$2" onPress={toggleEndDatePicker}>
                            <MyText fontSize={"$6"} color="$primaryFontColor" >{formatDate(endDate)}</MyText>
                          </View>) : (<DateTimePicker
                            themeVariant={theme == "dark" ? "dark" : "light"}
                            accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                            display="default"
                            minimumDate={startDate}
                            value={endDate}
                            mode='date'
                            onChange={({ type }, value) => setEndDate(value)} />)
                        }
                        {
                          showEndDatePicker ? (<DateTimePicker
                            themeVariant={theme == "dark" ? "dark" : "light"}
                            accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                            display="default"
                            minimumDate={startDate}
                            value={endDate}
                            mode='date'
                            onChange={({ type }, value) => setAndroidEndDate(type, value)} />) : <></>
                        }
                      </View>
                    </View>
                  </View>

                  <View >
                    <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}>Travellers</Label>
                    {/* goes here */}
                    <AddRemoveTravellers travellers={travellers} addTraveller={(user) => setTravellers([...travellers, user])} removeTraveller={(user) => setTravellers(travellers.filter(item => item.uid != user.uid))} />

                  </View>
                </YStack>

                <Form.Trigger asChild>
                  <Button
                    alignSelf='center'
                    w={"50%"}
                    bg={"$accentColor"}
                    pressStyle={{
                      scale: 0.9,
                      opacity: 0.8
                    }}
                    animateOnly={["transform",]}
                    animation={"fast"}
                  >
                    <MyText color="#ffffff" fontFamily={DEFAULT_FONT_BOLD} fontSize={20}>Create Trip</MyText>
                  </Button>
                </Form.Trigger>
              </YStack>

            </Form>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

    </View >
  )
}

export default NewTripScreen