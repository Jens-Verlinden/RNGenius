import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { Option, Participant, Selection, Generator } from "@/types";
import OptionBox from "./option";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useSession } from "@/app/authContext";
import UserService from "@/service/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GeneratorService } from "@/service/GeneratorService";

interface CategoryProps {
  generatorId: number;
  category: string;
  options: Option[] | undefined;
  refetchGenerators: () => void;
  loading: boolean;
  creatorId: number;
  participants: Participant[];
  layout: { width: number; height: number };
}

export default function Category(props: CategoryProps) {
  const { signOut, session } = useSession();
  const [excluding, setExcluding] = useState(false);
  const [liking, setLiking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleExcludeCategory = async (excluding: boolean) => {
    setExcluding(true);
    Vibration.vibrate(100);
    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.excludeCategory,
        props.generatorId,
        props.category
      );
      if (response.ok) {
        const cachedGenerators = await AsyncStorage.getItem("generators");
        if (cachedGenerators) {
          const generators = JSON.parse(cachedGenerators);
          const updatedGenerators = generators.map((generator: Generator) => {
            return {
              ...generator,
              particpants: generator.participants.map(
                (participant: Participant) => {
                  if (participant.id.toString() === session) {
                    return {
                      ...participant,
                      selections: participant.selections.map(
                        (selection: Selection) => {
                          if (
                            selection.option.categories.includes(props.category)
                          ) {
                            return {
                              ...selection,
                              excluded: excluding,
                            };
                          }
                          return selection;
                        }
                      ),
                    };
                  }
                }
              ),
            };
          });
          await AsyncStorage.setItem(
            "generators",
            JSON.stringify(updatedGenerators)
          );
        }
        props.refetchGenerators();
        setRefreshing(true);
      } else {
        setExcluding(false);
      }
    } catch (error) {
      console.error(error);
      setExcluding(false);
    }
  };

  const handleFavoriseCategory = async (favorising: boolean) => {
    setLiking(true);
    Vibration.vibrate(100);
    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.favoriseCategory,
        props.generatorId,
        props.category
      );
      if (response.ok) {
        const cachedGenerators = await AsyncStorage.getItem("generators");
        if (cachedGenerators) {
          const generators = JSON.parse(cachedGenerators);
          const updatedGenerators = generators.map((generator: Generator) => {
            return {
              ...generator,
              particpants: generator.participants.map(
                (participant: Participant) => {
                  if (participant.id.toString() === session) {
                    return {
                      ...participant,
                      selections: participant.selections.map(
                        (selection: Selection) => {
                          if (
                            selection.option.categories.includes(props.category)
                          ) {
                            return {
                              ...selection,
                              favorised: favorising,
                            };
                          }
                          return selection;
                        }
                      ),
                    };
                  }
                }
              ),
            };
          });
          await AsyncStorage.setItem(
            "generators",
            JSON.stringify(updatedGenerators)
          );
        }
        props.refetchGenerators();
        setRefreshing(true);
      } else {
        setLiking(false);
      }
    } catch (error) {
      console.error(error);
      setLiking(false);
    }
  };

  useEffect(() => {
    if (refreshing && !props.loading) {
      setExcluding(false);
      setLiking(false);
      setRefreshing(false);
    }
  }, [props.loading]);

  const allOptionsExcludedForCategory = (
    participant: Participant,
    category: string
  ): boolean => {
    return participant.selections
      .filter((selection: Selection) =>
        selection.option.categories.includes(category)
      )
      .every((selection: Selection) => selection.excluded);
  };

  const allOptionsFavorisedForCategory = (
    participant: Participant,
    category: string
  ): boolean => {
    return participant.selections
      .filter((selection: Selection) =>
        selection.option.categories.includes(category)
      )
      .every((selection: Selection) => selection.favorised);
  };

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.text}>{props.category}</Text>
        <View style={styles.rowIcons}>
          <TouchableOpacity
            onPress={() =>
              handleExcludeCategory(
                !allOptionsExcludedForCategory(
                  props.participants.find(
                    (participant: Participant) =>
                      participant.user.id.toString() === session
                  )!,
                  props.category
                )
              )
            }
            accessibilityLabel="Exclude option"
          >
            {excluding ? (
              <ActivityIndicator
                size={30}
                color={
                  allOptionsExcludedForCategory(
                    props.participants.find(
                      (participant: Participant) =>
                        participant.user.id.toString() === session
                    )!,
                    props.category
                  )
                    ? "#7B4444"
                    : "#D9D9D9"
                }
              />
            ) : (
              <FontAwesome
                name="ban"
                size={30}
                color={
                  allOptionsExcludedForCategory(
                    props.participants.find(
                      (participant: Participant) =>
                        participant.user.id.toString() === session
                    )!,
                    props.category
                  )
                    ? "#7B4444"
                    : "#D9D9D9"
                }
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              handleFavoriseCategory(
                !allOptionsFavorisedForCategory(
                  props.participants.find(
                    (participant: Participant) =>
                      participant.user.id.toString() === session
                  )!,
                  props.category
                )
              )
            }
            style={{ marginLeft: 7 }}
            accessibilityLabel="Favorise option"
          >
            {liking ? (
              <ActivityIndicator
                size={30}
                color={
                  allOptionsFavorisedForCategory(
                    props.participants.find(
                      (participant: Participant) =>
                        participant.user.id.toString() === session
                    )!,
                    props.category
                  )
                    ? "#2B502E"
                    : "#D9D9D9"
                }
              />
            ) : (
              <FontAwesome
                name="thumbs-up"
                size={30}
                color={
                  allOptionsFavorisedForCategory(
                    props.participants.find(
                      (participant: Participant) =>
                        participant.user.id.toString() === session
                    )!,
                    props.category
                  )
                    ? "#2B502E"
                    : "#D9D9D9"
                }
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.line, { width: props.layout.width - 20 }]}></View>
      <View style={styles.box2}>
        {props.options && (
          <FlatList
            contentContainerStyle={styles.flatListContent}
            scrollEnabled={false}
            data={props.options}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <OptionBox
                key={item.id}
                option={item}
                category={props.category}
                refetchGenerators={props.refetchGenerators}
                loading={props.loading}
                creatorId={props.creatorId}
                participants={props.participants}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 20,
    padding: 10,
  },
  text: {
    fontSize: 28,
    color: "#D9D9D9",
    fontFamily: "JaroRegular",
  },
  box2: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  line: {
    marginVertical: 10,
    height: 1,
    backgroundColor: "#C9BEBE",
  },
  flatListContent: {
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  rowIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
});
