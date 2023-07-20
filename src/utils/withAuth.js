import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { Redirect } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
      // Redirect to login page if not authenticated
      return <Redirect to="/auth/sign-in" />;
    }

    // Render the protected component if authenticated
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
