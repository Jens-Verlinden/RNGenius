import GreetingService from '@/service/GreetingService';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditScreenInfo({ path }: { path: string }) {

  const [requestError, setRequestError] = useState("");
  const [greeting, setGreeting] = useState("");
  
  const getGreeting = async () => {

    try {
      const response = await GreetingService.getGreeting()

      if(response.ok) {
        setRequestError("");
        const greetingData = await response.json();
          setGreeting(greetingData.message);
          AsyncStorage.setItem("greeting", greetingData.message);
      }
      else {
        const value = await AsyncStorage.getItem("greeting");
        if (value !== null) {
          setGreeting(value);
        } else {
          setRequestError("Something went wrong, please try again later.");
        }
      };
    }
    catch (error) {
      const cachedGreeting = await AsyncStorage.getItem("greeting");
      if (cachedGreeting !== null) {
        setGreeting(cachedGreeting);
      } else {
        setRequestError("Could not connect to the server. Please check your internet connection.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const cachedGreeting = await AsyncStorage.getItem("greeting");

      if (cachedGreeting !== null) {
        setGreeting(cachedGreeting);
      }

      getGreeting();
      setInterval(() => {
        getGreeting();
      }, 5000);
    };

    fetchData();
  }, []);

  return (
    <View>
      <View style={{ alignItems: 'center', marginHorizontal: 50 }}>
        {requestError ?  <Text style={{ color: 'rgba(255,0,0,0.8)', fontSize: 17, lineHeight: 24, textAlign: 'center' }}>
          {requestError}
        </Text>
        : <Text style={{ color: 'rgba(0,0,255,0.8)', fontSize: 17, lineHeight: 24, textAlign: 'center' }}>
          {greeting}
        </Text>}


      </View>
    </View>
  );
}