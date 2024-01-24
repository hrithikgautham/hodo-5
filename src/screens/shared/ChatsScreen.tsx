import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Image, ScrollView, View, XStack, YStack } from "tamagui";
import { db } from '../../../firebase';
import { CHATS_COLLECTION, USERS_COLLECTION } from '../../constants/collections';
import { useAuth } from '../../hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import { addChat, removeChat } from '../../slices/chatsSlice';
import MyText from '../../components/MyText';
import { useNavigation } from '@react-navigation/native';
import { CHAT_MESSAGES_SCREEN } from '../../constants/screens';
import Menu from '../../components/Menu';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';

const ChatsScreen = () => {

  const { auth: { uid, }, } = useAuth();
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chats.chats);
  const navigation = useNavigation();

  useEffect(() => {
    onSnapshot(query(collection(db, CHATS_COLLECTION), where("members", "array-contains", uid)), (ss) => {
      ss.docChanges().forEach(async (change) => {
        if (change.type === "added" || change.type === "modified") {
          const member = change.doc.data().members.find(item => item !== uid);
          const userData = await (await getDoc(doc(db, USERS_COLLECTION, member))).data();
          dispatch(addChat({
            id: change.doc.id,
            data: { ...change.doc.data(), ...userData, },
          }));
        }

        if (change.type === "removed") {
          dispatch(removeChat({
            id: change.doc.id,
          }));
        }
      })
    });
  }, []);

  return (
    <View bg="$primaryColor" flex={1}>
      <SafeAreaView>
        <XStack bg={"$secondaryColor"} alignItems='center'>
          <Button icon={<ChevronLeft size={30} color={"$primaryFontColor"} />}>

          </Button>
          <MyText fontFamily={DEFAULT_FONT_BOLD} color={"$primaryFontColor"}>
            Chats
          </MyText>
        </XStack>
        <ScrollView h={"100%"}>
          {
            Object.entries(chats).map(([key, data]) => {
              return (<XStack p={"$2"} m={"$2"} bg={"$secondaryColor"} borderRadius={10} justifyContent='space-between' alignItems='center' onPress={() => navigation.navigate(CHAT_MESSAGES_SCREEN, { chatId: key, })}>
                <XStack flex={1} space={"$2"} alignItems='center'>
                  <Image w={50} h={50} borderRadius={25} source={data.photoURL ? { uri: data.photoURL } : require("../../../assets/unknown-user.jpg")} />
                  <YStack>
                    <MyText color={"$primaryFontColor"}>{data.username}</MyText>
                    {/* <MyText>{data.lastMessage}</MyText> */}
                  </YStack>
                </XStack>
                <View bg={"red"} p={10} borderRadius={20} h={40} w={40} justifyContent='center' alignItems='center'>
                  <MyText p={0} color={"#ffffff"}>1</MyText>
                </View>
              </XStack>)
            })
          }
        </ScrollView>
      </SafeAreaView>
      <Menu />
    </View>
  )
}

export default ChatsScreen