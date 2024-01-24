import React, { useEffect } from 'react'
import { collection, collectionGroup, documentId, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { TRIPS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { addTraveller, clearTravellers, removeTraveller } from '../../slices/TripsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, } from "tamagui";
import CardComp from '../../components/Card';
import {
  TRIPS_ITINIRARY_DATES_SCREEN,
  TRIP_ACCOMMODATION_SCREEN,
  TRIP_DOCUMENTS_SCREEN,
  TRIP_EXPENSES_SCREEN,
  TRIP_NOTES_SCREEN,
  TRIP_PHOTOS_SCREEN,
  TRIP_TRANSPORTATION_SCREEN,
} from '../../constants/screens';
import TripScreensTemplate from '../../components/TripScreensTemplate';
import { useAuth } from '../../hooks/auth';
import CardList from '../../components/CardList';

const TripItemsScreen = ({ route: { params: { tripId, } } }) => {
  const { auth: { uid, }, } = useAuth();
  const dispatch = useDispatch();

  const {
    destination: {
      photos,
      description: destinationName,
    },
  } = useSelector(state => state.trips.trips[tripId]);

  useEffect(() => {
    const unsub = onSnapshot(query(collectionGroup(db, TRIPS_COLLECTION), where("tripId", "==", tripId)), snapshot => {
      snapshot.docChanges().forEach(change => {
        const { tripId, user, } = change.doc.data();
        console.log(tripId, user)
        if (change.type === "added" || change.type === "modified") {
          dispatch(addTraveller({
            id: tripId,
            data: user,
          }));
        }
        if (change.type === "removed") {
          dispatch(removeTraveller({
            id: tripId,
            data: user,
          }));
        }
      });
    });

    return () => {
      unsub();
      dispatch(clearTravellers({
        id: tripId,
      }))
    }
  }, []);

  const cards = [
    {
      data: { tripId, },
      title: 'Itinirary',
      screen: TRIPS_ITINIRARY_DATES_SCREEN,
      image: require("../../../assets/itinirary.jpeg"),
    },
    {
      data: { tripId, },
      title: 'Accommodation',
      screen: TRIP_ACCOMMODATION_SCREEN,
      image: require("../../../assets/accommodation.jpeg"),
    },
    // {
    //   data: { tripId, },
    //   title: 'Transportation',
    //   screen: TRIP_TRANSPORTATION_SCREEN,
    //   image: require("../../../assets/transportation.jpeg"),
    // },
    {
      data: { tripId, },
      title: 'Notes',
      screen: TRIP_NOTES_SCREEN,
      image: require("../../../assets/notes.jpeg"),
    },
    // {
    //   data: { tripId, },
    //   title: 'Documents',
    //   screen: TRIP_DOCUMENTS_SCREEN,
    //   image: require("../../../assets/documents.jpeg"),
    // },
    {
      data: { tripId, },
      title: 'Expenses',
      screen: TRIP_EXPENSES_SCREEN,
      image: require("../../../assets/expenses.png"),
    },
    // {
    //   data: { tripId, },
    //   title: 'Photos',
    //   screen: TRIP_PHOTOS_SCREEN,
    //   image: require("../../../assets/photos.webp"),
    // }
  ]

  return (
    <TripScreensTemplate title={destinationName} imageUrl={photos[0]} tripId={tripId}>
      <ScrollView showsVerticalScrollIndicator={false} paddingVertical="$6">
        <View flexDirection='row' flexWrap='wrap' justifyContent='space-evenly' rowGap={"$2"}>
          <CardList cards={cards} />
        </View>
      </ScrollView>
    </TripScreensTemplate>
  )
}

export default TripItemsScreen