import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { AuthProvider } from 'contexts/AuthContext';
import { AppProvider } from 'contexts/AppContext';
import WithAuth from 'utils/withAuth';
import LogoutInactiveUser from 'views/auth/logout-inactive-user';
import { QueryClient, QueryClientProvider } from 'react-query';
import HomeLayout from 'layouts/home';
const queryClient = new QueryClient();

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppProvider>
              <LogoutInactiveUser timeout={15 * 60 * 1000} />
              <BrowserRouter>
                <Switch>
                  <Route path={`/auth`} component={AuthLayout} />
                  <Route path={`/admin`} component={WithAuth(AdminLayout)} />
                  <Route path={`/landing`} component={HomeLayout} />
                  <Redirect from="/" to="/admin" />
                </Switch>
                <ToastContainer />
              </BrowserRouter>
            </AppProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
