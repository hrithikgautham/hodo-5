import React, { useEffect } from 'react'
import { useDispatch, } from 'react-redux'
import { View, } from "tamagui";
import { SafeAreaView } from 'react-native';
import CouchSurfIncomingRequests from '../../components/CouchSurfIncomingRequests';
import CouchSurfOutgoingRequests from '../../components/CouchSurfOutgoingRequests';
import MyTopTabs from '../../components/MyTopTabs';
import global from '../../../global';
import { collection, collectionGroup, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { REQUESTS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { useAuth } from '../../hooks/auth';
import { addIncomingRequest, addOutgoingRequest, removeIncomingRequest, removeOutgoingRequest, } from '../../slices/couchSurfSlice';

const CouchSurfRequestsScreen = () => {
  const { auth: { uid, }, } = useAuth();
  const dispatch = useDispatch();

  const tabs = [
    {
      name: "Your Requests",
      component: () => <CouchSurfOutgoingRequests />,
    },
    {
      name: "Incoming Requests",
      component: () => <CouchSurfIncomingRequests />,
    },
  ];

  useEffect(() => {
    // incoming requests
    const unsub3 = onSnapshot(query(collection(db, `${USERS_COLLECTION}/${uid}/${REQUESTS_COLLECTION}`), orderBy("requestedTime", "desc")), (ss) => {
      ss.docChanges().forEach(async (change) => {
        console.log("in incoming: ", uid, change.doc.data())
        if (change.type == "added" || change.type == "modified") {
          const data = change.doc.data();
          const id = change.doc.id;
          const userData = (await getDoc(doc(db, `${USERS_COLLECTION}/${id}`))).data();
          // console.log({ ...data, ...userData, })

          dispatch(addIncomingRequest({
            id,
            data: { ...data, ...userData, },
          }));

        }

        if (change.type == "removed") {
          const id = change.doc.id;

          dispatch(removeIncomingRequest({
            id,
          }));
        }
      });
    });

    // outgoing requests
    const unsub4 = onSnapshot(query(collectionGroup(db, REQUESTS_COLLECTION), where("from", "==", uid), orderBy("requestedTime", "desc")), (ss) => {
      ss.docChanges().forEach(async (change) => {
        console.log("in incoming: ", uid, change.doc.data())
        if (change.type == "added" || change.type == "modified") {
          const data = change.doc.data();
          console.log("data.to: ", data.to)
          // const id = change.doc.id;
          const userData = (await getDoc(doc(db, `${USERS_COLLECTION}/${data.to}`))).data();
          // console.log({ ...data, ...userData, })

          dispatch(addOutgoingRequest({
            id: data.to,
            data: { ...data, ...userData, },
          }));

        }

        if (change.type == "removed") {
          const { to, } = change.doc.data();

          dispatch(removeOutgoingRequest({
            id: to,
          }));
        }
      });
    });

    return () => { unsub3(); unsub4(); };
  }, []);

  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView style={global.droidSafeArea}>
        <MyTopTabs tabs={tabs} />
      </SafeAreaView>
    </View>
  )
}

export default CouchSurfRequestsScreen