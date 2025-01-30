import React, { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Href, router } from "expo-router";
import { Link } from "expo-router";
import { useSession } from "./authContext";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import UserService from "@/service/UserService";
import { setStorageItemAsync } from "./useStorageState";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");
  const { signIn } = useSession();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    let valid: boolean = true;

    setEmailError("");
    setPasswordError("");

    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    }

    if (password === "") {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = useCallback(async () => {
    Vibration.vibrate(10);
    setServerError("");

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.login(email, password);
      const data = await response.json();

      if (response.status === 200) {
        setStorageItemAsync("accessToken", data.accessToken);
        setStorageItemAsync("refreshToken", data.refreshToken);
        AsyncStorage.setItem("email", data.email);
        AsyncStorage.setItem("firstName", data.firstName);
        AsyncStorage.setItem("lastName", data.lastName);
        signIn(data.id);
        router.replace("/" as Href);
      } else {
        setServerError(data.message);
      }
    } catch (error) {
      setServerError(
        "Could not connect to the server. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, password, signIn]);

  const handlePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prevState) => !prevState);
  }, []);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const [loaded, error] = useFonts({
    JaroRegular: require("@/assets/fonts/JaroRegular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.background}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("@/assets/images/logo.png")}
              accessibilityLabel="RNGenius Logo"
            />
            <Text style={styles.title}>RNGenius</Text>
          </View>
          <View style={styles.fields}>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  activeField === "email" && styles.activeInput,
                ]}
                onChangeText={handleEmailChange}
                value={email}
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                accessibilityLabel="Enter your email address"
              />
              {emailError !== "" && (
                <Text style={styles.errorText}>{emailError}</Text>
              )}
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  activeField === "password" && styles.activeInput,
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { flex: 1, borderWidth: 0 }]}
                  onChangeText={handlePasswordChange}
                  value={password}
                  autoCorrect={false}
                  secureTextEntry={!isPasswordVisible}
                  autoComplete="password"
                  autoCapitalize="none"
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField(null)}
                  accessibilityLabel="Enter your password"
                />
                <TouchableOpacity
                  onPress={handlePasswordVisibility}
                  style={styles.visibilityButton}
                  accessibilityLabel="Toggle password visibility"
                >
                  <Ionicons
                    autoCorrect={false}
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#283829"
                  />
                </TouchableOpacity>
              </View>
              {passwordError !== "" && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <TouchableOpacity
                    onPress={handleLogin}
                    activeOpacity={0.6}
                    disabled={isLoading}
                    accessibilityLabel="Click to log in"
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>GO GENERATE!</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {serverError !== "" && (
                <Text style={styles.serverErrorText}>{serverError}</Text>
              )}
              <Link
                href="/register"
                style={styles.registerLink}
                accessibilityLabel="Click to register"
              >
                REGISTER
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#283829",
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 110,
    height: 125,
    marginBottom: 10,
    marginTop: 50,
  },
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#243829",
    height: "100%",
    margin: 0,
  },
  fields: {
    width: "80%",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    color: "#D9D9D9",
    fontFamily: "JaroRegular",
  },
  label: {
    fontSize: 24,
    color: "#D9D9D9",
    fontFamily: "JaroRegular",
    paddingLeft: 15,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#D9D9D9",
    color: "#283829",
    fontFamily: "JaroRegular",
    fontSize: 18,
  },
  passwordInput: {
    height: 40,
    borderWidth: 0,
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#D9D9D9",
    color: "#283829",
    fontFamily: "JaroRegular",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#AD8F8F",
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "JaroRegular",
    fontSize: 20,
  },
  activeInput: {
    borderColor: "#AD8F8F",
    borderWidth: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    borderRadius: 15,
    backgroundColor: "#D9D9D9",
  },
  visibilityButton: {
    paddingRight: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  buttonWrapper: {
    height: 50,
    justifyContent: "center",
  },
  errorText: {
    color: "#f43f5e",
    fontFamily: "JaroRegular",
    fontSize: 15,
    paddingLeft: 15,
    paddingBottom: 15,
  },
  serverErrorText: {
    color: "#f43f5e",
    fontFamily: "JaroRegular",
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 5,
  },
  registerLink: {
    color: "#fff",
    fontFamily: "JaroRegular",
    fontSize: 20,
    marginTop: 12,
    textDecorationLine: "underline",
    paddingBottom: 20,
  },
});
