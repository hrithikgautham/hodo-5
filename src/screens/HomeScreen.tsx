import { SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import Menu from '../components/Menu'
import { Button, Separator, View, } from 'tamagui'
import { useAuth } from '../hooks/auth'
import { useNavigation } from '@react-navigation/native'
import { USER_INFO_SCREEN } from '../constants/screens'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, } from '../../firebase'
import { USERS_COLLECTION } from '../constants/collections'
import MyText from '../components/MyText'
import { DARK_THEME_PRIMARY_COLOR } from '../constants/colors'

const HomeScreen = () => {
  const { auth: { email, phoneNumber, uid, }, } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    onSnapshot(doc(db, USERS_COLLECTION, uid), ss => {
      console.log("ss1")
      if (ss.exists() && !ss.data()?.gotInfo) {
        setTimeout(() => {
          navigation.replace(USER_INFO_SCREEN)
        }, 1000);
      }
    });

  }, [])

  return (
    <View flex={1} bg={"$primaryColor"}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always" scrollEnabled={false}>
        <SafeAreaView style={{ flex: 1, }}>

          <View>
            {/* search biar */}
          </View>

          <View>
            {/* cuochsurf requests */}
          </View>

          <View>
            {/* current trips */}
          </View>

          <View>
            {/* if the use is not a host, ask if they want to be a host */}
          </View>



        </SafeAreaView>
      </KeyboardAwareScrollView>
      <Menu />
    </View>
  )
}



export default HomeScreen