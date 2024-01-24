import * as Font from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function useFonts(fonts: { [key: string]: any }) {
  const [fontsLoaded, setfontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(fonts);
      setfontsLoaded(true);
      SplashScreen.hideAsync();
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}