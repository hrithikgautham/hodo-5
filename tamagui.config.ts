import { createAnimations } from "@tamagui/animations-react-native";
import { createInterFont } from "@tamagui/font-inter";
import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";
import { DARK_THEME_ACCENT_COLOR, DARK_THEME_PRIMARY_COLOR, DARK_THEME_PRIMARY_FONT_COLOR, DARK_THEME_SECONARY_FONT_COLOR, DARK_THEME_SECONDARY_COLOR, LIGHT_THEME_ACCENT_COLOR, LIGHT_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_FONT_COLOR, LIGHT_THEME_SECONARY_FONT_COLOR, LIGHT_THEME_SECONDARY_COLOR } from "./src/constants/colors";

const animations = createAnimations({
  bouncy: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100
  },
  lazy: {
    type: "spring",
    damping: 20,
    stiffness: 60
  },
  fast: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250
  },
  medium: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
});

const headingFont = createInterFont();
const bodyFont = createInterFont();

const config = createTamagui({
  animations,
  defaultTheme: "dark",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont
  },
  themes: {
    dark: {
      primaryColor: DARK_THEME_PRIMARY_COLOR,
      secondaryColor: DARK_THEME_SECONDARY_COLOR,
      accentColor: DARK_THEME_ACCENT_COLOR,
      primaryFontColor: DARK_THEME_PRIMARY_FONT_COLOR,
      secondaryFontColor: DARK_THEME_SECONARY_FONT_COLOR,
    },
    light: {
      primaryColor: LIGHT_THEME_PRIMARY_COLOR,
      secondaryColor: LIGHT_THEME_SECONDARY_COLOR,
      accentColor: LIGHT_THEME_ACCENT_COLOR,
      primaryFontColor: LIGHT_THEME_PRIMARY_FONT_COLOR,
      secondaryFontColor: LIGHT_THEME_SECONARY_FONT_COLOR,
    },
  },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" }
  })
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
