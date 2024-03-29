import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosService from 'utils/axiosService';

const AppContext = createContext();

// Custom hook to access the AuthContext
export function useAppContext() {
  return useContext(AppContext);
}

const AppProvider = ({ children }) => {
  const [appError, setAppError] = useState('');
  const [accountInformation, setAccountInformation] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [userPackages, setUserPackages] = useState([]);
  const [packageId, setPackageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get('/branch/');
        setBranches(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [setBranches]);

  return (
    <AppContext.Provider
      value={{
        appError,
        setAppError,
        accountInformation,
        setAccountInformation,
        branches,
        setBranches,
        loading,
        setLoading,
        customerData,
        setCustomerData,
        userPackages,
        setUserPackages,
        setPackageId,
        packageId,
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        cartItems,
        setCartItems,
        selectedPackage,
        setSelectedPackage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
