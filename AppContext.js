import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [id, setId] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const apiUrl = "https://36aa-210-119-34-14.ngrok-free.app/";

  const contextValue = {
    id,
    setId,
    profileImage,
    setProfileImage,
    apiUrl,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };