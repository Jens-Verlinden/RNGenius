import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, Href } from "expo-router";
import { Generator, Participant } from "@/types";
import { getIconsDefault } from "@/utils/iconData";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GeneratorService } from "@/service/GeneratorService";
import UserService from "@/service/UserService";
import { useSession } from "@/app/authContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import React from "react";

interface GeneratorViewProps {
  generator: Generator;
  refetchGenerators: () => void;
  setOptionPage: React.Dispatch<React.SetStateAction<boolean>>;
  currentNotifications: boolean;
}

export default function GeneratorView(props: GeneratorViewProps) {
  const [notifications, setNotifications] = useState<boolean>(
    props.currentNotifications
  );
  const [isLoadingBell, setIsLoadingBell] = useState<boolean>(false);
  const { signOut, session, isLoading } = useSession();
  const imgSource = getIconsDefault();

  const handleToggleNotifications = async () => {
    setIsLoadingBell(true);

    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.toggleNotifications,
        props.generator.id
      );
      if (response) {
        setNotifications(!notifications);

        const cachedGenerators = await AsyncStorage.getItem("generators");
        if (cachedGenerators) {
          const generators = JSON.parse(cachedGenerators);
          const updatedGenerators = generators.map((generator: Generator) => {
            return {
              ...generator,
              particpants: generator.participants.map(
                (participant: Participant) => {
                  if (participant.user.id === Number(session)) {
                    return {
                      ...participant,
                      notifications: !participant.notifications,
                    };
                  }
                  return participant;
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
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }

    setIsLoadingBell(false);
  };

  return (
    <View
      style={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingTop: "8%",
      }}
    >
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => router.navigate("/")}
          accessibilityLabel="Click to go back to the generator page"
        >
          <FontAwesome name="chevron-left" size={35} color="#283829" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.back}
          onPress={handleToggleNotifications}
          accessibilityLabel="toggle notifications"
        >
          <View style={styles.centerBell}>
            {isLoading || isLoadingBell ? (
              <ActivityIndicator size={30} color="#283829" />
            ) : notifications ? (
              <FontAwesome6 name="bell" size={30} color="#283829" />
            ) : (
              <FontAwesome6 name="bell-slash" size={30} color="#283829" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {props.generator && (
        <>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 80, height: 80, marginBottom: 10, marginTop: 30 }}
              source={imgSource[props.generator.iconNumber]}
              accessibilityLabel="Generator icon"
            />
            <View style={{ maxWidth: "70%" }}>
              <Text
                style={[
                  styles.title,
                  {
                    textAlignVertical: "bottom",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    textAlign: "center",
                  },
                ]}
              >
                {props.generator?.title}
              </Text>
            </View>
            <View style={styles.nav}>
              <View
                style={{
                  backgroundColor: "#283829",
                  borderBottomLeftRadius: 12,
                  borderTopLeftRadius: 12,
                  overflow: "hidden",
                  width: "50%",
                  height: "102%",
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    width: "100%",
                    fontFamily: "JaroRegular",
                    textAlign: "center",
                    fontSize: 20,
                    color: "#D9D9D9",
                  }}
                >
                  Generate
                </Text>
              </View>
              <Text
                onPress={() => props.setOptionPage(true)}
                style={{
                  color: "#283829",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  width: "50%",
                  fontFamily: "JaroRegular",
                  textAlign: "center",
                  fontSize: 20,
                }}
              >
                Options
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                router.navigate(("/roulette/" + props.generator.id) as Href)
              }
              activeOpacity={0.5}
              accessibilityLabel="Navigate to roulette"
            >
              <Image
                style={[styles.diceImage, styles.shadow]}
                resizeMode="contain"
                source={require("../../assets/images/logo_shadow.png")}
                accessibilityLabel="RNGenius Logo"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#99BAA8",
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
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  generateButton: {
    padding: 10,
    backgroundColor: "#729E84",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#D9D9D9",
    fontSize: 20,
    fontFamily: "JaroRegular",
  },
  diceImage: {
    width: 230,
    height: 230,
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
  centerBell: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});
