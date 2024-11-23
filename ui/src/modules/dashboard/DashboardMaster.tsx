import { Box } from '@mui/material';

import ProjectList from '../projects/ProjectList';
import ProjectCard from '../projects/ProjectCard';

const DashboardMaster = () => {
  return (
    <Box
      sx={{
        margin: 3,
        height: '100%',
      }}
    >
      <ProjectList ProjectCard={ProjectCard} />
    </Box>
  );
};

export default DashboardMaster;
