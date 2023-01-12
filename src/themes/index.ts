import {
  MD2LightTheme as PaperDefaultTheme,
  MD2DarkTheme as PaperDarkTheme
} from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

const Colors = {
  Primary:"#25408F",
  Secondary:"#0AA0DD",
  Accent:"#FFD600",
  Background:'#FBFBFB',

  Success:"#019267",
  Failed:'#b70000',
  NotFound:"#fbfbfb",

  Green1:"#019267",
  Green2:"#00C897",
  Red1:'#b70000',
  Red2:'#8e0000',
  Gray1:'#7e7e7e',
  Gray2:'#333',
  Gray3:'#e6e6e6',
  White:'#fff',
  White2:'#fbfbfb',
  Black:'#000',
}

const CombinedDefaultTheme: ThemeProp = {
  ...PaperDefaultTheme,
  roundness: 10,
  colors: {
    background: "#FBFBFB",
    primary: "#0386D0",
    accent: "#0AA0DD",
    disabled: "#e6e6e6"
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: 'System',
      fontWeight: 'normal'
    },
    light: {
      fontFamily: 'System',
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: 'System',
      fontWeight: 'normal'
    }
  }
};
const CombinedDarkTheme: ThemeProp = {
  ...PaperDarkTheme,
  roundness: 10,
  colors: {
    background: '#1B2938',
    primary: '#0386D0',
    accent: "#0AA0DD",
    disabled: "#e6e6e6"
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: 'normal',
    }
  }
};

export {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  Colors
}