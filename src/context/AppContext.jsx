import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [onboardingData, setOnboardingData] = useState(null);

  return (
    <AppContext.Provider value={{ onboardingData, setOnboardingData }}>
      {children}
    </AppContext.Provider>
  );
}