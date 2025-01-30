import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { Generator } from "@/types";
import { Href, router } from "expo-router";
import { getIconsDefault } from "@/utils/iconData";

interface GeneratorProps {
  generator: Generator;
  even: boolean;
}

function GenIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={styles.icon} {...props} />;
}

export default function GeneratorBox(props: GeneratorProps) {
  const imgSource = getIconsDefault();

  const handleClick = () => {
    router.push(`/options/${props.generator.id}` as Href);
  };

  return (
    // TouchableOpacity is a wrapper for making views respond properly to touches
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handleClick}
      accessibilityLabel="Click to go to the generator page"
    >
      <View
        style={[
          styles.box,
          { backgroundColor: props.even ? "#C9BEBE" : "#D9D9D9" },
        ]}
      >
        <View style={styles.innerBox}>
          <Image
            source={imgSource[props.generator.iconNumber]}
            style={styles.image}
            accessibilityLabel="Generator icon"
          />
          <Text style={styles.text}>{props.generator.title}</Text>
        </View>
        <GenIcon
          name="arrow-right"
          color={props.even ? "#FBEAEA" : "#AD8F8F"}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 10,
  },
  innerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: "#283829",
    fontFamily: "JaroRegular",
    maxWidth: "55%",
  },
  image: {
    width: 60,
    height: 60,
  },
  icon: {
    marginBottom: -3,
  },
});
