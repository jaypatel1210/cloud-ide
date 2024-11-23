import { FC, FunctionComponent, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';

import { ProjectCardProps } from './ProjectCard';
import axiosInstance from '../../axios/axiosInstance';
import { Project } from './types';
import Loading from '../../components/Loading';
import formatDate from '../../utils/formatDate';

const ProjectAdd = lazy(() => import('./ProjectAdd'));

const fetchProjects = async (): Promise<Project> => {
  const { data } = await axiosInstance.get('/projects');
  return data;
};

interface Props {
  ProjectCard: FunctionComponent<ProjectCardProps>;
}

const ProjectList: FC<Props> = ({ ProjectCard }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const projectLength = data?.projects.length ?? 0;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem',
      }}
    >
      {projectLength < 5 ? (
        <Suspense fallback={<></>}>
          <ProjectAdd />
        </Suspense>
      ) : null}
      {data?.projects.map(project => {
        const date = formatDate(project.created);
        return (
          <ProjectCard
            key={project.projectId}
            title={project.projectName}
            description={project.projectDesc}
            date={date}
            projectId={project.projectId}
            projectType={project.projectType}
          />
        );
      })}
    </Box>
  );
};

export default ProjectList;
