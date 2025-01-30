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
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");
  const { signIn } = useSession();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    let valid: boolean = true;

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFirstNameError("");
    setLastNameError("");

    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    }

    if (password === "") {
      setPasswordError("Password is required");
      valid = false;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    }

    if (firstName.trim() === "") {
      setFirstNameError("First name is required");
      valid = false;
    }

    if (lastName.trim() === "") {
      setLastNameError("Last name is required");
      valid = false;
    }

    return valid;
  };

  const handleRegister = useCallback(async () => {
    Vibration.vibrate(10);
    setServerError("");

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.register(
        firstName,
        lastName,
        email,
        password
      );

      if (response.status === 200) {
        router.replace("/" as Href);
      } else {
        const data = await response.json();
        setServerError(data.message);
      }
    } catch (error) {
      console.error(error);
      setServerError(
        "Could not connect to the server. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, password, confirmPassword, firstName, lastName, signIn]);

  const handlePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prevState) => !prevState);
  }, []);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
  }, []);

  const handleFirstNameChange = useCallback((text: string) => {
    setFirstName(text);
  }, []);

  const handleLastNameChange = useCallback((text: string) => {
    setLastName(text);
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.background}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            width: " 100%",
          }}
          style={{ width: "100%" }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.logo}
              source={require("@/assets/images/logo.png")}
              accessibilityLabel="RNGenius logo"
            />
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
                accessibilityLabel="Email input"
              />
              {emailError !== "" && (
                <Text
                  style={{
                    color: "#f43f5e",
                    fontFamily: "JaroRegular",
                    fontSize: 15,
                    paddingLeft: 15,
                    paddingBottom: 15,
                  }}
                >
                  {emailError}
                </Text>
              )}
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[
                  styles.input,
                  activeField === "firstName" && styles.activeInput,
                ]}
                onChangeText={handleFirstNameChange}
                value={firstName}
                autoCorrect={false}
                autoComplete="given-name"
                onFocus={() => setActiveField("firstName")}
                onBlur={() => setActiveField(null)}
                accessibilityLabel="First name input"
              />
              {firstNameError !== "" && (
                <Text
                  style={{
                    color: "#f43f5e",
                    fontFamily: "JaroRegular",
                    fontSize: 15,
                    paddingLeft: 15,
                    paddingBottom: 15,
                  }}
                >
                  {firstNameError}
                </Text>
              )}
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[
                  styles.input,
                  activeField === "lastName" && styles.activeInput,
                ]}
                onChangeText={handleLastNameChange}
                value={lastName}
                autoCorrect={false}
                autoComplete="family-name"
                onFocus={() => setActiveField("lastName")}
                onBlur={() => setActiveField(null)}
                accessibilityLabel="Last name input"
              />
              {lastNameError !== "" && (
                <Text
                  style={{
                    color: "#f43f5e",
                    fontFamily: "JaroRegular",
                    fontSize: 15,
                    paddingLeft: 15,
                    paddingBottom: 15,
                  }}
                >
                  {lastNameError}
                </Text>
              )}
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  activeField === "password" && styles.activeInput,
                ]}
              >
                <TextInput
                  style={[
                    styles.passwordInput,
                    activeField === "password" && styles.activeInput,
                    { flex: 1, borderWidth: 0 },
                  ]}
                  onChangeText={handlePasswordChange}
                  value={password}
                  autoCorrect={false}
                  secureTextEntry={!isPasswordVisible}
                  autoComplete="password"
                  autoCapitalize="none"
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField(null)}
                  accessibilityLabel="Password input"
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
                <Text
                  style={{
                    color: "#f43f5e",
                    fontFamily: "JaroRegular",
                    fontSize: 15,
                    paddingLeft: 15,
                    paddingBottom: 15,
                  }}
                >
                  {passwordError}
                </Text>
              )}
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  activeField === "confirmPassword" && styles.activeInput,
                ]}
                onChangeText={handleConfirmPasswordChange}
                value={confirmPassword}
                autoCorrect={false}
                secureTextEntry={true}
                autoComplete="password"
                autoCapitalize="none"
                onFocus={() => setActiveField("confirmPassword")}
                onBlur={() => setActiveField(null)}
                accessibilityLabel="Confirm password input"
              />
              {confirmPasswordError !== "" && (
                <Text
                  style={{
                    color: "#f43f5e",
                    fontFamily: "JaroRegular",
                    fontSize: 15,
                    paddingLeft: 15,
                    paddingBottom: 15,
                  }}
                >
                  {confirmPasswordError}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                gap: 10,
              }}
            >
              <View style={{ height: 50, justifyContent: "center" }}>
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    accessibilityLabel="Loading"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={handleRegister}
                    activeOpacity={0.6}
                    disabled={isLoading}
                    accessibilityLabel="Register button"
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>MAKE ACCOUNT!</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {serverError !== "" && (
                <Text
                  style={{
                    color: "#f43f5e",
                    fontFamily: "JaroRegular",
                    fontSize: 20,
                    textAlign: "center",
                    paddingBottom: 5,
                  }}
                >
                  {serverError}
                </Text>
              )}

              <Link
                href="/signIn"
                style={styles.link}
                accessibilityLabel="Already have an account? Click to sign in"
              >
                Alreay have an account?
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#283829",
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
    margin: 8,
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
    margin: 8,
    borderRadius: 15,
    backgroundColor: "#D9D9D9",
  },
  visibilityButton: {
    paddingRight: 10,
  },
  logo: {
    width: 80,
    height: 90,
    marginBottom: 10,
    marginTop: 30,
  },
  link: {
    color: "#fff",
    fontFamily: "JaroRegular",
    fontSize: 20,
    marginTop: 12,
    textDecorationLine: "underline",
    paddingBottom: 20,
  },
});
