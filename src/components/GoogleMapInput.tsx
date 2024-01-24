import React, { useEffect, useRef } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../constants/apiKeys';
import { useTheme, useThemeName } from 'tamagui';
import { DARK_THEME_PRIMARY_COLOR, DARK_THEME_PRIMARY_FONT_COLOR, DARK_THEME_SECONARY_FONT_COLOR, DARK_THEME_SECONDARY_COLOR, LIGHT_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_FONT_COLOR, LIGHT_THEME_SECONARY_FONT_COLOR, LIGHT_THEME_SECONDARY_COLOR } from '../constants/colors';
import { useToast } from '../hooks/toast';
import { DEFAULT_FONT } from '../constants/fonts';

const GoogleMapInput = ({ location = null, setLocation, clearOnSelect = false, autoFocus = false, }: { location?: any[] | any, setLocation: any, clearOnSelect?: boolean, autoFocus?: boolean, }) => {
  const inputRef = useRef(null);
  const themeName = useThemeName();
  const theme = useTheme();
  const { showToast, } = useToast();

  useEffect(() => {
    if (inputRef.current) {
      location && location.description && inputRef.current.setAddressText(location.description);
    }
  }, []);

  return (
    // <View>
    <GooglePlacesAutocomplete
      textInputProps={{
        autoFocus,
        placeholderTextColor: themeName == "dark" ? DARK_THEME_SECONARY_FONT_COLOR : LIGHT_THEME_SECONARY_FONT_COLOR,
        keyboardAppearance: themeName == "dark" ? "dark" : "light",
        allowFontScaling: false,
      }}
      ref={inputRef}
      styles={{
        separator: {
          backgroundColor: themeName == "dark" ? DARK_THEME_PRIMARY_COLOR : LIGHT_THEME_PRIMARY_COLOR,
        },
        description: {
          color: themeName == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR,
          fontFamily: DEFAULT_FONT,
        },
        row: {
          backgroundColor: themeName == "dark" ? DARK_THEME_SECONDARY_COLOR : LIGHT_THEME_SECONDARY_COLOR,
        },
        container: {
          flex: 1,
          width: "100%",
          boxShadow: '10px 10px',
          zIndex: 9999,

        },
        textInput: {
          autoFocus: false,
          zIndex: 9999,
          fontFamily: DEFAULT_FONT,
          shadowOffset: {
            height: 0.5,
            width: 0.5
          },
          shadowOpacity: 0.5,
          shadowColor: "#cccccc",
          shadowRadius: 0.1,
          color: themeName == "dark" ? DARK_THEME_PRIMARY_FONT_COLOR : LIGHT_THEME_PRIMARY_FONT_COLOR,
          backgroundColor: themeName == "dark" ? DARK_THEME_SECONDARY_COLOR : LIGHT_THEME_SECONDARY_COLOR,
        },
      }}
      nearbyPlacesAPI='GooglePlacesSearch'
      debounce={100}
      placeholder='Search Places...'
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        try {
          console.log("details.geometry.location: ", details.geometry.location)
          const obj = {
            location: details.geometry.location,
            description: data.description,
            name: data.description,
            mapUrl: details.url,
            photos: details.photos.slice(0, 2),
          };
          if (Array.isArray(location)) {
            console.log("it is an array")
            if (!location.find((item: any) => item.description == obj.description)) {
              setLocation([
                ...location,
                obj,
              ]);
            }
            else {
              showToast("Destination already added");
            }
          }
          else {
            console.log("Not a array: ", location)
            setLocation(obj);
          }

          clearOnSelect && inputRef.current.clear();
        }
        catch (err) {
          console.log(err.message)
        }
      }}
      enablePoweredByContainer={false}
      query={{
        key: GOOGLE_API_KEY,
        language: 'en',
      }}
    />
    // </View>
  )
}

export default GoogleMapInput