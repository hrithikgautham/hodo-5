import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button, Image, View, Theme, Avatar } from 'tamagui';
import { Camera, Pencil, Upload, X } from '@tamagui/lucide-icons';
import { useToast } from '../hooks/toast';
import { DEFAULT_FONT_BOLD } from '../constants/fonts';
import MyText from './MyText';

const MediaSelector = ({ selectedMedia, setMedia, }) => {
  const { showToast, } = useToast();

  async function setImageData(isLibrary = false) {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    };

    let result = null;

    if(isLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }
    else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }

    else {
      showToast("You did not select any image", "")
    }
  }

  return (
    <View alignItems='center'>
      {
        selectedMedia ? (
          <View flex={1} alignItems='center' marginVertical="$5">
            {/* <Image borderRadius={100} source={{ uri: selectedMedia, }} width={200} h={200} />
             */}
            <Avatar circular size="$20">
              <Avatar.Image src={selectedMedia} />
              <Avatar.Fallback bc="$secondaryColor" />
            </Avatar>
            <Button p="$2" bg="$accentColor" circular position='absolute' right={0} opacity={0.1} pressStyle={{
              scale: 0.95,
              opacity: 0.8,
            }} onPress={() => setMedia(null)}>
              <X color={"#ffffff"} />
            </Button>
          </View>
        ) : (<View>
          <Button icon={<Upload size={20} color="#ffffff" />} p="$2" bg="$accentColor" alignItems='center' pressStyle={{
          scale: 0.95,
          opacity: 0.8,
        }} onPress={() => setImageData(true)}>
          <MyText fontFamily={DEFAULT_FONT_BOLD} color="#ffffff">Upload</MyText>
        </Button>
        <Button icon={<Camera size={20} color="#ffffff" />} p="$2" bg="$accentColor" alignItems='center' pressStyle={{
          scale: 0.95,
          opacity: 0.8,
        }} onPress={() => setImageData(false)} />
        </View>)
      }
    </View>
  )
}

export default MediaSelector