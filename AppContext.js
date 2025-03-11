import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [id, setId] = useState(''); 
  const [profileImage, setProfileImage] = useState(null);
  const apiUrl = "http://192.168.219.104:9090/";
  const [nickname, setNickname] = useState('');
  const [grade, setGrade] = useState('');
  const [point, setPoint] = useState('');
  const [common, setCommon] = useState('');
  const [view_num, setView_Num] = useState('');
  const [tastenote_num, setTastenote_Num] = useState('');
  const [starpoint, setStar_Point] = useState('');



  const contextValue = {
    id,
    setId,
    profileImage,
    setProfileImage,
    apiUrl,
    nickname,
    grade,
    point,
    common,
    starpoint,
    view_num,
    setNickname,
    setGrade,
    setPoint,
    setCommon,
    tastenote_num, 
    setStar_Point,
    setTastenote_Num,
    setView_Num,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };