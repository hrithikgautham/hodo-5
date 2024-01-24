import React, { useState, useEffect, } from 'react'
import TripScreensTemplate from '../../components/TripScreensTemplate'
import { Accordion, Button, Paragraph, ScrollView, Separator, Square, View, XStack, YStack } from 'tamagui';
import CardComp from '../../components/Card';
import { MAP_SCREEN, TRIP_PLACES_SCREEN } from '../../constants/screens';
import { useSelector } from 'react-redux';
import { UPDATE_ITINIRARY_URL } from '../../constants/URL';
import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from 'react-native-reanimated';
import Draggable from '../../components/Draggable';
import { ChevronDown, GripVertical, Map, Pencil, Save, X } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../hooks/toast';
import { SafeAreaView } from 'react-native';
import MyText from '../../components/MyText';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';

const TripPlacesScreen = ({ route: { params: { tripId, index, } } }) => {


  const { itinirary, tripEnded, } = useSelector(state => state.trips.trips[tripId]);
  const { right, } = useSafeAreaInsets();

  const { auth: { email, }, setLoading, } = useAuth();
  const [places, setPlaces] = useState(itinirary[index].places);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();
  const [tempPlaces, setTempPlaces] = useState([...places]);
  const trip = useSelector(state => state.trips.trips[tripId]);
  const travellers = useSelector(state => state.trips.travellers[tripId]);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const positions = useSharedValue({ ...Object.keys(places) });
  const { showToast, } = useToast();

  async function updateItiniraryOfTrip(tripId, itinirary) {
    try {
      const res = await fetch(UPDATE_ITINIRARY_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId,
          itinirary,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());
      console.log(res)
      return res.success;
    }
    catch (err) {
      return false;
    }
  }

  function close() {
    setTempPlaces([...places]);
    positions.value = { ...Object.keys(places) };
    setIsEditing(false);
  }

  function remove(index) {
    const temp = [...tempPlaces.slice(0, index), ...tempPlaces.slice(index + 1, tempPlaces.length)];
    setTempPlaces(temp);
    positions.value = { ...Object.keys(temp) };
  }

  async function save(newOrder) {
    try {
      const oldOrders = Object.keys(newOrder);
      const newOrders: any = Object.values(newOrder);
      const result = [];

      oldOrders.forEach((order, i) => {
        result[newOrders[i]] = tempPlaces[order]
      });

      const newItinirary = JSON.parse(JSON.stringify(itinirary));

      newItinirary[index].places = result;

      console.log(newItinirary[index].places.map(item => item.name));
      // return;
      const res = await updateItiniraryOfTrip(tripId, newItinirary);
      console.log("res?.success: ", res?.success)
      if (res) {
        positions.value = { ...Object.keys(result) };
        showToast("Updated Trip!");
        setTempPlaces(result);
        setPlaces(result);
        setIsEditing(false);
      }
      else {
        showToast("Please try Again")
        close();
      }
    }
    catch (err: any) {
      console.log(err.message)
      showToast("Please try Again");
      close();
    }
    finally {
      setLoading(false);
    }
  }

  function goToMapScreen(autoFocus) {
    console.log("sdfdsf: ", places.map(item => ({ lat: item.lat, lng: item.lng, name: item.name, })))
    navigation.navigate(MAP_SCREEN, { autoFocus, tripId, index, locations: places.map(item => ({ lat: item.lat, lng: item.lng, name: item.name, })), })
  }

  return (
    <TripScreensTemplate title={`Day ${index + 1} (${itinirary[index].date})`} imageUrl={places[0]?.photos ? places[0]?.photos[0] : ""} tripId={tripId} >
      <XStack
        space={"$2"}
        margin="$4"
        pos="absolute"
        zIndex={1}>
        <Button pressStyle={{
          scale: 1.1,
          opacity: 0.8,
        }}
          onPress={() => isEditing ? save(positions.value) : goToMapScreen(false)}
          animateOnly={["transform",]}
          animation={"fast"}
          bg={"$accentColor"}
          icon={isEditing ? <Save size={20} color="#ffffff" /> : <Map size={20} color="#ffffff" />}
          circular
        />
        {
          tripEnded ? <></> : (<Button pressStyle={{
            scale: 1.1,
            opacity: 0.8,
          }}
            onPress={() => isEditing ? close() : setIsEditing(!isEditing)}
            animateOnly={["transform",]}
            animation={"fast"}
            bg={"#ffffff"}
            icon={isEditing ? <X size={20} color="#000000" /> : <Pencil size={20} color="#000000" />}
            circular
          />)
        }
      </XStack>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false} padding="$6" h="100%" >
          <View flexDirection='column' flexWrap='wrap' justifyContent='space-evenly' alignItems='center' rowGap={"$4"}>
            {
              isEditing ?
                (tempPlaces.map((item, i) => (
                  <Draggable key={`${item.lat}, ${item.lng}`} positions={positions} id={i}>
                    <View bg="$secondaryColor" p="$2" borderRadius={5} flexDirection='row' justifyContent='space-between' alignItems='center'>
                      <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Button icon={<GripVertical color={"$accentColor"} size={20} />} bg="$secondaryColor" flexDirection='row' justifyContent='space-between' alignItems='center' />
                        <MyText color="$primaryFontColor" allowFontScaling={false}>{item.name}</MyText>
                      </View>
                      <Button bg={"$secondaryColor"} onPress={() => remove(i)} icon={<X size={20} />} color={"red"} />
                    </View>
                  </Draggable>
                )))
                : (
                  <Accordion marginTop={"$10"} width={"100%"} type='multiple' >
                    {
                      tempPlaces.map((item, i) => (
                        <Accordion.Item key={`${item.lat}, ${item.lng}`} value={`${item.lat}, ${item.lng}`}>
                          <YStack gap={0}>
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
                                  <MyText overflow="hidden" scale={open ? 1.1 : 1} animateOnly={["transform"]} animation="fast" color="$primaryFontColor">{item.name}</MyText>
                                  <Square animateOnly={["transform"]} animation="fast" rotate={open ? '180deg' : '0deg'}>
                                    <ChevronDown color="$accentColor" size="$1" />
                                  </Square>
                                </>
                              )}
                            </Accordion.Trigger>
                            {/* <View zi={2}>
                              <Separator alignSelf='center' pos="absolute" borderColor={"$primaryColor"} width={"80%"} />
                            </View> */}

                            <Accordion.Content
                              top={-10}
                              animateOnly={["transform"]}
                              animation={"fast"}
                              bg="$secondaryColor"
                              borderBottomLeftRadius={"$4"}
                              borderBottomRightRadius={"$4"}
                            >

                              <View>
                                {
                                  item.description ? <MyText color="$secondaryFontColor">{item.description}</MyText> : <></>
                                }
                                {
                                  item.description ? (<View zi={2} mt={"$2"}>
                                    <Separator alignSelf='center' pos="absolute" borderColor={"$primaryColor"} width={"90%"} />
                                  </View>) : <></>
                                }
                                {
                                  item.activities.map((activity, index) => (<View key={index} marginVertical="$2">
                                    <View flexDirection='row' justifyContent='space-between'>
                                      <MyText w={"50%"} overflow={"hidden"} color="$primaryFontColor" fontFamily={DEFAULT_FONT_BOLD}>{activity.activity}</MyText>
                                      <MyText color="$secondaryFontColor" fontFamily={DEFAULT_FONT_BOLD}>{activity.time}</MyText>
                                    </View>
                                    <MyText color="$secondaryFontColor">{activity.description}</MyText>
                                  </View>))
                                }
                              </View>
                            </Accordion.Content>
                          </YStack>
                        </Accordion.Item>
                      ))
                    }
                  </Accordion>
                )
            }
            {
              isEditing ? <></> : (<Button
                bg="$accentColor"
                pressStyle={{
                  scale: 1.1,
                  opacity: 0.8
                }}
                animation={"fast"}
                animateOnly={["transform"]}
                onPress={() => goToMapScreen(true)}
              >
                <MyText color="#ffffff" fontFamily={DEFAULT_FONT_BOLD} >
                  Add Stop
                </MyText>
              </Button>)
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </TripScreensTemplate >
  )
}

export default TripPlacesScreen;