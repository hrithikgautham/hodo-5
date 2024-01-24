import React, { useState } from 'react'
import { Button, ScrollView, View } from "tamagui";
import TripScreensTemplate from '../../components/TripScreensTemplate';
import { Upload } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { TRIPS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { useAuth } from '../../hooks/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { UPDATE_TRIP_BY_KEY_URL } from '../../constants/URL';
import MyText from '../../components/MyText';


const TripDocumentsScreen = ({ route: { params: { tripId, index, } } }) => {
  const { auth: { uid, }, } = useAuth();
  const { right, } = useSafeAreaInsets();
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  const pickDocuments = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      return result.assets;
    }
    catch (err) {
      console.error(err.message)
    }
    finally {

    }
  }

  async function selectDocs() {
    try {
      setShowSpinner(true);
      const results = await pickDocuments();
      if (results && Array.isArray(results)) {
        const URLS = [];
        console.log(1)
        for (let i = 0; i < results.length; i++) {
          console.log(2)
          const path = `trips/${tripId}/docs/${new Date().getTime()}`;
          console.log(3)
          const mediaRef = ref(storage, path);
          console.log(4, results[i].mimeType)
          const data = await fetch(results[i].uri);
          const blob = await data.blob();
          console.log(5)
          const uploaded = await uploadBytes(mediaRef, blob);
          console.log(6)
          const URL = await getDownloadURL(uploaded.ref);
          console.log(7)
          URLS.push(URL);
        }


        await fetch(UPDATE_TRIP_BY_KEY_URL, {
          method: "POST",
          body: JSON.stringify({
            tripId,
            key: "docs",
            value: URLS,
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json());
        setSelectedDocs(results);

      }
      else {

      }
    }
    catch (err: any) {
      console.log(err.message);
    }
    finally {
      setShowSpinner(false);
    }
  }

  return (
    <TripScreensTemplate title={`Documents`} image={require("../../../assets/documents.jpeg")} tripId={tripId} >
      <View flex={1}>
        <Button
          zIndex={1}
          onPress={selectDocs}
          pressStyle={{
            scale: 1.1,
            opacity: 0.8,
          }}
          animateOnly={["transform"]}
          animation={"fast"}
          pos="absolute"
          top={20}
          right={right + 20}
          circular
          icon={<Upload size={25} />} bg="$accentColor" color="#ffffff"
        />

        <View flex={1} >
          <ScrollView p={"$2"}>
            <View flexDirection="row" flexWrap='wrap' columnGap={5} rowGap={5}>
              {/* {
                selectedDocs ? selectedDocs.map((doc, index) => {
                  return <MyText>{doc}</MyText>;
                }) : <></>
              } */}
              <MyText>{
                JSON.stringify(selectedDocs)
              }
              </MyText>
            </View>
          </ScrollView>
        </View>
      </View>
    </TripScreensTemplate>
  )
}

export default TripDocumentsScreen