import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useSession } from "./../authContext";
import { StyleSheet } from "react-native";

export const unstable_settings = {
  // Uses the index in the (tabs) group as the initial route
  initialRouteName: "(tabs)",
};

// Ensure splashscreen is not automatically hidden while loading
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Show the splash screen while the session is being loaded
  if (isLoading) {
    return null;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/signIn" />;
  }

  return (
    // Defining the stack navigator for the app layout where the tabs form the base for the info and modal pages
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(info)/options/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(info)/roulette/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="generatorModal"
        options={{
          presentation: "modal",
          title: "",
          headerStyle: styles.headerStyle,
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="generatorEditModal"
        options={{
          presentation: "modal",
          title: "",
          headerStyle: styles.headerStyle,
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="optionModal"
        options={{
          presentation: "modal",
          title: "",
          headerStyle: styles.headerStyle,
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#283829",
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "#fff",
  },
});
