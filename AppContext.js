import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [id, setId] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const contextValue = {
    id,
    setId,
    profileImage,
    setProfileImage,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };