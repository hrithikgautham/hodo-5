import { Dimensions } from 'react-native';
import React from 'react';
import {
  BarChart,
  PieChart,
  StackedBarChart
} from "react-native-chart-kit";
import { ChartConfig } from 'react-native-chart-kit/dist/HelperTypes';
import { ScrollView, useThemeName } from 'tamagui';
import { DARK_THEME_SECONDARY_COLOR, LIGHT_THEME_SECONDARY_COLOR } from '../constants/colors';
import { View, } from "tamagui";
import MyText from './MyText';

const screenWidth = Dimensions.get("window").width;

const Chart = ({ type, data, style = {}, title, }) => {

  const theme = useThemeName();

  const chartConfig: ChartConfig = {
    backgroundColor: theme == "dark" ? DARK_THEME_SECONDARY_COLOR : LIGHT_THEME_SECONDARY_COLOR,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    backgroundGradientFrom: "#000000",
    backgroundGradientTo: "#ffffff"
  };

  return (
    <View zIndex={10} overflow='scroll' zi={10}>
      <MyText color="$secondaryFontColor">{title.toUpperCase()}</MyText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {
          type == "bar" ? (
            <BarChart
              style={style}
              data={data}
              width={screenWidth}
              height={220}
              yAxisLabel="$"
              chartConfig={chartConfig}
              verticalLabelRotation={30}
            />
          ) : <></>
        }

        {
          type == "stackedbar" ? (
            <StackedBarChart
              style={style}
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
            />
          ) : <></>
        }

        {
          type == "pie" ? (
            <PieChart
              data={data}
              width={screenWidth}
              height={screenWidth / 2}
              chartConfig={chartConfig}
              accessor={"data"}
              backgroundColor={theme == "dark" ? DARK_THEME_SECONDARY_COLOR : LIGHT_THEME_SECONDARY_COLOR}
              center={[0, 0]}
              absolute
              style={{

              }}
            />
          ) : <></>
        }
      </ScrollView>
    </View>
  )
}

export default Chart