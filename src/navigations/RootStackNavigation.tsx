import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, LoginRegisterScreen, SplashScreen, TodosScreen } from '../screens';

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginRegisterScreen: undefined;
  HomeScreen: undefined;
  TodosScreen: undefined;
};

export default function RootStackNavigation() {
  const Root = createNativeStackNavigator<RootStackParamList>();
  return (
    <Root.Navigator screenOptions={{headerShown: false}}>
      <Root.Screen name="SplashScreen" component={SplashScreen}/>
      <Root.Screen name="LoginRegisterScreen" component={LoginRegisterScreen} />
      <Root.Screen name="HomeScreen" component={HomeScreen} />
      <Root.Screen name="TodosScreen" component={TodosScreen} />
    </Root.Navigator>
  )
}

const styles = StyleSheet.create({})