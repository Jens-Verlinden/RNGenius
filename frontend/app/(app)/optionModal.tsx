import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Vibration,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useGeneratorContext } from "./generatorContext";
import { Generator } from "@/types";
import UserService from "@/service/UserService";
import { GeneratorService } from "@/service/GeneratorService";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useSession } from "../authContext";

export default function AddGeneratorScreen() {
  const { id } = useLocalSearchParams();
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { generators, refetchGenerators, loading } = useGeneratorContext();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropVisible, setIsDropVisible] = useState(false);
  const { signOut } = useSession();

  useEffect(() => {
    getGenerator();
  }, [generators]);

  const getGenerator = () => {
    const tempGenerator: Generator | undefined = generators.find(
      (generator: Generator) => generator.id === Number(id)
    );
    if (tempGenerator) {
      getCategory(tempGenerator);
    }
  };

  // Get the categories of the generator and storing them with their options
  const getCategory = (generator: Generator) => {
    let tempCategories = [
      ...new Set(
        generator?.options.flatMap((option) => option.categories) || []
      ),
    ];
    // merge categories with newCategories
    tempCategories = [...tempCategories, ...newCategories];
    setCategories(tempCategories);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === "") {
      return;
    }
    // Add when not already in the list
    if (
      !(newCategories.includes(newCategory) || categories.includes(newCategory))
    ) {
      setNewCategories((currentCategories) => [
        ...currentCategories,
        newCategory,
      ]);
      setCategories((currentCategories) => [...currentCategories, newCategory]);
      setSelectedCategories((currentSelectedCategories) => [
        ...currentSelectedCategories,
        newCategory,
      ]);
    }
    setNewCategory("");
    setIsModalVisible(false);
  };

  const handleAddOption = useCallback(async () => {
    Vibration.vibrate(10);
    setError("");
    setNameError("");
    setCategoryError("");

    let er = false;
    if (name.trim() === "") {
      setNameError("Name is required");
      er = true;
    }
    if (name.length > 20) {
      setNameError("Name is too long max 20 characters");
      er = true;
    }
    if (selectedCategories.length === 0) {
      setCategoryError("At least one category is required");
      er = true;
    }
    if (er) {
      return;
    }

    try {
      setAdding(true);
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.addOption,
        id,
        name,
        selectedCategories,
        description
      );

      if (response.ok) {
        refetchGenerators();
        setRefreshing(true);
      } else {
        const data = await response.json();
        setError(data.message);
        setAdding(false);
      }
    } catch (error) {
      console.error(error);
      setAdding(false);
    }
  }, [name, selectedCategories, description, router, refetchGenerators]);

  useEffect(() => {
    if (refreshing && !loading) {
      setAdding(false);
      setRefreshing(false);
      router.replace(("/options/" + id) as Href);
    }
  }, [loading]);

  // DropDownPicker text depending on the number of selected categories
  DropDownPicker.addTranslation("EN", {
    PLACEHOLDER: "Select an item",
    SEARCH_PLACEHOLDER: "Search for an item ...",
    SELECTED_ITEMS_COUNT_TEXT: {
      1: "1 catergory selected",
      n: "{count} catergories selected",
    },
    NOTHING_TO_SHOW: "",
  });

  DropDownPicker.setLanguage("EN");

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ width: "100%" }}
        >
          <View style={styles.container}>
            <Text style={styles.headerText}>ADD OPTION</Text>
            <Text style={styles.labelText}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Paris"
              placeholderTextColor="#AD8F8F"
              onChangeText={setName}
              accessibilityLabel="Input for option name"
            />
            {nameError !== "" && (
              <Text
                style={{
                  color: "#f43f5e",
                  fontFamily: "JaroRegular",
                  fontSize: 15,
                  textAlign: "left",
                  width: "88%",
                }}
              >
                {nameError}
              </Text>
            )}

            <Text style={[styles.labelText, { paddingTop: 10 }]}>Category</Text>

            <DropDownPicker
              items={categories.map((category) => ({
                label: category,
                value: category,
              }))}
              value={selectedCategories}
              containerStyle={styles.pickerContainer}
              style={styles.picker}
              labelStyle={styles.pickerLabel}
              multiple={true}
              // enable search when categories are more than 10
              searchable={categories.length > 5}
              setValue={(callback) => {
                // Update the selected categories state
                setSelectedCategories((currentSelectedCategories) => {
                  // Get the new value by calling the callback with the current selected category
                  const newValue = callback(currentSelectedCategories);

                  // If the new value is an array, return it as a string array
                  if (Array.isArray(newValue)) {
                    return newValue as string[];
                    // If the new value is a non-null string, return it as an array containing that string
                  } else if (
                    newValue !== null &&
                    typeof newValue === "string"
                  ) {
                    return [newValue as string];
                  }

                  // If the new value is neither an array nor a non-null string, return the current selected category
                  return currentSelectedCategories;
                });
              }}
              open={isDropVisible}
              setOpen={setIsDropVisible}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.optionText}
              placeholderStyle={{
                color: "#283829",
                fontFamily: "JaroRegular",
                fontSize: 18,
              }}
              searchContainerStyle={{
                borderBottomColor: "#283829",
                backgroundColor: "#729E84",
                borderBottomWidth: 1,
              }}
              searchTextInputStyle={{
                color: "#d9d9d9",
                fontFamily: "JaroRegular",
                fontSize: 18,
                borderColor: "#283829",
                borderWidth: 0,
                paddingLeft: 0,
              }}
              searchPlaceholderTextColor="#ffe"
              ArrowUpIconComponent={() => (
                <FontAwesome
                  name="chevron-up"
                  size={18}
                  color={categories.length === 0 ? "#D9D9D9" : "#AD8F8F"}
                />
              )}
              ArrowDownIconComponent={() => (
                <FontAwesome
                  name="chevron-down"
                  size={18}
                  color={categories.length === 0 ? "#D9D9D9" : "#AD8F8F"}
                />
              )}
              TickIconComponent={() => (
                <FontAwesome name="check" size={18} color="#283829" />
              )}
              selectedItemLabelStyle={styles.selectedItemLabel}
              listMode="SCROLLVIEW"
              disabled={categories.length === 0}
              placeholder={
                categories.length === 0
                  ? "No categories yet..."
                  : "Select an item"
              }
            />
            {categoryError !== "" && (
              <Text
                style={{
                  color: "#f43f5e",
                  fontFamily: "JaroRegular",
                  fontSize: 15,
                  textAlign: "left",
                  width: "88%",
                }}
              >
                {categoryError}
              </Text>
            )}

            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.circle}
                onPress={() => setIsModalVisible(true)}
                accessibilityLabel="Click to add a new category"
              >
                <FontAwesome name="plus" size={32} color="#D9D9D9" />
              </TouchableOpacity>
            </View>

            <Text style={styles.labelText}>Description</Text>
            <TextInput
              style={[styles.input, { height: 150, textAlignVertical: "top" }]}
              placeholder="E.g. Tropical honeymoon"
              placeholderTextColor="#AD8F8F"
              multiline={true}
              scrollEnabled={true}
              onChangeText={setDescription}
              accessibilityLabel="Input for option description"
            />

            {error !== "" && (
              <Text
                style={{
                  color: "#f43f5e",
                  fontFamily: "JaroRegular",
                  fontSize: 15,
                  textAlign: "left",
                  width: "88%",
                  paddingTop: 5,
                }}
              >
                {error}
              </Text>
            )}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddOption}
                disabled={adding}
                accessibilityLabel="Click to add the option"
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
          accessibilityLabel="Click to close the modal"
        >
          <View style={styles.modalBox}>
            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                alignItems: "baseline",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                accessibilityLabel="Click to close the modal"
              >
                <FontAwesome name="close" size={28} color="#C3A6A6" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add New Category</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="E.g. Thriller"
              placeholderTextColor="#AD8F8F"
              value={newCategory}
              onChangeText={setNewCategory}
              accessibilityLabel="Input for new category name"
            />
            <TouchableOpacity
              onPress={handleAddCategory}
              accessibilityLabel="Click to add the new category"
            >
              <Text
                style={[
                  styles.addButonModal,
                  { color: newCategory ? "#fff" : "#D9D9D9" },
                ]}
              >
                ADD
              </Text>
            </TouchableOpacity>
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
  },
  input: {
    width: "91%",
    height: 40,
    marginTop: 5,
    marginBottom: 10,
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
  pickerContainer: {
    height: 50,
    width: "91%",
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "#D9D9D9",
    borderRadius: 15,
    borderWidth: 0,
  },
  pickerLabel: {
    fontFamily: "JaroRegular",
    fontSize: 18,
    color: "#283829",
  },
  dropdownContainer: {
    backgroundColor: "#99BAA8",
    borderWidth: 0,
  },
  optionText: {
    fontFamily: "JaroRegular",
    fontSize: 20,
    color: "#fff",
  },
  selectedItemLabel: {
    color: "#283829",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "88%",
    marginLeft: 35,
    marginRight: 35,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  selectedIcon: {
    width: 35,
    height: 35,
  },
  iconEditButton: {
    marginLeft: 10,
  },
  editText: {
    color: "#C3A6A6",
    fontSize: 16,
  },
  participantBox: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#D9D9D9",
    marginBottom: 40,
    width: "91%",
    marginLeft: 35,
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
    bottom: 20,
    marginTop: 70,
    marginBottom: 20,
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
  closeButtonText: {
    fontSize: 20,
    color: "#333",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "JaroRegular",
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
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    backgroundColor: "#729E84",
    borderColor: "#D9D9D9",
    elevation: 5,
  },
  addButonModal: {
    backgroundColor: "#AD8F8F",
    color: "#D9D9D9",
    fontSize: 20,
    fontFamily: "JaroRegular",
    padding: 10,
    borderRadius: 15,
  },
});
