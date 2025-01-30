import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { Href, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import UserService from "@/service/UserService";
import { useGeneratorContext } from "./generatorContext";
import { GeneratorService } from "@/service/GeneratorService";
import { getIcons } from "@/utils/iconData";
import { useSession } from "../authContext";

const iconData = getIcons();

export default function AddGeneratorScreen() {
  const [selectedIcon, setSelectedIcon] = useState(iconData[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [adding, setIsAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refetchGenerators, loading } = useGeneratorContext();
  const { signOut } = useSession();

  const handleIconSelect = (icon: any) => {
    setSelectedIcon(icon);
    setIsModalVisible(false);
  };

  const handleAddGenerator = useCallback(async () => {
    Vibration.vibrate(10);
    setError("");
    if (title.trim() === "") {
      setError("Title is required");
      return;
    }
    if (title.length > 20) {
      setError("Title must be less than 20 characters");
      return;
    }

    try {
      setIsAdding(true);
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.addGenerator,
        title,
        iconData.indexOf(selectedIcon) + 1
      );

      if (response.ok) {
        refetchGenerators();
        setRefreshing(true);
      } else {
        const data = await response.json();
        setError(data.message);
        setIsAdding(false);
      }
    } catch (error) {
      console.error(error);
      setIsAdding(false);
    }
  }, [title, selectedIcon, router, refetchGenerators]);

  useEffect(() => {
    if (refreshing && !loading) {
      setIsAdding(false);
      setRefreshing(false);
      router.replace("/" as Href);
    }
  }, [loading]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headerText}>ADD GENERATOR</Text>
        <Text style={styles.labelText}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g. City trip"
          placeholderTextColor="#AD8F8F"
          value={title}
          onChangeText={setTitle}
          accessibilityLabel="Enter the title of the generator"
        />
        {error !== "" && <Text style={styles.errorText}>{error}</Text>}
        <Text style={styles.labelText}>Icon</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <Image source={selectedIcon} style={styles.selectedIcon} />
          </View>
          <TouchableOpacity
            style={styles.iconEditButton}
            onPress={() => setIsModalVisible(true)}
            accessibilityLabel="Click to select an icon"
          >
            <FontAwesome name="pencil" size={32} color="#C3A6A6" />
          </TouchableOpacity>
        </View>
        <Text style={styles.labelText}>Participants</Text>
        <View style={styles.participantBox}>
          <Text style={styles.participantText}>You</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddGenerator}
          disabled={adding}
          accessibilityLabel="Click to add the generator"
        >
          {adding ? (
            <ActivityIndicator
              size="small"
              color="#D9D9D9"
              accessibilityLabel="Loading"
            />
          ) : (
            <FontAwesome name="download" size={30} color="#D9D9D9" />
          )}
        </TouchableOpacity>
      </View>
      <Modal
        statusBarTranslucent
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
          accessibilityLabel="Click to close the icon selection modal"
        >
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Pick Your Icon</Text>
            </View>
            <FlatList
              data={iconData}
              keyExtractor={(item, index) => index.toString()}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleIconSelect(item)}
                  style={styles.iconOption}
                  accessibilityLabel="Click to select this icon"
                >
                  <Image source={item} style={styles.icon} />
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#283829",
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 70,
  },
  headerText: {
    fontSize: 40,
    marginBottom: 20,
    color: "#D9D9D9",
    fontFamily: "JaroRegular",
  },
  labelText: {
    fontSize: 24,
    color: "#D9D9D9",
    fontFamily: "JaroRegular",
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    width: "91%",
    height: 40,
    marginTop: 5,
    marginLeft: 35,
    marginRight: 35,
    borderWidth: 0,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#D9D9D9",
    fontFamily: "JaroRegular",
    fontSize: 20,
    color: "#283829",
  },
  errorText: {
    color: "#f43f5e",
    fontFamily: "JaroRegular",
    fontSize: 15,
    textAlign: "left",
    width: "88%",
    paddingTop: 5,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "88%",
    marginTop: 5,
    marginLeft: 35,
    marginRight: 35,
    justifyContent: "flex-start",
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
  },
  selectedIcon: {
    width: 35,
    height: 35,
  },
  iconEditButton: {
    marginLeft: 10,
  },
  participantBox: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#D9D9D9",
    marginBottom: 30,
    width: "91%",
    marginLeft: 35,
    marginTop: 5,
    marginRight: 35,
    opacity: 0.9,
  },
  participantText: {
    color: "#AD8F8F",
    fontSize: 20,
    fontFamily: "JaroRegular",
  },
  addButton: {
    width: 70,
    height: 70,
    position: "absolute",
    bottom: "10%",
    borderRadius: 35,
    backgroundColor: "#729E84",
    borderColor: "#D9D9D9",
    borderWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  addButonText: {
    color: "#D9D9D9",
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    width: "100%",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#333",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "JaroRegular",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  iconOption: {
    margin: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
