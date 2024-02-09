import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { AuthProvider } from 'contexts/AuthContext';
import { AppProvider } from 'contexts/AppContext'; 
import WithAuth from 'utils/withAuth';
import LogoutInactiveUser from 'views/auth/logout-inactive-user';

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <AuthProvider>
          <AppProvider>
              <LogoutInactiveUser timeout={15 * 60 * 1000} />
            <HashRouter>
              <Switch>
                <Route path={`/auth`} component={AuthLayout} />
                <Route path={`/admin`} component={WithAuth(AdminLayout)} />
                <Redirect from="/" to="/admin" />
              </Switch>
              <ToastContainer />
            </HashRouter>
          </AppProvider>
        </AuthProvider>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
