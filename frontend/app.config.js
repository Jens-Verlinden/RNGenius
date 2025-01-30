module.exports = {
  expo: {
    // Basic project information
    // The name of your app as it appears on the home screen
    name: "rngenius",
    // A unique identifier for your app
    slug: "rngenius",
    // The version of your app
    version: "1.0.0",
    // The default orientation of your app
    orientation: "portrait",
    // Enable the usage of the new React Native architecture (required in Expo SDK 52)
    "newArchEnabled": true,
    // Path to your app's icon
    icon: "./assets/images/favicon.png",
    // Custom URL scheme for deep linking
    scheme: "myapp",
    // User interface style, can be 'light', 'dark', or 'automatic'
    userInterfaceStyle: "automatic",
    
    // Splash screen configuration
    // The image to display on the splash screen
    splash: {
      image: "./assets/images/splash.png",
      // How the splash screen image should be resized to fit the screen
      resizeMode: "contain",
      // Background color of the splash screen
      backgroundColor: "#283829"
    },
    
    // iOS specific configuration
    // Whether the app supports running on tablets
    ios: {
      supportsTablet: true
    },
    
    // Android specific configuration
    // Configuration for the adaptive icon on Android
    android: {
      adaptiveIcon: {
        // Path to the foreground image of the adaptive icon
        foregroundImage: "./assets/images/adaptive-icon.png",
        // Background color of the adaptive icon
        backgroundColor: "#ffffff"
      }
    },
    
    // Android navigation bar configuration
    // Background color of the Android navigation bar
    androidNavigationBar: {
      backgroundColor: "#283829"
    },
    
    // Web specific configuration
    // The bundler to use for the web build
    web: {
      bundler: "metro",
      // The output format for the web build, source code will be sent in single bundle
      output: "single",
      // Path to the favicon for the web build
      favicon: "./assets/images/favicon.png"
    },
    
    // Plugins used in the project
    // List of plugins to include in the project
    plugins: [
      "expo-router",
      [
        "expo-font",
        {
          // List of custom fonts to include
          fonts: ["./assets/fonts/JaroRegular.ttf"]
        }
      ],
      [
        "expo-camera", 
        {
          // Permission request message for camera access 
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera" 
        }
      ],
    ],    
    // Experimental features
    // Enable typed routes for better type safety
    experiments: {
      typedRoutes: true,
      // Enable TypeScript paths support
      tsconfigPaths: true
    }
  }
};
