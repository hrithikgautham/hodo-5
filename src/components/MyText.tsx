
import React from 'react';
import { Text } from 'tamagui';
import { DEFAULT_FONT } from '../constants/fonts';

const MyText = (props) => {
  return (
    <Text allowFontScaling={false} fontFamily={DEFAULT_FONT} {...props}>{props.children}</Text>
  )
}

export default MyText