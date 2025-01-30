import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import GeneratorBox from "@/components/home/generatorBox";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useGeneratorContext } from "../generatorContext";

export default function TabHome() {
  const { generators, generatorError, loading } = useGeneratorContext();
  const [isScrollable, setIsScrollable] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [initialFetch, setInitialFetch] = useState(true);

  SplashScreen.preventAutoHideAsync();

  // Ensure that the application font is loaded before hiding the splash screen
  const [loaded, error] = useFonts({
    JaroRegular: require("@/assets/fonts/JaroRegular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (initialFetch && !loading) {
      setInitialFetch(false);
    }
  }, [loading]);

  const handleContentSizeChange = (_: number, contentHeight: number) => {
    setContentHeight(contentHeight);
  };

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
  };

  useEffect(() => {
    setIsScrollable(viewHeight != 0 && contentHeight - 50 > viewHeight);
  }, [contentHeight, viewHeight]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    let isBottom =
      layoutMeasurement.height + contentOffset.y + 30 >= contentSize.height;
    if (contentOffset.y < 0) {
      isBottom = true;
    }
    setIsAtBottom(isBottom);
  };

  if (!loaded)
    return (
      <View style={styles.background}>
        <ActivityIndicator
          size="large"
          color="#283829"
          accessibilityLabel="Loading"
        />
      </View>
    );

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.main}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            RNGenius
          </Text>
          {!loading && generatorError && !generators && (
            <Text style={styles.errorText}>{generatorError}</Text>
          )}
          {(!generators || generators.length == 0) && loading && initialFetch && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="#D9D9D9"
                accessibilityLabel="Loading"
              />
            </View>
          )}
          {generators && generators.length === 0 && !initialFetch && (
            <Text style={styles.noResultsText}>
              Not a participant of a generator yet ...
            </Text>
          )}
          {generators && (
            <View style={styles.generatorListContainer}>
              <FlatList
                contentContainerStyle={styles.flatListContent}
                scrollEnabled={false}
                data={generators}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <GeneratorBox generator={item} even={index % 2 === 0} />
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
      {isScrollable && !isAtBottom && (
        <LinearGradient
          colors={["transparent", "#729E84"]}
          style={styles.fade}
        />
      )}
      <Link href="/generatorModal" style={styles.circle} asChild>
        <Pressable
          style={styles.pressable}
          accessibilityLabel="Click to go back to the generator page"
        >
          <FontAwesome name="plus" size={30} color="#283829" />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#729E84",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 30,
  },
  scrollView: {
    width: "100%",
  },
  main: {
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 20,
    height: "90%",
    width: "100%",
    padding: 30,
    paddingTop: 0,
    paddingBottom: 50,
  },
  title: {
    fontSize: 50,
    color: "#283829",
    fontFamily: "JaroRegular",
  },
  errorText: {
    color: "#990000",
    fontFamily: "JaroRegular",
    fontSize: 20,
    textAlign: "left",
    paddingBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    marginHorizontal: "auto",
    justifyContent: "center",
    alignContent: "center",
  },
  generatorListContainer: {
    flex: 1,
  },
  flatListContent: {
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 15,
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -25,
    borderWidth: 4,
    borderColor: "#283829",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  noResultsText: {
    flex: 1,
    fontSize: 18,
    color: "#FFD7B3",
    opacity: 0.8,
    marginTop: 15,
    fontFamily: "JaroRegular",
  },
});
