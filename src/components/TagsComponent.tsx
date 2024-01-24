
import React, { useState } from 'react'
import { View, Label, ScrollView, Input, useThemeName } from 'tamagui'
import MyText from './MyText'
import { X } from '@tamagui/lucide-icons'
import { useToast } from '../hooks/toast';
import { DEFAULT_FONT } from '../constants/fonts';

// item => item.code != item.code
// (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())\
const MAXIMUM_SELECTION = 5;

const TagsComponent = ({ id, title, selected, setSelected, readOnly = false, }: { id: string, title: string, selected: boolean, setSelected?: any, readOnly: boolean, }) => {
  const { showToast, } = useToast();
  const theme = useThemeName();
  const [showSpinner, setShowSpinner] = useState(false);

  // console.log(id, title, data, setData, selected, setSelected)

  return (
    <View>
      <Label allowFontScaling={false} htmlFor={id} color={"$primaryFontColor"} fontSize={"$5"}>{title}</Label>
      {
        readOnly ? <></> : (<Input
          allowFontScaling={false}
          id={id}
          fontFamily={DEFAULT_FONT}
          disabled={showSpinner}
          keyboardAppearance={theme}
          value={selected}
          shadowOffset={{
            width: 0.5,
            height: 0.5
          }}
          shadowOpacity={0.5}
          shadowColor={"#cccccc"}
          shadowRadius={0.1}
          borderWidth={0}
          my="$2"
          bg="$secondaryColor"
          color={"$secondaryFontColor"}
          placeholder='Enter comma seperated values...'
          placeholderTextColor={"$secondaryFontColor"}
          fontSize={"$5"}
          onChangeText={setSelected}
        />)
      }

      {
        selected ? <View flexDirection='row' flexWrap='wrap' gap={5} p={"$2"}>
          {
            selected.split(",")
              .filter(item => item.trim().length > 0)
              .map(item => <View
                pressStyle={{
                  scale: 0.95,
                  opacity: 0.9,
                }}
                animation={"fast"}
                animateOnly={["transform", "opacity"]}
                alignItems='center'
                p={10}
                borderRadius={20}
                flexDirection='row'
                bg="$accentColor"
                h="$3"
                disabled={readOnly}
                onPress={() => {
                  const newSelected = selected.split(",").filter(i => i.trim() != item.trim()).join(",");
                  setSelected(newSelected);
                }}
              >
                <MyText color={"#ffffff"}>{item.trim()}</MyText>
                {
                  readOnly ? <></> : (<X size={20} color="#ffffff" />)
                }
              </View>)
          }
        </View> : <></>
      }

    </View>
  )
}

export default TagsComponent;