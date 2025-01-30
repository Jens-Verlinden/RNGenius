import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { Result } from "@/types";
import { Href, router } from "expo-router";
import { getIconsDefault } from "@/utils/iconData";
import { useGeneratorContext } from "@/app/(app)/generatorContext";
import Feather from "@expo/vector-icons/Feather";

interface ResultProps {
  result: Result;
}

export default function ResultBox(props: ResultProps) {
  const { generators } = useGeneratorContext();

  const imgSource = getIconsDefault();

  const handleClick = () => {
    router.push(`/options/${props.result.generatorId}` as Href);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getGeneratorTitle = (id: number) => {
    const generator = generators.find((gen) => gen.id === id);
    return generator ? generator.title : "";
  };

  const getGeneratorIcon = (id: number) => {
    const generator = generators.find((gen) => gen.id === id);
    return generator ? generator.iconNumber : 0;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handleClick}
      accessibilityLabel="Click to go to the generator page"
    >
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(
                props.result.user.firstName,
                props.result.user.lastName
              )}
            </Text>
          </View>
          <Text
            style={styles.text}
          >{`${props.result.user.firstName} ${props.result.user.lastName}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>
            <Text style={styles.text}>generated: </Text>
            <Text style={[styles.text, { color: "#9A6262" }]}>
              "{props.result.option.name}"
            </Text>
          </Text>
        </View>
        <View style={styles.separator}></View>
        <View style={[styles.row, { paddingBottom: 10 }]}>
          <Image
            tintColor={"#AD8F8F"}
            style={styles.image}
            source={imgSource[getGeneratorIcon(props.result.generatorId)]}
          />
          <Text style={styles.subText}>
            {getGeneratorTitle(props.result.generatorId)}
          </Text>
        </View>
        <View style={styles.row}>
          <Feather name="calendar" size={24} color="#AD8F8F" />
          <Text style={styles.subText}>
            {props.result.dateTime
              ? `${new Date(props.result.dateTime).toLocaleDateString(
                  "en-GB"
                )} ${new Date(props.result.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}`
              : "Invalid Date"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#D9D9D9",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    flex: 1,
    backgroundColor: "#D9D9D9",
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 45,
    backgroundColor: "#283829",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontFamily: "JaroRegular",
    color: "#D9D9D9",
  },
  text: {
    fontSize: 20,
    color: "#283829",
    fontFamily: "JaroRegular",
  },
  subText: {
    fontSize: 16,
    color: "#AD8F8F",
    fontFamily: "JaroRegular",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    minWidth: "100%",
    backgroundColor: "#fff",
  },
  image: {
    width: 24,
    height: 24,
    shadowColor: "#AD8F8F",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 100,
    elevation: 50,
  },
});
