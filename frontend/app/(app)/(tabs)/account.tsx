import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "./../../authContext";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
  Vibration,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "@/service/UserService";
import { SplashScreen } from "expo-router";
import QRCode from "react-native-qrcode-svg";

export default function TabAccount() {
  const { signOut } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [succeeded, setSucceeded] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const loaded = email && firstName && lastName;

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [email, firstName, lastName]);

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout on this device",
        style: "default",
        onPress: () => signOut(),
      },
      {
        text: "Logout on all devices",
        style: "destructive",
        onPress: () => logOutAllDevices(),
      },
    ]);
  };

  const logOutAllDevices = () => {
    try {
      UserService.callApiWithRefreshToken(
        signOut,
        UserService.logOutAllDevices
      );
      signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangePassword = useCallback(async () => {
    Vibration.vibrate(10);
    setSucceeded(null);
    setRequestError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setRequestError("All fields are required");
      setSucceeded(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setRequestError("Passwords do not match");
      setSucceeded(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        UserService.changePassword,
        currentPassword,
        newPassword
      );
      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSucceeded(true);
      } else {
        const data = await response.json();
        setRequestError(data.message);
        setSucceeded(false);
      }
    } catch (error) {
      console.error(error);
      setSucceeded(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  useEffect(() => {
    const loadUserData = async () => {
      const storedFirstName = await AsyncStorage.getItem("firstName");
      const storedLastName = await AsyncStorage.getItem("lastName");
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
    };
    loadUserData();
  }, [signOut]);

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.background}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            width: " 100%",
          }}
          style={{ width: "100%" }}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleLogout}
              accessibilityLabel="Click to logout"
            >
              <Ionicons name="log-out-outline" size={45} color="#C9BEBE" />
            </TouchableOpacity>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.nameText}>{`${firstName} ${lastName}`}</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.emailInput,
                activeField === "email" && styles.activeInput,
              ]}
              value={email}
              editable={false}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField(null)}
              accessibilityLabel="Email input field"
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={[styles.label, { marginBottom: 10 }]}>Password</Text>
            <View
              style={[
                styles.currentPasswordField,
                activeField === "currentPassword" && styles.activeInput,
              ]}
            >
              <TextInput
                style={styles.currentPasswordInput}
                placeholder="Current password"
                placeholderTextColor={"#FFFFFF"}
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                onFocus={() => setActiveField("currentPassword")}
                onBlur={() => setActiveField(null)}
                accessibilityLabel="Current password input field"
                autoComplete="password"
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                accessibilityLabel="Toggle current password visibility"
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#283829"
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.passwordField,
                activeField === "newPassword" && styles.activeInput,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="New password"
                placeholderTextColor={"#AD8F8F"}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => setActiveField("newPassword")}
                onBlur={() => setActiveField(null)}
                accessibilityLabel="New password input field"
                autoComplete="password"
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                accessibilityLabel="Toggle new password visibility"
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#283829"
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.passwordField,
                activeField === "confirmPassword" && styles.activeInput,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={"#AD8F8F"}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setActiveField("confirmPassword")}
                onBlur={() => setActiveField(null)}
                accessibilityLabel="Confirm password input field"
                autoComplete="password"
                autoCapitalize="none"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                {succeeded === true ? (
                  <Ionicons name="checkmark" size={24} color="#729E84" />
                ) : (
                  succeeded === false && (
                    <Ionicons name="close" size={28} color="#990000" />
                  )
                )}
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#283829"
                    accessibilityLabel="Loading"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={handleChangePassword}
                    accessibilityLabel="Save new password"
                  >
                    <Ionicons name="save" size={24} color="#283829" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {requestError !== "" && (
              <Text
                style={{
                  color: "#990000",
                  fontFamily: "JaroRegular",
                  fontSize: 15,
                  textAlign: "left",
                  paddingLeft: 20,
                }}
              >
                {requestError}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Show profile QR"
          >
            <FontAwesome name="qrcode" size={35} color="#ffffff" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      <Modal
        statusBarTranslucent
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <QRCode value={email} size={200} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#729E84",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 50,
    paddingTop: 35,
  },
  main: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 20,
    height: "90%",
    padding: 30,
    paddingTop: 0,
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 45,
    fontFamily: "JaroRegular",
    color: "#2B2B2B",
  },
  nameText: {
    fontSize: 35,
    color: "#2B2B2B",
    fontFamily: "JaroRegular",
    marginBottom: 20,
  },
  emailContainer: {
    width: "80%",
    marginBottom: 10,
  },
  label: {
    fontSize: 24,
    color: "white",
    fontFamily: "JaroRegular",
    paddingLeft: 15,
  },
  emailInput: {
    height: 40,
    opacity: 0.8,
    margin: 12,
    marginBottom: 0,
    marginTop: 5,
    borderWidth: 0,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#D9D9D9",
    color: "#283829",
    fontFamily: "JaroRegular",
    fontSize: 18,
  },
  passwordContainer: {
    width: "80%",
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E0E0E0",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    height: 40,
    margin: 12,
    marginTop: 5,
    borderWidth: 0,
    borderRadius: 15,
  },
  currentPasswordField: {
    color: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#C9BEBE",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    height: 40,
    margin: 12,
    marginTop: 0,
    borderWidth: 0,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#2B2B2B",
    fontFamily: "JaroRegular",
  },
  currentPasswordInput: {
    flex: 1,
    fontSize: 18,
    color: "#000000",
    fontFamily: "JaroRegular",
  },
  activeInput: {
    borderColor: "#AD8F8F",
    borderWidth: 2,
  },
  changePasswordButton: {
    color: "#283829",
    fontWeight: "bold",
    marginLeft: 10,
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 20,
    backgroundColor: "#283829",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 30,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
