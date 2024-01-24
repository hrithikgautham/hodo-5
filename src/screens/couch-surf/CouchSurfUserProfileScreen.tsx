import React, { useEffect, useState } from 'react'
import { Button, Image, ScrollView, Separator, Spinner, View, XStack, YStack, } from "tamagui"
import { useAuth } from '../../hooks/auth'
import { SafeAreaView } from 'react-native';
import MyText from '../../components/MyText';
import { collection, deleteDoc, doc, getDoc, onSnapshot, } from 'firebase/firestore';
import { db } from '../../../firebase';
import { REFERENCES_COLLECTION, REQUESTS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { useToast } from '../../hooks/toast';
import { useNavigation } from '@react-navigation/native';
import CouchSurfRequestPopOver from '../../components/CouchSurfRequestPopOver';
import { Hourglass, MessageCircle, Pencil, Trash2 } from '@tamagui/lucide-icons';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';
import global from '../../../global';
import TagsComponent from '../../components/TagsComponent';
import { useDispatch, useSelector } from 'react-redux';
import MyTopTabs from '../../components/MyTopTabs';
import { acceptOrRejectRequest } from '../../apis/couchsurf';
import { CHATS_SCREEN } from '../../constants/screens';
import CSReferencePopOver from '../../components/CSReferencePopOver';
import { addReference, removeReference } from '../../slices/referencesSlice';

const CouchSurfUserProfileScreen = ({ route: { params: { uid: to, }, }, }) => {
  const { auth: { uid: from, email, } } = useAuth();
  const [user, setUser] = useState({});
  const { showToast, } = useToast();
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const [showSpinner, setShowSpinner] = useState(true);
  const [showAcceptSpinner, setShowAcceptSpinner] = useState(false);
  const [showRejectSpinner, setShowRejectSpinner] = useState(false);

  const request = useSelector(state => {
    // state.couchSurf.requests[to]
    if (to in state.couchSurf.incomingRequests) {
      return state.couchSurf.incomingRequests[to];
    }
    else if (to in state.couchSurf.outgoingRequests) {
      return state.couchSurf.outgoingRequests[to];
    }
    return undefined;
  });

  const tabs = [
    {
      name: "About Me",
      component: () => <AboutMe user={user} />,
    },
    {
      name: "References",
      component: () => <References user={user} />,
    },
  ];

  useEffect(() => {
    if (!request) {
      console.log("request is not there");

      const unsub2 = onSnapshot(doc(db, `${USERS_COLLECTION}/${from}/${REQUESTS_COLLECTION}/${to}`), async (d) => {
        const docRef = await getDoc(doc(db, `${USERS_COLLECTION}/${d.id}`))
        let obj = {
          ...docRef.data(),
        }

        if (d.exists()) {
          obj = {
            ...obj,
            ...d.data(),
          };
        }

        setUser(obj);

        setShowSpinner(false);
      });

      return () => {
        unsub2()
      };
    }
    else {
      setUser(request);
      setShowSpinner(false);
    }
    return () => console.log("un mounted")
  }, []);

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
      <SafeAreaView style={global.droidSafeArea}>
        {
          showSpinner ?
            <Spinner size='large' color={"$primaryFontColor"} /> :
            (
              <YStack space={"$4"} flex={1}>
                <YStack space={"$2"}>
                  <View px={"$4"} flexDirection='row' justifyContent='space-between' alignItems='center'>
                    <Image source={user?.photoURL ? { uri: user?.photoURL } : require("../../../assets/unknown-user.jpg")} width={100} height={100} borderRadius={50} />
                    <YStack flex={1} space={"$2"}>
                      <View px={"$4"} flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <View>
                          <MyText color={"$primaryFontColor"} fontFamily={DEFAULT_FONT_BOLD} fontSize={20}>{user.username} {email == user.email ? '(You)' : ""}</MyText>
                          <MyText color={"$secondaryFontColor"}>{user.email}</MyText>
                        </View>

                        {
                          user.accepted === true ? (<Button
                            pressStyle={{
                              scale: 1.1,
                              opacity: 0.8,
                            }}
                            animateOnly={["transform"]}
                            animation={"fast"}
                            bg="$accentColor"
                            icon={<MessageCircle />}
                            onPress={() => navigation.navigate(CHATS_SCREEN)}
                          />) : <></>
                        }
                      </View>
                      <View px={"$4"}>
                        {/* send invite */}
                        {
                          from != to ? (
                            "accepted" in user ?
                              (
                                user.accepted === null ?
                                  from == user.from ?
                                    (
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
                                          onPress={() => revokeRequest(user.from, user.to)}
                                        >
                                          <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Cancel</MyText>
                                        </Button>
                                      </>
                                    ) :
                                    (
                                      <CouchSurfRequestPopOver to={to} open={open} setOpen={setOpen} />
                                    ) :
                                  (
                                    user.accepted == true ?
                                      (
                                        <View>
                                          <MyText color={"$secondaryFontColor"}>Requested on: <MyText color={"$primaryFontColor"}>{user.requestedTime.toDate().toDateString()}</MyText></MyText>
                                          <MyText color={"$accentColor"}>Accepted on: <MyText>{user.actionDate.toDate().toDateString()}</MyText></MyText>

                                        </View>
                                      ) :
                                      (
                                        from == user.from ?
                                          (
                                            <View>
                                              <MyText color={"$red10Light"}>Your Request was Rejected</MyText>
                                              <MyText color={"$secondaryFontColor"}>You have to wait until <MyText color={"$primaryFontColor"} fontFamily={DEFAULT_FONT_BOLD}>{new Date(user.actionDate.toDate().setDate(user.actionDate.toDate().getDate() + 30)).toDateString()}</MyText></MyText>
                                            </View>
                                          ) :
                                          (
                                            <View>
                                              <MyText color={"$red10Light"}>You Rejected their Request</MyText>
                                              <CouchSurfRequestPopOver to={to} open={open} setOpen={setOpen} />
                                            </View>
                                          )
                                      )
                                  )
                              ) :
                              (
                                <CouchSurfRequestPopOver to={to} open={open} setOpen={setOpen} />
                              )
                          ) :
                            (<></>)
                        }
                      </View>
                    </YStack>
                  </View>
                </YStack>
                <MyTopTabs tabs={tabs} />
              </YStack>
            )
        }

      </SafeAreaView>
    </View>
  )
}

function AboutMe({ user, }) {

  return (<ScrollView bg="$secondaryColor" showsVerticalScrollIndicator={false}>
    <YStack space="$6" p={"$4"}>
      <View>
        <MyText fontSize={"$5"} color={"$primaryFontColor"}>About me</MyText>
        <MyText fontSize={"$5"} color={"$secondaryFontColor"}>{user.aboutMe}</MyText>
      </View>
      {/* 
        whereDoYouLive,
        hobbies,
        languages,
        countriesVisited,
        countriesLived,
        aboutMe,
        teachLearnShare,
        offerHosts,
        whyImOnCouchSurfing, 
      */}

      <TagsComponent id="Languages" title="Languages" selected={user.languages} readOnly={true} />
      <TagsComponent id="hobbies" title="Hobbies" selected={user.hobbies} readOnly={true} />
      <TagsComponent id="countriesVisited" title="Countries Visited" selected={user.countriesVisited} readOnly={true} />
      <TagsComponent id="countriesLived" title="Countries Lived" selected={user.countriesLived} readOnly={true} />

      <View>
        <MyText fontSize={"$5"} color={"$primaryFontColor"}>Teach, Learn, Share</MyText>
        <MyText fontSize={"$5"} color={"$secondaryFontColor"}>{user.teachLearnShare}</MyText>
      </View>

      <View>
        <MyText fontSize={"$5"} color={"$primaryFontColor"}>What can I Offer Hosts</MyText>
        <MyText fontSize={"$5"} color={"$secondaryFontColor"}>{user.offerHosts}</MyText>
      </View>

      <View>
        <MyText fontSize={"$5"} color={"$primaryFontColor"}>Why I'm on Hodo?</MyText>
        <MyText fontSize={"$5"} color={"$secondaryFontColor"}>{user.whyImOnCouchSurfing}</MyText>
      </View>


    </YStack>
  </ScrollView>)
}

function References({ user, }) {
  const [open, setOpen] = useState(false);
  const references = useSelector(state => state.references.references);
  const { auth: { uid, }, } = useAuth();
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [description, setDescription] = useState(null);
  const { showToast, } = useToast();
  const [disableTrigger, setDisableTrigger] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `${USERS_COLLECTION}/${uid}/${REFERENCES_COLLECTION}`), snapshot => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type == "added" || change.type == "modified") {
          const data = change.doc.data();
          if (data.referredBy === uid) {
            setDisableTrigger(true);
          }
          const userData = (await getDoc(doc(db, `${USERS_COLLECTION}/${data.referredBy}`))).data();
          data["lastUpdatedAt"] && (data["lastUpdatedAt"] = data["lastUpdatedAt"].toDate().toString());
          dispatch(addReference({
            id: change.doc.id,
            data: { ...data, ...userData, },
          }))
        }

        if (change.type == "removed") {
          dispatch(removeReference({
            id: change.doc.id,
          }))
        }
      })
    });

    return () => unsub()
  }, []);

  function showPopOver(description: string, id: string) {
    console.log("description:", description)
    setDescription(description);
    setId(id)
    setOpen(true);
  }

  async function deleteReference(id) {
    try {
      const docRef = await doc(db, `${USERS_COLLECTION}/${uid}/${REFERENCES_COLLECTION}/${id}`);
      await deleteDoc(docRef);
      showToast("Reference Deleted!")
    }
    catch (err) {
      showToast("Please try Again")
    }
  }

  return (<View bg={"$secondaryColor"} flex={1}>
    {
      user?.accepted ?
        (<CSReferencePopOver disableTrigger={disableTrigger} description={description} docId={id} open={open} setOpen={setOpen} />) :
        (<></>)
    }

    <ScrollView space={"$4"}>
      {
        Object.entries(references).map(([key, reference]) => {
          return (
            <YStack
              key={key}
              p="$4"
              m="$2"
              bg="$primaryColor"
              borderRadius="$4"
              pressStyle={{
                scale: 1.05,
                opacity: 0.8,
              }}
              animateOnly={["transform"]}
              animation={"fast"}
            >
              <XStack justifyContent='space-between'>
                <XStack alignItems='center' space={"$4"}>
                  <Image w={50} h={50} borderRadius={25} source={reference.photoURL ? { uri: reference.photoURL } : require("../../../assets/unknown-user.jpg")} />
                  <MyText color={"$primaryFontColor"} fontFamily={DEFAULT_FONT_BOLD}>{reference.username}</MyText>
                </XStack>
                {
                  reference.referredBy === uid ?
                    (<XStack space={"$2"}>
                      <Button
                        bg={"$secondaryColor"}
                        p={0}
                        circular
                        icon={<Pencil size={20} color={"$secondaryFontColor"} />}
                        onPress={() => showPopOver(reference.description, reference.referredBy, key)}
                      />
                      <Button
                        bg={"$secondaryColor"}
                        p={0}
                        circular
                        icon={<Trash2 size={20} color={"red"} />}
                        onPress={() => deleteReference(key)}
                      />
                    </XStack>) :
                    (<></>)
                }

              </XStack>
              <Separator marginVertical={"$2"} borderColor={"$secondaryColor"} />
              < MyText color="$secondaryFontColor" textOverflow="ellipsis">{reference.description}</MyText>
            </YStack>
          )
        })
      }
    </ScrollView>
  </View>)
}

export default CouchSurfUserProfileScreen