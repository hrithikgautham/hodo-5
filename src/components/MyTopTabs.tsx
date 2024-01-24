import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useThemeName } from 'tamagui';
import { DARK_THEME_ACCENT_COLOR, DARK_THEME_PRIMARY_COLOR, DARK_THEME_PRIMARY_FONT_COLOR, LIGHT_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_FONT_COLOR } from '../constants/colors';

const Tab = createMaterialTopTabNavigator();

export default function MyTopTabs({ tabs }) {
  const theme = useThemeName();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR,
        tabBarIndicatorStyle: {
          backgroundColor: DARK_THEME_ACCENT_COLOR
        },
        tabBarStyle: {
          backgroundColor: theme == "dark" ? DARK_THEME_PRIMARY_COLOR : LIGHT_THEME_PRIMARY_COLOR,
        },
      }}
    >
      {
        tabs.map(tab => <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />)
      }
    </Tab.Navigator>
  );
}