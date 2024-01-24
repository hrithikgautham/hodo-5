import React, { useEffect, useState } from 'react'
import { Button, Input, XStack, useThemeName, View, YStack, Spinner, } from 'tamagui';
import { checkIfTravellerExists } from '../apis/trips';
import { X } from '@tamagui/lucide-icons';
import { useAuth } from '../hooks/auth';
import { useToast } from '../hooks/toast';
import { DEFAULT_FONT } from '../constants/fonts';
import MyText from './MyText';

const AddRemoveTravellers = ({ travellers, addTraveller, removeTraveller, readOnly = false, }: { travellers: string[], addTraveller: any, removeTraveller: any, readOnly?: boolean, }) => {
  const { auth: { uid, } } = useAuth();
  const { showToast, } = useToast();

  const [travellerEmail, setTravellerEmail] = useState("");
  const theme = useThemeName();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showListItemSpinner, setShowListItemSpinner] = useState(-1);


  async function add(usernameOrEmail: string,) {
    try {
      setShowSpinner(true);
      const data = await checkIfTravellerExists(usernameOrEmail);
      if (travellers.filter(item => item.uid == data?.uid).length > 0) {
        showToast("You are already part of the Trip", "");
        return;
      }

      if (addTraveller) {
        await addTraveller({
          uid: data.uid,
          email: data.email,
          username: data.username,
        });
        setTravellerEmail("");
      }
    }
    catch (err: any) {
      showToast("Please Try Again ");
    }
    finally {
      setShowSpinner(false);
    }
  }

  async function remove(traveller, index) {
    try {
      setShowListItemSpinner(index);
      if (removeTraveller) {
        await removeTraveller(traveller);
      }

    }
    catch (err) {

    }
    finally {
      setShowListItemSpinner(-1);
    }
  }

  return (
    <View>
      <YStack>
        {
          readOnly ? <></> : (<XStack alignItems='center' space={10}>
            <View flex={1}>
              <Input
                allowFontScaling={false}
                fontFamily={DEFAULT_FONT}
                clearButtonMode='always'
                id="travellerEmail"
                keyboardAppearance={theme}
                value={travellerEmail}
                shadowOffset={{
                  width: 0.5,
                  height: 0.5
                }} shadowOpacity={0.5}
                shadowColor={"#cccccc"}
                shadowRadius={0.1}
                borderWidth={0}
                my="$2"
                bg={"$secondaryColor"}
                color={"$secondaryFontColor"}
                placeholder='Enter Email/Username...'
                placeholderTextColor={"$secondaryFontColor"}
                fontSize={"$5"}
                onChangeText={setTravellerEmail}

              />
            </View>
            <Button onPress={() => add(travellerEmail)} pressStyle={{
              scale: 1.1,
              opacity: 0.8
            }}
              disabled={!travellerEmail}
              bg="$accentColor">
              {
                showSpinner ? <Spinner size='small' color={"#ffffff"} /> : <MyText color="#ffffff" fontWeight={"bold"}>
                  Add
                </MyText>
              }
            </Button>
          </XStack>)
        }
        <YStack space="$2">
          {
            travellers.map((traveller, index) => (
              <XStack key={index} space={10} alignItems='center'>
                <View flex={1} flexDirection='row' alignItems='center'>
                  <MyText color={"$primaryFontColor"} fontWeight={"bold"}>{traveller.username}<MyText color={"$secondaryFontColor"}>({traveller.email}) {traveller.uid == uid ? `(You)` : ""}</MyText></MyText>
                  {
                    !readOnly && traveller.uid != uid ? (showListItemSpinner == index ? <Spinner size='small' /> : <Button
                      onPress={() => remove(traveller, index)}
                      pressStyle={{
                        scale: 1.1,
                        opacity: 0.8
                      }}
                      animateOnly={["transform",]}
                      animation={"fast"}
                      borderRadius={100}
                      h={20}
                      w={20}
                      bg="$red11Dark" icon={<X size={20} color="#ffffff" />} p="$0" />) : <></>
                  }
                </View>

              </XStack>
            ))
          }
        </YStack>
      </YStack>
    </View>
  )
}

export default AddRemoveTravellers