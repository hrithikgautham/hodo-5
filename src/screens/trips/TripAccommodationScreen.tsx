import React, { useEffect, useState } from 'react';
import { View, Text, YStack, Button, Tooltip, Paragraph, Spinner } from "tamagui";
import TripScreensTemplate from '../../components/TripScreensTemplate';
import MyAlert from '../../components/MyAlert';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/auth';
import { db } from '../../../firebase';
import { USERS_COLLECTION } from '../../constants/collections';
import { COUCH_SURF_SCREEN, DRAWER_COUCH_SURF_SCREEN } from '../../constants/screens';
import { useToast } from '../../hooks/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setIsHost } from '../../slices/couchSurfSlice';
import { makeUserHost } from '../../apis/users';
import MyText from '../../components/MyText';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';

const TripAccommodationScreen = ({ route: { params: { tripId, } } }) => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const { auth: { uid, }, } = useAuth();
  const isHost = useSelector(state => state.couchSurf.isHost);
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const { showToast, } = useToast();

  useEffect(() => {

    const unsub = onSnapshot(doc(db, `${USERS_COLLECTION}/${uid}`), (doc) => {
      dispatch(setIsHost(doc.data()?.isHost));
    })

    return () => {
      unsub();
    }
  }, []);



  async function makeHost(uid: string) {
    try {
      setShowSpinner(true);
      const isHost = await makeUserHost(uid);

      if (isHost) {
        showToast("You are a Host now!");
        setShowSpinner(false);
        navigation.reset({
          index: 0,
          routes: [{ name: DRAWER_COUCH_SURF_SCREEN }],
        });
      }
      else {
        showToast("Please try Again!");
      }
    }
    catch (err) {
      showToast("Please try Again");
    }
    finally {
      setShowSpinner(false);
    }
  }

  return (
    <TripScreensTemplate title={"Accommodation"} image={require("../../../assets/accommodation.jpeg")} tripId={tripId}>
      <YStack p="$3" space="$3">
        <Button bg="$secondaryColor"
          pressStyle={{
            scale: 0.9,
            opacity: 0.8,
          }} animateOnly={["transform",]} animation={"fast"}
        >
          <MyText color={"$primaryFontColor"} fontFamily={DEFAULT_FONT_BOLD} fontSize={"$6"}>Booking.com</MyText>

        </Button>

        {
          isHost ? <CouchSurfButton showSpinner={showSpinner} onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: DRAWER_COUCH_SURF_SCREEN }],
          })} /> : <MyAlert button={<CouchSurfButton showSpinner={showSpinner} />} open={open} setOpen={setOpen} onOk={() => makeHost(uid)} description="Are you willing to be the host?" />
        }

      </YStack>
    </TripScreensTemplate>
  )
}

function CouchSurfButton({ showSpinner = false, onPress, }: { showSpinner?: boolean, onPress?: any, }) {
  return <Button disabled={showSpinner} bg="$accentColor"
    onPress={() => onPress && onPress()}
    pressStyle={{
      scale: 0.9,
      opacity: 0.8,
    }} animateOnly={["transform",]} animation={"fast"}>
    {
      showSpinner ? <Spinner color="#ffffff" size='small' /> : <Text color={"$primaryFontColor"} fontWeight={"bold"} fontSize={"$6"}>Couch Surf</Text>
    }


  </Button>;
}

export default TripAccommodationScreen