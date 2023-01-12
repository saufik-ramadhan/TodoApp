import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/RootStackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services';

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>;

export default function Splash({navigation, route}: Props) {
  
  const checkCredential = async () => {
    try {
      const api = await API.getAccount(); // api call
      if(api === undefined) throw api
      await AsyncStorage.setItem('me', JSON.stringify(api));
      console.info('Credential Valid')
      setTimeout(() => navigation.reset({index: 0, routes: [{ name: 'HomeScreen' }]}), 1000);
    } catch (error) {
      console.info(error)
      navigation.reset({index: 0, routes: [{ name: 'LoginRegisterScreen' }]});
    }
  }
  
  useEffect(() => {
    checkCredential();
  }, [])
  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Splash</Text>
    </View>
  )
}

const styles = StyleSheet.create({})