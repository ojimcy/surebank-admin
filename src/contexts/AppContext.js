import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [appError, setAppError] = useState('');

  return (
    <AppContext.Provider
      value={{
        appError,
        setAppError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
