import React, { useEffect, useRef, useState, } from 'react'
import { Timestamp, addDoc, collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { CHATS_COLLECTION, MESSAGES_COLLECTION } from '../../constants/collections'
import { db } from "../../../firebase"
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, clearMessages, removeMessage } from "../../slices/chatsSlice"
import { useAuth } from '../../hooks/auth'
import { View, Text, XStack, Input, Button, YStack, Image, ScrollView, } from 'tamagui'
import { SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ChevronLeft, MoreHorizontal, SendHorizontal } from '@tamagui/lucide-icons'
import MyText from '../../components/MyText'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useToast } from '../../hooks/toast'

const ChatBody = ({ route: { params: { chatId, }, }, }) => {
  const dispatch = useDispatch();
  const chat = useSelector(state => state.chats.chats[chatId]);
  const messages = useSelector(state => state.chats.messages[chatId]);
  const { auth: { uid, } } = useAuth();
  const chatBodyRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, `${CHATS_COLLECTION}/${chatId}/${MESSAGES_COLLECTION}`)), snapshot => {
      console.log(snapshot.docs)
      snapshot.docChanges().forEach(change => {
        console.log(change.doc.data())
        if (change.type === "added" || change.type === "modified") {
          console.log("added message")
          dispatch(addMessage({
            id: chatId,
            mId: change.doc.id,
            data: change.doc.data(),
          }));
        }
        if (change.type === "removed") {
          dispatch(removeMessage({
            id: chatId,
            mId: change.doc.id,
          }));
        }
      })
    });

    return () => {
      unsub();
      clearMessages({
        id: chatId,
      });
    }
  }, []);

  function scrollToEnd() {
    chatBodyRef.current.scrollToEnd({ animated: true, });
  }

  return (
    <View bg={"$secondaryColor"} flex={1}>
      <SafeAreaView >
        <KeyboardAwareScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled" style={{
          backgroundColor: "blue",
        }}>

          <View flex={1}>
            <YStack justifyContent='space-between' bg={"red"} flex={1}>
              <XStack justifyContent='space-between' alignItems='center' bg={"$secondaryColor"} py={"$2"}>
                <XStack>
                  <Button bg={"$secondaryColor"} icon={<ChevronLeft size={20} />} borderRadius={"50%"} onPress={() => navigation.goBack()} />
                  <XStack space={"$2"}>
                    <Image w={50} h={50} borderRadius={25} source={chat.photoURL ? { uri: chat.photoURL, } : require("../../../assets/unknown-user.jpg")} />
                    <MyText color={"$primaryFontColor"}>{chat.username}</MyText>
                  </XStack>
                </XStack>
                <Button bg={"$secondaryColor"} icon={<MoreHorizontal size={20} />} borderRadius={"50%"} />
              </XStack>

              <ScrollView >
                {/* <YStack>
                  {
                    Object.entries(messages).map(([key, obj]) => {
                      return obj.sender.trim() == uid.trim() ? (<MyMessageView message={obj.message} read={obj.read} time={obj.sentAt} />) : <OtherMessageView message={obj.message} time={obj.sentAt} read={obj.read} />
                    })
                  }
                </YStack> */}
              </ScrollView>

              <ChatInput chatId={chatId} />
            </YStack>
          </View>

        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  )
}

function ChatInput({ chatId, }) {
  const { bottom, } = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const { auth: { uid, }, } = useAuth();
  const { showToast, } = useToast();

  async function sendMessage(message) {
    try {
      await addDoc(collection(db, `${CHATS_COLLECTION}/${chatId}/${MESSAGES_COLLECTION}`), {
        message,
        sentAt: Timestamp.now(),
        sender: uid,
        read: false,
      });
      setMessage("");
    }
    catch (err) {
      showToast("Please try Again");
    }
  }

  return <XStack>
    <Input flex={1} value={message} onChangeText={setMessage} />
    <Button icon={<SendHorizontal />} onPress={() => sendMessage(message)} />
  </XStack>
}

/**
 * 
 * <>
      {
        messages ? <FlatList onContentSizeChange={scrollToEnd} ref={chatBodyRef} className="flex-1" data={Object.entries(messages)} keyExtractor={item => item[0]} renderItem={({ item: [, obj] }) => (
          obj.sentBy.trim() == email.trim() ? (<MyMessageView message={obj.message} read={obj.read} />) : <OtherMessageView message={obj.message} time={obj.sentAt} read={obj.read} />
        )} /> : <></>
      }
    </>
 */



const MyMessageView = ({ message, time = "", read = false, }) => {
  return (message ? <View >
    <View alignSelf='flex-end'>
      <Text >{message}</Text>
      <View >
        <Text style={{ fontSize: 10, }}>{time.toDate().toDateString()}</Text>
      </View>x
    </View>
  </View> : <></>)
}

const OtherMessageView = ({ message, time = "", read = false, }) => {
  return (message ? <View >
    <View  >
      <Text style={{ color: "white", }}>{message}</Text>
      <View >
        <Text style={{ color: "white", fontSize: 10, }}>{time.toDate().toDateString()}</Text>
      </View>
    </View>
  </View> : <></>)
}

export default ChatBody;