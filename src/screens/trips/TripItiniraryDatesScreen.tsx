import React, { useEffect } from 'react'
import TripScreensTemplate from '../../components/TripScreensTemplate'
import { ScrollView, View } from 'tamagui';
import CardComp from '../../components/Card';
import { TRIP_PLACES_SCREEN } from '../../constants/screens';
import { useSelector } from 'react-redux';

const TripItiniraryDatesScreen = ({ route: { params: { tripId, } } }) => {
  const {
    itinirary,
  } = useSelector(state => state.trips.trips[tripId]);

  console.log(itinirary)

  return (
    <TripScreensTemplate title='Itinirary' image={require("../../../assets/itinirary.jpeg")} tripId={tripId} >
      <ScrollView showsVerticalScrollIndicator={false} padding="$4">
        <View >
          {
            itinirary.map((item, index) => <CardComp key={item.date} data={{ tripId, index, }} title={`Day ${index + 1}\n(${item.date})`} screen={TRIP_PLACES_SCREEN} imageUrl={item.places[0].photos ? item.places[0].photos[0] : ""} />)
          }
        </View>
      </ScrollView>
    </TripScreensTemplate>
  )
}



export default TripItiniraryDatesScreen