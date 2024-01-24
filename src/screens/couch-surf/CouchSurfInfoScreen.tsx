import { X } from '@tamagui/lucide-icons';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, YStack, ScrollView, Label, Input, useThemeName, Button, useSelectContext, } from "tamagui";
import GoogleMapInput from '../../components/GoogleMapInput';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { USERS_COLLECTION } from '../../constants/collections';
import { useNavigation } from '@react-navigation/native';
import { makeUserHost } from '../../apis/users';
import Menu from '../../components/Menu';
import TagsComponent from '../../components/TagsComponent';
import global from '../../../global';
import MyText from '../../components/MyText';
import CouchSurfInfo from '../../components/CouchSurfInfo';
import { useSelector } from 'react-redux';

const CouchSurfInfoScreen = () => {
  const { auth: { uid, }, } = useAuth();
  const user = useSelector(state => state.user.user);
  const MAXIMUM_SELECTION = 5;
  const theme = useThemeName();
  const { showToast, } = useToast();

  const [whereDoYouLive, setWhereDoYouLive] = useState<string>(user.whereDoYouLive ? user.whereDoYouLive : "");
  const [hobbies, setHobbies] = useState(user.hobbies ? user.hobbies : "");
  const [languages, setLanguages] = useState(user.languages ? user.languages : "");
  const [countriesVisited, setCountriesVisited] = useState(user.countriesVisited ? user.countriesVisited : "");
  const [countriesLived, setCountriesLived] = useState(user.countriesLived ? user.countriesLived : "");
  const [aboutMe, setaboutMe] = useState<string>(user.aboutMe ? user.aboutMe : "");
  const [teachLearnShare, setTeachLearnShare] = useState<string>(user.teachLearnShare ? user.teachLearnShare : "");
  const [offerHosts, setOfferHosts] = useState<string>(user.offerHosts ? user.offerHosts : "");
  const [whyImOnCouchSurfing, setWhyImOnCouchSurfing] = useState<string>(user.whyImOnCouchSurfing ? user.whyImOnCouchSurfing : "");

  useEffect(() => {
    (async (uid) => {
      setShowSpinner(true);
      // const data = await getDoc(doc(db, USERS_COLLECTION, uid));
      console.log("user in user: ", user)
      const {
        whereDoYouLive,
        hobbies,
        languages,
        countriesVisited,
        countriesLived,
        aboutMe,
        teachLearnShare,
        offerHosts,
        whyImOnCouchSurfing,
      } = user;
      setWhereDoYouLive(whereDoYouLive);
      setHobbies(hobbies);
      setLanguages(languages);
      setCountriesVisited(countriesVisited);
      setCountriesLived(countriesLived);
      setaboutMe(aboutMe);
      setTeachLearnShare(teachLearnShare);
      setOfferHosts(offerHosts);
      setWhyImOnCouchSurfing(whyImOnCouchSurfing);
      setShowSpinner(false);
    })(uid)
  }, []);

  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  // refs
  const hobbiesInputRef = useRef(null);
  const navigation = useNavigation();

  async function save(whereDoYouLive, hobbies, languages, countriesVisited, countriesLived, aboutMe, teachLearnShare, offerHosts, whyImOnCouchSurfing,) {
    try {
      if (!whereDoYouLive || !hobbies || !languages || !countriesVisited || !countriesLived || !aboutMe || !teachLearnShare || !offerHosts || !whyImOnCouchSurfing) {
        showToast("Please fill all the fields");
        return;
      }
      setShowSpinner(true);

      const docRef = doc(db, `${USERS_COLLECTION}/${uid}`);
      await updateDoc(docRef, {
        whereDoYouLive,
        hobbies,
        languages,
        countriesVisited,
        countriesLived,
        aboutMe,
        teachLearnShare,
        offerHosts,
        whyImOnCouchSurfing,
        isHost: true,
      });
      showToast("Saved successfully");
      navigation.goBack();
    }
    catch (err) {
      showToast("Something went wrong. Please try Again")
    }
    finally {
      setShowSpinner(false);
    }
  }


  return (
    <View bg="$primaryColor" flex={1}>
      <Menu />
      <SafeAreaView style={global.droidSafeArea}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* <ScrollView> */}
          <YStack p={"$4"}>
            <CouchSurfInfo {...{
              setWhereDoYouLive,
              aboutMe,
              setaboutMe,
              teachLearnShare,
              setTeachLearnShare,
              offerHosts,
              setOfferHosts,
              whyImOnCouchSurfing,
              setWhyImOnCouchSurfing,
              hobbies,
              setHobbies,
              languages,
              setLanguages,
              countriesVisited,
              setCountriesVisited,
              countriesLived,
              setCountriesLived,
              whereDoYouLive,
            }} />
            <Button
              mt={"$4"}
              alignSelf='center'
              w="50%"
              onPress={() => save(whereDoYouLive,
                hobbies,
                languages,
                countriesVisited,
                countriesLived,
                aboutMe,
                teachLearnShare,
                offerHosts,
                whyImOnCouchSurfing,)} bg="$accentColor">
              <MyText color="#ffffff" fontWeight={"bold"}>Save</MyText>
            </Button>
          </YStack>
          {/* </ScrollView> */}
        </KeyboardAwareScrollView>
      </SafeAreaView>

    </View>
  )
}

export default CouchSurfInfoScreen