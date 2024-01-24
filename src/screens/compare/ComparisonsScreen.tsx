import { collectionGroup, limit, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Button, Accordion, Paragraph, Square, Separator, ScrollView, Spinner } from "tamagui";
import { db } from '../../../firebase';
import { COMPARE_TRIPS_COLLECTION } from '../../constants/collections';
import { useAuth } from '../../hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import { addCompare, removeCompare } from '../../slices/compareSlice';
import { SafeAreaView } from 'react-native';
import Menu from '../../components/Menu';
import CardList from '../../components/CardList';
import { useNavigation } from '@react-navigation/native';
import { COMPARE_VISUALIZATION_SCREEN, NEW_COMPARE_SCREEN } from '../../constants/screens';
import { ChevronDown } from '@tamagui/lucide-icons';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';
import MyText from '../../components/MyText';

const ComparisonsScreen = () => {
  const { auth: { email, uid, }, } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [disableCompare, setDisableCompare] = useState(false);

  const compares = useSelector(state => state.compares.compares);

  useEffect(() => {
    onSnapshot(query(collectionGroup(db, COMPARE_TRIPS_COLLECTION), where("uid", "==", uid)), (snapshot) => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        data["creationTime"] && (data["creationTime"] = data["creationTime"].toDate().toString());
        data["startDate"] && (data["startDate"] = data["startDate"].toDate().toString());
        data["endDate"] && (data["endDate"] = data["endDate"].toDate().toString());
        if (change.type == "added" || change.type == "modified") {
          dispatch(addCompare({
            id: change.doc.id,
            data,
          }));
        }

        if (change.type == "removed") {
          dispatch(removeCompare({
            id: change.doc.id,
          }));
        }
      });
    });

    onSnapshot(query(collectionGroup(db, COMPARE_TRIPS_COLLECTION), where("uid", "==", uid), where("processed", "==", false), limit(1)), snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        // console.log("data?.processed: ", change)
        if (change.type === "added" || change.type === "modified") {
          setDisableCompare(!data?.processed);
        }
        if (change.type === "removed") {
          setDisableCompare(false);
        }
      });
    });
  }, []);

  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView>
        <Button
          bg={disableCompare ? "#aaa" : "$accentColor"}
          disabled={disableCompare}
          pressStyle={{
            scale: 1.1,
            opacity: 0.8,
          }}
          mt="$5"
          alignSelf='center'
          w="40%"
          animateOnly={["transform"]}
          animation={"fast"}
          onPress={() => navigation.navigate(NEW_COMPARE_SCREEN)}
        >
          <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff" fontSize={"$6"}>Compare</MyText>
        </Button>
        <View marginVertical="$2" mt="$5" flexDirection='row' justifyContent='center' alignItems='center'>
          <Separator borderColor={"$primaryFontColor"} />
          <MyText color="$primaryFontColor" margin="$2" fontSize={"$6"} fontWeight={"bold"}>Your Comparisons</MyText>
          <Separator borderColor={"$primaryFontColor"} />
        </View>
        <ScrollView h="100%" p="$3">
          {
            compares && Object.keys(compares).length > 0 ? (
              <Accordion type='multiple'>
                {
                  Object.values(compares).map((compare: any, index) => (
                    <Accordion.Item key={compare.compareId} value={"" + index} disabled={!compare.processed}>
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
                            <View flexDirection='row' alignItems='center' gap="$2">
                              <Paragraph scale={open ? 1.1 : 1} animateOnly={["transform"]} animation="fast" color="$primaryFontColor">{compare.origin.description}</Paragraph>
                              {
                                compare.processed ? <></> : <Spinner size="small" color="$primaryFontColor" />
                              }
                            </View>

                            {
                              compare.processed ? (<Square animation="fast" animateOnly={["transform",]} rotate={open ? '180deg' : '0deg'}>
                                <ChevronDown color="$accentColor" size="$1" />
                              </Square>) : <></>
                            }
                          </>
                        )}
                      </Accordion.Trigger>
                      <View zIndex={2}>
                        <Separator alignSelf='center' pos="absolute" borderColor={"$primaryColor"} width={"80%"} />
                      </View>
                      <Accordion.Content
                        top={-10}
                        animation={"fast"}
                        animateOnly={["transform", "top", "position"]}
                        bg="$secondaryColor"
                        borderBottomLeftRadius={"$4"}
                        borderBottomRightRadius={"$4"}
                      >

                        <View>
                          {
                            compare.destinations.map(destination => (<MyText key={`${destination.location.lat}-${destination.location.lng}`} m="$1" color="$primaryFontColor">{destination.description}</MyText>))
                          }
                        </View>
                        <Button alignSelf='center' w={"40%"} disabled={!compare.processed} onPress={() => navigation.navigate(COMPARE_VISUALIZATION_SCREEN, { ...compare })} bg="$accentColor" mt="$4">
                          <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Show</MyText>
                        </Button>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))
                }
              </Accordion>
            ) : (
              <View justifyContent='center' alignItems='center' marginVertical={"$7"}>
                <MyText textAlign='center' color="$secondaryFontColor">You dont have any trip Comparisons. Please create a <MyText onPress={() => navigation.navigate(NEW_COMPARE_SCREEN)} pressStyle={{ opacity: 0.8 }} color="$accentColor" textDecorationLine="underline" fontSize={15}>Compare</MyText>.</MyText>
              </View>
            )
          }
        </ScrollView>
      </SafeAreaView>
      <Menu />
    </View>
  )
}

export default ComparisonsScreen