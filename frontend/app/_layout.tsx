import { Slot } from "expo-router";
import { SessionProvider } from "./authContext";
import { GeneratorProvider } from "./(app)/generatorContext";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import React from "react";

export default function Root() {
  // Set up the auth and generator context and render our layout inside of it.
  return (
    <>
      <StatusBar
        backgroundColor={styles.statusBar.backgroundColor}
        translucent={true}
        style="light"
      />
      <SessionProvider>
        <GeneratorProvider>
          <Slot />
        </GeneratorProvider>
      </SessionProvider>
    </>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#283829",
  },
});
