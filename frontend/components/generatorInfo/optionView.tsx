import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Href, Link } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Generator, Category as CategoryType } from "@/types";
import Category from "./category";
import { getIconsDefault } from "@/utils/iconData";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/app/authContext";
import UserService from "@/service/UserService";
import { GeneratorService } from "@/service/GeneratorService";
import React from "react";

interface OptionViewProps {
  generator: Generator;
  categories: CategoryType[] | undefined;
  refetchGenerators: () => void;
  loading: boolean;
  setOptionPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OptionView(props: OptionViewProps) {
  const [isScrollable, setIsScrollable] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { session } = useSession();
  const { signOut } = useSession();

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  const handleContentSizeChange = (_: number, contentHeight: number) => {
    setContentHeight(contentHeight);
  };

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
  };

  useEffect(() => {
    setIsScrollable(viewHeight != 0 && contentHeight > viewHeight);
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

  const imgSource = getIconsDefault();

  const hasNonExcludedOptions = props.generator.options.some(
    (option) =>
      !props.generator.participants.some((participant) =>
        participant.selections.some(
          (selection) => selection.option.id === option.id && selection.excluded
        )
      )
  );

  const handLeaveGenerator = () => {
    Alert.alert(
      "Leave Generator",
      `Are you sure you want to leave ${props.generator.title}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => leaveGenerator(),
        },
      ]
    );
  };

  const leaveGenerator = useCallback(async () => {
    try {
      setIsLeaving(true);
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.leaveGenerator,
        props.generator.id
      );
      if (response.ok) {
        props.refetchGenerators();
        setRefreshing(true);
      } else {
        setIsLeaving(false);
      }
    } catch (error) {
      console.error(error);
      setIsLeaving(false);
    }
  }, [router, props.refetchGenerators]);

  useEffect(() => {
    if (refreshing && !props.loading) {
      setIsLeaving(false);
      setRefreshing(false);
      router.replace("/" as Href);
    }
  }, [props.loading]);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => router.navigate("/" as Href)}
            accessibilityLabel="Click to go back to the generator page"
          >
            <FontAwesome name="chevron-left" size={35} color="#283829" />
          </TouchableOpacity>
          {Number(session) === props.generator.user.id ? (
            <TouchableOpacity
              style={styles.back}
              onPress={() =>
                router.navigate(
                  ("/generatorEditModal?id=" + props.generator.id) as Href
                )
              }
              accessibilityLabel="Click to edit the generator"
            >
              <FontAwesome name="gear" size={45} color="#283829" />
            </TouchableOpacity>
          ) : isLeaving ? (
            <ActivityIndicator
              size="large"
              color="#D9D9D9"
              accessibilityLabel="Loading"
              style={styles.back}
            />
          ) : (
            <TouchableOpacity
              style={styles.back}
              onPress={handLeaveGenerator}
              accessibilityLabel="Click to leave the generator"
            >
              <Ionicons name="log-out-outline" size={45} color="#C9BEBE" />
            </TouchableOpacity>
          )}
        </View>
        {props.generator && (
          <>
            <View style={styles.generatorInfo}>
              <Image
                style={styles.generatorImage}
                source={imgSource[props.generator.iconNumber]}
              />
              <View style={styles.generatorTitleContainer}>
                <Text style={styles.generatorTitle}>
                  {props.generator?.title}
                </Text>
              </View>
              {props.categories?.length === 0 ? (
                <View style={styles.navNoOptions}>
                  <Link
                    href={`/optionModal?id=${props.generator.id}`}
                    style={styles.addOptionLink}
                    accessibilityLabel="Click to add a new option"
                  >
                    <Text style={styles.addOptionText}>
                      Add your first option!
                    </Text>
                  </Link>
                </View>
              ) : !hasNonExcludedOptions ? (
                <View style={styles.navNoOptions}>
                  <Text style={styles.noOptionsText}>Options</Text>
                </View>
              ) : (
                <View style={styles.nav}>
                  <Text
                    onPress={() => props.setOptionPage(false)}
                    style={styles.generateText}
                  >
                    Generate
                  </Text>
                  <View style={styles.optionsContainer}>
                    <Text style={styles.optionsText}>Options</Text>
                  </View>
                </View>
              )}
            </View>
            <View
              style={styles.options}
              onLayout={(event) => setLayout(event.nativeEvent.layout)}
            >
              <FlatList
                contentContainerStyle={styles.flatListContent}
                scrollEnabled={false}
                data={props.categories}
                keyExtractor={(item, index) => item.category + index}
                renderItem={({ item, index }) => (
                  <Category
                    key={index}
                    generatorId={props.generator.id}
                    category={item.category}
                    options={item.options}
                    refetchGenerators={props.refetchGenerators}
                    loading={props.loading}
                    creatorId={props.generator.user.id}
                    participants={props.generator.participants}
                    layout={layout}
                  />
                )}
                style={styles.flatList}
              />
            </View>
          </>
        )}
      </ScrollView>
      {isScrollable && !isAtBottom && (
        <LinearGradient
          colors={["transparent", "#729E84"]}
          style={styles.fade}
        />
      )}
      <Link
        href={`/optionModal?id=${props.generator.id}`}
        style={styles.circle}
        asChild
      >
        <Pressable
          style={styles.pressable}
          accessibilityLabel="Click to add a new option"
        >
          <FontAwesome name="plus" size={30} color="#283829" />
        </Pressable>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: "8%",
  },
  scrollView: {
    width: "100%",
  },
  generatorInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  generatorImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    marginTop: 30,
  },
  generatorTitleContainer: {
    maxWidth: "70%",
  },
  generatorTitle: {
    textAlignVertical: "bottom",
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    alignItems: "baseline",
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20,
    color: "#283829",
    fontFamily: "JaroRegular",
  },
  addOptionLink: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  addOptionText: {
    paddingVertical: 5,
    textAlign: "center",
    fontSize: 20,
    color: "#D9D9D9",
    fontFamily: "JaroRegular",
  },
  noOptionsText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    color: "#D9D9D9",
    fontFamily: "JaroRegular",
  },
  generateText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "50%",
    fontFamily: "JaroRegular",
    textAlign: "center",
    fontSize: 20,
    color: "#283829",
  },
  optionsContainer: {
    backgroundColor: "#283829",
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    width: "50%",
    height: "102%",
  },
  optionsText: {
    color: "#D9D9D9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    fontFamily: "JaroRegular",
    textAlign: "center",
    fontSize: 20,
  },
  flatListContent: {
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
  },
  flatList: {
    width: "100%",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: "#283829",
    fontFamily: "JaroRegular",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "65%",
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#283829",
    backgroundColor: "#D9D9D9",
    color: "#283829",
    fontFamily: "JaroRegular",
  },
  navNoOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "65%",
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    backgroundColor: "#283829",
    color: "#283829",
    fontFamily: "JaroRegular",
  },
  options: {
    width: "80%",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 70,
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
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
    bottom: "3%",
    left: "50%",
    marginLeft: -25,
    borderWidth: 4,
    borderColor: "#283829",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  back: {
    elevation: 5,
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "86%",
    position: "absolute",
    top: 64.3,
    marginRight: 10,
  },
});
