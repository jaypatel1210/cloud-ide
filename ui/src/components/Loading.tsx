import { Box, CircularProgress } from '@mui/material';
import { FC } from 'react';

interface Props {
  fullScreen?: boolean;
}

const Loading: FC<Props> = ({ fullScreen }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: fullScreen ? '100vh' : '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
