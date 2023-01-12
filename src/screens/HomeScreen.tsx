import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect } from 'react'
import dayjs from 'dayjs';
import { FAB, Modal, Portal, TextInput, useTheme } from 'react-native-paper';
import { MD2Theme } from 'react-native-paper/lib/typescript/types';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/RootStackNavigation';
import Feather from 'react-native-vector-icons/Feather';
import { API } from '../services';

interface Greeting {
  name: string
}
const Greeting = ({name}: Greeting) => {
  return (
    <View>
      <Text style={{fontSize: 30, fontWeight: '300', lineHeight: 37}}>Hello,</Text>
      <Text style={{fontSize: 35, fontWeight: '200', lineHeight: 35}}>{name}</Text>
    </View>
  )
}
 

interface BannerProps {
  message: string,
  caption: string,
  backgroundColor: string,
  imageUri: string,
}
const Banner = ({message, caption, backgroundColor, imageUri}: BannerProps) => {
  return (
    <TouchableOpacity style={[styles.banner, {backgroundColor: backgroundColor}]}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 18}}>{message}</Text> 
        <Text style={{fontSize: 11, color: '#9B9B9B'}}>{caption}</Text>
      </View>
      <FastImage style={{width: 100, height: 100}} source={imageUri} />
    </TouchableOpacity>
  )
}

interface Todo { id?: string, text: string, createdAt: string, status: 'completed' | 'aborted' | 'progress'}
type PopupButtonAction = 'add' | 'del' | 'edit' | 'abort' | 'complete';
interface PopupModalProps {
  data: Todo,
  visible: boolean,
  onDismiss: () => void,
  action: 'add' | 'edit',
  onPressButton: ({action, todo}: {
    action: PopupButtonAction, 
    todo?: Todo
  }) => void
}

const PopupModal = ({action, data, visible, onDismiss, onPressButton}: PopupModalProps) => {
  const theme = useTheme<MD2Theme>();
  const [todo, setTodo] = React.useState<Todo>(data);
  const [isEditMode, setEditMode] = React.useState<boolean>(false);
  const progressButtons = [
    {text: 'Cancel', action: () => onDismiss(), color: theme?.colors?.disabled},
    {text: 'Abort', action: () => onPressButton({action: 'abort'}), color: '#FF0000'},
    {text: 'Complete', action: () => onPressButton({action: 'complete'}), color: '#1BD15D'}
  ]
  const dataButtons = [
    {text: 'Cancel', action: () => onDismiss(), color: theme?.colors?.disabled},
    {text: 'Delete', action: () => onPressButton({action: 'del'}), color: '#FF0000'},
    {text: 'Update', action: () => onPressButton({action: 'edit', todo: todo}), color: '#1BD15D'}
  ]
  useEffect(() => {
    setTodo(data)
  }, [data])
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <TextInput value={todo?.text} disabled={!isEditMode && action !== 'add'} mode='outlined' placeholder='To do' onChangeText={(text) => setTodo({...todo, text})}/>
        <View style={{height: 10}} />
        <TextInput value={dayjs(todo?.createdAt).format('hh:mm A')} disabled style={{alignSelf: 'flex-start'}} mode='outlined' onChangeText={(text) => setTodo({...todo, text})}/>
        <View style={{height: 10}} />
        {
          action === 'add' ?
            <TouchableOpacity 
              disabled={todo?.text === ''}
              style={{
                backgroundColor: todo?.text === '' ? theme?.colors?.disabled : '#1BD15D', 
                padding: 10,
                borderRadius: 10
              }} onPress={() => onPressButton({action: 'add', todo: {
                text: todo?.text || '',
                createdAt: new Date().toISOString(),
                status: 'progress'
              }})}>
              <Text style={{color: theme?.colors?.background, fontWeight: '900', textAlign: 'center'}}>Add</Text>
            </TouchableOpacity> :
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              {[...(isEditMode ? dataButtons : progressButtons)].map((item, key) => (
                <TouchableOpacity 
                  key={key}
                  style={{
                    padding: 10, 
                    backgroundColor: item.color,
                    borderRadius: 10,
                    alignSelf: 'flex-start'}} onPress={item.action}>
                  <Text style={{
                    color: theme?.colors?.background, 
                    fontWeight: '900', 
                    textAlign: 'center'
                  }}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setEditMode(!isEditMode)}>
                <Feather name='edit' size={25} color={isEditMode ? theme?.colors?.primary : theme?.colors?.disabled}/>
              </TouchableOpacity>
            </View>
        }
      </Modal>
    </Portal>
  )
}


type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;
interface Me {
  id:string,
  fullName:string,
  email:string,
  profilePicturestring: string
}
export default function Home({navigation}: Props) {
  const theme = useTheme<MD2Theme>();
  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = React.useState<number>(0);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [action, setAction] = React.useState<'add' | 'edit'>('add');
  const [me, setMe] = React.useState<Me>({
    fullName: '',
    email: '',
    id: '',
    profilePicturestring: ''
  });

  const onPressModalButton = ({action, todo}:{action: PopupButtonAction, todo?: Todo}) => {
    setModalVisible(false);
    switch(action) {
      case 'add': if(todo) onAddTodo(todo); break;
      case 'del': onDelTodo(selectedTodo); break;
      case 'edit': if(todo) onUpdateTodo(selectedTodo, todo); break;
      case 'abort': onChangeStatus(selectedTodo, 'aborted'); break;
      case 'complete': onChangeStatus(selectedTodo, 'completed'); break;
      default: return;
    }
  }

  const onChangeStatus = async (index: number, status: 'aborted' | 'completed') => {
    try {
      let newTodos = todos;
      newTodos[index]['status'] = status;
      setTodos(newTodos);
      return await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      throw error;
    }
  }

  const onAddTodo = async (todo: Todo) => {
    try {
      let newTodos = [...todos, todo];
      console.log(newTodos);
      setTodos(newTodos);
      return await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      throw error
    }
  }

  const onDelTodo = async (index: number) => {
    try {
      let newTodos = todos
      newTodos.splice(index, 1);
      setTodos(newTodos);
      return await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      throw error
    }
  }

  const onUpdateTodo = async (index: number, todo: Todo) => {
    try {
      let newTodos = todos;
      newTodos[index] = todo;
      setTodos(newTodos);
      return await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      
    }
  }

  const getTodos = async () => {
    try {
      const json: Todo[] = await API.getTodos();
      setTodos(json);
    } catch (error) {
      throw error
    }
  }

  const getMe = async () => {
    try {
      const json: any = await API.getAccount();
      setMe(json);
    } catch (error) {
      throw error
    }
  }

  const doLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['jwt', 'me']);
      return navigation.reset({index: 0, routes: [{ name: 'LoginRegisterScreen' }]});
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    getTodos();
    getMe();
  }, [])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme?.colors?.background}}>
    <PopupModal 
      action={action} 
      data={action === 'add' ? 
        {id:'',text:'',status:'progress',createdAt: new Date().toISOString()} : 
        todos[selectedTodo]
      }
      visible={isModalVisible} 
      onDismiss={() => setModalVisible(false)} 
      onPressButton={onPressModalButton}
    />
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between'}}>
              <Greeting name={me?.fullName} />
              <TouchableOpacity onPress={doLogout}  style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, marginRight: 5, color: theme.colors.accent}}>Logout</Text>
                <Feather name='log-out' size={17} color={theme.colors.accent}/>
              </TouchableOpacity>
            </View>
            <View style={{height: 20}}/>
            <Banner 
              message={
                todos.filter(i => i.status === 'completed').length === todos.length ?
                'Congratulation !\nwhat a productive day':
                'Your plan for today'
              } 
              caption={
                todos.filter(i => i.status === 'completed').length.toString() +
                ' of '+
                todos.length.toString()+' Completed'
              }
              imageUri={require('../assets/todo_image.png')}
              backgroundColor={'#F3F6C8'} />
            <View style={{height: 20}}/>
            <Text style={{fontSize: 17, marginBottom: 10}}>Daily Review</Text>
          </View>
        }
        data={todos.sort((a,b) => (dayjs(b.createdAt).isAfter(dayjs(a.createdAt)) ? 1 : -1) )}
        keyExtractor={(item, key) => String(key)}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity onPress={() => {
              setSelectedTodo(index);
              setAction('edit');
              setModalVisible(true);
            }} style={{
              backgroundColor: '#F8F8F6',
              borderRadius: 28,
              paddingVertical: 20,
              paddingHorizontal: 24,
              marginBottom: 10,
              justifyContent: 'center'
            }}>
              <Text style={{fontSize: 15, marginBottom: 3}}>{item.text}</Text>
              <Text style={{fontSize: 13, color: '#9B9B9B'}}>{dayjs(item.createdAt).format('hh:mm A') + (item.status !== "progress" ? ' \u2022 ' + item.status : '') }</Text>
              <Feather name='chevron-right' color={theme?.colors?.disabled} size={25} style={{position: 'absolute', alignSelf: 'flex-end', right: 20}}/> 
            </TouchableOpacity>
          )
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          setAction('add');
          setModalVisible(true);
        }}
      />
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  banner: {
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  fab: {
    position: 'absolute',
    borderRadius: 18,
    backgroundColor: '#1BD15D',
    margin: 16,
    alignSelf: 'center',
    bottom: 20
  },
  modalContainer: {
    marginHorizontal: 30,
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 20
  }
})