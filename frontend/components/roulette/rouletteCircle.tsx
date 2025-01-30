import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Vibration } from "react-native";
import { Audio } from "expo-av";
import { Option } from "@/types";
import React from "react";

interface GeneratingScreenProps {
  options: Option[];
  targetIndex: number;
  setGenerated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GeneratingScreen(props: GeneratingScreenProps) {
  const [currentOption, setCurrentOption] = useState(props.options[0]);
  const [rolling, setRolling] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [countdown, setCountdown] = useState(3);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const minSpins = 30;
  let spinCount = 0;

  async function playSound(file: string) {
    let soundFile;
    if (file === "beep.mp3") {
      soundFile = require("../../assets/sounds/beep.mp3");
    } else if (file === "boop.mp3") {
      soundFile = require("../../assets/sounds/boop.mp3");
    }
    // Sound is loaded and played in the same function to prevent multiple sounds from playing at the same time
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          // Unload the sound after a soundfile was loaded so it isn't loaded multiple times
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (countdown > 0) {
      playSound("beep.mp3");
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      playSound("boop.mp3");
      const timer = setTimeout(() => {
        setRolling(true);
        setCountdown(-1); // Ensure "GO" disappears after rolling starts
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    let interval: any;
    if (rolling) {
      interval = setInterval(() => {
        spinCount++;
        setCurrentOption((prevOption) => {
          const currentIndex = props.options.findIndex(
            (option) => option.id === prevOption.id
          );
          const nextIndex = (currentIndex + 1) % props.options.length;

          // Stop the roulette when the minimum amount of spins is reached and the target index is reached
          if (spinCount >= minSpins && nextIndex === props.targetIndex) {
            setRolling(false);
            clearInterval(interval); // Stop rolling interval
            Vibration.vibrate([0, 500, 100, 500]); // Vibrate twice with a 100ms pause in between
            setTimeout(() => props.setGenerated(true), 1000); // Set generated to true after 1 second
          }
          return props.options[nextIndex];
        });

        Animated.timing(animatedValue, {
          toValue: 1, // Animate to the value 1
          duration: 100, // Duration of the animation in milliseconds
          useNativeDriver: true, // Use the native driver for better performance
        }).start(() => {
          // Callback function to be executed after the animation completes
          animatedValue.setValue(0); // Reset the animated value to 0
        });
      }, 100);
    } else if (!rolling && interval) {
      clearInterval(interval); // Stop interval wanneer niet meer moet rollen
    }
    return () => clearInterval(interval);
  }, [rolling]);

  // Define the visible options for the roulette as the current option and the options before and after it
  const getVisibleOptions = () => {
    const currentIndex = props.options.findIndex(
      (option) => option.id === currentOption.id
    );
    return [
      // Add the length or the index can be negative to get the correct index
      props.options[
        (currentIndex - 1 + props.options.length) % props.options.length
      ],
      currentOption,
      props.options[(currentIndex + 1) % props.options.length],
    ];
  };

  const getItemStyle = (index: number) => {
    // Interpolate the animated value to get the scale, translateY and opacity of the item based on the index in the visible options
    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        index === 0 ? 0.85 : index === 1 ? 1 : 0.85,
        index === 0 ? 0.7 : index === 1 ? 0.85 : 1,
      ],
    });

    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        index === 0 ? -40 : index === 1 ? 0 : 40,
        index === 0 ? -80 : index === 1 ? -40 : 0,
      ],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        index === 0 ? 0.5 : index === 1 ? 1 : 0.5,
        index === 0 ? 0 : index === 1 ? 0.5 : 1,
      ],
    });

    console.info(index, 'has the following properties: ', 'scale', scale, 'translateY', translateY, 'opacity', opacity);

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        {countdown > 0 ? (
          <Text style={styles.countdownText}>{countdown}</Text>
        ) : countdown === 0 ? (
          <Text style={styles.countdownText}>GO!</Text>
        ) : (
          <>
            <View style={styles.slotWindow}>
              <View style={styles.perspective}>
                <Animated.View style={styles.optionsContainer}>
                  {getVisibleOptions().map((option, index) => (
                    <Animated.Text
                      key={`${option.id}-${index}`}
                      style={[
                        styles.option,
                        index === 1 && styles.currentOption,
                        getItemStyle(index),
                        { flexShrink: 1, minWidth: 0 },
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {option.name}
                    </Animated.Text>
                  ))}
                </Animated.View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  circle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 150,
    backgroundColor: "white",
    shadowColor: "#000",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  slotWindow: {
    height: 200,
    width: 250,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  perspective: {
    height: "100%",
    justifyContent: "center",
  },
  optionsContainer: {
    position: "relative",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    position: "absolute",
    fontSize: 32,
    textAlign: "center",
    width: "100%",
    color: "#2",
    flexShrink: 1,
    paddingHorizontal: 15,
    fontWeight: "thin",
    fontFamily: "JaroRegular",
  },
  currentOption: {
    fontSize: 36,
    flexShrink: 1,
    fontFamily: "JaroRegular",
    color: "#283829",
  },
  fadingEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 125,
    zIndex: 1,
  },
  countdownText: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#283829",
  },
});
