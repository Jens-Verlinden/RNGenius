import React, { useState, useEffect, useCallback } from "react";
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
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Dimensions
} from "react-native";
import { Href, useRouter, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import UserService from "@/service/UserService";
import { useGeneratorContext } from "./generatorContext";
import { GeneratorService } from "@/service/GeneratorService";
import { getIcons } from "@/utils/iconData";
import { useSession } from "../authContext";
import { Generator, Participant } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";

const iconData = getIcons();

export default function EditGeneratorScreen() {
  const { id } = useLocalSearchParams();
  const [generator, setGenerator] = useState<Generator>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconData[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingParticipantIds, setDeletingParticipantIds] = useState<
    number[]
  >([]);
  const [refreshingParticipantIds, setRefreshingParticipantIds] = useState<
    number[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const { generators, refetchGenerators, loading } = useGeneratorContext();
  const { signOut } = useSession();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [openCamera, setOpenCamera] = useState(false);
  const qrLock = React.useRef(false);
  const [dataSet, setDataSet] = useState(false);

  useEffect(() => {
    getGenerator();
  }, [generators]);

  const getGenerator = () => {
    const tempGenerator: Generator | undefined = generators.find(
      (generator: Generator) => generator.id === Number(id)
    );
    setGenerator(tempGenerator);
    if (tempGenerator) {
      if (!dataSet) {
        setTitle(tempGenerator.title);
        setSelectedIcon(iconData[tempGenerator.iconNumber - 1]);
        setDataSet(true);
      }
      setParticipants(
        tempGenerator.participants.filter(
          (participant: Participant) =>
            participant.user.id !== tempGenerator.user.id
        )
      );
    }
  };

  const handleIconSelect = (icon: any) => {
    setSelectedIcon(icon);
    setIsModalVisible(false);
  };

  const handleAddParticipant = useCallback(async (qrEmail?: string) => {
    setEmailError("");

    const emailInput = qrEmail ? qrEmail : email;

    if (emailInput.trim() === "") {
      setEmailError("Email is required");
      return;
    }
    if (emailInput.length > 50) {
      setEmailError("Email must be less than 50 characters");
      return;
    }

    try {
      setIsAdding(true);
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.addParticipant,
        id,
        emailInput
      );
      if (response.ok) {
        refetchGenerators();
        setEmail("");
        setRefreshing(true);
      } else {
        const data = await response.json();
        setEmailError(data.message);
        setIsAdding(false);
      }
    } catch (error) {
      console.error(error);
      setIsAdding(false);
    }
  }, [email, id, generator]);

  const handleDeleteParticipant = (participant: Participant) => {
    Alert.alert(
      "Delete Participant",
      `Are you sure you want to delete ${participant.user.firstName} ${participant.user.lastName}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteParticipant(participant),
        },
      ]
    );
  };

  const deleteParticipant = useCallback(
    async (participant: Participant) => {
      try {
        setDeletingParticipantIds((prev) => [...prev, participant.id]);
        const response = await UserService.callApiWithRefreshToken(
          signOut,
          GeneratorService.deleteParticipant,
          id,
          participant.user.id
        );
        if (response.ok) {
          setRefreshingParticipantIds((prev) => [...prev, participant.id]);
          refetchGenerators();
          setRefreshing(true);
        } else {
          setDeletingParticipantIds((prev) =>
            prev.filter((id) => id !== participant.id)
          );
        }
      } catch (error) {
        console.error(error);
        setDeletingParticipantIds((prev) =>
          prev.filter((id) => id !== participant.id)
        );
        setRefreshingParticipantIds((prev) =>
          prev.filter((id) => id !== participant.id)
        );
      }
    },
    [id, generator]
  );

  const handleDeleteGenerator = () => {
    Alert.alert(
      "Delete Generator",
      `Are you sure you want to delete ${generator?.title}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteGenerator(),
        },
      ]
    );
  };

  const deleteGenerator = async () => {
    try {
      setIsDeleting(true);
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.deleteGenerator,
        generator?.id
      );
      if (response.ok) {
        const cachedGenerators = await AsyncStorage.getItem("generators");
        if (cachedGenerators) {
          const generators = JSON.parse(cachedGenerators);
          const updatedGenerators = generators.map((generator: Generator) => {
            if (generator.id === Number(generator?.id)) {
              return null;
            }
            return generator;
          });
          await AsyncStorage.setItem(
            "generators",
            JSON.stringify(updatedGenerators)
          );
        }
        refetchGenerators();
        setRefreshing(true);
      } else {
        setIsDeleting(false);
      }
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  const handleUpdateGenerator = useCallback(async () => {
    Vibration.vibrate(10);
    setTitleError("");
    if (title.trim() === "") {
      setTitleError("Title is required");
      return;
    }
    if (title.length > 20) {
      setTitleError("Title must be less than 20 characters");
      return;
    }

    try {
      setIsSaving(true);
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.updateGenerator,
        generator?.id,
        title,
        iconData.indexOf(selectedIcon) + 1
      );
      if (response.ok) {
        refetchGenerators();
        setRefreshing(true);
      } else {
        const data = await response.json();
        setTitleError(data.message);
        setIsSaving(false);
      }
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  }, [title, selectedIcon, generator]);

  useEffect(() => {
    if (refreshing && !loading) {
      if (isSaving && !loading) {
        setIsSaving(false);
        router.replace(("/options/" + id) as Href);
      } else if (isDeleting && !loading) {
        setIsDeleting(false);
        router.replace("/" as Href);
      } else if (isAdding && !loading) {
        setIsAdding(false);
      } else if (setDeletingParticipantIds && !loading) {
        setDeletingParticipantIds(
          deletingParticipantIds.filter(
            (id) => !refreshingParticipantIds.includes(id)
          )
        );
        setRefreshingParticipantIds([]);
      }

      setRefreshing(false);
    }
  }, [loading]);

  const getDeviceWidth = () => {
    return Dimensions.get("window").width;
  };

  const openScanner = async () => {
    if (permission?.granted) {
      setOpenCamera(true);
    } else {
      await requestPermission();
      if (isPermissionGranted) {
        setOpenCamera(true);
      }
    }
  };

  useEffect(() => {
    if (!openCamera) {
      qrLock.current = false;
    }
  }, [openCamera]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {openCamera && (
          <>
            <CameraView
              style={[
                StyleSheet.absoluteFillObject,
                { position: "absolute", zIndex: 1 },
              ]}
              facing="back"
              onBarcodeScanned={({ data }) => {
                if (data && !qrLock.current) {
                  qrLock.current = true;
                  handleAddParticipant(data)
                  setOpenCamera(false);
                }
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpenCamera(false)}
              accessibilityLabel="Click to close the camera view"
            >
              <Text style={styles.xButtonText}>X</Text>
            </TouchableOpacity>
          </>
        )}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ width: "100%" }}
        >
          <View style={[styles.container, { paddingBottom: 170 }]}>
            <Text style={styles.headerText}>EDIT GENERATOR</Text>
            <Text style={styles.labelText}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. City trip"
              placeholderTextColor="#AD8F8F"
              value={title}
              onChangeText={setTitle}
              accessibilityLabel="Enter the title of the generator"
            />
            {titleError !== "" && (
              <Text style={styles.errorText}>{titleError}</Text>
            )}
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
              <View
                style={[
                  styles.participantRow,
                  { borderTopWidth: 0, paddingRight: getDeviceWidth() < 700 ? 5 : "5%" },
                ]}
              >
                <Text style={styles.participantText}>
                  {generator?.user.firstName} {generator?.user.lastName}
                </Text>
                <FontAwesome6 name="crown" size={20} color="#283829" />
              </View>
              {participants && (
                <FlatList
                  contentContainerStyle={{
                    alignItems: "flex-start",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    gap: 15,
                  }}
                  scrollEnabled={false}
                  data={participants}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <View key={index} style={styles.participantRow}>
                      <Text style={styles.participantText}>
                        {item.user.firstName} {item.user.lastName}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteParticipant(item)}
                        disabled={deletingParticipantIds.includes(item.id)}
                        accessibilityLabel={`Click to delete participant ${item.user.firstName} ${item.user.lastName}`}
                      >
                        {deletingParticipantIds.includes(item.id) ? (
                          <ActivityIndicator
                            size="small"
                            color="#9A6262"
                            accessibilityLabel="Loading"
                          />
                        ) : (
                          <FontAwesome name="trash" size={25} color="#9A6262" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
            </View>

            <Text style={styles.labelText}>Add Participant</Text>
            <View style={styles.addParticipantRow}>
              <TextInput
                style={[
                  styles.input,
                  { width: "100%", marginTop: 0, paddingRight: 85 },
                ]}
                numberOfLines={1}
                placeholder="Email"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                placeholderTextColor="#AD8F8F"
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="Enter the email of the participant"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.qrButton}
                onPress={openScanner}
                accessibilityLabel="Click to open the camera to scan an email QR"
              >
                <FontAwesome name="qrcode" size={30} color="#283829" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAddParticipant()}
                style={styles.addButton}
                disabled={isAdding}
                accessibilityLabel="Click to add participant"
              >
                {isAdding ? (
                  <ActivityIndicator
                    size="small"
                    color="#283829"
                    accessibilityLabel="Loading"
                  />
                ) : (
                  <FontAwesome name="plus" size={20} color="#283829" />
                )}
              </TouchableOpacity>
            </View>
            {emailError !== "" && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#9A6262" }]}
                onPress={handleDeleteGenerator}
                disabled={isDeleting}
                accessibilityLabel="Click to delete the generator"
              >
                {isDeleting ? (
                  <ActivityIndicator
                    size="small"
                    color="#D9D9D9"
                    accessibilityLabel="Loading"
                  />
                ) : (
                  <FontAwesome name="trash" size={30} color="#D9D9D9" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#729E84" }]}
                onPress={handleUpdateGenerator}
                disabled={isSaving}
                accessibilityLabel="Click to save the generator"
              >
                {isSaving ? (
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                accessibilityLabel="Click to close the modal"
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Pick Your Icon</Text>
            </View>
            <FlatList
              data={iconData}
              keyExtractor={(index) => index.toString()}
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
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: "#283829",
  },
  participantText: {
    color: "#283829",
    fontSize: 20,
    fontFamily: "JaroRegular",
    width: "90%",
  },
  addParticipantRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "91%",
  },
  addButton: {
    position: "absolute",
    right: 15,
  },
  qrButton: {
    position: "absolute",
    right: 45,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 90,
    position: "absolute",
    bottom: 50,
    width: "100%",
    marginBottom: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  errorText: {
    color: "#f43f5e",
    fontFamily: "JaroRegular",
    fontSize: 15,
    textAlign: "left",
    width: "88%",
    paddingTop: 5,
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
  closeButton: {
    position: "absolute",
    top: 20,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 10,
    zIndex: 2,
  },
  xButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
