import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "@/service/UserService";
import { GeneratorService } from "@/service/GeneratorService";
import { Generator, Result } from "@/types";
import { useSession } from "../authContext";

interface GeneratorContextProps {
  generators: Generator[];
  results: Result[];
  generatorError: string;
  resultError: string;
  refetchGenerators: () => void;
  latestRetrievedResult: Date;
  checkingResults: React.Dispatch<React.SetStateAction<boolean>>;
  latestCheckedResult: Date;
  setLatestCheckedResult: React.Dispatch<React.SetStateAction<Date>>;
  loading: boolean;
}

const GeneratorContext = createContext<GeneratorContextProps | undefined>(
  undefined
);

// Provider for the generator context which fetches the user's generators and stores them in the context, it returns the generators, the error message and a function to refetch them
export const GeneratorProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [generatorError, setGeneratorError] = useState("");
  const [resultError, setResultError] = useState("");
  const [latestCheckedResult, setLatestCheckedResult] = useState<Date>(
    new Date(+0)
  );
  const [latestRetrievedResult, setLatestRetrievedResult] = useState<Date>(
    new Date(+0)
  );
  const [isCheckingResults, setIsCheckingResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signOut } = useSession();

  useEffect(() => {
    if (isCheckingResults) {
      setLatestCheckedResult(latestRetrievedResult);
    }
  }, [isCheckingResults]);

  const setCachedLatestCheckedResult = async () => {
    const latestResult = await AsyncStorage.getItem("latestCheckedResult");
    setLatestCheckedResult(
      latestResult
        ? new Date(new Date(latestResult).toString().slice(0, 24))
        : new Date(+0)
    );
  };

  useEffect(() => {
    setCachedLatestCheckedResult();
  }, []);

  useEffect(() => {
    if (latestCheckedResult) {
      AsyncStorage.setItem(
        "latestCheckedResult",
        latestCheckedResult.toString()
      );
    }
  }, [latestCheckedResult]);

  const getGenerators = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.myGenerators
      );
      if (response.ok) {
        const generatorData = await response.json();
        setGeneratorError("");
        setGenerators(generatorData);
        AsyncStorage.setItem("generators", JSON.stringify(generatorData));
      } else {
        const value = await AsyncStorage.getItem("generators");
        if (value !== null) {
          setGenerators(JSON.parse(value));
        } else {
          setGeneratorError("Something went wrong, please try again later.");
        }
      }
    } catch (error) {
      const cachedGenerators = await AsyncStorage.getItem("generators");
      if (cachedGenerators !== null) {
        setGenerators(JSON.parse(cachedGenerators));
      } else {
        setGeneratorError(
          "Could not connect to the server. Please check your internet connection."
        );
      }
    }

    try {
      const response = await UserService.callApiWithRefreshToken(
        signOut,
        GeneratorService.myResults
      );
      if (response.ok) {
        const resultData = await response.json();
        setResults(resultData);
        setResultError("");
        if (resultData.length > 0) {
          const latestResult = resultData.sort(
            (a: Result, b: Result) =>
              new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          )[0];
          if (isCheckingResults) {
            setLatestCheckedResult(
              new Date(new Date(latestResult.dateTime).toString().slice(0, 24))
            );
          }

          setLatestRetrievedResult(
            new Date(new Date(latestResult.dateTime).toString().slice(0, 24))
          );
        }
        AsyncStorage.setItem("results", JSON.stringify(resultData));
      } else {
        const value = await AsyncStorage.getItem("results");
        if (value !== null) {
          setResults(JSON.parse(value));
        } else {
          setResultError("Something went wrong, please try again later.");
        }
      }
    } catch (error) {
      const cachedResults = await AsyncStorage.getItem("results");
      if (cachedResults !== null) {
        setResults(JSON.parse(cachedResults));
      } else {
        setResultError(
          "Could not connect to the server. Please check your internet connection."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isCheckingResults]);

  useEffect(() => {
    let fetchInterval: NodeJS.Timeout;
    const fetchData = async () => {
      getGenerators();
      fetchInterval = setInterval(() => {
        getGenerators();
      }, 3000);
    };

    fetchData();
    return () => clearInterval(fetchInterval);
  }, [getGenerators]);

  return (
    <GeneratorContext.Provider
      value={{
        generators,
        results,
        generatorError,
        resultError,
        refetchGenerators: getGenerators,
        latestRetrievedResult,
        checkingResults: setIsCheckingResults,
        latestCheckedResult,
        setLatestCheckedResult,
        loading,
      }}
    >
      {children}
    </GeneratorContext.Provider>
  );
};

export const useGeneratorContext = () => {
  const context = useContext(GeneratorContext);
  if (!context) {
    throw new Error(
      "useGeneratorContext must be used within a GeneratorProvider"
    );
  }
  return context;
};
