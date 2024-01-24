import { SafeAreaView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NEW_TRIP_SCREEN, TRIPS_SCREEN, TRIP_ITEMS_SCREEN } from '../../constants/screens'
import Menu from '../../components/Menu'
import { useAuth } from '../../hooks/auth'
import { db } from '../../../firebase'
import { Timestamp, addDoc, and, collection, collectionGroup, limit, onSnapshot, or, orderBy, query, where } from 'firebase/firestore'
import { TRIPS_COLLECTION, USERS_COLLECTION, } from '../../constants/collections'
import { useDispatch, useSelector } from 'react-redux'
import { addTrip, removeTrip, } from '../../slices/TripsSlice'
import { Button, Spinner, View, XStack, YStack } from 'tamagui'
import CardList from '../../components/CardList'
import JoinTripPopOver from '../../components/JoinTripPopOver'
import MyText from '../../components/MyText'
import { DEFAULT_FONT_BOLD } from '../../constants/fonts'
import global from '../../../global'
import { DELETE_TRIP_URL, NEW_TRIP_URL } from '../../constants/URL'
import { useToast } from '../../hooks/toast'

const TripsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    setLoading,
    auth: { email, uid, },
  } = useAuth();

  const trips = useSelector(state => state.trips.trips);
  const [currentTrips, setCurrentTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [openJoinTripDialog, setOpenJoinTripDialog] = useState(false);
  const [disableNewTrip, setDisableNewTrip] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const { showToast, } = useToast();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `${USERS_COLLECTION}/${uid}/${TRIPS_COLLECTION}`), snapshot => {
      snapshot.docChanges().forEach(change => {
        console.log("change.type: ", change.type)
        if (change.type === "added" || change.type === "modified") {
          const data = change.doc.data();
          data["startDate"] && (data["startDate"] = data["startDate"].toDate().toString());
          data["endDate"] && (data["endDate"] = data["endDate"].toDate().toString());
          data["creationTime"] && (data["creationTime"] = data["creationTime"].toString());
          data["updatedAt"] && (data["updatedAt"] = data["updatedAt"].toDate().toString());
          dispatch(addTrip({
            id: change.doc.id,
            data,
          }));
        }
        if (change.type === "removed") {
          dispatch(removeTrip({
            id: change.doc.id,
          }));
        }

        setShowSpinner(false);
      });
    });

    onSnapshot(query(collection(db, USERS_COLLECTION, uid, TRIPS_COLLECTION), or(where("processed", "==", false), where("error", "==", true)), limit(1)), snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        console.log("data?.processed: ", data.processed, data.error)
        if (change.type === "added" || change.type === "modified") {
          setDisableNewTrip(disableNewTrip || !data?.processed || data.error);
        }
        if (change.type === "removed") {
          setDisableNewTrip(false);
        }
      });
    });

    return () => {
      unsub();
    }
  }, []);

  async function handleDelete( id) {
    try {
      console.log("path, id: ", id);
      const res = await fetch(DELETE_TRIP_URL, {
        method: "POST",
        body: JSON.stringify({
          tripId: id,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json());

      if(res?.success) {
        showToast("Trip Deleted!");
      }
      else {
        showToast("Please try again!");
      }
    }
    catch(err) {
      console.error(err.message);
      showToast("Please try again!");
    }
    
  }

  useEffect(() => {
    
    async function setTripsData(trips) {
      
      try {
        const [currentTrips, pastTrips] = [trips.filter(trip => !trip.tripEnded), trips.filter(trip => trip.tripEnded)];
        setCurrentTrips(currentTrips.map(item => {
          const imageUrls = item.destination?.photos;
          console.log(item.id)
          return ({ handleDelete, showDelete: true, id: item.id, error: item.error, isGettingCreated: !item.processed, screen: TRIP_ITEMS_SCREEN, title: item?.destination?.description, imageUrl: imageUrls && imageUrls[0], data: { tripId: item.tripId, } })
        }));
        setPastTrips(pastTrips.map(item => {
          const imageUrls = item.destination?.photos
          return ({ handleDelete, showDelete: true, id: item.id, error: item.error, isGettingCreated: !item.processed, screen: TRIP_ITEMS_SCREEN, title: item?.destination?.description, imageUrl: imageUrls && imageUrls[0], data: { tripId: item.tripId, } })
        }));
      }
      catch (err: any) {
        console.log(err.message)
      }
      finally {

      }
    }
    setTripsData(Object.values(trips));
  }, [trips]);

  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView style={[global.droidSafeArea, {

      }]}>
        {/* {
          showSpinner ? <Spinner size="large" color="$primaryFontColor" /> : <></>
        } */}
        <YStack marginTop={"$4"}>
          <XStack justifyContent='center' space={20} marginVertical="$2">
            <Button bg={disableNewTrip ? "#aaa" : "$accentColor"}
              disabled={disableNewTrip}
              pressStyle={{
                scale: 1.1,
                opacity: 0.8
              }}
              animation={"fast"}
              animateOnly={["transform"]}
              onPress={() => navigation.navigate(NEW_TRIP_SCREEN)}>
              <MyText color="#ffffff" fontFamily={DEFAULT_FONT_BOLD}>
                New Trip
              </MyText>
            </Button>
            <JoinTripPopOver disabled={disableNewTrip} />
            {/* here */}
          </XStack>

          {
            currentTrips && currentTrips.length > 0 ? (<CardList cards={currentTrips} title={"Active Trips"} />) : (
              <View justifyContent='center' alignItems='center' marginVertical={"$7"}>
                <MyText textAlign='center' color="$secondaryFontColor">You dont have any active trips. Please create a <MyText onPress={() => navigation.navigate(NEW_TRIP_SCREEN)} pressStyle={{ opacity: 0.8 }} color="$accentColor" textDecorationLine="underline" fontSize={15}>New Trip</MyText>.</MyText>
              </View>
            )
          }
          {
            pastTrips && pastTrips.length > 0 ? (<CardList cards={pastTrips} title={"Past Trips"} />) : <></>
          }
        </YStack>
      </SafeAreaView >
      <Menu />
    </View>
  )
}

export default TripsScreen