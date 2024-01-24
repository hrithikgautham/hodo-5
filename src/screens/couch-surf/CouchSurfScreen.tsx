import React, { useEffect, useState } from 'react'
import { View, Button, Image, XStack, ScrollView } from "tamagui";
import Menu from '../../components/Menu';
import { collection, doc, getCountFromServer, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../hooks/auth';
import { REQUESTS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { addRequest, removeRequest, setIsHost, setRequestsCount } from '../../slices/couchSurfSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import MyAlert from '../../components/MyAlert';
import { useNavigation, useIsFocused, } from '@react-navigation/native';
import { COUCH_SURF_INFO_SCREEN, COUCH_SURF_REQUESTS_SCREEN, COUCH_SURF_USER_PROFILE_SCREEN, DRAWER_HOME_SCREEN, HOME_SCREEN } from '../../constants/screens';
import { useToast } from '../../hooks/toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SearchBar from '../../components/SearchBar';
import MyText from '../../components/MyText';
import { searchIndex } from '../../utils/agnolia';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';
import global from '../../../global';
import { makeUserHost } from '../../apis/users';

const CouchSurfScreen = () => {
  const { auth: { uid, }, } = useAuth();
  const isHost = useSelector(state => state.couchSurf.isHost);
  // const requestsCount = useSelector(state => state.couchSurf.requestsCount);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const screenFocussed = useIsFocused();
  const { showToast, } = useToast();
  const [showAlert, setShowAlert] = useState(false);
  const [requestsCount, setRequestsCount] = useState(0);
  const user = useSelector(state => state.user.user);


  useEffect(() => {
    console.log("sdfsdfsdfdsF", isHost)
    if (screenFocussed) {
      const unsub = onSnapshot(doc(db, `${USERS_COLLECTION}/${uid}`), (doc) => {
        dispatch(setIsHost(doc.data()?.isHost));
      });

      const unsub1 = onSnapshot(doc(db, `${USERS_COLLECTION}/${uid}`), (ss) => {
        const { isHost, } = ss.data();
        setShowAlert(!isHost);
      });

      async function getCount() {
        const count = await getCountFromServer(query(collection(db, `${USERS_COLLECTION}/${uid}/${REQUESTS_COLLECTION}`), where("accepted", "==", null)));
        setRequestsCount(count.data().count);
      }

      getCount();

      return () => {
        unsub();
        unsub1();
      }
    }
  }, [screenFocussed]);


  function onCancel() {
    showToast("You can't move forward without being a Host", "error")
    navigation.reset({
      index: 0,
      routes: [{ name: DRAWER_HOME_SCREEN }],
    });
  }

  async function check(uid) {
    const flag = await makeHost(uid)
    if (!flag) {
      navigation.navigate(COUCH_SURF_INFO_SCREEN)
    }
  }

  async function makeHost(uid: string) {
    try {
      console.log(user)
      if (
        user.aboutMe &&
        user.teachLearnShare &&
        user.offerHosts &&
        user.whyImOnCouchSurfing &&
        user.hobbies &&
        user.languages &&
        user.countriesVisited &&
        user.countriesLived &&
        user.whereDoYouLive
      ) {
        console.log("in fi")
        await makeUserHost(uid);
        showToast("You are now a Host");
        return true;
      }
      console.log("im elisa")
      return false;
    }
    catch (err) {
      showToast("Please try Again");
    }
    finally {

    }
  }

  return (
    <View flex={1} bg={"$primaryColor"}>
      <MyAlert
        setOpen={setShowAlert}
        open={showAlert}
        button={<></>}
        onCancel={() => onCancel()}
        description="Do you Want to be the Host? You can only move forward if you are a Host."
        onOk={() => check(uid)}
      />
      <SafeAreaView style={global.droidSafeArea}>
        <KeyboardAwareScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled" >
          {
            isHost ? (
              <View>
                <SearchBar searchIndex={searchIndex} SearchItem={SearchItem} />
                <ScrollView h={"100%"} p={"$4"}>
                  <Button bg="$secondaryFontColor" onPress={() => navigation.navigate(COUCH_SURF_REQUESTS_SCREEN)}>
                    <MyText color="#ffffff">Requests {requestsCount > 0 ? <View bg={"$red10Light"} w={20} h={20} justifyContent='center' alignItems='center' borderRadius={10}>
                      <MyText>{requestsCount}</MyText></View> : <></>}</MyText>
                  </Button>
                </ScrollView>
              </View>
            ) : <></>
          }

        </KeyboardAwareScrollView>
      </SafeAreaView>
      <Menu />
    </View>
  )
}

function SearchItem(user) {
  const { auth: { email, }, } = useAuth();
  const navigation = useNavigation();
  return (<Button
    onPress={() => navigation.navigate(COUCH_SURF_USER_PROFILE_SCREEN, { uid: user.objectID, })}
    pressStyle={{
      scale: 0.95,
      opacity: 0.8,
    }}
    animateOnly={["transform"]}
    animation={"fast"}
    bg="$secondaryColor"
  >
    <XStack flex={1} space={"$4"} alignItems='center'>
      <Image w={30} h={30} source={user.photoURL ? { uri: user.photoURL, } : require("../../../assets/unknown-user.jpg")} borderRadius={15} />
      <View>
        <MyText fontFamily={DEFAULT_FONT_BOLD} w={"100%"} textAlign='left' color="$primaryFontColor">{user.username} {user.email == email ? '(You)' : ""}</MyText>
        <MyText w={"100%"} textAlign='left' color="$secondaryFontColor">{user.email}</MyText>
      </View>
    </XStack>
  </Button>)
}

export default CouchSurfScreen