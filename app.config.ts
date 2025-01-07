import { ExpoConfig } from "@expo/config";

export default () => {
  const mapsAPIKey = process.env.MAPS_API_KEY;
  const googleServices = process.env.GOOGLE_SERVICES_JSON;

  return {
    "expo": {
      "name": "cityride",
      "slug": "cityride",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./src/assets/images/icon.png",
      "scheme": "cityride",
      "userInterfaceStyle": "automatic",
      "newArchEnabled": true,
      "ios": {
        "supportsTablet": true,
        "infoPlist": {
          "NSCameraUsageDescription": "Allow $(PRODUCT_NAME) to access your camera"
        }
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./src/assets/images/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        },
        "config": {
          "googleMaps": {
            "apiKey": mapsAPIKey
          }
        },
        "googleServicesFile": googleServices,
        "package": "ng.cityride",
        "permissions": [
          "android.permission.CAMERA",
          "android.permission.ACCESS_FINE_LOCATION",
          "android.permission.ACCESS_COARSE_LOCATION"
        ]
      },
      "plugins": [
        "expo-router",
        "@react-native-firebase/app",
        "@react-native-firebase/auth",
        "@react-native-firebase/crashlytics",
        "@react-native-google-signin/google-signin",
        [
          "expo-build-properties",
          {
            "ios": {
              "useFrameworks": "static"
            }
          }
        ],
        [
          "expo-splash-screen",
          {
            "image": "./src/assets/images/splash-icon.png",
            "imageWidth": 200,
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
          }
        ],
        "react-native-vision-camera",
      ],
      "extra": {
        "eas": {
          "projectId": "a5bda6e5-d928-4902-a4a6-b44bcf375132"
        }
      },
      "owner": "raven-consult",
      "experiments": {
        "typedRoutes": true
      }
    } satisfies ExpoConfig
  };

}