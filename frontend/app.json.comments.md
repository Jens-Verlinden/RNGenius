# App Configuration

## Basic Project Information

- **name**: The name of your app as it appears on the home screen.
- **slug**: A unique identifier for your app.
- **version**: The version of your app.
- **orientation**: The default orientation of your app.
- **icon**: Path to your app's icon.
- **scheme**: Custom URL scheme for deep linking, if you wanted to use for example invitation links
- **userInterfaceStyle**: User interface style, can be 'light', 'dark', or 'automatic'. If the components support it, they will change their appearance based on the user's preference.

## Splash Screen Configuration

- **splash.image**: The image to display on the splash screen.
- **splash.resizeMode**: How the splash screen image should be resized to fit the screen.
- **splash.backgroundColor**: Background color of the splash screen.

## iOS Specific Configuration

- **ios.supportsTablet**: Whether the app supports running on tablets.

## Android Specific Configuration

- **android.adaptiveIcon.foregroundImage**: Path to the foreground image of the adaptive icon, an icon that can change shape to match the device's theme.
- **android.adaptiveIcon.backgroundColor**: Background color of the adaptive icon.

## Android Navigation Bar Configuration

- **androidNavigationBar.backgroundColor**: Background color of the Android navigation bar.

## Web Specific Configuration

- **web.bundler**: The bundler to use for the web build.
- **web.output**: The output format for the web build.
- **web.favicon**: Path to the favicon for the web build.

## Plugins Used in the Project

- **plugins**: List of plugins to include in the project.
  - **expo-router**
  - **expo-font**
    - **fonts**: List of custom fonts to include in the expo router.

## Experimental Features

- **experiments.typedRoutes**: Enable typed pages and routes which are validated with the TypeScript compiler.
- **experiments.tsconfigPaths**: Enable type aliases for file paths, like `@components` or `@types`. 