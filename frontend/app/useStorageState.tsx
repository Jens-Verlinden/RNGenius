import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Define a custom hook type that returns a state tuple and a setter function
type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

// Custom hook to manage asynchronous state, differs from useState because it returns the synchronaus state of the state value
function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    // Reducer function to update the state
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

// Function to set an item in storage (localStorage for web, SecureStore for other platforms)
export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key); // Remove item if value is null
      } else {
        localStorage.setItem(key, value); // Set item in localStorage
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key); // Delete item from SecureStore
    } else {
      await SecureStore.setItemAsync(key, value); // Set item in SecureStore
    }
  }
}

export async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key); // Get item from localStorage
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    return SecureStore.getItemAsync(key); // Get item from SecureStore
  }
  return null;
}

// Custom hook to manage state with storage differs from useState
export function useStorageState(key: string): UseStateHook<string> {
  // Public state and setter
  const [state, setState] = useAsyncState<string>();

  // Get item from storage on component mount
  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key)); // Get item from localStorage
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    } else {
      SecureStore.getItemAsync(key).then((value) => {
        setState(value); // Get item from SecureStore and set it with the async state
      });
    }
  }, [key]);

  // Set item in storage and update state, a function memorized as a callback of which the logic only will be update on change of the key
  const setValue = useCallback(
    (value: string | null) => {
      setState(value); // Update state
      setStorageItemAsync(key, value); // Set item in storage
    },
    [key]
  );

  return [state, setValue];
}
