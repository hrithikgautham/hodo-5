import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import {
  CHATS_SCREEN,
  CHAT_MESSAGES_SCREEN,
  COMPARE_TRIPS_SETTINGS_SCREEN,
  COMPARE_VISUALIZATION_SCREEN,
  COMPARISON_SCREEN,
  COUCH_SURF_INFO_SCREEN,
  COUCH_SURF_REQUESTS_SCREEN,
  COUCH_SURF_SCREEN,
  COUCH_SURF_USER_PROFILE_SCREEN,
  DELETE_ACCOUNT_SCREEN,
  DRAWER_CHATS_SCREEN,
  DRAWER_COMPARE_TRIPS_SCREEN,
  DRAWER_COUCH_SURF_SCREEN,
  DRAWER_HOME_SCREEN,
  DRAWER_PACK_UP_SCREEN,
  DRAWER_POSTS_SCREEN,
  DRAWER_SETTINGS_SCREEN,
  DRAWER_TRIPS_SCREEN,
  HOME_SCREEN,
  MAP_SCREEN,
  NEW_COMPARE_SCREEN,
  NEW_POST_SCREEN,
  NEW_TRIP_SCREEN,
  NOTIFICATIONS_SETTINGS_SCREEN,
  PACK_UP_SCREEN,
  POSTS_SCREEN,
  SETTINGS_SCREEN,
  STATUS_SCREEN,
  TRIPS_ITINIRARY_DATES_SCREEN,
  TRIPS_SCREEN,
  TRIP_ACCOMMODATION_SCREEN,
  TRIP_DOCUMENTS_SCREEN,
  TRIP_EXPENSES_SCREEN,
  TRIP_ITEMS_SCREEN,
  TRIP_NOTES_SCREEN,
  TRIP_PHOTOS_SCREEN,
  TRIP_PLACES_SCREEN,
  TRIP_PLACE_SCREEN,
  TRIP_SETTINGS_SCREEN,
  TRIP_TRANSPORTATION_SCREEN,
  USER_INFO_SCREEN,
  USER_POSTS_PROFILE_SCREEN
} from '../constants/screens';
import PostsScreen from '../screens/posts/PostsScreen';
import TripsScreen from '../screens/trips/TripsScreen';
import NewTripScreen from '../screens/trips/NewTripScreen';
import TripItiniraryDatesScreen from '../screens/trips/TripItiniraryDatesScreen';
import {useAuth} from '../hooks/auth';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/settings/SettingsScreen';
import MapScreen from '../screens/shared/MapScreen';
import TripItemsScreen from '../screens/trips/TripItemsScreen';
import TripAccommodationScreen from '../screens/trips/TripAccommodationScreen';
import TripTransportationScreen from '../screens/trips/TripTransportationScreen';
import TripNotesScreen from '../screens/trips/TripNotesScreen';
import TripDocumentsScreen from '../screens/trips/TripDocumentsScreen';
import TripExpensesScreen from '../screens/trips/TripExpensesScreen';
import TripPhotosScreen from '../screens/trips/TripPhotosScreen';
import TripPlacesScreen from '../screens/trips/TripPlacesScreen';
import TripPlaceScreen from '../screens/trips/TripPlaceScreen';
import ComparisonsScreen from '../screens/compare/ComparisonsScreen';
import CompareVisualizationScreen from '../screens/compare/CompareVisualizationScreen';
import UserPostsProfileScreen from '../screens/posts/UserPostsProfileScreen';
import ChatsScreen from '../screens/shared/ChatsScreen';
import ChatMessagesScreen from '../screens/shared/ChatMessagesScreen';
import StatusScreen from '../screens/posts/StatusScreen';
import TripSettingsScreen from '../screens/trips/TripSettingsScreen';
import MyDrawerMenu from '../components/MyDrawerMenu';
import UserInfoScreen from '../screens/UserInfoScreen';
import CouchSurfScreen from '../screens/couch-surf/CouchSurfScreen';
import NewCompareScreen from '../screens/compare/NewCompareScreen';
import {Backpack, BaggageClaim, GitCompare, Home, LandPlot, MessageCircle, Settings} from '@tamagui/lucide-icons';
import {useThemeName} from 'tamagui';
import {DARK_THEME_ACCENT_COLOR, DARK_THEME_PRIMARY_FONT_COLOR, DARK_THEME_SECONDARY_COLOR, LIGHT_THEME_PRIMARY_FONT_COLOR, LIGHT_THEME_SECONDARY_COLOR} from '../constants/colors';
import NewPostScreen from '../screens/posts/NewPostScreen';
import CompareTripsSettingsScreen from '../screens/compare/CompareTripsSettingsScreen';
import CouchSurfInfoScreen from '../screens/couch-surf/CouchSurfInfoScreen';
import {DEFAULT_FONT_BOLD} from '../constants/fonts';
import DeleteAccountScreen from '../screens/settings/DeleteAccountScreen';
import NotificationsSettingsScreen from '../screens/settings/NotificationsSettingsScreen';
import CouchSurfUserProfileScreen from '../screens/couch-surf/CouchSurfUserProfileScreen';
import CouchSurfRequestsScreen from '../screens/couch-surf/CouchSurfRequestsScreen';
import PackUpScreen from '../screens/shared/PackUpScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const tripStack = [
  <Stack.Screen key={TRIP_ITEMS_SCREEN} name={TRIP_ITEMS_SCREEN} component={TripItemsScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIPS_ITINIRARY_DATES_SCREEN} key={TRIPS_ITINIRARY_DATES_SCREEN} component={TripItiniraryDatesScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={MAP_SCREEN} key={MAP_SCREEN} component={MapScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_ACCOMMODATION_SCREEN} key={TRIP_ACCOMMODATION_SCREEN} component={TripAccommodationScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_TRANSPORTATION_SCREEN} key={TRIP_TRANSPORTATION_SCREEN} component={TripTransportationScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_NOTES_SCREEN} key={TRIP_NOTES_SCREEN} component={TripNotesScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_DOCUMENTS_SCREEN} key={TRIP_DOCUMENTS_SCREEN} component={TripDocumentsScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_EXPENSES_SCREEN} key={TRIP_EXPENSES_SCREEN} component={TripExpensesScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_PHOTOS_SCREEN} key={TRIP_PHOTOS_SCREEN} component={TripPhotosScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_PLACES_SCREEN} key={TRIP_PLACES_SCREEN} component={TripPlacesScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_PLACE_SCREEN} key={TRIP_PLACE_SCREEN} component={TripPlaceScreen} options={{
    headerShown: false,
  }} />,
  <Stack.Screen name={TRIP_SETTINGS_SCREEN} key={TRIP_SETTINGS_SCREEN} component={TripSettingsScreen} options={{
    headerShown: false,
  }} />,
]

const TripsStackNavigator = () => <Stack.Navigator initialRouteName={TRIPS_SCREEN}>
  <Stack.Screen name={TRIPS_SCREEN} component={TripsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={NEW_TRIP_SCREEN} component={NewTripScreen} options={{
    headerShown: false,
  }} />
  {tripStack}
</Stack.Navigator>;

const ComparisonStackNavigator = () => <Stack.Navigator initialRouteName={COMPARISON_SCREEN}>
  <Stack.Screen name={COMPARISON_SCREEN} component={ComparisonsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={COMPARE_VISUALIZATION_SCREEN} component={CompareVisualizationScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={NEW_COMPARE_SCREEN} component={NewCompareScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={COMPARE_TRIPS_SETTINGS_SCREEN} component={CompareTripsSettingsScreen} options={{
    headerShown: false,
  }} />
</Stack.Navigator>

const PostsStackNavigator = () => <Stack.Navigator initialRouteName={POSTS_SCREEN}>
  <Stack.Screen name={POSTS_SCREEN} component={PostsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={NEW_POST_SCREEN} component={NewPostScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={CHATS_SCREEN} component={ChatsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={CHAT_MESSAGES_SCREEN} component={ChatMessagesScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={STATUS_SCREEN} component={StatusScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={USER_POSTS_PROFILE_SCREEN} component={UserPostsProfileScreen} options={{
    headerShown: false,
  }} />
</Stack.Navigator>


const HomeStackNavigator = () => <Stack.Navigator initialRouteName={HOME_SCREEN}>
  <Stack.Screen name={HOME_SCREEN} component={HomeScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={USER_INFO_SCREEN} component={UserInfoScreen} options={{
    headerShown: false,
  }} />
</Stack.Navigator>

const CouchSurfStackNavigator = () => <Stack.Navigator initialRouteName={COUCH_SURF_SCREEN}>
  <Stack.Screen name={COUCH_SURF_SCREEN} component={CouchSurfScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={COUCH_SURF_INFO_SCREEN} component={CouchSurfInfoScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={COUCH_SURF_USER_PROFILE_SCREEN} component={CouchSurfUserProfileScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={COUCH_SURF_REQUESTS_SCREEN} component={CouchSurfRequestsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={CHATS_SCREEN} component={ChatsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={CHAT_MESSAGES_SCREEN} component={ChatMessagesScreen} options={{
    headerShown: false,
  }} />
</Stack.Navigator>

const SettingsStackNavigator = () => <Stack.Navigator initialRouteName={SETTINGS_SCREEN}>
  <Stack.Screen name={SETTINGS_SCREEN} component={SettingsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={DELETE_ACCOUNT_SCREEN} component={DeleteAccountScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={NOTIFICATIONS_SETTINGS_SCREEN} component={NotificationsSettingsScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={USER_INFO_SCREEN} component={UserInfoScreen} options={{
    headerShown: false,
  }} />
  <Stack.Screen name={COUCH_SURF_INFO_SCREEN} component={CouchSurfInfoScreen} options={{
    headerShown: false,
  }} />
</Stack.Navigator>

const PackUpStackNavigator = () => <Stack.Navigator initialRouteName={SETTINGS_SCREEN}>
  <Stack.Screen name={PACK_UP_SCREEN} component={PackUpScreen} options={{
    headerShown: false,
  }} />
</Stack.Navigator>

const ChatsStackNavigator = () => <Stack.Navigator initialRouteName={CHATS_SCREEN}>
  <Stack.Screen name={CHATS_SCREEN} component={ChatsScreen} options={{
    headerShown: false,
  }} />
</Stack.Navigator>

const AuthenticatedStack = () => {
  const {auth} = useAuth();
  const theme = useThemeName();

  return (
    auth ? <Drawer.Navigator
      screenOptions={{
        drawerType: "front",
        drawerHideStatusBarOnOpen: true,
        drawerStatusBarAnimation: "fade",
        swipeEnabled: false,
        headerShown: false,
        drawerItemStyle: {
          marginVertical: 0,
          marginHorizontal: 0,
          paddingHorizontal: 0,
          paddingVertical: 0,
          padding: 0,
          margin: 0,
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
          marginBottom: 0,
        },
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: DEFAULT_FONT_BOLD,
        },
        drawerActiveTintColor: DARK_THEME_ACCENT_COLOR,
        drawerInactiveTintColor: theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR,
      }}
      initialRouteName={HOME_SCREEN}
      drawerContent={props => <MyDrawerMenu {...props} />}>
      <Drawer.Screen name={DRAWER_HOME_SCREEN} component={HomeStackNavigator} options={{
        drawerIcon: config => <Home color={config.focused ? DARK_THEME_ACCENT_COLOR : (theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR)} />
      }} />
      <Drawer.Screen name={DRAWER_COMPARE_TRIPS_SCREEN} component={ComparisonStackNavigator} options={{
        drawerIcon: config => <GitCompare color={config.focused ? DARK_THEME_ACCENT_COLOR : (theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR)} />
      }} />
      <Drawer.Screen name={DRAWER_TRIPS_SCREEN} component={TripsStackNavigator} options={{
        drawerIcon: config => <BaggageClaim color={config.focused ? DARK_THEME_ACCENT_COLOR : (theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR)} />
      }} />
      <Drawer.Screen name={DRAWER_COUCH_SURF_SCREEN} component={CouchSurfStackNavigator} options={{
        drawerIcon: config => <LandPlot color={config.focused ? DARK_THEME_ACCENT_COLOR : (theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR)} />
      }} />
      <Drawer.Screen name={DRAWER_PACK_UP_SCREEN} component={PackUpStackNavigator} options={{
        drawerIcon: config => <Backpack color={config.focused ? DARK_THEME_ACCENT_COLOR : (theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR)} />
      }} />
      <Drawer.Screen name={DRAWER_CHATS_SCREEN} component={ChatsStackNavigator} options={{
        drawerIcon: config => <MessageCircle color={config.focused ? DARK_THEME_ACCENT_COLOR : (theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR)} />
      }} />
      <Drawer.Screen name={DRAWER_SETTINGS_SCREEN} component={SettingsStackNavigator} options={{
        drawerIcon: config => <Settings color={config.focused ? DARK_THEME_ACCENT_COLOR : (theme == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR)} />
      }} />
    </Drawer.Navigator> : <></>
  )
}

export default AuthenticatedStack