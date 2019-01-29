import { SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import { blue, green } from '@material-ui/core/colors';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        background: 'rgba(226, 226, 226, 0.08)',
        flexGrow:1
      },
      elevation0:{
        background: 'rgba(226, 226, 226, 0.08)'
      },
      elevation1:{
        background: 'rgba(226, 226, 226, 0.08)'
      }
    }
  },
  palette: {
    type:'dark',
    primary: { main: '#fff' },
    secondary: { main: green[300]},
  },
  typography: {
    color: '#fff',
    useNextVariants: true,
    body1: {
      fontSize: '0.875rem',
      fontWeight:100
    },
    body2: {
      fontWeight: 300,
      fontSize: '0.75rem'
    },
    h4: {
      fontWeight: 500,
      fontSize:'1.25rem'
    },
    h5: {
      fontSize:'1.125rem'
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 400
    },
    display1: {
       
    },
    button:{
      color:'white'
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
