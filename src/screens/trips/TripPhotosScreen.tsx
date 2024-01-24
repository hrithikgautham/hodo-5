import React, { useEffect, useState } from 'react'
import { View, Text, Button, YStack, ScrollView, Image, XStack, Spinner, Popover, Input, Label, Adapt, } from "tamagui";
import TripScreensTemplate from '../../components/TripScreensTemplate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronUp, Circle, Plus, Upload } from '@tamagui/lucide-icons';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { useToast } from '../../hooks/toast';
import { arrayUnion, collectionGroup, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { PHOTOS_COLLECTION, TRIPS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { useAuth } from '../../hooks/auth';
import ImagePreviewPopOver from '../../components/ImagePreviewPopOver';
import { UPDATE_TRIP_BY_KEY_URL } from '../../constants/URL';

const TripPhotosScreen = ({ route: { params: { tripId, } } }) => {
  const { auth: { uid, }, } = useAuth();
  const { right, } = useSafeAreaInsets();
  // const [selectedMedias, setSelectedMedias] = useState<string[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [enableSelection, setEnableSelection] = useState<boolean>(false);
  const { showToast, } = useToast();
  const medias = useSelector(state => state.trips.trips[tripId].medias);

  async function selectFromGallery(isLibrary = false) {
    let result = null;

    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: false,
      allowsMultipleSelection: true,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images for now
    };

    if (isLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }
    else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
      // console.log(result.assets);
      return result.assets;
    }
    else {
      return null
    }
  }

  async function createFolder() {
    try {
      const uploaded = await uploadBytes(ref(storage, `trips/${tripId}/photos/dummy`), new Blob());
      showToast("Folder Created!");
    }
    catch (err) {
      showToast("Please try Again");
    }
    finally {

    }
  }

  async function selectMedias() {
    try {
      setShowSpinner(true);
      const results = await selectFromGallery(true);
      console.log("1")
      if (results && Array.isArray(results)) {
        console.log("2");
        const URLS = [];
        for (let i = 0; i < results.length; i++) {
          console.log("3")
          const path = `trips/${tripId}/photos/${new Date().getTime()}`;
          const mediaRef = ref(storage, path);
          console.log(results[i].uri)
          const blob = await fetch(results[i].uri).then(r => r.blob());
          console.log(3.5)
          const uploaded = await uploadBytes(mediaRef, blob);
          const URL = await getDownloadURL(uploaded.ref);
          URLS.push(URL);
        }

        const trips = query(collectionGroup(db, TRIPS_COLLECTION), where("tripId", "==", tripId));
        await updateDoc(doc(db, PHOTOS_COLLECTION, tripId), {
          "medias": arrayUnion(...URLS),
        });

        await fetch(UPDATE_TRIP_BY_KEY_URL, {
          body: JSON.stringify({
            tripId,
            key: "medias",
            value: URLS,
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json());
      }
      else {
        console.log("5")
      }
    }
    catch (err: any) {
      console.log(err.message);
    }
    finally {
      setShowSpinner(false);
    }
  }

  const [open, setOpen] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>("");

  return (
    <TripScreensTemplate title='Photos' tripId={tripId} image={require("../../../assets/photos.webp")} >
      <ImagePreviewPopOver open={open} setOpen={(flag) => {
        setOpen(flag);
        setSelectedImageUri("");
      }} uri={selectedImageUri} />
      <View flex={1}>
        {
          enableSelection ? <></> : (<Button
            zIndex={1}
            onPress={selectMedias}
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
          />)
        }

        <View flex={1} >
          <ScrollView p={"$2"}>
            <View flexDirection="row" flexWrap='wrap' columnGap={5} rowGap={5}>
              {
                medias ? medias.map((media, index) => {
                  return (
                    <Button
                      key={index}
                      onPress={() => {
                        setSelectedImageUri(media);
                        setTimeout(() => setOpen(true), 500);
                      }}
                      flexBasis={100}
                      pressStyle={{
                        scale: 0.9,
                        opacity: 0.8,
                      }}
                      onLongPress={() => setEnableSelection(true)}
                      animateOnly={["transform"]}
                      animation={"fast"}
                      p={0}
                      m={0}
                      style={{ height: "fit-content" }}
                      borderRadius={0}
                    >
                      <Image
                        source={{ uri: media, }}
                        width={100}
                        h={100}
                      />
                      {/* <Button pos={"absolute"} p={0} left={0} top={0} icon={<Circle />} /> */}
                    </Button>
                  )
                }) : <></>
              }
            </View>
          </ScrollView>
        </View>
      </View>

      {
        showSpinner ? <Spinner size="large" pos={"absolute"} alignSelf='center' alignItems='center' /> : <></>
      }

      {/* <ActionPopover /> */}
    </TripScreensTemplate>
  )
}

/*

function ActionPopover() {
  return (
    <Popover size="$5" allowFlip placement="top">
      <Popover.Trigger asChild>
        <View>
          <Button icon={ChevronUp} circular />
        </View>
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="lazy"
            animateOnly={["transform", "opacity"]}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={"fast"}
        animateOnly={["transform"]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack space="$3">
          <XStack space="$3">
            <Label allowFontScaling={false} size="$3" htmlFor={"name"}>
              Name
            </Label>
            <Input allowFontScaling={false} size="$3" id={"name"} />
          </XStack>

          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                
              }}
            >
              Submit
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>

  )
}
*/


export default TripPhotosScreen