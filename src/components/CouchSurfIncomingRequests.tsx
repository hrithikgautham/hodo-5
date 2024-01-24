import React, { useState } from 'react';
import { View, Image, Button, ScrollView, Spinner, } from "tamagui";
import { useSelector, } from 'react-redux';
import { useAuth } from '../hooks/auth';
import MyText from './MyText';
import { DEFAULT_FONT_BOLD } from '../constants/fonts';
import { ChevronRight, MessageCircle } from '@tamagui/lucide-icons';
import { useNavigation, } from '@react-navigation/native';
import { CHATS_SCREEN, COUCH_SURF_USER_PROFILE_SCREEN } from '../constants/screens';
import { acceptOrRejectRequest } from '../apis/couchsurf';
import { useToast } from '../hooks/toast';

const CouchSurfIncomingRequests = () => {
  const { auth: { uid, } } = useAuth();
  const requests = useSelector(state => state.couchSurf.incomingRequests)
  const navigation = useNavigation();
  const { showToast, } = useToast();

  const [showAcceptSpinner, setShowAcceptSpinner] = useState(false);
  const [showRejectSpinner, setShowRejectSpinner] = useState(false);

  async function acceptOrReject(from: string, to: string, accepted: boolean,) {
    try {
      if (accepted) {
        setShowAcceptSpinner(true);
      }
      else {
        setShowRejectSpinner(true);
      }

      const success = await acceptOrRejectRequest(from, to, accepted);

      if (success) {
        if (accepted) {
          showToast("Accepted Request!");
        }
        else {
          showToast("Rejected Request!");
        }
      }
      else {
        showToast("Something went wrong!")
      }

    }
    catch (err) {

    }
    finally {
      if (accepted) {
        setShowAcceptSpinner(false);
      }
      else {
        setShowRejectSpinner(false);
      }
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
                      (
                        <>
                          <Button
                            disabled={showAcceptSpinner || showRejectSpinner}
                            bg={"$accentColor"}
                            onPress={() => acceptOrReject(data.from, data.to, true)}
                            pressStyle={{
                              scale: 0.95,
                              opacity: 0.9,
                            }}
                            animateOnly={["transform"]}
                            animation={"fast"}
                          >
                            {showAcceptSpinner ? <Spinner size='small' color="#ffffff" /> : <MyText color="#ffffff">Accept</MyText>}
                          </Button>
                          <Button
                            disabled={showAcceptSpinner || showRejectSpinner}
                            bg={"$red10Light"}
                            onPress={() => acceptOrReject(data.from, data.to, false)}
                            pressStyle={{
                              scale: 0.95,
                              opacity: 0.9,
                            }}
                            animateOnly={["transform"]}
                            animation={"fast"}
                          >
                            {showRejectSpinner ? <Spinner size='small' color="#ffffff" /> : <MyText color="#ffffff">Reject</MyText>}
                          </Button>
                        </>
                      ) :
                      data.accepted === true ?
                        (
                          <View flexDirection='row' alignItems='center' justifyContent='space-around' flex={1}>
                            <MyText color="$accentColor">Accepted</MyText>
                            <Button bg="$accentColor" color="#ffffff" icon={<MessageCircle size={25} />} onPress={() => navigation.navigate(CHATS_SCREEN)} />
                          </View>
                        ) : (
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

export default CouchSurfIncomingRequests

