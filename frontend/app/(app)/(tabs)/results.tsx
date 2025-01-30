import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useGeneratorContext } from "../generatorContext";
import ResultBox from "@/components/results/resultBox";
import { useFocusEffect } from "expo-router";

export default function TabResults() {
  const { results, resultError, checkingResults, loading } =
    useGeneratorContext();
  const [isScrollable, setIsScrollable] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [initialFetch, setInitialFetch] = useState(true);

  useFocusEffect(
    // The callback to run when the screen is focused, its memoized and only changes when the dependencies change
    React.useCallback(() => {
      checkingResults(true);
      return () => {
        checkingResults(false);
      };
    }, [])
  );

  const handleContentSizeChange = (_: number, contentHeight: number) => {
    setContentHeight(contentHeight);
  };

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
  };

  useEffect(() => {
    if (initialFetch && !loading) {
      setInitialFetch(false);
    }
  }, [loading]);

  useEffect(() => {
    setIsScrollable(viewHeight != 0 && contentHeight - 30 > viewHeight);
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
            RNGenerations
          </Text>
          {(!results || results.length == 0) && loading && initialFetch && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="#D9D9D9"
                accessibilityLabel="Loading"
              />
            </View>
          )}
          {!loading && resultError && (
            <Text style={styles.errorText}>{resultError}</Text>
          )}
          {results && results.length === 0 && !initialFetch && (
            <Text style={styles.noResultsText}>
              No results for your notifying generators yet ...
            </Text>
          )}
          {results && results.length > 0 && (
            <View style={styles.generatorListContainer}>
              <FlatList
                contentContainerStyle={styles.flatListContent}
                scrollEnabled={false}
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ResultBox key={item.id} result={item} />
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
    paddingBottom: 30,
  },
  title: {
    fontSize: 40,
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
  noResultsText: {
    flex: 1,
    fontSize: 18,
    color: "#FFD7B3",
    opacity: 0.8,
    marginTop: 15,
    fontFamily: "JaroRegular",
  },
});
