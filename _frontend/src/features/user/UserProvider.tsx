import { useEffect, useState } from 'react';
import { User } from '../types';
import { UserContext } from './UserContext';

type Props = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
