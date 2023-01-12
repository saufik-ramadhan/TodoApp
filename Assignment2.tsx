import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper';
import { CombinedDarkTheme, CombinedDefaultTheme } from './src/themes';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackNavigation } from './src/navigations'

export default function Assignment2() {
  let isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootStackNavigation />
      </NavigationContainer>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({})