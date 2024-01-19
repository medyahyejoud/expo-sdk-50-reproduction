import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME || "Test App",
  slug: "sdk-50-test",
  version: "0.1.0",
  orientation: "portrait",
  scheme: "sdk-50-test",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.testacccount.test",
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY_IOS,
      usesNonExemptEncryption: false,
    },
    googleServicesFile: "./GoogleService-Info.plist",
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.testacccount.test",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY_ANDROID,
      },
    },
    googleServicesFile: "./google-services.json",
  },
  extra: {
    eas: {
      projectId: process.env.EXPO_PROJECT_ID,
    },
  },
  experiments: {
    tsconfigPaths: true,
  },
  plugins: [
    "expo-localization",
    "@react-native-firebase/app",
    "@react-native-firebase/perf",
    "@react-native-firebase/crashlytics",
    "expo-secure-store",
    "expo-apple-authentication",
    "@react-native-google-signin/google-signin",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "expo-font",
      {
        fonts: ["./src/assets/fonts/Metropolis-Bold.otf"],
      },
    ],
    "./bin/react-native-maps-plugin",
    "./bin/react-apple-ios-simulator-not-found-plugin",
  ],
});
