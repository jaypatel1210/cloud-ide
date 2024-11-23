import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from 'firebase/auth';

import axiosInstance from '../axios/axiosInstance';
import SignIn from '../auth/SignIn';
import Loading from '../components/Loading';

interface Props {
  children: ReactNode;
}

interface AuthContext {
  user: User;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

const AuthProvider: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkSession = async () => {
    try {
      const result = await axiosInstance.post('/me');

      if (result.status != 200) {
        setUser(null);
      }

      setUser(result.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user?.uid) {
    return <SignIn />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
