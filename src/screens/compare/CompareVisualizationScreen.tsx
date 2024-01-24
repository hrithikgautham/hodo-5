import React, { useEffect, useState } from 'react'
import { View, ScrollView, Accordion, Paragraph, Square, Separator, Button, Select, YStack, Adapt, Sheet, Spinner, XStack, RadioGroup, } from "tamagui";
import Chart from '../../components/Chart';
import { Keyboard, SafeAreaView } from 'react-native';
import { NEW_TRIP_URL } from '../../constants/URL';
import { useToast } from '../../hooks/toast';
import { useNavigation } from '@react-navigation/native';
import { COMPARE_TRIPS_SETTINGS_SCREEN, DRAWER_TRIPS_SCREEN, TRIPS_SCREEN } from '../../constants/screens';
import { Timestamp, addDoc, collection, collectionGroup, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { COMPARE_TRIPS_COLLECTION, TRIPS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { Check, ChevronDown, ChevronUp, Cloud, CloudRain, Cloudy, Plane, Smile, Star, Sun, Timer, Wallet } from '@tamagui/lucide-icons';
import Menu from '../../components/Menu';
import { LinearGradient } from 'react-native-svg';
import { useAuth } from '../../hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import { addTraveller, clearTravellers, removeTraveller } from '../../slices/compareSlice';
import SettingsButton from '../../components/SettingsButton';
import MyText from '../../components/MyText';
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from '../../constants/fonts';
import { Label } from 'tamagui';

const CompareVisualizationScreen = ({ route: { params: { compareId, }, } }) => {
  const { auth: { uid, }, } = useAuth();

  const { data, origin, destinations, startDate, endDate, travellers, } = useSelector(state => state.compares.compares[compareId]);

  const [accordionHeaders, setAccordionHeaders] = useState(Object.keys(data));
  const { showToast, } = useToast();
  const navigation = useNavigation();
  const [selectedPlace, setSelectedPlace] = useState<string>("0");
  const [showSpinner, setShowSpinner] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {

    const unsub = onSnapshot(query(collection(db, USERS_COLLECTION, uid, COMPARE_TRIPS_COLLECTION), where("compareId", "==", compareId)), snapshot => {
      console.log(snapshot.size)
      snapshot.docChanges().forEach(change => {
        const { compareId, uid, } = change.doc.data();

        if (change.type === "added" || change.type === "modified") {
          dispatch(addTraveller({
            id: compareId,
            data: uid,
          }));
        }

        if (change.type === "removed") {
          dispatch(removeTraveller({
            id: compareId,
            data: uid,
          }));
        }
      });
    });

    return () => {
      unsub();
      dispatch(clearTravellers({
        id: compareId,
      }))
    }
  }, []);

  function getPieChartData(data) {
    const keys = Object.keys(data);// train, bus, 
    return keys.map(key => {
      const chartData = Object.keys(data[key]);
      return <Chart title={key} type="pie" data={chartData.map(item => ({
        name: item,
        data: data[key][item],
        legendFontColor: "#7F7F7F",
        color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        legendFontSize: 12
      }))} />;
    });
  }

  async function createTrip(origin, destination, startDate, endDate, travellers, uid) {

    let docRef = null;
    setShowSpinner(true);
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
      navigation.navigate(DRAWER_TRIPS_SCREEN);
    }
    catch (err) {
      await deleteDoc(docRef);
    }
    finally {
      setShowSpinner(false);
    }
  }

  return (
    <View bg={"$primaryColor"} flex={1}>
      <SafeAreaView>
        <MyText pl="$3" color="$primaryFontColor" fontSize={"$8"}>Metrics</MyText>
        <ScrollView h={"100%"} p="$3">
          <View>
            <Accordion width={"100%"} type='multiple'>
              {
                accordionHeaders.map((header, index) => {
                  let chartComponents = [];
                  let title = "";
                  let icon = <></>;


                  switch (header) {
                    case "commuting_cost": {

                      chartComponents.push(...getPieChartData(data[header]));
                      icon = <Plane color={"$secondaryFontColor"} />
                      title = "Commuting Cost";
                      break;
                    }
                    case "travel_hours": {
                      chartComponents.push(...getPieChartData(data[header]));
                      icon = <Timer color={"$secondaryFontColor"} />
                      title = "Travel Hours";
                      break;
                    }
                    case "weather": {
                      chartComponents.push(<View className="self-center w-full">
                        {
                          Object.entries(data[header]).map(([place, weather], index) => (
                            <View m="$2" gap="$1">
                              <MyText fontWeight={"bold"} color="$secondaryFontColor" fontSize={"$6"}>{place.length > 20 ? `${place.slice(0, 20)}...` : place}</MyText>
                              <View flexDirection='row' alignItems='center' gap="$2">
                                {/* <Icon type="ionicon" name={weather == "sunny" ? "sunny-outline" : weather == "rainy" ? "rainy-outline" : "cloud-circle-outline"} /> */}

                                {weather == "sunny" ? <Sun color={"$secondaryFontColor"} /> : weather == "rainy" ? <CloudRain color={"$secondaryFontColor"} /> : <Cloudy color={"$secondaryFontColor"} />}
                                <MyText color="$secondaryFontColor">{weather}</MyText>
                              </View>
                            </View>
                          ))
                        }
                      </View>);
                      icon = <Cloud color={"$secondaryFontColor"} />
                      title = "Weather";
                      break;
                    }
                    case "reviews": {
                      chartComponents.push(<View className="self-center w-full">
                        {
                          Object.entries(data[header]).map(([place, reviews], index) => (
                            <View key={index} m="$2" gap="$1">
                              <MyText fontWeight={"bold"} color="$secondaryFontColor" fontSize={"$6"}>{place.length > 20 ? `${place.slice(0, 20)}...` : place}</MyText>
                              <View gap={"$1"}>
                                {
                                  reviews.map((review) => (<MyText color="$secondaryFontColor">* {review}</MyText>))
                                }
                              </View>
                            </View>
                          ))
                        }
                      </View>);
                      icon = <Star color={"$secondaryFontColor"} />
                      title = "Reviews";
                      break;
                    }
                    case "sentiment": {
                      chartComponents.push(<View className="self-center w-full">
                        {
                          Object.entries(data[header]).map(([place, sentiment], index) => (
                            <View key={index} m="$2" gap="$1">
                              <MyText fontWeight={"bold"} color="$secondaryFontColor" fontSize={"$6"}>{place.length > 20 ? `${place.slice(0, 20)}...` : place}</MyText>
                              <View >
                                {/* <Icon type="ionicon" name={sentiment == "positive" ? "happy-outline" : sentiment == "negative" ? "sad-outline" : "cloud-circle-outline"} /> */}
                                <MyText color="$secondaryFontColor">{sentiment}</MyText>
                              </View>
                            </View>
                          ))
                        }
                      </View>);
                      icon = <Smile color={"$secondaryFontColor"} />
                      title = "Sentiment";
                      break;
                    }
                    case "affordability_of_the_place": {
                      chartComponents.push(<Chart title={""} type="pie" data={Object.keys(data[header]).map(key => ({
                        name: key,
                        data: data[header][key],
                        legendFontColor: "#7F7F7F",
                        color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
                        legendFontSize: 15
                      }))} />);
                      icon = <Wallet color={"$secondaryFontColor"} />
                      title = "Affordability";
                      break;
                    }
                  }
                  return <Accordion.Item key={index} value={"" + index}>
                    <Accordion.Trigger
                      bg="$secondaryColor"
                      borderColor={"$secondaryColor"}
                      borderRadius={"$4"}
                      marginTop={"$2"}
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      {({ open }) => (
                        <>
                          <View flexDirection='row' alignItems='center' gap="$2">
                            {icon}
                            <Paragraph scale={open ? 1.1 : 1} animateOnly={["transform"]} animation="fast" color="$primaryFontColor">{title}</Paragraph>
                          </View>

                          <Square animateOnly={["transform"]} animation="fast" rotate={open ? '180deg' : '0deg'}>
                            <ChevronDown color="$accentColor" size="$1" />
                          </Square>
                        </>
                      )}
                    </Accordion.Trigger>
                    <View zIndex={2}>
                      <Separator alignSelf='center' pos="absolute" borderColor={"$primaryColor"} width={"80%"} />
                    </View>
                    <Accordion.Content
                      top={-10}
                      animateOnly={["transform"]}
                      animation={"fast"}
                      bg="$secondaryColor"
                      borderBottomLeftRadius={"$4"}
                      borderBottomRightRadius={"$4"}
                    >

                      <ScrollView>
                        {chartComponents}
                      </ScrollView>
                    </Accordion.Content>
                  </Accordion.Item>;
                })
              }
            </Accordion>
          </View>
          <Separator marginVertical={"$4"} borderColor={"$secondaryColor"} />

          <View gap="$2" mb={"$20"}>
            {/* here */}
            <View>
              <RadioGroup aria-labelledby="Select one item" value={selectedPlace} defaultValue={"0"} name="form" onValueChange={setSelectedPlace}>
                <YStack space={"$2"}>
                  {
                    destinations.map((destination, index) => (<XStack alignItems="center" space="$4">
                      <RadioGroup.Item value={"" + index} id={`${destination.location.lat}=${destination.location.lng}`} size={30}>
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>

                      <Label allowFontScaling={false} color={"$primaryFontColor"} size={30} htmlFor={`${destination.location.lat}=${destination.location.lng}`}>
                        {destination.description}
                      </Label>
                    </XStack>))
                  }
                </YStack>
              </RadioGroup>
            </View>
            {/* here */}
            <Button
              pressStyle={{
                scale: 0.9,
                opacity: 0.8
              }}
              animateOnly={["transform",]}
              animation={"fast"}
              bg="$accentColor"
              w={"50%"}
              alignSelf='center'
              onPress={() => createTrip(origin, destinations[selectedPlace], startDate, endDate, travellers, uid)}
            >
              {
                showSpinner ? <Spinner color={"#ffffff"} /> : <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Create Trip</MyText>
              }
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Menu />
      <SettingsButton screen={COMPARE_TRIPS_SETTINGS_SCREEN} data={{ compareId, }} />
    </View>
  )
}

export default CompareVisualizationScreen