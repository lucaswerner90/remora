import { SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  overrides: {
    MuiBadge: {
      "badge": {
        "margin": 10,
      }
    },
    MuiTabs: {
      "root": {
        color:'#fff'
      },
      "indicator": {
        "color": '#fff'
      },
    },
    // MuiInput:{
    //   "underline": {
    //     '&::before': {
    //       "borderBottom":"none"
    //     }
    //   }
    // },
    MuiInputLabel: {
      marginDense: {
        fontSize:'1rem',
        fontWeight: 300,
      }
    },
    MuiInputBase: {
      "root": {

      }
    },
    MuiPaper: {
      root: {
        background: 'none',
        boxShadow:'none',
        flexGrow:1
      },
      elevation0:{
        background: 'rgba(226, 226, 226, 0.05)',
        paddingTop:'2%',
        paddingBottom:'2%',
        paddingLeft:'5%',
        paddingRight:'5%',
      },
      elevation16:{
        background: 'none',
        boxShadow:'none'
      },
      elevation1:{
        background: '#1b3f772e',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'5%',
        paddingRight: '5%',
        boxShadow:'none'
      }
    }
  },
  palette: {
    type:'dark',
    primary: {
      main: 'rgb(102,255,255)',
      light: 'rgb(102,255,255)',
      dark: 'rgb(0,153,204)'
    },
    secondary: {
      main: 'rgb(255,0,102)'
    },
  },
  typography: {
    useNextVariants: true,
    body1: {
      fontSize: '0.875rem',
      fontWeight:500
    },
    body2: {
      fontWeight: 300,
      fontSize: '0.75rem'
    },
    h3: {
      fontWeight: 300,
      fontSize:'3.5rem'
    },
    h4: {
      fontWeight: 300,
      fontSize:'1.5rem'
    },
    h5: {
      fontWeight: 300,
      fontSize:'1.25rem'
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 200
    },
    display1: {
      fontSize: '0.5rem',
      fontWeight: 300
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 300
    }
  },
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

let pageContext;

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext();
  }

  return pageContext;
}
