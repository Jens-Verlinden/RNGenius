import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
  Vibration,
  FlatList,
} from "react-native";
import { Option, Participant, Selection } from "@/types";
import UserService from "@/service/UserService";
import { GeneratorService } from "@/service/GeneratorService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Generator } from "@/types";
import { useSession } from "@/app/authContext";

interface OptionProps {
  option: Option;
  category: string;
  refetchGenerators: () => void;
  loading: boolean;
  creatorId: number;
  participants: Participant[];
}

interface FilterdParticipant {
  id: number;
  name: string;
  excluded: boolean;
  favorised: boolean;
}

function GenIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function OptionBox(props: OptionProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [animation] = useState(new Animated.Value(0));
  const [deleting, setDeleting] = useState(false);
  const [excluding, setExcluding] = useState(false);
  const [liking, setLiking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [filteredParticipants, setFilteredParticipants] = useState<
    FilterdParticipant[]
  >([]);
  const { signOut, session } = useSession();
  const findDimensions = (layout: any) => {
    const { height } = layout;
    setContentHeight(height);
  };

  const toggleCollapse = async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    if (collapsed) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();

      await delay(100);
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    setCollapsed(!collapsed);
  };

  // Animation for the box to collapse uses the height of the box as the output range
  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const handleDeleteOption = () => {
    Alert.alert(
      "Delete option",
      `Are you sure you want to delete ${props.option.name}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteOption(),
        },
      ]
    );
  };

  const handlePurgeOption = () => {
    Alert.alert(
      "Delete option",
      `Are you sure you want to delete ${props.option.name}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete from category",
          style: "destructive",
          onPress: () => deleteOption(),
        },
        {
          text: "Delete from all categories",
          style: "destructive",
          onPress: () => purgeOption(),
        },
      ]
    );
  };

  const deleteOption = async () => {
    setDeleting(true);
    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.deleteOption,
        props.option.id,
        props.category
      );
      if (response.ok) {
        const cachedGenerators = await AsyncStorage.getItem("generators");
        if (cachedGenerators) {
          const generators = JSON.parse(cachedGenerators);
          const updatedGenerators = generators.map((generator: Generator) => {
            return {
              ...generator,
              options: generator.options.map((option: Option) => {
                if (option.id !== props.option.id) {
                  return option;
                } else {
                  return {
                    ...option,
                    categories: option.categories.filter(
                      (category: string) => category !== props.category
                    ),
                  };
                }
              }),
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
        setDeleting(false);
      }
    } catch (error) {
      console.error(error);
      setDeleting(false);
    }
  };

  const purgeOption = async () => {
    setDeleting(true);
    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.purgeOption,
        props.option.id
      );
      if (response.ok) {
        const cachedGenerators = await AsyncStorage.getItem("generators");
        if (cachedGenerators) {
          const generators = JSON.parse(cachedGenerators);
          const updatedGenerators = generators.map((generator: Generator) => {
            return {
              ...generator,
              options: generator.options.filter(
                (option: Option) => option.id !== props.option.id
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
        setDeleting(false);
      }
    } catch (error) {
      console.error(error);
      setDeleting(false);
    }
  };

  const handleExcludeOption = async () => {
    setExcluding(true);
    Vibration.vibrate(100);
    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.excludeOption,
        props.option.id
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
                          if (selection.option.id === props.option.id) {
                            return {
                              ...selection,
                              excluded: !selection.excluded,
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

  const handleFavoriseOption = async () => {
    setLiking(true);
    Vibration.vibrate(100);
    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.favoriseOption,
        props.option.id
      );
      if (response.ok) {
        const cachedGenerators = await AsyncStorage.getItem("generators");
        if (cachedGenerators) {
          const generators = JSON.parse(cachedGenerators);
          const updatedGenerators = generators.map((generator: Generator) => {
            return {
              ...generator,
              participants: generator.participants.map(
                (participant: Participant) => {
                  if (participant.id.toString() === session) {
                    return {
                      ...participant,
                      selections: participant.selections.map(
                        (selection: Selection) => {
                          if (selection.option.id === props.option.id) {
                            return {
                              ...selection,
                              favorised: !selection.favorised,
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

  const getFilteredParticipants = (
    participants: Participant[],
    session: string,
    optionId: number
  ) => {
    return participants
      .filter((participant) => participant.user.id.toString() !== session)
      .map((participant: Participant) => {
        const selection = participant.selections.find(
          (selection: Selection) => selection.option.id === optionId
        );
        if (selection?.excluded || selection?.favorised) {
          return {
            id: participant.id,
            name: participant.user.firstName + " " + participant.user.lastName,
            excluded: selection.excluded,
            favorised: selection.favorised,
          };
        }
        return null;
      })
      .filter((participant) => participant !== null);
  };

  useEffect(() => {
    if (refreshing && !props.loading) {
      setDeleting(false);
      setExcluding(false);
      setLiking(false);
      setRefreshing(false);
    }
  }, [props.loading]);

  useEffect(() => {
    const sessionId = session ?? "";
    setFilteredParticipants(
      getFilteredParticipants(props.participants, sessionId, props.option.id)
    );
  }, [props.participants]);

  return (
    <View style={styles.box}>
      <TouchableWithoutFeedback
        onPress={toggleCollapse}
        accessibilityLabel="Toggle collapse"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingRight: 10,
          }}
        >
          <Text style={styles.name}>
            {props.option.name} {""}
            {props.participants.findIndex(
              (participant: Participant) =>
                participant.selections.find(
                  (selection: Selection) =>
                    selection.option.id === props.option.id
                )?.excluded
            ) !== -1 ? (
              <FontAwesome
                name="ban"
                size={20}
                color="#7B4444"
                accessibilityLabel="Excluded"
              />
            ) : props.participants.findIndex(
                (participant: Participant) =>
                  participant.selections.find(
                    (selection: Selection) =>
                      selection.option.id === props.option.id
                  )?.favorised
              ) !== -1 ? (
              <FontAwesome
                name="thumbs-up"
                size={20}
                color="#2B502E"
                accessibilityLabel="Favorised"
              />
            ) : null}
          </Text>
          <GenIcon
            name={collapsed ? "chevron-down" : "chevron-up"}
            color={"#283829"}
          />
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={{ height: heightInterpolate }}>
        {/* When the box is collapsed, its still there but not visible to be able to calculate the dynamic height of the box. */}
        <View
          onLayout={(event) => findDimensions(event.nativeEvent.layout)}
          style={[
            styles.box2,
            collapsed
              ? { opacity: 0, position: "absolute", zIndex: -1 }
              : { display: "flex" },
          ]}
        >
          {props.option.description && props.option.description !== "" && (
            <Text style={styles.description}>{props.option.description}</Text>
          )}
          <View style={styles.separator}></View>
          <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
            <FlatList
              scrollEnabled={false}
              data={filteredParticipants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Text style={styles.participantName}>{item.name}</Text>
                  {item.excluded && (
                    <FontAwesome
                      name="ban"
                      size={20}
                      color="#AD8F8F"
                      style={{ marginLeft: 5 }}
                    />
                  )}
                  {item.favorised && (
                    <FontAwesome
                      name="thumbs-up"
                      size={20}
                      color="#AD8F8F"
                      style={{ marginLeft: 5 }}
                    />
                  )}
                </View>
              )}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginLeft: "auto",
            }}
          >
            {session && session === props.creatorId.toString() && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    props.option.categories.length > 1
                      ? handlePurgeOption()
                      : handleDeleteOption();
                  }}
                  accessibilityLabel="Delete option"
                >
                  {deleting ? (
                    <ActivityIndicator size={30} color="#9A6262" />
                  ) : (
                    <FontAwesome name="trash" size={30} color="#9A6262" />
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    width: 2,
                    height: 30,
                    backgroundColor: "#fff",
                    marginHorizontal: 7,
                  }}
                />
              </>
            )}
            <TouchableOpacity
              onPress={handleExcludeOption}
              accessibilityLabel="Exclude option"
            >
              {excluding ? (
                <ActivityIndicator
                  size={30}
                  color={
                    props.participants
                      .find(
                        (participant: Participant) =>
                          participant.user.id.toString() === session
                      )
                      ?.selections.find(
                        (selection: Selection) =>
                          selection.option.id === props.option.id
                      )?.excluded
                      ? "#7B4444"
                      : "#AD8F8F"
                  }
                />
              ) : (
                <FontAwesome
                  name="ban"
                  size={30}
                  color={
                    props.participants
                      .find(
                        (participant: Participant) =>
                          participant.user.id.toString() === session
                      )
                      ?.selections.find(
                        (selection: Selection) =>
                          selection.option.id === props.option.id
                      )?.excluded
                      ? "#7B4444"
                      : "#AD8F8F"
                  }
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFavoriseOption}
              style={{ marginLeft: 7 }}
              accessibilityLabel="Favorise option"
            >
              {liking ? (
                <ActivityIndicator
                  size={30}
                  color={
                    props.participants
                      .find(
                        (participant: Participant) =>
                          participant.user.id.toString() === session
                      )
                      ?.selections.find(
                        (selection: Selection) =>
                          selection.option.id === props.option.id
                      )?.favorised
                      ? "#2B502E"
                      : "#AD8F8F"
                  }
                />
              ) : (
                <FontAwesome
                  name="thumbs-up"
                  size={30}
                  color={
                    props.participants
                      .find(
                        (participant: Participant) =>
                          participant.user.id.toString() === session
                      )
                      ?.selections.find(
                        (selection: Selection) =>
                          selection.option.id === props.option.id
                      )?.favorised
                      ? "#2B502E"
                      : "#AD8F8F"
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    color: "#283829",
    fontFamily: "JaroRegular",
    paddingLeft: 10,
  },
  description: {
    fontSize: 16,
    maxWidth: "90%",
    color: "#9A6262",
    fontFamily: "JaroRegular",
    textAlign: "left",
    paddingLeft: 10,
  },
  box2: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    minWidth: "100%",
    backgroundColor: "#fff",
  },
  participantName: {
    fontSize: 16,
    color: "#AD8F8F",
    fontFamily: "JaroRegular",
  },
});
