import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Card, Image, Spinner, ScrollView, View, Button } from "tamagui";
import MyText from './MyText';
import { DEFAULT_FONT_BOLD } from '../constants/fonts';
import { MoreHorizontal, RotateCcw, Trash2 } from '@tamagui/lucide-icons';
import MyAlert from './MyAlert';

const CardComp = ({ isGettingCreated, screen, data, title, image, imageUrl, error, showDelete = false, handleDelete, id, }) => {
  const navigation = useNavigation();
  const [openAlert, setOpenAlert] = useState(false);

  function deleteRecord() {
    handleDelete && handleDelete(id);
  }

  return (
    <Card
      disabled={isGettingCreated}
      shadowOpacity={0.1}
      shadowColor={"$primaryFontColor"}
      shadowRadius={2}
      shadowOffset={{
        width: 1,
        height: 1
      }}
      onLongPress={() => console.log("long pressed")}
      minHeight={"$10"}
      pressStyle={{
        scale: isGettingCreated ? 1 : 0.98,
      }}
      onPress={() => error ? null : navigation.navigate(screen, data)}
      marginVertical={"$2"}
      marginHorizontal={"$2"}
    >
      <MyAlert open={openAlert} setOpen={setOpenAlert} description="Are you sure u want to delete? Trip will be deleted for all travellers." onCancel={() => setOpenAlert(false)} onOk={() => deleteRecord()} />
      {
        !isGettingCreated && showDelete ? 
        (<Card.Header >
          <Button bg={"$red10Light"} circular icon={<Trash2 size={20} color={"#ffffff"}/>} alignSelf='flex-end' onPress={() => setOpenAlert(true)}/>
        </Card.Header>) : 
        (<></>)
      }
      <Card.Footer padded>
        <MyText color="#ffffff" fontFamily={DEFAULT_FONT_BOLD}>{title}</MyText>
      </Card.Footer>

      <Card.Background justifyContent='center' alignItems='center' borderRadius={"$4"} bg={"$secondaryColor"}>
        {
          isGettingCreated ? 
          <Spinner pos='absolute' zi={1} size="large" color="#ffffff" /> : error === true ? <Button
            zi={1}
            onPress={() => {}}
            pos='absolute'
            bg={"$secondaryColor"}
            icon={<RotateCcw size={20} color={"$primaryFontColor"} />}
          /> : 
          <></>
        }
        {
          !isGettingCreated && (image || imageUrl) ? (<Image
            opacity={0.6}
            resizeMode="cover"
            alignSelf="center"
            height={"100%"}
            width={"100%"}
            source={image ? image : {
              uri: imageUrl,
            }}
          />) : (<Image
            opacity={0.6}
            resizeMode="cover"
            alignSelf="center"
            height={"100%"}
            width={"100%"}
            bg="$secondaryColor"
            source={{}}
          />)
        }

      </Card.Background>
    </Card>
  )
}

export default CardComp