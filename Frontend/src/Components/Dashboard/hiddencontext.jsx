import { createContext, useContext, useState } from 'react';

const HiddenContext = createContext();

export const HiddenProvider = ({ children }) => {
  const [hiddenword, setHiddenWord] = useState(null);
  const [usernm, setUsernm] = useState(null);
  const [usernamepoints, setUsernamepoints] = useState([]);
  const [Lines, updatelines] = useState([]);

  const setHiddenWordValue = (value) => {
    setHiddenWord(value);
  };

  const setusrr = (value) => {
    setUsernm(value);
  };

  const updateUserpoints = (newUserpoints) => {
    setUsernamepoints(newUserpoints);
  };

  const updateLines = (lines) => {
    updatelines(lines);
  };

  return (
    <HiddenContext.Provider value={{ hiddenword, setHiddenWordValue, usernm, setusrr, usernamepoints, updateUserpoints,Lines,
    updateLines }}>
      {children}
    </HiddenContext.Provider>
  );
};

export const useHiddenContext = () => {
  return useContext(HiddenContext);
};
