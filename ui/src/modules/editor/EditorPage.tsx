import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import EditorMaster from './EditorMaster';
import SocketProvider from '../../context/SocketProvider';
import Loading from '../../components/Loading';
import orchestratorInstance from '../../axios/orchestratorInstance';

async function startResources(projectId: string): Promise<any> {
  const { data } = await orchestratorInstance.post(
    `/start-resources`,
    {
      projectId,
    },
    {
      withCredentials: true,
    }
  );

  return data;
}

const EditorPageWrapper = () => {
  const { projectId } = useParams();

  const mutation = useMutation({
    mutationFn: startResources,
  });

  useEffect(() => {
    if (projectId) {
      mutation.mutate(projectId);
    }
  }, [projectId]);

  if (!projectId) {
    return <div>Invalid Project ID</div>;
  }

  if (mutation.isPending) {
    return <Loading fullScreen />;
  }

  if (mutation.isError) {
    return <div>Error starting resources</div>;
  }

  if (mutation.isSuccess) {
    return (
      <SocketProvider
        projectId={projectId}
        wsUrl={mutation.data.url}
        resourceId={mutation.data.resourceId}
      >
        <EditorMaster />
      </SocketProvider>
    );
  }

  return <div>Error starting resources</div>;
};

export default EditorPageWrapper;
