import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useGeneratorContext } from "../generatorContext";

// Import the FontAwesome icon set and add a button by name
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
  showIndicator?: boolean;
}) {
  return (
    <View>
      <FontAwesome style={styles.icon} {...props} />
      {props.showIndicator && <View style={styles.indicator} />}
    </View>
  );
}

// Define the tab layout with two tabs
export default function TabLayout() {
  const { latestRetrievedResult, latestCheckedResult } = useGeneratorContext();
  const [newResults, setNewResults] = useState(false);

  useEffect(() => {
    setNewResults(
      new Date(latestRetrievedResult).getTime() >
        new Date(latestCheckedResult).getTime()
    );
  }, [latestRetrievedResult, latestCheckedResult]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFD7B3",
        tabBarInactiveTintColor: "#D9D9D9",
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="results"
        options={{
          title: "Results",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="bell"
              color={color}
              size={24}
              showIndicator={newResults}
            />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
        listeners={{
          tabPress: () => setNewResults(false),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} size={28} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} size={26} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
  tabBar: {
    backgroundColor: "#283829",
  },

  tabBarLabel: {
    fontSize: 12,
  },
  indicator: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7B4444",
  },
});
