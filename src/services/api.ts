import AsyncStorage from '@react-native-async-storage/async-storage';

interface apiClient {
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD',
  headers?: object,
  data?: object | null
}
interface loginInfo {
  Email: string,
  Password: string
}
interface registerInfo {
  FullName: string,
  Email: string,
  Password: string
}

const API = {
  base_url: 'https://reacttestlab.azurewebsites.net/api/',
  client: async ({ url = '', method = 'GET', headers = {}, data = null }: apiClient) => {
    try {
      let body: any = JSON.stringify(data);
      if (method == 'GET') body = null;
      if (method == 'HEAD') body = null;
  
      // Default options are marked with *
      const response = await fetch(`${API.base_url}${url}`, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Access-Control-Allow-Origin": "*"
        },
        body: body
      });
      if(response.status === 400) throw await response.text()
      if(response.status === 401) throw await response.text()
      return response
    } catch (error) {
      throw error
    }
  },
  doLogin: async (loginInfo: loginInfo) => {
    try {
      const api = await API.client({
        url: 'SignIn',
        method: 'POST',
        data: loginInfo
      })
      //  if (!api.ok) throw false
      if (api.status == 200) return await api.json();
    } catch (error) {
      throw error
    }
  },
  doRegister: async (registerInfo: registerInfo) => {
    try {
      const api = await API.client({
        url: 'Register',
        method: 'POST',
        data: registerInfo
      })
      
      if(api.status == 200) return await api.json();
    } catch (error) {
      throw error   
    }
  },
  getAccount: async () => {
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      if(jwt === undefined || jwt === null || jwt === '') throw `JWT not found`;
      const bearer: string = JSON.parse(jwt).accessToken;
      const api = await API.client({
        url: 'Me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearer}`
        }
      })
      if(api.status == 200) return await api.json();
    } catch (error) {
      throw error
    } 
  },
  getTodos: async () => {
    try {
      const api = await AsyncStorage.getItem('todos');
      if(api === undefined || api === null || api === '') return [];
      const json: any[] = await JSON.parse(api);
      return json
    } catch (error) {
      throw error
    }
  }
}

export default API