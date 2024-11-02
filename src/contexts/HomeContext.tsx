import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface HomeContextType {
   is_preparing: boolean;
   set_is_preparing: (data: boolean) => void;
}

// Initialize the context with `undefined` as default
const HomeContext = createContext<HomeContextType | undefined>(undefined);

// Define the props for the provider component
interface HomeProviderProps {
  children: ReactNode;
}

// Create the provider component
export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
   const [is_preparing, set_is_preparing] = useState<boolean>(false);

  return (
    <HomeContext.Provider value={{is_preparing, set_is_preparing}}>
      {children}
    </HomeContext.Provider>
  );
};

// Custom hook to use the HomeContext
export const useHomeContext = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};
