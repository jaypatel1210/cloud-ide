import { useMemo, useState } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import type { Navigation, Router, Session } from '@toolpad/core/AppProvider';
import CategoryIcon from '@mui/icons-material/Category';

import { handleSignOut } from '../../auth/SignIn';
import { useAuth } from '../../context/AuthProvider';

import DashboardFooter from './DashboardFooter';
import DashboardMaster from './DashboardMaster';

const NAVIGATION: Navigation = [
  {
    segment: 'projects',
    title: 'Projects',
    icon: <CategoryIcon />,
  },
];

const DashboardPage = () => {
  const [pathname, setPathname] = useState('/projects');
  const { user } = useAuth();

  const session: Session = {
    user: {
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      id: user.uid,
    },
  };

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: path => setPathname(String(path)),
    };
  }, [pathname]);

  const authentication = useMemo(() => {
    return {
      signIn: () => {},
      signOut: handleSignOut,
    };
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      authentication={authentication}
      session={session}
      branding={{
        title: 'Cloud IDE',
        logo: '', // TODO: add logo
      }}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: () => null,
          sidebarFooter: DashboardFooter,
        }}
      >
        <DashboardMaster />
      </DashboardLayout>
    </AppProvider>
  );
};

export default DashboardPage;
