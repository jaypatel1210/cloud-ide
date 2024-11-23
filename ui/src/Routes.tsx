import { lazy, ReactNode, Suspense } from 'react';
import { Routes as RRoutes, Route } from 'react-router-dom';

import Loading from './components/Loading';

const Dashboard = lazy(() => import('./modules/dashboard/DashboardPage'));
const EditorPage = lazy(() => import('./modules/editor/EditorPage'));

const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<Loading fullScreen />}>{children}</Suspense>;
};

const Routes = () => {
  return (
    <RRoutes>
      <Route
        path="/"
        element={
          <SuspenseWrapper>
            <Dashboard />
          </SuspenseWrapper>
        }
      />

      <Route
        path="/editor/:projectId"
        element={
          <SuspenseWrapper>
            <EditorPage />
          </SuspenseWrapper>
        }
      />
    </RRoutes>
  );
};

export default Routes;
