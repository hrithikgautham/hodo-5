import { SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Input, YStack, View, TextArea, Label, ScrollView, Button, Image, useThemeName, Form, SizeTokens, XStack, RadioGroup, Spinner } from 'tamagui'
import { useAuth } from '../hooks/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MediaSelector from '../components/MediaSelector'
import { Upload } from '@tamagui/lucide-icons'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, } from '../../firebase'
import { useNavigation } from '@react-navigation/native'
import { useToast } from '../hooks/toast'
import { CHECK_IF_EMAIL_EXISTS_URL } from '../constants/URL'
import { USERS_COLLECTION } from '../constants/collections'
import { getAuth, sendEmailVerification, signOut, updateEmail, updateProfile, } from 'firebase/auth'
import MyText from '../components/MyText'
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from '../constants/fonts'
import { GENDER_FEMALE, GENDER_MALE, GENDER_UNDEFINED } from '../constants/gender'
import PhoneNumberAuth from '../components/PhoneNumberAuth'
import { HOME_SCREEN } from '../constants/screens'
import global from '../../global'
import CouchSurfInfo from '../components/CouchSurfInfo'
import { useSelector } from 'react-redux'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import {storage} from "../../firebase";

const UserInfoScreen = () => {
  const user = useSelector(state => state.user.user);
  const { showToast, } = useToast();
  const { auth, } = useAuth();
  const [profilePicture, setProfilePicture] = useState(auth.photoURL ? { uri: auth.photoURL } : null);
  const [userEmail, setUserEmail] = useState(auth.email ? auth.email : "");
  const [username, setUsername] = useState(auth.displayName ? auth.displayName : "");
  const [userPhoneNumber, setUserPhoneNumber] = useState(auth.phoneNumber ? auth.phoneNumber : "");
  const [showSpinner, setShowSpinner] = useState(false);
  const [userBio, setUserBio] = useState(user.bio ? user.bio : "");
  const [gender, setGender] = useState(user.gender ? user.gender : "");
  const [whereDoYouLive, setWhereDoYouLive] = useState<string>(user.whereDoYouLive ? user.whereDoYouLive : "");
  const [hobbies, setHobbies] = useState(user.hobbies ? user.hobbies : "");
  const [languages, setLanguages] = useState(user.languages ? user.languages : "");
  const [countriesVisited, setCountriesVisited] = useState(user.countriesVisited ? user.countriesVisited : "");
  const [countriesLived, setCountriesLived] = useState(user.countriesLived ? user.countriesLived : "");
  const [aboutMe, setaboutMe] = useState<string>(user.aboutMe ? user.aboutMe : "");
  const [teachLearnShare, setTeachLearnShare] = useState<string>(user.teachLearnShare ? user.teachLearnShare : "");
  const [offerHosts, setOfferHosts] = useState<string>(user.offerHosts ? user.offerHosts : "");
  const [whyImOnCouchSurfing, setWhyImOnCouchSurfing] = useState<string>(user.whyImOnCouchSurfing ? user.whyImOnCouchSurfing : "");
  const [phoneNumberVerified, setPhoneNumberVerified] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async (auth) => {
      const data = await getDoc(doc(db, USERS_COLLECTION, auth.uid));
      const { gender, bio, } = data.data();
      setUserBio(bio ? bio : "");
      setGender(gender ? gender : GENDER_MALE);
    })(auth)
  }, []);

  async function validate(email: string, phoneNumber: string, profilePicture: any, gender: string, username: string,) {
    try {
      if (!email || !gender || !username) {
        showToast("Please fill all the fields", "");
        return false;
      }

      if (!phoneNumber) {
        showToast("Please Verify your Phone Number");
        return false;
      }

      console.log("hello")
      if (!profilePicture || !profilePicture?.uri) {
        showToast("Please add a profile picture");
        return false;
      }

      if (email != auth.email) {
        const { success, } = await fetch(CHECK_IF_EMAIL_EXISTS_URL, {
          method: "POST",
          body: JSON.stringify({
            email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(data => data.json());
        if (success) {
          showToast("Email Already in Use");
          return false;
        }
        return true;
      }

      if (username.length > 8) {
        showToast("Username cannot be more than 8 characters");
        return false;
      }

      return true;
    }
    catch (err: any) {
      console.log(err.message)
      return false;
    }
  }

  async function updateInfo(uid: string, email: string, phoneNumber: string, profilePicture: any, gender: string, username: string,) {
    try {
      setShowSpinner(true);
      const validated = await validate(email, phoneNumber, profilePicture, gender, username)
      console.log(1)
      if (!validated) {
        return;
      }
      let profilePictureURL = ""
      if (profilePicture.uri != auth?.photoURL) {
        const mediaBlob = await fetch(profilePicture.uri).then(data => data.blob());
        const uploaded = await uploadBytes(ref(storage, `profile-pictures/${uid}`), mediaBlob);
        profilePictureURL = await getDownloadURL(uploaded.ref);
      }
      else {
        profilePictureURL = profilePicture.uri;
      }

      await updateEmail(getAuth().currentUser, email);
      await updateProfile(getAuth().currentUser, {
        photoURL: profilePictureURL,
        displayName: username,
      });
      const docRef = doc(db, `${USERS_COLLECTION}/${uid}`);
      await updateDoc(docRef, {
        gotInfo: true,
        email,
        phoneNumber,
        photoURL: profilePictureURL,
        bio: userBio,
        gender,
        username,
        aboutMe,
        teachLearnShare,
        offerHosts,
        whyImOnCouchSurfing,
        hobbies,
        languages,
        countriesVisited,
        countriesLived,
        whereDoYouLive,
      });
      console.log(email.trim(), auth.email.trim())

      if (email.trim() != auth.email.trim()) {
        console.log("sending verification email....")
        sendEmailVerification(getAuth().currentUser);
        showToast("A Verification link has been sent to your Email");
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      else {
        navigation.replace(HOME_SCREEN);
      }
    }
    catch (err: any) {
      console.log(err.message);
      if (err.code === "auth/email-already-in-use") {
        showToast("Email Already in Use");
        // navigation.navigate(SIGNIN_SCREEN);
      }
      else if (err.code === "auth/requires-recent-login") {
        showToast("You were logged out. Please Login Again");
        await signOut(getAuth());
      }
      else {

      }
    }
    finally {
      setShowSpinner(false);
    }
  }

  const theme = useThemeName();

  return (
    <View flex={1} bg="$primaryColor">

      <KeyboardAwareScrollView keyboardShouldPersistTaps="always" scrollEnabled={false} contentContainerStyle={{ height: "100%", }}>
        <SafeAreaView style={global.droidSafeArea}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <YStack paddingHorizontal={"$3"} >
              <View alignSelf='center'>
                <Image source={require("../../assets/logos/HODO_LOGO.png")} width={150} height={150} />
              </View>
              <View>
                <Label allowFontScaling={false} htmlFor="profilePicture" color={"$secondaryFontColor"} fontSize={"$5"}>Profile Picture <MyText color={"red"}>*</MyText></Label>
                <MediaSelector selectedMedia={profilePicture} setMedia={setProfilePicture} />
              </View>
              <Form onSubmit={() => updateInfo(auth.uid, userEmail, userPhoneNumber, profilePicture, gender, username)}>
                <YStack space={"$4"}>
                  <View >
                    <Label allowFontScaling={false} htmlFor="email" color={"$secondaryFontColor"} fontSize={"$5"}>Email <MyText color={"red"}>*</MyText></Label>
                    <Input
                      allowFontScaling={false}
                      id="email"
                      fontFamily={DEFAULT_FONT}
                      disabled={showSpinner}
                      keyboardAppearance={theme}
                      keyboardType='email-address'
                      value={userEmail}
                      shadowOffset={{
                        width: 0.5,
                        height: 0.5
                      }} shadowOpacity={0.5}
                      shadowColor={"#cccccc"}
                      shadowRadius={0.1}
                      borderWidth={0}
                      my="$2"
                      bg="$secondaryColor"
                      color={"$secondaryFontColor"}
                      placeholder='Enter Email...'
                      placeholderTextColor={"$secondaryFontColor"}
                      fontSize={"$5"}
                      onChangeText={setUserEmail}
                    />
                  </View>

                  <View >
                    <Label allowFontScaling={false} htmlFor="username" color={"$secondaryFontColor"} fontSize={"$5"}>Username <MyText color={"red"}>*</MyText></Label>
                    <Input
                      allowFontScaling={false}
                      fontFamily={DEFAULT_FONT}
                      id="username"
                      disabled={showSpinner}
                      keyboardAppearance={theme}
                      value={username}
                      shadowOffset={{
                        width: 0.5,
                        height: 0.5
                      }} shadowOpacity={0.5}
                      shadowColor={"#cccccc"}
                      shadowRadius={0.1}
                      borderWidth={0}
                      my="$2"
                      bg="$secondaryColor"
                      color={"$secondaryFontColor"}
                      placeholder='Enter Username...'
                      placeholderTextColor={"$secondaryFontColor"}
                      fontSize={"$5"}
                      onChangeText={setUsername}
                    />
                  </View>

                  {/* add input for phone number */}
                  <PhoneNumberAuth setPhoneNumber={setUserPhoneNumber} autofocus={false} />

                  <View >
                    <Label allowFontScaling={false} fontFamily={DEFAULT_FONT} htmlFor="gender" color={"$secondaryFontColor"} fontSize={"$5"}>Gender <MyText color={"red"}>*</MyText></Label>
                    <RadioGroup disabled={showSpinner} aria-labelledby="Select one item" defaultValue={"0"} value={gender} onValueChange={setGender} name="gender">
                      <XStack space={"$4"}>
                        <RadioGroupItemWithLabel size="$3" value={GENDER_MALE} label={GENDER_MALE} />
                        <RadioGroupItemWithLabel size="$3" value={GENDER_FEMALE} label={GENDER_FEMALE} />
                        <RadioGroupItemWithLabel size="$3" value={GENDER_UNDEFINED} label={GENDER_UNDEFINED} />
                      </XStack>
                    </RadioGroup>
                  </View>

                  <View >
                    <Label allowFontScaling={false} fontFamily={DEFAULT_FONT} htmlFor="bio" color={"$secondaryFontColor"} fontSize={"$5"}>Bio</Label>
                    <TextArea
                      disabled={showSpinner}
                      fontFamily={DEFAULT_FONT}
                      keyboardAppearance={theme}
                      maxLength={1000}
                      id={"bio"}
                      value={userBio}
                      onChangeText={setUserBio}
                      my="$2"
                      size="$4"
                      shadowOffset={{
                        width: 0.5,
                        height: 0.5
                      }}
                      shadowOpacity={0.5}
                      shadowColor={"#cccccc"}
                      borderWidth="$0"
                      color="$primaryFontColor"
                      bg="$secondaryColor"
                      placeholder='Few words about yourself....'
                      placeholderTextColor={"$secondaryFontColor"}
                    />
                  </View>

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
                </YStack>

                <View >
                  <Form.Trigger asChild>
                    <Button
                      alignSelf='center'
                      w={"40%"}
                      disabled={showSpinner}
                      p="$1"
                      bg="$accentColor"
                      alignItems='center'
                      pressStyle={{
                        scale: 0.95,
                        opacity: 0.8,
                      }}
                    >
                      {
                        showSpinner ? <Spinner color="#ffffff" size={"small"} /> : <MyText color={"#ffffff"} fontFamily={DEFAULT_FONT_BOLD} fontSize={"$6"}>Save</MyText>
                      }
                    </Button>
                  </Form.Trigger>
                </View>
              </Form>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAwareScrollView>

    </View>
  )
}


function RadioGroupItemWithLabel(props: {
  size: SizeTokens
  value: string
  label: string
}) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack alignItems="center" space="$2">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label allowFontScaling={false} fontFamily={DEFAULT_FONT} size={props.size} htmlFor={id} color={"$primaryFontColor"}>
        {props.label}
      </Label>
    </XStack>
  )
}



export default UserInfoScreen