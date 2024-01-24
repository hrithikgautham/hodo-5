import React, { useEffect, useState } from 'react'
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import { COMPARE_TRIPS_COLLECTION, TRIPS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { COMPARISON_SCREEN } from '../../constants/screens';
import { useToast } from '../../hooks/toast';
import { COMPARE_TRIPS_URL } from '../../constants/URL';
import { View, Form, YStack, Label, useThemeName, Button, Input, } from "tamagui";
import { SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GoogleMapInput from '../../components/GoogleMapInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X } from '@tamagui/lucide-icons';
import AddRemoveTravellers from '../../components/AddRemoveTravellers';
import { DARK_THEME_ACCENT_COLOR, LIGHT_THEME_ACCENT_COLOR } from '../../constants/colors';
import MyText from '../../components/MyText';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';

const NewCompareScreen = () => {
  const { auth: { email, uid, displayName: username, }, } = useAuth();
  const navigation = useNavigation();
  const { showToast, } = useToast();

  const [origin, setOrigin] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [travellers, setTravellers] = useState([{ email, uid, username, },]);
  const [budget, setBudget] = useState("");

  useEffect(() => {
    console.log("destinations: ", destinations)
  }, [destinations])

  async function compare(origin: any, destinations: any[], startDate: any, endDate: any, travellers: any[], budget: number | string, uid: string) {
    try {
      if (!origin || !destinations || destinations.length == 0 || !startDate || !endDate || !travellers || travellers.length == 0 || !budget) {
        showToast("Please fill all the fields");
        return;
      }

      if (travellers.length < 1) {
        showToast("Please add atleast one traveller");
        return;
      }

      if (budget < 0) {
        showToast("Please enter a valid budget");
        return;
      }

      if (startDate > endDate) {
        showToast("Please enter a valid date range");
        return;
      }

      if (destinations.length > 5) {
        showToast("Please select atmost 5 destinations");
        return;
      }
      console.log(destinations)

      const docRef = await addDoc(collection(db, `${USERS_COLLECTION}/${uid}/${COMPARE_TRIPS_COLLECTION}`), {
        travellers,
        origin,
        budget,
        destinations,
        processed: false,
        creationTime: Timestamp.now(),
        uid,
      });

      console.log("travellers: ", travellers)

      // make a network call to create comparison
      fetch(COMPARE_TRIPS_URL, {
        method: "POST",
        body: JSON.stringify({
          id: docRef.id,
          origin,
          travellers,
          destinations,
          startDate: `${startDate}`,
          endDate: `${endDate}`,
          budget,
          uid,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      showToast("Please wait while we create your comparison");
      navigation.navigate(COMPARISON_SCREEN);
    }
    catch (err) {
      console.log(err.message)
      showToast("Please try Again");
    }
    finally {

    }
  }

  function removeDestination(item: any) {
    const temp = destinations.filter(dest => dest != item);
    setDestinations(temp);
  }

  const theme = useThemeName();

  return (
    <View flex={1} bg={"$primaryColor"}>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps='handled' nestedScrollEnabled={true} >
          <Form flex={1} onSubmit={() => compare(origin, destinations, startDate, endDate, travellers, budget, uid)}>
            <YStack flex={1} p={"$6"} space={"$6"}>
              <YStack flex={1} space={"$6"}>
                <View >
                  <Label allowFontScaling={false} mb={10} color={"$primaryFontColor"} fontSize={"$6"}>Where are you Now?</Label>
                  <GoogleMapInput setLocation={setOrigin} location={origin} />
                </View>

                <View>
                  <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}>Where do you want to go?</Label>
                  <GoogleMapInput setLocation={setDestinations} location={destinations} clearOnSelect={true} />
                  <View >
                    {
                      destinations && destinations.length > 0 ?
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
                            bg="$red11Dark" icon={<X size={20} color="#ffffff" />} p="$0" />
                        </View>)) :
                        <MyText color={"$primaryFontColor"}>Please Select Destinations...</MyText>
                    }
                  </View>
                </View>

                <View >
                  <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}><MyText>Dates</MyText></Label>
                  <View flexDirection='row' justifyContent='space-around' alignContent='center'>
                    <View>
                      <DateTimePicker
                        themeVariant={theme == "dark" ? "dark" : "light"}
                        accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                        display="default"
                        minimumDate={startDate}
                        value={startDate}
                        mode='date'
                        onChange={(event, value) => setStartDate(value)}
                        textColor={""} />
                    </View>
                    <View>
                      <MyText alignSelf='center' color="$primaryFontColor">TO</MyText>
                    </View>
                    <View>
                      <DateTimePicker
                        themeVariant={theme == "dark" ? "dark" : "light"}
                        accentColor={theme == "dark" ? DARK_THEME_ACCENT_COLOR : LIGHT_THEME_ACCENT_COLOR}
                        display="default"
                        minimumDate={startDate}
                        value={endDate}
                        mode='date'
                        onChange={(event, value) => setEndDate(value)} />
                    </View>
                  </View>
                </View>

                <View >
                  <Label allowFontScaling={false} htmlFor='budget' mb={10} fontSize={"$6"} color={"$primaryFontColor"}>Budget</Label>
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
                  />
                </View>

                <View >
                  <Label allowFontScaling={false} mb={10} fontSize={"$6"} color={"$primaryFontColor"}>Travellers</Label>
                  {/* goes here */}
                  <AddRemoveTravellers travellers={travellers} addTraveller={(user) => setTravellers([...travellers, user])} removeTraveller={(user) => setTravellers(travellers.filter(item => item.uid != user.uid))} />

                </View>
              </YStack>

              <Form.Trigger asChild >
                <Button
                  w={"50%"}
                  alignSelf='center'
                  bg={"$accentColor"}
                  pressStyle={{
                    scale: 0.9,
                    opacity: 0.8
                  }}
                  animateOnly={["transform",]}
                  animation={"fast"}
                >
                  <MyText color="#ffffff" fontFamily={DEFAULT_FONT_BOLD} fontSize={20}>Compare</MyText>
                </Button>
              </Form.Trigger>
            </YStack>

          </Form>
        </KeyboardAwareScrollView>
      </SafeAreaView>

    </View >
  )
}

export default NewCompareScreen