import { SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0B183E',
    },
  },
  typography: {
    useNextVariants: true,
    color: 'white',
    body1: {
      color: 'white',
      fontSize: '0.875rem'
    },
    body2: {
      color: 'white',
      fontWeight: 300
    },
    h4: {
      color: 'white',
      fontWeight: 100
    },
    h5: {
      color: 'white',
      fontStyle: 'italic',
      textTransform: 'uppercase',
      fontSize:'1rem'
    },
    h6: {
      color: 'white',
      textTransform: 'uppercase',
      fontSize: '0.875rem'
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
