import React from 'react'
import { Image, ScrollView, Separator, View, XStack, YStack } from 'tamagui'
import { Card as CardType } from '../types/Card'
import { useNavigation } from '@react-navigation/native'
import Card from './Card'
import MyText from './MyText'
import { DEFAULT_FONT_BOLD } from '../constants/fonts'

const CardList = ({ cards, title = "", }: { cards: CardType[], title?: string, }) => {
  const navigation = useNavigation();

  console.log(cards, title)

  return (
    <View h={"100%"} w={"100%"}>
      {
        title ? (<View marginVertical="$2" flexDirection='row' justifyContent='center' alignItems='center' zi={1}>
          <Separator borderColor={"$primaryFontColor"} />
          <MyText color="$primaryFontColor" margin="$2" fontSize={"$6"} fontFamily={DEFAULT_FONT_BOLD}>{title}</MyText>
          <Separator borderColor={"$primaryFontColor"} />
        </View>) : <></>
      }
      <ScrollView overflow='hidden' showsVerticalScrollIndicator={false}>
        <YStack mb={100}>
          {
            cards.map((card: CardType) => (<Card key={card.id} {...card} />))
          }
        </YStack>
      </ScrollView>
    </View>
  )
}

export default CardList