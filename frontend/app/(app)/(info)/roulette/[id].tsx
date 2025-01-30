import RouletteCircle from "@/components/roulette/rouletteCircle";
import { Option, Generator, Participant, Selection } from "@/types";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { useGeneratorContext } from "../../generatorContext";
import UserService from "@/service/UserService";
import { GeneratorService } from "@/service/GeneratorService";
import { getIconsDefault } from "@/utils/iconData";
import { useSession } from "@/app/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GeneratingScreen() {
  const [generated, setGenerated] = useState(false);
  const { id } = useLocalSearchParams();
  const { generators, refetchGenerators, checkingResults, loading } =
    useGeneratorContext();
  const [generator, setGenerator] = useState<Generator>();
  const [targetIndex, setTargetIndex] = useState(-1);
  const [optionId, setOptionId] = useState(-1);
  const [excluding, setExcluding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { signOut, session } = useSession();

  useEffect(() => {
    if (!generator) getGenerator();
  }, [generators]);

  const getGenerator = () => {
    const tempGenerator: Generator | undefined = generators.find(
      (generator: Generator) => generator.id === Number(id)
    );
    if (tempGenerator) {
      setGenerator(tempGenerator);
    }
  };

  const generateOption = async () => {
    if (generator) {
      try {
        const response = await UserService.callApiWithRefreshToken(
          signOut,
          GeneratorService.generateOption,
          id
        );
        if (response.ok) {
          const data = await response.json();
          const option = data as Option;
          setTargetIndex(
            generator.options.findIndex((o) => o.id === option.id)
          );
          setOptionId(option.id);
          if (isNotificationTurnedOn()) checkingResults(true);
          refetchGenerators();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const imgSource = getIconsDefault();

  const isNotificationTurnedOn = () => {
    if (!generator) return false;
    const participant = generator.participants.find(
      (participant) => participant.user.id === Number(session)
    );
    return participant?.notifications || false;
  };

  const handleExcludeOption = async () => {
    setExcluding(true);
    Vibration.vibrate(100);
    if (generator && generated && optionId !== -1) {
      try {
        setExcluding(true);
        const response = await UserService.callApiWithRefreshToken(
          signOut,
          GeneratorService.excludeOption,
          optionId
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
                            if (selection.option.id === optionId) {
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
          refetchGenerators();
          setRefreshing(true);
        } else {
          setExcluding(false);
        }
      } catch (error) {
        console.error(error);
        setExcluding(false);
      }
    }
  };

  useEffect(() => {
    if (generator) generateOption();
  }, [generator]);

  useEffect(() => {
    if (refreshing && !loading) {
      setExcluding(false);
      isNotificationTurnedOn()
        ? router.replace("/results/" as Href)
        : router.replace(("/options/" + id) as Href);
    }
  }, [loading]);

  if (generator)
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.centeredColumn}>
          <Image
            style={styles.generatorImage}
            source={imgSource[generator.iconNumber]}
            accessibilityLabel="Generator Icon"
          />
          <View style={styles.textContainer}>
            <Text style={[styles.title, styles.centerText]}>
              {generator.title}
            </Text>
            <Text style={[styles.title, styles.generatorText]}>
              {"GENERATOR"}
            </Text>
          </View>
        </View>
        {targetIndex !== -1 ? (
          <RouletteCircle
            targetIndex={targetIndex}
            setGenerated={setGenerated}
            options={generator?.options as Option[]}
          />
        ) : (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator
              size={200}
              color="#283829"
              style={styles.activityIndicator}
              accessibilityLabel="Loading"
            />
          </View>
        )}
        {!generated ? (
          <TouchableOpacity
            onPress={() => router.navigate(("/options/" + id) as Href)}
            accessibilityLabel="Click to try again later"
          >
            {targetIndex === -1 ? (
              <Text style={styles.tryAgainText}>TRY AGAIN LATER!</Text>
            ) : (
              <Text style={styles.emptyText}></Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.bottomText}>
            <TouchableOpacity
              onPress={() => {
                isNotificationTurnedOn()
                  ? router.replace("/results/" as Href)
                  : router.replace(("/options/" + id) as Href);
              }}
              accessibilityLabel="Click to go back to the generator page"
            >
              <Text style={styles.thanksText}>THANKS!</Text>
            </TouchableOpacity>
            {excluding ? (
              <ActivityIndicator
                size={20}
                color="#fff"
                style={styles.actvityIndicatorSmall}
                accessibilityLabel="Loading"
              />
            ) : (
              <TouchableOpacity
                onPress={() => handleExcludeOption()}
                accessibilityLabel="Click to go back to the generator page"
              >
                <Text style={styles.excludeText}>EXCLUDE OPTION</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6%",
    backgroundColor: "#99BAA8",
  },
  centeredColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  generatorImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    marginTop: 50,
  },
  textContainer: {
    maxWidth: "85%",
  },
  centerText: {
    textAlign: "center",
  },
  generatorText: {
    textAlignVertical: "bottom",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    textAlign: "center",
    color: "white",
  },
  activityIndicatorContainer: {
    height: 200,
  },
  activityIndicator: {
    marginVertical: 25,
    marginBottom: 100,
  },
  actvityIndicatorSmall: {
    marginBottom: "10%",
    marginTop: 5,
  },
  tryAgainText: {
    fontSize: 30,
    color: "#283829",
    fontFamily: "JaroRegular",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: "10%",
  },
  emptyText: {
    fontSize: 30,
    color: "#283829",
    fontFamily: "JaroRegular",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: "10%",
  },
  bottomText: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  thanksText: {
    fontSize: 30,
    color: "#283829",
    fontFamily: "JaroRegular",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: "4%",
  },
  excludeText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "JaroRegular",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: "10%",
  },
  title: {
    fontSize: 30,
    color: "#283829",
    fontFamily: "JaroRegular",
    textTransform: "uppercase",
  },
});
