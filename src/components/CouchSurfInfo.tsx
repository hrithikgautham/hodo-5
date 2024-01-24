import React from 'react'
import { Label, YStack, View, Input, Button, useThemeName } from 'tamagui'
import GoogleMapInput from './GoogleMapInput'
import TagsComponent from './TagsComponent'

const CouchSurfInfo = ({
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
}) => {
  const theme = useThemeName();

  return (
    <YStack space="$4">
      <View zi={2}>
        <Label allowFontScaling={false} htmlFor="phonenumber" color={"$primaryFontColor"} fontSize={"$5"}>Where do you live?</Label>
        <View my={"$2"}>
          <GoogleMapInput setLocation={setWhereDoYouLive} />
        </View>
      </View>

      <View zi={2}>
        <Label allowFontScaling={false} htmlFor="aboutme" color={"$primaryFontColor"} fontSize={"$5"}>About me</Label>
        <Input
          allowFontScaling={false}
          id="aboutme"
          keyboardAppearance={theme}
          value={aboutMe}
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
          placeholder='About Me...'
          placeholderTextColor={"$secondaryFontColor"}
          fontSize={"$5"}
          onChangeText={setaboutMe}
          multiline
        />
      </View>

      {/* teach learn share */}
      <View zi={2}>
        <Label allowFontScaling={false} htmlFor="teach-learn-share" color={"$primaryFontColor"} fontSize={"$5"}>TEACH, LEARN, SHARE</Label>
        <Input
          allowFontScaling={false}
          id="teach-learn-share"
          keyboardAppearance={theme}
          value={teachLearnShare}
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
          placeholder='Teach, learn, share....'
          placeholderTextColor={"$secondaryFontColor"}
          fontSize={"$5"}
          onChangeText={setTeachLearnShare}
          multiline
        />
      </View>

      {/* offer hosts */}
      <View zi={2}>
        <Label allowFontScaling={false} htmlFor="offer-hosts" color={"$primaryFontColor"} fontSize={"$5"}>What can I Offer Hosts?</Label>
        <Input
          allowFontScaling={false}
          id="offer-hosts"
          keyboardAppearance={theme}
          value={offerHosts}
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
          placeholder='What can I Offer Hosts....'
          placeholderTextColor={"$secondaryFontColor"}
          fontSize={"$5"}
          onChangeText={setOfferHosts}
          multiline
        />
      </View>

      <View zi={2}>
        <Label allowFontScaling={false} htmlFor="why-am-i-on-hodo" color={"$primaryFontColor"} fontSize={"$5"}>Why I'm on Hodo?</Label>
        <Input
          allowFontScaling={false}
          id="why-am-i-on-hodo"
          keyboardAppearance={theme}
          value={whyImOnCouchSurfing}
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
          placeholder='Why?....'
          placeholderTextColor={"$secondaryFontColor"}
          fontSize={"$5"}
          onChangeText={setWhyImOnCouchSurfing}
          multiline
        />
      </View>

      <TagsComponent id={"hobbies"} title={"Hobbies"} selected={hobbies} setSelected={setHobbies} />
      <TagsComponent id={"languages"} title={"Languages"} selected={languages} setSelected={setLanguages} />
      <TagsComponent id={"visited-countries"} title={"Countries I have Visited"} selected={countriesVisited} setSelected={setCountriesVisited} />
      <TagsComponent id={"lived-countries"} title={"Countries I have Lived"} selected={countriesLived} setSelected={setCountriesLived} />
    </YStack>
  )
}

export default CouchSurfInfo