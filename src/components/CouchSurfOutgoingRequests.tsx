import React from 'react';
import { View, Image, Button, ScrollView, } from "tamagui";
import { useSelector } from 'react-redux';
import MyText from './MyText';
import { DEFAULT_FONT_BOLD } from '../constants/fonts';
import { ChevronRight, Hourglass, MessageCircle, X } from '@tamagui/lucide-icons';
import { useNavigation, } from '@react-navigation/native';
import { CHATS_SCREEN, COUCH_SURF_USER_PROFILE_SCREEN } from '../constants/screens';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { REQUESTS_COLLECTION, USERS_COLLECTION } from '../constants/collections';
import { useToast } from '../hooks/toast';

const CouchSurfOutgoingRequests = () => {
  const requests = useSelector(state => state.couchSurf.outgoingRequests);
  const navigation = useNavigation();
  const { showToast, } = useToast();

  async function revokeRequest(from: string, to: string) {
    console.log(from, to)
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, to, REQUESTS_COLLECTION, from));
      showToast("Request Cancelled!");
    }
    catch (err) {
      showToast("Please try Again");
    }
    finally {

    }
  }

  return (
    <View bg="$primaryColor" flex={1}>
      <ScrollView p={"$4"} space={"$6"}>
        {
          Object.entries(requests).map(([id, data]) => {

            // console.log(userData)
            return (<View
              flexDirection='row'
              justifyContent='space-around'
              alignItems='center'
              p={"$2"}
              bg={"$secondaryColor"}
              borderRadius={"$2"}
              onPress={() => navigation.navigate(COUCH_SURF_USER_PROFILE_SCREEN, { uid: id, accepted: data.accepted, })}
              pressStyle={{
                scale: 0.95,
                opacity: 0.9,
              }}
              animateOnly={["transform"]}
              animation={"fast"}
            >
              <View mr={"$2"}>
                <Image borderRadius={50} width={100} height={100} source={data.photoURL ? { uri: data.photoURL, } : require("../../assets/unknown-user.jpg")} />
              </View>
              <View gap={"$2"} flex={1}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View>
                    <MyText fontFamily={DEFAULT_FONT_BOLD} color={"$primaryFontColor"} fontSize={"$6"}>{data.username}</MyText>
                    <MyText color={"$secondaryFontColor"}>{data.email}</MyText>
                  </View>
                  <ChevronRight color={"$primaryFontColor"} />
                </View>
                <View flexDirection='row' justifyContent='space-around' gap={"$2"}>
                  {/* buttons */}
                  {
                    data.accepted === null ?
                      <>
                        <Button
                          disabled
                          pressStyle={{
                            scale: 1.1,
                            opacity: 0.8,
                          }}
                          animateOnly={["transform"]}
                          animation={"fast"}
                          bg="#ccc"
                          icon={<Hourglass />}
                        >
                          <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Pending</MyText>
                        </Button>
                        <Button
                          pressStyle={{
                            scale: 1.1,
                            opacity: 0.8,
                          }}
                          animateOnly={["transform"]}
                          animation={"fast"}
                          bg="$red10Light"
                          icon={<X />}
                          onPress={() => revokeRequest(data.from, data.to)}
                        >
                          <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Cancel</MyText>
                        </Button>
                      </> :
                      data.accepted === true ?
                        (
                          <View flexDirection='row' alignItems='center' justifyContent='space-around' flex={1}>
                            <MyText color="$accentColor">Accepted</MyText>
                            <Button bg="$accentColor" color="#ffffff" icon={<MessageCircle size={25} />} onPress={() => navigation.navigate(CHATS_SCREEN)} />
                          </View>
                        ) :
                        (
                          <View flexDirection='row' alignItems='center' justifyContent='space-around' flex={1}>
                            <MyText color="$red10Light">Rejected</MyText>
                          </View>
                        )
                  }
                </View>
              </View>

            </View>)
          })
        }
      </ScrollView>
    </View>
  )
}

export default CouchSurfOutgoingRequests

