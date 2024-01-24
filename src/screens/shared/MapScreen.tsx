import React, { useEffect, useState, } from 'react'
import { Marker, } from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions"
import { GOOGLE_API_KEY } from '../../constants/apiKeys';
import Map from '../../components/Map';
import GoogleMapInput from '../../components/GoogleMapInput';
import { View, Button, XStack, Spinner, } from "tamagui";
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MyText from '../../components/MyText';
import { DARK_THEME_ACCENT_COLOR } from '../../constants/colors';
import { ADD_STOP_TO_TRIP_URL } from '../../constants/URL';
import { useToast } from '../../hooks/toast';
import { useSelector } from 'react-redux';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';
import { TRIP_PLACES_SCREEN } from '../../constants/screens';

const MapScreen = ({ route: { params: { autoFocus, locations, index, tripId, } } }) => {
  const [searchedLocation, setSearchedLocation] = useState(null);
  const navigation = useNavigation();
  const { top, bottom, left, right } = useSafeAreaInsets();
  const [showSpinner, setShowSpinner] = useState(false);
  const { showToast, } = useToast();
  const trip = useSelector(state => state.trips.trips[tripId]);

  function getIdentifierArray(len) {
    console.log("len: ", len)
    let result = [];
    for (let i = 0; i <= len - 1; i++) {
      result.push("" + i);
    }
    return result;
  }

  async function addStopToTrip(tripId: string, itinirary: any, index: string | number, location: any, destination: string) {
    try {
      setShowSpinner(true);
      const res = await fetch(ADD_STOP_TO_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId,
          itinirary,
          itiniraryIndex: index,
          location,
          destination,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());
      setShowSpinner(false);
      if (res?.success) {
        showToast("Place Added!");
        navigation.navigate(TRIP_PLACES_SCREEN);
      }
      else {
        // add toast // trip id doesnt exist
        showToast("Please try Again");
      }
    }
    catch (err) {
      // add toast
      showToast("Please try Again");
    }
    finally {
      setShowSpinner(false);
    }
  }

  return (
    <View>

      <View>

        <Map
          identifiers={[...getIdentifierArray(locations.length), "searchedLocation"]}
          initialRegion={{
            latitude: locations[0].lat,
            longitude: locations[0].lng,
          }}
        >
          {
            locations.map((location, index) => (

              <React.Fragment key={`${location.lat},${location.lng}`}>
                {
                  locations.length > 1 && index != locations.length - 1 ? < MapViewDirections

                    origin={{
                      latitude: location.lat,
                      longitude: location.lng,
                    }}
                    destination={{
                      latitude: locations[index + 1].lat,
                      longitude: locations[index + 1].lng,
                    }}
                    apikey={GOOGLE_API_KEY}
                    strokeWidth={3}
                    strokeColor={"#000000"}
                    mode='TRANSIT'
                  /> : <></>
                }

                <Marker coordinate={{
                  latitude: location.lat,
                  longitude: location.lng
                }} description={location.name}
                  title={location.name}
                  identifier={"" + index}

                >
                  <Button
                    width={30}
                    height={30}
                    borderRadius={15}
                    p={0}
                    style={{ backgroundColor: "#DB712E" }}
                    pressStyle={{
                      scale: 1.1,
                      opacity: 0.8,
                    }}
                    animateOnly={["transform",]}
                    animation={"fast"}
                  >
                    <MyText color="#ffffff" fontSize={"$5"} fontFamily={DEFAULT_FONT_BOLD}>{index + 1}</MyText>
                  </Button>
                </Marker>

                {/* <Marker coordinate={{
                    latitude: locations[index + 1].lat,
                    longitude: locations[index + 1].lng
                  }} description={locations[index + 1].name}
                    title={locations[index + 1].name}
                    identifier={"" + (index + 1)} /> */}
              </React.Fragment>
            ))
          }

          {
            searchedLocation ? <><Marker pinColor='green' coordinate={{
              latitude: searchedLocation.location.lat,
              longitude: searchedLocation.location.lng
            }} description={searchedLocation.description}
              title={searchedLocation.description}
              identifier={"searchedLocation"} >
              <Button width={30}
                height={30}
                borderRadius={15}
                p={0} bg={"$accentColor"}>
                <MyText color={"#ffffff"}>{locations.length + 1}</MyText>
              </Button>
            </Marker>
              < MapViewDirections
                origin={{
                  latitude: locations[locations.length - 1].lat,
                  longitude: locations[locations.length - 1].lng,
                }}
                destination={{
                  latitude: searchedLocation.location.lat,
                  longitude: searchedLocation.location.lng,
                }}
                apikey={GOOGLE_API_KEY}
                strokeWidth={3}
                strokeColor={DARK_THEME_ACCENT_COLOR}
                mode='TRANSIT'
              />
            </> : <></>
          }
        </Map>
      </View >
      <XStack
        pos={"absolute"}
        top={top + 20}
        left={left + 10}
        right={right + 10}
        space={"$2"}
      >

        <Button
          pressStyle={{
            scale: 1.2,
          }}
          zIndex={100}
          animateOnly={["transform",]}
          animation={"fast"}
          onPress={() => navigation.goBack()}
          icon={<ChevronLeft size={20} />}
          color={"#ffffff"}
          circular
          bg="#000000"

        />
        <GoogleMapInput setLocation={setSearchedLocation} autoFocus={autoFocus} />
        {
          searchedLocation ? (<Button
            pressStyle={{
              scale: 1.2,
            }}
            zIndex={100}
            animateOnly={["transform",]}
            animation={"fast"}
            onPress={() => addStopToTrip(tripId, trip?.itinirary, index, searchedLocation, trip.destination.description)}

            bg={"$accentColor"}
          >
            {showSpinner ? <Spinner size="small" color="#ffffff" /> : <MyText color={"#ffffff"}>Add</MyText>}
          </Button>) : <></>
        }
      </XStack>
      <StatusBar style='dark' />
    </View>
  )
}

export default MapScreen