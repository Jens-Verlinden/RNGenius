import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, SafeAreaView } from "react-native";
import { Generator, Option, Participant } from "@/types";
import Category from "@/components/generatorInfo/category";
import { useGeneratorContext } from "../../generatorContext";
import OptionView from "@/components/generatorInfo/optionView";
import GeneratorView from "@/components/generatorInfo/generatorView";
import { useSession } from "@/app/authContext";

interface Category {
  category: string;
  options: Option[] | undefined;
}

export default function GeneratorInfoScreen() {
  const { id } = useLocalSearchParams();
  const { generators, refetchGenerators, loading } = useGeneratorContext();
  const [generator, setGenerator] = useState<Generator>();
  const [categories, setCategories] = useState<Category[]>();
  const [optionPage, setOptionPage] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<boolean>(false);
  const { session } = useSession();

  useEffect(() => {
    getGenerator();
  }, [generators, session]);

  const getGenerator = () => {
    const tempGenerator: Generator | undefined = generators.find(
      (generator: Generator) => generator.id === Number(id)
    );
    if (tempGenerator) {
      setGenerator(tempGenerator);
      getCategory(tempGenerator);
      setInitialNotifications(tempGenerator, Number(session));
    }
  };

  // Get the categories of the generator and storing them with their options
  const getCategory = (generator: Generator) => {
    const categories = [
      ...new Set(
        generator?.options.flatMap((option) => option.categories) || []
      ),
    ];

    // You are able to use a component and a props as a type without rendering it
    const tempCategories: Category[] = [];
    categories.forEach((category) => {
      const options = generator?.options.filter((option) =>
        option.categories.includes(category)
      );
      tempCategories.push({ category, options });
    });
    setCategories(
      tempCategories.sort((a, b) => a.category.localeCompare(b.category))
    );
  };

  const setInitialNotifications = (generator: Generator, id: number) => {
    const participant = generator.participants.find(
      (participant: Participant) => participant.user.id === id
    );

    if (participant?.notifications) {
      setNotifications(participant.notifications);
    }
  };

  if (generator)
    return (
      <SafeAreaView style={styles.background}>
        {optionPage ? (
          <OptionView
            generator={generator}
            categories={categories}
            refetchGenerators={refetchGenerators}
            loading={loading}
            setOptionPage={setOptionPage}
          />
        ) : (
          <GeneratorView
            generator={generator}
            refetchGenerators={refetchGenerators}
            setOptionPage={setOptionPage}
            currentNotifications={notifications}
          />
        )}
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#729E84",
  },
});
