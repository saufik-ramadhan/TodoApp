import React, { useEffect } from 'react'
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, Linking, SafeAreaView, View, StyleSheet, Platform, Alert } from 'react-native'
import { TextInput, Text, Checkbox, ActivityIndicator, MD2Theme, Caption } from 'react-native-paper';
// import LoginIllustration from '../assets/LoginIllustration';
// import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/RootStackNavigation';
import { Colors } from '../themes';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper'
import { API } from '../services';
import Svg, { Path, Ellipse } from "react-native-svg"

type Props = NativeStackScreenProps<RootStackParamList, 'LoginRegisterScreen'>;

function LoginRegister({ navigation, route }: Props) {
  const [inputFullName, setInputFullName] = React.useState<string>('');
  const [inputEmail, setInputEmail] = React.useState<string>('');
  const [inputPassword, setInputPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  // const [passwordStrength, setPasswordStrength] = React.useState<number>(0);
  const [passwordStrength, setPasswordStrength] = React.useState<'strong'|'weak'|'medium'|'invalid'>('invalid');
  const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
  const mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

  const [checked, setChecked] = React.useState<boolean>(false);
  const [viewPass, setViewPass] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isLogin, setIsLogin] = React.useState<boolean>(true);

  const theme = useTheme<MD2Theme>();

  /** INPUT CHANGE */
  const onFullNameChange = React.useCallback((text) => setInputFullName(text), [])
  const onUsernameChange = React.useCallback((text) => setInputEmail(text), [])
  const onPasswordChange = React.useCallback((text) => {
    setInputPassword(text)
    if(text.length > 3) {
      if(strongPassword.test(text)) setPasswordStrength('strong')
      else if(mediumPassword.test(text)) setPasswordStrength('medium')
      else setPasswordStrength('weak')
    } else { setPasswordStrength('invalid') }
  }, [])
  const onConfirmPasswordChange = React.useCallback((text) => setConfirmPassword(text), [])

  /** Forgot Password */
  const forgotPassword = () => Linking.openURL('https://google.com');

  /** Restore Credential if Any */
  async function restoreCredential() {
    try {
      setLoading(true);
      const savedCredential = await AsyncStorage.getItem('saved_credential') || '{}';
      const credential = JSON.parse(savedCredential);
      setInputEmail(credential.username);
      setInputPassword(credential.password)
    } catch (error) {
    }
  }


  /** Login Request */
  interface LoginInfo {
    Email: string,
    Password: string
  }
  const doLogin = async (loginInformation: LoginInfo) => {
    try {
      setLoading(true);
      const jwt = await API.doLogin(loginInformation); // api pull
      if(jwt === undefined) throw 'Login Failed'
      if(jwt?.error !== '') throw jwt?.error
      await AsyncStorage.setItem('jwt', JSON.stringify(jwt));  // store jwt

      await checkCredential(); 

      navigation.reset({index: 0, routes: [{ name: 'HomeScreen' }]})
    } catch (error) {
      if(error === undefined || error === null) return console.log('Error undefined');
      return Alert.alert('Login Failed', error);
    } finally {
      setLoading(false);
    }
  }

  /** Register Request */
  interface RegisterInfo {
    FullName: string,
    Email: string,
    Password: string
  }
  const doRegister = async (registerInfo: RegisterInfo) => {
    try {
      setLoading(true);
      const api = await API.doRegister(registerInfo); // api call
      if(api === undefined) throw api
      if(api?.error !== '') throw api?.error
      await AsyncStorage.setItem('jwt', JSON.stringify(api));

      await checkCredential(); 

      navigation.reset({index: 0, routes: [{ name: 'HomeScreen' }]})
    } catch (error) {
      if(error === undefined || error === null) return console.log('Error undefined dsadsa');
      return Alert.alert('Register Failed', error);
    } finally {
      setLoading(false);
    }
  }


  const checkCredential = async () => {
    try {
      setLoading(true);
      const api = await API.getAccount();
      if(api === undefined) throw api
      await AsyncStorage.setItem('me', JSON.stringify(api));
    } catch (error) {
      throw error
    } finally {
      setLoading(false);
    }
  }

  /** Password Visibility */
  const showHidePass = () => setViewPass(!viewPass)

  useEffect(() => {
  }, [])

  return (
    <KeyboardAvoidingView style={{ backgroundColor: theme?.colors?.background, flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, justifyContent: 'space-between', backgroundColor: theme?.colors?.background }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
            <FastImage source={{ uri: 'https://cdn-images-1.medium.com/max/1200/1*cogd0Ioz0Akw1PEcblYh8g.png' }} style={{ width: 70, height: 70 }} resizeMode='contain' />
          </View>
          {/* <View style={{ alignSelf: 'flex-end', marginTop: 10, position: 'absolute' }}><LoginIllustration width={150} height={150} /></View> */}

          <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => {
              setIsLogin(true);
              setInputFullName('');
              setInputEmail('');
              setInputPassword('');
              setConfirmPassword('');
            }}>
              <Text style={{ fontSize: 37, textDecorationLine: isLogin ? 'underline' : 'none', marginTop: 10, marginBottom: 20, fontWeight: '300', color: isLogin ? theme?.colors?.primary : theme?.colors?.disabled }}>Sign In</Text>
            </TouchableOpacity>
            <Text style={{fontSize:37, fontWeight: '200', color: theme?.colors?.disabled}}> / </Text>
            <TouchableOpacity onPress={() => {
              setIsLogin(false);
              setInputFullName('');
              setInputEmail('');
              setInputPassword('');
              setConfirmPassword('');
            }}>
              <Text style={{ fontSize: 37, textDecorationLine: !isLogin ? 'underline' : 'none', marginTop: 10, marginBottom: 20, fontWeight: '300', color: !isLogin ? theme?.colors?.primary : theme?.colors?.disabled }}>Register</Text>
            </TouchableOpacity>
          </View>

          {/** FULL NAME */}
          {!isLogin && <>
            <TextInput
            style={[styles.textInput]}
            label="Full Name"
            onChangeText={onFullNameChange}
            value={inputFullName}
            maxLength={30}
            />
            <View style={{ height: 10 }} /></>}

          {/** INPUT EMAIL or USERNAME */}
          <TextInput
            style={[styles.textInput]}
            label="Email"
            onChangeText={onUsernameChange}
            value={inputEmail}
            maxLength={30}
          />

          <View style={{ height: 10 }} />

          {/** INPUT PASSWORD */}
          <View style={{ justifyContent: 'center' }}>
          {/* <View style={{flexDirection: 'row'}}>
              {[{color: 'red'},{color: 'yellow'},{color: 'green'}].map((i, k) => (
                <View key={k} style={{
                  height: 2,
                  backgroundColor: 
                    passwordStrength > k ? 'green' : theme?.colors?.disabled, 
                  flex: 1
                }} />
              ))}
            </View> */}
            <TextInput
              style={[styles.textInput]}
              label={`Password`}
              secureTextEntry={viewPass}
              keyboardType={'default'}
              onChangeText={onPasswordChange}
              value={inputPassword}
              maxLength={30}
            />
            {!isLogin && passwordStrength !== 'invalid' && 
              <Caption style={{
                color: passwordStrength === 'strong' ? 'green' : passwordStrength === 'medium' ? 'yellow' : 'red'
              }}>{passwordStrength}</Caption>}
            
            <TouchableOpacity onPress={showHidePass} style={{ position: 'absolute', right: 0, paddingLeft: 20, paddingRight: 15, paddingVertical: 20 }}>
              {viewPass ?
                <Icon name='eye' color={theme?.colors?.text} size={25} /> :
                <Icon name='eye-off' color={theme?.colors?.text} size={25} />
              }
            </TouchableOpacity>
          </View>


          {/** INPUT CONFIRM PASSWORD */}
          {!isLogin && <>
            <View style={{height: 10}} />
            <View style={{ justifyContent: 'center' }}>
              <TextInput
                style={[styles.textInput]}
                label="Confirm Password"
                secureTextEntry={viewPass}
                keyboardType={'default'}
                onChangeText={onConfirmPasswordChange}
                value={confirmPassword}
                maxLength={30}
              />
              {!isLogin && confirmPassword !== '' && confirmPassword === inputPassword && 
              <Caption style={{
                color: 'green'
              }}>valid</Caption>}
              <TouchableOpacity onPress={showHidePass} style={{ position: 'absolute', right: 0, paddingLeft: 20, paddingRight: 15, paddingVertical: 20 }}>
                {viewPass ?
                  <Icon name='eye' color={theme?.colors?.text} size={25} /> :
                  <Icon name='eye-off' color={theme?.colors?.text} size={25} />
                }
              </TouchableOpacity>
            </View>
          </>}
          

          <TouchableOpacity style={{ marginTop: 20, marginBottom: 10, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }} onPress={() => setChecked(!checked)}>
            <Checkbox
              status={checked ? 'checked' : 'indeterminate'}
              color={theme?.colors?.primary}
              uncheckedColor={Colors.Gray1}
              onPress={() => {
                setChecked(!checked)
              }}
            />
            <Text style={{ color:theme?.colors?.text, fontSize: 15 }}>Remember me</Text>
          </TouchableOpacity>
          {/** CONTINUE / LOGIN */}
            <TouchableOpacity disabled={loading || (!isLogin && inputPassword !== confirmPassword)} onPress={() => {
              if(isLogin) doLogin({ Email: inputEmail, Password: inputPassword })
              else doRegister({ FullName: inputFullName, Email: inputEmail, Password: inputPassword });
            }} style={{ borderRadius: 10, padding: 10, backgroundColor: theme?.colors?.primary, alignItems: 'center', justifyContent: 'center' }}>
            {!loading ?
              <Text style={{ fontSize: 15, color: theme?.colors?.background }}>CONTINUE</Text> :
              <ActivityIndicator color={theme?.colors?.background} size={20} /> }
            </TouchableOpacity>
          {/** FORGOT USERNAME BUTTON */}
          <Text style={{ textAlign:'center',color: theme?.colors?.text, fontSize: 15, marginTop: 20 }}>
            By clicking {isLogin ? 'signing in' : 'registering'}, you agree to our
          </Text>
          <TouchableOpacity style={{ marginBottom: 10, alignSelf: 'center' }} onPress={forgotPassword}>
            <Text style={{ color: theme?.colors?.primary, fontSize: 15 }}>
              Term and privacy policy
            </Text>
          </TouchableOpacity>

        </ScrollView>
        <Illustration />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const Illustration = () => {
  return (
    <>
      <Svg width={'100%'} height={200} viewBox="30 0 60 100" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', bottom: -30, zIndex: -1}}>
        <Path fill="#469fd1" d="M7 69h278v157H7z" />
        <Ellipse ry={27} rx={75} cy={70} cx={159} fill="#469fd1" />
        <Ellipse ry={54} rx={61.5} cy={65} cx={210.5} fill="#469fd1" />
        <Ellipse ry={57} rx={54.5} cy={58} cx={234.5} fill="#0386d0" />
        <Ellipse ry={56.5} rx={58.5} cy={70.5} cx={59.5} fill="#469fd1" />
      </Svg>
      <FastImage source={require('../assets/login_image.png')} style={{width:'100%',position: 'absolute', bottom: 70, zIndex: -2, height: 200}} resizeMode='contain'/>
    </>
  )
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    borderRadius: 10
  }
})

export default LoginRegister;
