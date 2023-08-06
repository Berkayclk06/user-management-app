import React, { createContext, useState, ReactNode } from 'react';

interface UserContextProps {
    userUpdated: boolean;
    setUserUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const UserContext = createContext<UserContextProps>({
    userUpdated: false,
    setUserUpdated: () => {},
  });
  

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [userUpdated, setUserUpdated] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ userUpdated, setUserUpdated }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
